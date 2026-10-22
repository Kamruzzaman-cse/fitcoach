import { SPLITS, weekStart } from './fitness'

/*
  Weekly schedule.
  - profile.trainingDays: weekdays the user goes to the gym (JS numbers: 0 = Sunday ... 6 = Saturday)
  - The split's workouts are given to those days in order, starting from Saturday.
    Example, PPL with Sunday off: Sat Push, Mon Pull, Tue Legs, Wed Push, Thu Pull, Fri Legs
  - reschedules: [{ from: '2026-10-25', to: '2026-10-30' | null, templateKey }]
    "to: null" means the workout was skipped.
*/

export const WEEK_ORDER = [6, 0, 1, 2, 3, 4, 5] // Bangladesh week: Sat -> Fri

export const DAY_NAMES = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  bn: ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার']
}
export const DAY_SHORT = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  bn: ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি']
}
export const dayName = (wd, lang) => (DAY_NAMES[lang] || DAY_NAMES.en)[wd]
export const dayShort = (wd, lang) => (DAY_SHORT[lang] || DAY_SHORT.en)[wd]

// Sensible default days for each count (Friday off first, then spread out)
export const DEFAULT_DAYS = {
  3: [6, 1, 3],
  4: [6, 0, 2, 3],
  5: [6, 0, 1, 3, 4],
  6: [6, 0, 1, 2, 3, 4]
}

export const sortDays = days => [...days].sort((a, b) => WEEK_ORDER.indexOf(a) - WEEK_ORDER.indexOf(b))

export function trainingDaysOf(profile) {
  return profile.trainingDays?.length ? profile.trainingDays : DEFAULT_DAYS[profile.daysPerWeek] || DEFAULT_DAYS[3]
}

/* { weekday: templateKey } for the user's gym days */
export function weekPlan(profile) {
  const days = sortDays(trainingDaysOf(profile))
  const cycle = (SPLITS[days.length] || SPLITS[3]).cycle
  return Object.fromEntries(days.map((d, i) => [d, cycle[i % cycle.length]]))
}

export const dateStr = d =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/* The 7 days of a week with what to do and what happened */
export function getWeek(state, ref = new Date()) {
  const { profile, sessions, reschedules = [] } = state
  const plan = weekPlan(profile)
  const today = dateStr(new Date())
  const ws = weekStart(ref)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(ws)
    d.setDate(ws.getDate() + i)
    const date = dateStr(d)
    const wd = d.getDay()
    const base = plan[wd] || null
    const movedAway = reschedules.find(r => r.from === date)
    const movedIn = reschedules.find(r => r.to === date)
    const workout = movedIn?.templateKey || (movedAway ? null : base)
    // a session counts for the day it was planned for (scheduledFor), so a make-up doesn't mark today as done
    const done = sessions.some(s => {
      const k = s.scheduledFor || s.date
      return k === date || (movedIn && k === movedIn.from)
    })

    let status
    if (movedAway && !movedIn) status = movedAway.to ? 'moved' : 'skipped'
    else if (done) status = 'done'
    else if (!workout) status = 'rest'
    else if (date < today) status = 'missed'
    else if (date === today) status = 'today'
    else status = 'upcoming'

    return { date, wd, base, workout, status, movedTo: movedAway?.to || null, makeupOf: movedIn?.from || null, isToday: date === today }
  })
}

/*
  Recommend the best day to make up a workout:
  1. a free day (no workout) from today until the end of the week
  2. not right next to a day that trains the same muscles (gives them 48h to recover)
  3. the earliest one that fits
*/
export function recommendDay(week, missed) {
  const today = dateStr(new Date())
  const free = week.filter(d => d.date >= today && d.date !== missed.date && !d.workout && d.status !== 'done')
  if (!free.length) return null
  const tpl = missed.workout || missed.base
  const clash = d => {
    const i = week.indexOf(d)
    return [week[i - 1], week[i + 1]].some(n => n && (n.workout === tpl) && n.status !== 'moved')
  }
  return free.find(d => !clash(d)) || free[0]
}

/* Next day (from tomorrow, can roll into next week) that has a workout */
export function nextTrainingDay(state) {
  const week = getWeek(state)
  const today = dateStr(new Date())
  const later = week.find(d => d.date > today && d.workout && d.status === 'upcoming')
  if (later) return later
  const next = new Date(); next.setDate(next.getDate() + 7)
  return getWeek(state, next).find(d => d.workout && d.status === 'upcoming') || null
}

/*
  When there is no free day left: shift the week.
  The missed (or busy) workout goes to the next gym day, that day's workout goes to the one after,
  and so on. The last workout of the week is skipped.
  Returns the list of moves, or null if there is no gym day left this week.
*/
export function shiftPlan(week, day) {
  const today = dateStr(new Date())
  const targets = week.filter(d => d.date > day.date && d.date >= today && d.workout && (d.status === 'today' || d.status === 'upcoming'))
  if (!targets.length) return null
  const moves = [{ from: day.date, to: targets[0].date, templateKey: day.workout }]
  targets.forEach((d, i) => moves.push({ from: d.date, to: targets[i + 1]?.date || null, templateKey: d.workout }))
  return moves
}
