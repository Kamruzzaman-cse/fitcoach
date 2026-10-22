import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore'
import { FOODS } from '../data/foods'
import { calcNutrition, bmi, todayStr } from '../lib/fitness'
import { totalsFor, findFood } from '../lib/nutrition'
import { tx, num } from '../i18n'
import Bar from '../components/Bar'
import { Icon } from '../components/Icon'

export default function Diet() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { profile, foodLog, customFoods, water, addFood, removeFood, addCustomFood, setWater } = useStore()
  const [q, setQ] = useState('')
  const [qty, setQty] = useState({}) // servings chosen per food in the search list
  const [showCustom, setShowCustom] = useState(false)
  const [cf, setCf] = useState({ name: '', serving: '', kcal: '', p: '', c: '', f: '' })

  const today = todayStr()
  const log = foodLog[today] || []
  const eaten = totalsFor(log, customFoods)
  const n = calcNutrition(profile)
  const glasses = water[today] || 0
  const glassTarget = Math.round((n?.water || 3) * 4) // 250 ml glasses

  const all = [...customFoods, ...FOODS]
  const results = q.trim()
    ? all.filter(f => (f.name.en + ' ' + f.name.bn).toLowerCase().includes(q.toLowerCase())).slice(0, 8)
    : []

  const saveCustom = e => {
    e.preventDefault()
    if (!cf.name || !cf.kcal) return
    const id = addCustomFood({
      name: { en: cf.name, bn: cf.name }, serving: { en: cf.serving || '1 serving', bn: cf.serving || '১ পরিবেশন' },
      kcal: +cf.kcal, p: +cf.p || 0, c: +cf.c || 0, f: +cf.f || 0
    })
    addFood(id, 1)
    setCf({ name: '', serving: '', kcal: '', p: '', c: '', f: '' })
    setShowCustom(false)
  }

  return (
    <div className="space-y-4">
      <h1 className="heading text-4xl">{t('diet.title')}</h1>

      {/* Targets */}
      {n && (
        <section className="card">
          <div className="flex items-end justify-between mb-3">
            <h2 className="font-semibold">{t('diet.targets')}</h2>
            <span className="text-sm text-muted tabular">
              {n.calories - eaten.kcal >= 0
                ? t('diet.left', { n: num(Math.round(n.calories - eaten.kcal), lang) })
                : t('diet.over', { n: num(Math.round(eaten.kcal - n.calories), lang) })} kcal
            </span>
          </div>
          <Bar label={t('diet.calories')} value={eaten.kcal} max={n.calories} unit="kcal" lang={lang} />
          <Bar label={t('diet.protein')} value={eaten.p} max={n.protein} unit="g" lang={lang} />
          <Bar label={t('diet.carbs')} value={eaten.c} max={n.carbs} unit="g" lang={lang} />
          <Bar label={t('diet.fat')} value={eaten.f} max={n.fat} unit="g" lang={lang} />
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            {[['bmi', bmi(profile)], ['bmr', n.bmr], ['tdee', n.tdee]].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-surface-2 py-2">
                <div className="text-xs text-muted">{t('diet.' + k)}</div>
                <div className="font-display font-bold text-xl tabular">{num(v, lang)}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-2">{t('diet.how')} {t('common.approx')}</p>
        </section>
      )}

      {/* Water */}
      <section className="card flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">{t('diet.water')}</h2>
          <p className="text-sm text-muted tabular">{num(glasses, lang)} / {num(glassTarget, lang)} {t('diet.glasses')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="btn-ghost !px-3" onClick={() => setWater(glasses - 1)} aria-label="-1">−</button>
          <Icon name="water" className="text-accent" size={28} />
          <button type="button" className="btn-primary !px-3" onClick={() => setWater(glasses + 1)} aria-label="+1">+</button>
        </div>
      </section>

      {/* Add food */}
      <section className="card space-y-3">
        <h2 className="font-semibold">{t('diet.addFood')}</h2>
        <input id="food-search" className="input" placeholder={t('diet.search')} value={q} onChange={e => setQ(e.target.value)} />
        {results.length > 0 && (
          <ul className="divide-y divide-line">
            {results.map(f => {
              const s = qty[f.id] ?? 1
              return (
                <li key={f.id} className="py-2 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{tx(f.name, lang)}</div>
                    <div className="text-xs text-muted tabular">
                      {tx(f.serving, lang)} · {num(f.kcal, lang)} kcal · {num(f.p, lang)}g {t('diet.protein')}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" className="btn-ghost !px-2 !py-1" onClick={() => setQty(o => ({ ...o, [f.id]: Math.max(0.5, s - 0.5) }))} aria-label="-">−</button>
                    <span className="w-8 text-center tabular">{num(s, lang)}</span>
                    <button type="button" className="btn-ghost !px-2 !py-1" onClick={() => setQty(o => ({ ...o, [f.id]: s + 0.5 }))} aria-label="+">+</button>
                    <button type="button" className="btn-primary !px-2.5 !py-1" onClick={() => { addFood(f.id, s); setQ('') }} aria-label={t('common.add')}>
                      <Icon name="plus" size={18} />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <button type="button" className="text-sm text-accent font-semibold" onClick={() => setShowCustom(v => !v)}>
          + {t('diet.custom')}
        </button>
        {showCustom && (
          <form onSubmit={saveCustom} className="grid grid-cols-2 gap-2 rounded-lg bg-surface-2 p-3">
            <input id="cf-name" className="input col-span-2" placeholder={t('diet.customName')} value={cf.name} onChange={e => setCf({ ...cf, name: e.target.value })} />
            <input id="cf-serving" className="input col-span-2" placeholder={t('diet.serving')} value={cf.serving} onChange={e => setCf({ ...cf, serving: e.target.value })} />
            {[['kcal', 'kcal'], ['p', t('diet.protein') + ' g'], ['c', t('diet.carbs') + ' g'], ['f', t('diet.fat') + ' g']].map(([k, ph]) => (
              <input key={k} id={'cf-' + k} className="input tabular" type="number" inputMode="decimal" min="0" placeholder={ph}
                value={cf[k]} onChange={e => setCf({ ...cf, [k]: e.target.value })} />
            ))}
            <button type="submit" className="btn-primary col-span-2">{t('common.add')}</button>
          </form>
        )}
      </section>

      {/* Today's log */}
      <section className="card">
        <h2 className="font-semibold mb-2">{t('diet.todayLog')}</h2>
        {log.length === 0 && <p className="text-sm text-muted">{t('diet.empty')}</p>}
        <ul className="divide-y divide-line">
          {log.map(e => {
            const f = findFood(e.foodId, customFoods)
            if (!f) return null
            return (
              <li key={e.uid} className="py-2 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate">{tx(f.name, lang)} <span className="text-muted">× {num(e.qty, lang)}</span></div>
                  <div className="text-xs text-muted tabular">{num(Math.round(f.kcal * e.qty), lang)} kcal · {num(Math.round(f.p * e.qty), lang)}g {t('diet.protein')}</div>
                </div>
                <button type="button" className="text-muted p-1" onClick={() => removeFood(e.uid)} aria-label={t('common.delete')}>
                  <Icon name="trash" size={18} />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="card">
        <h2 className="font-semibold mb-2">{t('diet.tips')}</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {[1, 2, 3, 4].map(i => <li key={i}>{t('diet.tip' + i)}</li>)}
        </ul>
      </section>
    </div>
  )
}
