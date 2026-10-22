import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useStore } from '../store/useStore'
import { TEMPLATES, weekStart, parseDay } from '../lib/fitness'
import { EX_BY_ID } from '../data/exercises'
import { tx, num, digits } from '../i18n'

/* Recharts draws SVG and needs real color values, so read the current theme tokens */
function useColors() {
  useStore(s => s.settings.theme) // re-render when theme changes
  const cs = getComputedStyle(document.documentElement)
  const v = n => cs.getPropertyValue(n).trim()
  return { accent: v('--accent'), muted: v('--muted'), line: v('--line'), surface: v('--surface'), fg: v('--fg') }
}

const short = d => d.slice(5) // "2026-10-22" -> "10-22"

export default function Progress() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const c = useColors()
  const { sessions, weights, logWeight, profile } = useStore()
  const [kg, setKg] = useState('')
  const [exId, setExId] = useState('')
  const [openSession, setOpenSession] = useState(null)

  const tooltip = { contentStyle: { background: c.surface, border: `1px solid ${c.line}`, borderRadius: 8, color: c.fg }, labelStyle: { color: c.muted } }
  const axis = { stroke: c.muted, fontSize: 12, tickLine: false, axisLine: false }

  // workouts per week, last 8 weeks
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const start = weekStart(); start.setDate(start.getDate() - 7 * (7 - i))
    const end = new Date(start); end.setDate(end.getDate() + 7)
    const count = sessions.filter(s => { const d = parseDay(s.date); return d >= start && d < end }).length
    return { label: `${start.getDate()}/${start.getMonth() + 1}`, count }
  })

  // exercises that have history
  const doneIds = [...new Set(sessions.flatMap(s => s.items.filter(i => i.type !== 'time').map(i => i.id)))]
  const selected = exId || doneIds[0] || ''
  const exData = sessions
    .map(s => { const it = s.items.find(i => i.id === selected); return it && { date: short(s.date), kg: Math.max(...it.sets.map(x => x.w)) } })
    .filter(Boolean)

  const first = weights[0]?.kg
  const latest = weights[weights.length - 1]?.kg
  const change = first != null && latest != null ? Math.round((latest - first) * 10) / 10 : null

  return (
    <div className="space-y-4">
      <h1 className="heading text-4xl">{t('progress.title')}</h1>

      {/* Body weight */}
      <section className="card space-y-3">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-semibold">{t('progress.bodyWeight')}</h2>
            <div className="heading text-4xl tabular">{num(latest ?? profile.weight, lang)} <span className="text-lg text-muted">{t('common.kg')}</span></div>
            {change != null && weights.length > 1 && (
              <div className={`text-sm tabular ${change <= 0 ? 'text-good' : 'text-muted'}`}>
                {t('progress.change')}: {change > 0 ? '+' : ''}{num(change, lang)} {t('common.kg')}
              </div>
            )}
          </div>
          <form className="flex gap-2" onSubmit={e => { e.preventDefault(); if (+kg > 0) { logWeight(+kg); setKg('') } }}>
            <input id="weight-input" className="input !w-28 tabular" type="number" step="0.1" inputMode="decimal" placeholder={t('common.kg')}
              aria-label={t('progress.logWeight')} value={kg} onChange={e => setKg(e.target.value)} />
            <button type="submit" className="btn-primary">{t('common.save')}</button>
          </form>
        </div>
        {weights.length > 1 ? (
          <div className="h-48 -ml-4">
            <ResponsiveContainer>
              <LineChart data={weights.map(w => ({ date: short(w.date), kg: w.kg }))}>
                <CartesianGrid stroke={c.line} vertical={false} />
                <XAxis dataKey="date" {...axis} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} {...axis} width={40} />
                <Tooltip {...tooltip} />
                <Line type="monotone" dataKey="kg" stroke={c.accent} strokeWidth={3} dot={{ r: 3, fill: c.accent }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : <p className="text-sm text-muted">{t('progress.logWeight')} · {t('progress.noData')}</p>}
      </section>

      {/* Workouts per week */}
      <section className="card">
        <h2 className="font-semibold mb-2">{t('progress.perWeek')}</h2>
        <div className="h-44 -ml-4">
          <ResponsiveContainer>
            <BarChart data={weeks}>
              <CartesianGrid stroke={c.line} vertical={false} />
              <XAxis dataKey="label" {...axis} />
              <YAxis allowDecimals={false} domain={[0, Math.max(profile.daysPerWeek, ...weeks.map(w => w.count))]} {...axis} width={40} />
              <Tooltip {...tooltip} cursor={{ fill: c.line, opacity: 0.4 }} />
              <Bar dataKey="count" fill={c.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Exercise progress */}
      <section className="card space-y-3">
        <h2 className="font-semibold">{t('progress.exercise')}</h2>
        {doneIds.length ? (
          <>
            <select id="ex-select" className="input" value={selected} onChange={e => setExId(e.target.value)} aria-label={t('progress.choose')}>
              {doneIds.map(id => <option key={id} value={id}>{EX_BY_ID[id].name}</option>)}
            </select>
            <p className="text-xs text-muted">{t('progress.bestWeight')}</p>
            <div className="h-44 -ml-4">
              <ResponsiveContainer>
                <LineChart data={exData}>
                  <CartesianGrid stroke={c.line} vertical={false} />
                  <XAxis dataKey="date" {...axis} />
                  <YAxis {...axis} width={40} />
                  <Tooltip {...tooltip} />
                  <Line type="monotone" dataKey="kg" stroke={c.accent} strokeWidth={3} dot={{ r: 3, fill: c.accent }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : <p className="text-sm text-muted">{t('progress.noData')}</p>}
      </section>

      {/* History */}
      <section className="card">
        <h2 className="font-semibold mb-2">{t('progress.history')}</h2>
        {sessions.length === 0 && <p className="text-sm text-muted">{t('progress.noHistory')}</p>}
        <ul className="divide-y divide-line">
          {[...sessions].reverse().map(s => {
            const volume = s.items.reduce((a, it) => a + it.sets.reduce((b, x) => b + x.w * x.r, 0), 0)
            const isOpen = openSession === s.id
            return (
              <li key={s.id} className="py-2">
                <button type="button" className="w-full flex justify-between gap-3 text-left" onClick={() => setOpenSession(isOpen ? null : s.id)} aria-expanded={isOpen}>
                  <span>
                    <span className="font-semibold">{tx(TEMPLATES[s.templateKey]?.name, lang)}</span>
                    <span className="block text-xs text-muted tabular">{digits(s.date, lang)} · {num(s.durationMin, lang)} {t('common.min')}</span>
                  </span>
                  <span className="text-sm text-muted tabular text-right">
                    {t('progress.volume')}<br />{num(volume, lang)} {t('common.kg')}
                  </span>
                </button>
                {isOpen && (
                  <ul className="mt-2 space-y-1 text-sm">
                    {s.items.map(it => (
                      <li key={it.id} className="flex justify-between gap-3">
                        <span className="truncate">{EX_BY_ID[it.id]?.name}</span>
                        <span className="text-muted tabular shrink-0">
                          {digits(it.sets.map(x => it.type === 'time' ? `${x.r}s` : `${x.w}×${x.r}`).join(', '), lang)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
