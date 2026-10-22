import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore'
import { buildWorkout, nextTemplate, SPLITS, TEMPLATES, weekStart, streakWeeks, calcNutrition, todayStr, parseDay } from '../lib/fitness'
import { EX_BY_ID } from '../data/exercises'
import { tx, num, digits } from '../i18n'
import { totalsFor } from '../lib/nutrition'
import Bar from '../components/Bar'
import { Icon } from '../components/Icon'

function Stat({ label, value, sub }) {
  return (
    <div className="card !p-3">
      <div className="text-xs text-muted">{label}</div>
      <div className="heading text-3xl tabular mt-1">{value}</div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </div>
  )
}

export default function Today() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const navigate = useNavigate()
  const s = useStore()
  const { profile, cycleIndex, swaps, sessions, activeWorkout } = s

  const key = activeWorkout?.templateKey || nextTemplate(profile, cycleIndex)
  const w = buildWorkout(key, profile, swaps)
  const split = SPLITS[profile.daysPerWeek]
  const pos = (cycleIndex % split.cycle.length) + 1

  const ws = weekStart()
  const thisWeek = sessions.filter(x => parseDay(x.date) >= ws).length
  const streak = streakWeeks(sessions, profile.daysPerWeek)
  const last = sessions[sessions.length - 1]

  const n = calcNutrition(profile)
  const eaten = totalsFor(s.foodLog[todayStr()] || [], s.customFoods)

  const start = () => {
    if (!activeWorkout) s.startWorkout()
    navigate('/workout')
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="heading text-4xl">{t('today.hi', { name: profile.name || 'Champ' })}</h1>
        <p className="text-muted">{t('app.tagline')}</p>
      </div>

      {/* Next workout */}
      <section className="card !p-0 overflow-hidden">
        <div className="bg-accent text-white px-4 py-3">
          <div className="text-xs uppercase tracking-wider opacity-90">{t('today.next')}</div>
          <div className="heading text-4xl">{tx(TEMPLATES[key].name, lang)}</div>
          <div className="text-sm opacity-90">
            {tx(TEMPLATES[key].focus, lang)} · {t('today.exercises', { count: num(w.items.length, lang) })}
          </div>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-xs text-muted">{t('today.cycle', { n: num(pos, lang), split: tx(split.name, lang) })}</p>
          <ol className="space-y-1.5">
            {w.items.map((it, i) => (
              <li key={it.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="heading text-lg text-accent w-5">{num(i + 1, lang)}</span>
                  <span className="truncate">{EX_BY_ID[it.id].name}</span>
                </span>
                <span className="text-muted tabular shrink-0">{digits(`${it.sets} × ${it.reps}`, lang)}</span>
              </li>
            ))}
          </ol>
          <div className="flex gap-2 pt-1">
            <button type="button" className="btn-primary flex-1" onClick={start}>
              <Icon name="play" size={18} /> {activeWorkout ? t('today.resume') : t('today.start')}
            </button>
            {!activeWorkout && (
              <button type="button" className="btn-ghost" onClick={s.skipWorkout}>{t('today.skip')}</button>
            )}
          </div>
          <p className="text-xs text-muted">{t('today.warmup')}</p>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Stat label={t('today.thisWeek')} value={`${num(thisWeek, lang)}/${num(profile.daysPerWeek, lang)}`} />
        <Stat label={t('today.streak')} value={num(streak, lang)} sub={t('today.weeks')} />
        <Stat label={t('today.total')} value={num(sessions.length, lang)} />
      </div>

      <p className="text-sm rounded-lg bg-good-soft text-fg px-3 py-2">{t('today.missedTip')}</p>

      {/* Nutrition summary */}
      {n && (
        <section className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">{t('today.nutrition')}</h2>
            <Link to="/diet" className="text-accent text-sm font-semibold">{t('today.openDiet')} →</Link>
          </div>
          <Bar label={t('diet.calories')} value={eaten.kcal} max={n.calories} unit="kcal" lang={lang} />
          <Bar label={t('diet.protein')} value={eaten.p} max={n.protein} unit="g" lang={lang} />
        </section>
      )}

      {last && (
        <section className="card text-sm">
          <h2 className="font-semibold mb-1">{t('today.lastSession')}</h2>
          <p className="text-muted">
            {tx(TEMPLATES[last.templateKey].name, lang)} · {digits(last.date, lang)} · {num(last.durationMin, lang)} {t('common.min')}
          </p>
        </section>
      )}
    </div>
  )
}
