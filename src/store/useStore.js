import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { buildWorkout, nextTemplate, todayStr } from '../lib/fitness'

/*
  One global store (Zustand) for the whole app.
  `persist` saves it to localStorage automatically, so data survives a page refresh.
  Later you can replace localStorage with a backend (Firebase / Supabase) without changing the pages.
*/
const uid = () => Math.random().toString(36).slice(2, 10)

export const useStore = create(
  persist(
    (set, get) => ({
      profile: null,
      settings: { lang: 'en', theme: 'system', aiKey: '', aiModel: 'gemini-2.5-flash' },
      cycleIndex: 0,
      swaps: {},
      activeWorkout: null,
      sessions: [],
      weights: [],
      foodLog: {},
      customFoods: [],
      water: {},
      chat: [],

      /* ----- profile & settings ----- */
      saveProfile: profile => set(s => {
        const weights = s.weights.length ? s.weights : [{ date: todayStr(), kg: profile.weight }]
        return { profile, weights }
      }),
      setSetting: (key, value) => set(s => ({ settings: { ...s.settings, [key]: value } })),

      /* ----- workouts ----- */
      startWorkout: () => {
        const { profile, cycleIndex, swaps, sessions } = get()
        const key = nextTemplate(profile, cycleIndex)
        const w = buildWorkout(key, profile, swaps)
        const items = w.items.map(it => ({ ...it, sets: makeSets(it, sessions) }))
        set({ activeWorkout: { templateKey: key, startedAt: Date.now(), items } })
      },
      updateSet: (exIdx, setIdx, patch) => set(s => {
        const items = s.activeWorkout.items.map((it, i) => i !== exIdx ? it : {
          ...it, sets: it.sets.map((st, j) => j !== setIdx ? st : { ...st, ...patch })
        })
        return { activeWorkout: { ...s.activeWorkout, items } }
      }),
      addSet: exIdx => set(s => {
        const items = s.activeWorkout.items.map((it, i) => {
          if (i !== exIdx) return it
          const last = it.sets[it.sets.length - 1] || { w: '', r: '' }
          return { ...it, sets: [...it.sets, { w: last.w, r: last.r, done: false }] }
        })
        return { activeWorkout: { ...s.activeWorkout, items } }
      }),
      swapExercise: (exIdx, newId) => set(s => {
        const items = s.activeWorkout.items.map((it, i) => i !== exIdx ? it : {
          ...it, id: newId, sets: makeSets({ ...it, id: newId }, s.sessions)
        })
        return { activeWorkout: { ...s.activeWorkout, items }, swaps: { ...s.swaps, [s.activeWorkout.items[exIdx].baseId]: newId } }
      }),
      finishWorkout: () => set(s => {
        const a = s.activeWorkout
        const items = a.items
          .map(it => ({ id: it.id, type: it.type, sets: it.sets.filter(x => x.done).map(x => ({ w: +x.w || 0, r: +x.r || 0 })) }))
          .filter(it => it.sets.length)
        const session = {
          id: uid(), date: todayStr(), templateKey: a.templateKey,
          durationMin: Math.max(1, Math.round((Date.now() - a.startedAt) / 60000)), items
        }
        return { sessions: [...s.sessions, session], activeWorkout: null, cycleIndex: s.cycleIndex + 1 }
      }),
      cancelWorkout: () => set({ activeWorkout: null }),
      skipWorkout: () => set(s => ({ cycleIndex: s.cycleIndex + 1 })),

      /* ----- body weight ----- */
      logWeight: kg => set(s => {
        const date = todayStr()
        const weights = [...s.weights.filter(w => w.date !== date), { date, kg }].sort((a, b) => a.date.localeCompare(b.date))
        return { weights, profile: s.profile ? { ...s.profile, weight: kg } : s.profile }
      }),

      /* ----- diet ----- */
      addFood: (foodId, qty, date = todayStr()) => set(s => ({
        foodLog: { ...s.foodLog, [date]: [...(s.foodLog[date] || []), { uid: uid(), foodId, qty }] }
      })),
      removeFood: (entryId, date = todayStr()) => set(s => ({
        foodLog: { ...s.foodLog, [date]: (s.foodLog[date] || []).filter(e => e.uid !== entryId) }
      })),
      addCustomFood: food => {
        const id = 'custom_' + uid()
        set(s => ({ customFoods: [...s.customFoods, { ...food, id }] }))
        return id
      },
      setWater: (glasses, date = todayStr()) => set(s => ({ water: { ...s.water, [date]: Math.max(0, glasses) } })),

      /* ----- AI coach chat ----- */
      pushChat: msg => set(s => ({ chat: [...s.chat, msg].slice(-40) })),
      clearChat: () => set({ chat: [] }),

      /* ----- data ----- */
      importData: data => set(data),
      resetAll: () => set({ profile: null, cycleIndex: 0, swaps: {}, activeWorkout: null, sessions: [], weights: [], foodLog: {}, customFoods: [], water: {}, chat: [] })
    }),
    { name: 'fitcoach-data', version: 1 }
  )
)

/* Pre-fill sets with what you lifted last time (progressive overload made easy) */
function makeSets(item, sessions) {
  const last = lastPerformance(item.id, sessions)
  return Array.from({ length: item.sets }, (_, i) => {
    const prev = last?.[i] || last?.[last.length - 1]
    return { w: prev ? String(prev.w || '') : '', r: prev ? String(prev.r || '') : '', done: false }
  })
}

export function lastPerformance(exId, sessions) {
  for (let i = sessions.length - 1; i >= 0; i--) {
    const it = sessions[i].items.find(x => x.id === exId)
    if (it) return it.sets
  }
  return null
}
