import { EX_BY_ID } from '../data/exercises'

/* ---------- Workout templates ---------- */
export const TEMPLATES = {
  push: { name: { en: 'Push Day', bn: 'পুশ ডে' }, focus: { en: 'Chest, shoulders, triceps', bn: 'বুক, কাঁধ, ট্রাইসেপ' },
    exercises: ['chest_press_machine', 'incline_chest_press_machine', 'pec_deck', 'shoulder_press_machine', 'lateral_raise_machine', 'cable_pushdown'] },
  pull: { name: { en: 'Pull Day', bn: 'পুল ডে' }, focus: { en: 'Back, biceps', bn: 'পিঠ, বাইসেপ' },
    exercises: ['lat_pulldown', 'seated_cable_row', 'chest_supported_row', 'rear_delt_machine', 'biceps_curl_machine', 'cable_hammer_curl'] },
  legs: { name: { en: 'Leg Day', bn: 'লেগ ডে' }, focus: { en: 'Legs, abs', bn: 'পা, পেট' },
    exercises: ['leg_press', 'leg_extension', 'leg_curl', 'calf_raise_machine', 'cable_crunch'] },
  upper: { name: { en: 'Upper Body', bn: 'আপার বডি' }, focus: { en: 'Chest, back, shoulders, arms', bn: 'বুক, পিঠ, কাঁধ, হাত' },
    exercises: ['chest_press_machine', 'lat_pulldown', 'shoulder_press_machine', 'seated_cable_row', 'biceps_curl_machine', 'cable_pushdown'] },
  lower: { name: { en: 'Lower Body', bn: 'লোয়ার বডি' }, focus: { en: 'Legs, abs', bn: 'পা, পেট' },
    exercises: ['leg_press', 'leg_curl', 'leg_extension', 'calf_raise_machine', 'plank'] },
  fullA: { name: { en: 'Full Body A', bn: 'ফুল বডি A' }, focus: { en: 'Whole body', bn: 'পুরো শরীর' },
    exercises: ['leg_press', 'chest_press_machine', 'lat_pulldown', 'shoulder_press_machine', 'leg_curl', 'cable_crunch'] },
  fullB: { name: { en: 'Full Body B', bn: 'ফুল বডি B' }, focus: { en: 'Whole body', bn: 'পুরো শরীর' },
    exercises: ['db_rdl', 'incline_chest_press_machine', 'seated_cable_row', 'lateral_raise_machine', 'leg_extension', 'plank'] }
}

// Which templates rotate for each "days per week" choice
export const SPLITS = {
  3: { name: { en: 'Full Body', bn: 'ফুল বডি' }, cycle: ['fullA', 'fullB'] },
  4: { name: { en: 'Upper / Lower', bn: 'আপার / লোয়ার' }, cycle: ['upper', 'lower'] },
  5: { name: { en: 'Push / Pull / Legs + Upper / Lower', bn: 'পুশ / পুল / লেগস + আপার / লোয়ার' }, cycle: ['push', 'pull', 'legs', 'upper', 'lower'] },
  6: { name: { en: 'Push / Pull / Legs', bn: 'পুশ / পুল / লেগস' }, cycle: ['push', 'pull', 'legs'] }
}

const REPS = {
  muscle: { normal: '8–12', high: '12–15', time: '30–45s' },
  fat_loss: { normal: '12–15', high: '15–20', time: '30–45s' },
  recomp: { normal: '10–12', high: '12–15', time: '30–45s' }
}

/* Pick an exercise that fits the user's equipment preference.
   'machines' keeps machines; 'free' prefers dumbbell/barbell; 'home' prefers dumbbell/bodyweight */
export function pickForEquipment(id, pref) {
  const ex = EX_BY_ID[id]
  if (!ex || pref === 'machines') return id
  const ok = pref === 'home' ? ['dumbbell', 'bodyweight'] : ['dumbbell', 'barbell', 'bodyweight']
  if (ok.includes(ex.equipment)) return id
  return ex.alts.find(a => ok.includes(EX_BY_ID[a]?.equipment)) || id
}

/* Build the workout for a template, with sets/reps for the user's goal */
export function buildWorkout(templateKey, profile, swaps = {}) {
  const tpl = TEMPLATES[templateKey]
  const reps = REPS[profile.goal] || REPS.muscle
  const items = tpl.exercises.map(baseId => {
    const id = swaps[baseId] || pickForEquipment(baseId, profile.equipment)
    const ex = EX_BY_ID[id]
    const kind = ex.type === 'time' ? 'time' : ex.reps === 'high' ? 'high' : 'normal'
    return { baseId, id, sets: 3, reps: reps[kind], type: ex.type || 'reps' }
  })
  return { key: templateKey, ...tpl, items, cardio: profile.goal !== 'muscle' }
}

export function nextTemplate(profile, cycleIndex) {
  const cycle = SPLITS[profile.daysPerWeek]?.cycle || SPLITS[3].cycle
  return cycle[cycleIndex % cycle.length]
}

/* ---------- Nutrition ----------
   BMR: Mifflin-St Jeor equation (most accurate common formula)
   TDEE = BMR x activity factor (based on training days) */
export function calcNutrition(p) {
  if (!p?.weight || !p?.height || !p?.age) return null
  const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === 'female' ? -161 : 5)
  const factor = p.daysPerWeek >= 6 ? 1.725 : p.daysPerWeek >= 4 ? 1.55 : 1.375
  const tdee = bmr * factor
  const adjust = p.goal === 'fat_loss' ? -450 : p.goal === 'muscle' ? 250 : -200
  const calories = Math.round((tdee + adjust) / 10) * 10
  const protein = Math.round(p.weight * (p.goal === 'muscle' ? 1.8 : 2.0))
  const fat = Math.round((calories * 0.25) / 9)
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4))
  const water = Math.round(p.weight * 0.035 * 10) / 10 // litres
  return { bmr: Math.round(bmr), tdee: Math.round(tdee), calories, protein, fat, carbs, water }
}

export function bmi(p) {
  if (!p?.weight || !p?.height) return null
  const m = p.height / 100
  return Math.round((p.weight / (m * m)) * 10) / 10
}

/* ---------- Dates ---------- */
export const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// "2026-10-22" -> local Date at midnight (avoids timezone surprises)
export const parseDay = s => new Date(s + 'T00:00:00')

// Week starts on Saturday (Bangladesh)
export function weekStart(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const diff = (d.getDay() + 1) % 7 // Sat=0
  d.setDate(d.getDate() - diff)
  return d
}

export function streakWeeks(sessions, target) {
  // number of consecutive past weeks (incl. current if met) that hit the weekly target
  let streak = 0
  let ws = weekStart()
  const count = start => {
    const end = new Date(start); end.setDate(end.getDate() + 7)
    return sessions.filter(s => { const d = parseDay(s.date); return d >= start && d < end }).length
  }
  if (count(ws) >= target) streak++
  for (let i = 0; i < 52; i++) {
    ws = new Date(ws); ws.setDate(ws.getDate() - 7)
    if (count(ws) >= target) streak++
    else break
  }
  return streak
}
