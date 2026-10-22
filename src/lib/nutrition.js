import { FOOD_BY_ID } from '../data/foods'

export const findFood = (id, customFoods) => FOOD_BY_ID[id] || customFoods.find(f => f.id === id)

/* Add up calories and macros for a list of log entries [{ foodId, qty }] */
export function totalsFor(entries, customFoods = []) {
  return entries.reduce((t, e) => {
    const f = findFood(e.foodId, customFoods)
    if (!f) return t
    return { kcal: t.kcal + f.kcal * e.qty, p: t.p + f.p * e.qty, c: t.c + f.c * e.qty, f: t.f + f.f * e.qty }
  }, { kcal: 0, p: 0, c: 0, f: 0 })
}
