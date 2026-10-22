import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore'
import { buildWorkout, TEMPLATES, streakWeeks, calcNutrition, todayStr } from '../lib/fitness'
import { getWeek, nextTrainingDay, dayName, trainingDaysOf } from '../lib/schedule'
import { EX_BY_ID } from '../data/exercises'
import { tx, num, digits } from '../i18n'
import { totalsFor } from '../lib/nutrition'
import Bar from '../components/Bar'
import WeekStrip from '../components/WeekStrip'
import MakeupCard from '../components/MakeupCard'
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

/* Orange card with the workout's exercise list and a Start button */
function WorkoutCard({ templateKey, label, note, onStart, resume, children }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { profile, swaps } = useStore()
  const w = buildWorkout(templateKey, profile, swaps)
  return (
    <section className="card !p-0 overflow-hidden">
      <div className="bg-accent text-white px-4 py-3">
        <div className="text-xs uppercase tracking-wider opacity-90">{label}</div>
        <div className="heading text-4xl">{tx(TEMPLATES[templateKey].name, lang)}</div>
        <div className="text-sm opacity-90">
          {tx(TEMPLATES[templateKey].focus, lang)} · {t('today.exercises', { count: num(w.items.length, lang) })}
        </div>
      </div>
      <div className="p-4 space-y-3">
        {note && <p className="text-xs font-semibold text-accent">{note}</p>}
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
          <button type="button" className="btn-primary flex-1" onClick={onStart}>
            <Icon name="play" size={18} /> {resume ? t('today.resume') : t('today.start')}
          </button>
          {children}
        </div>
        <p className="text-xs text-muted">{t('today.warmup')}</p>
      </div>
    </section>
  )
}

export default function Today() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const navigate = useNavigate()
  const s = useStore()
  const { profile, sessions, activeWorkout, undoReschedule } = s
  const [selected, setSelected] = useState(null) // date picked on the week strip

  const week = getWeek(s)
  const today = week.find(d => d.isToday)
  const missed = week.filter(d => d.status === 'missed')
  const next = nextTrainingDay(s)
  const sel = week.find(d => d.date === selected)

  const doneThisWeek = week.filter(d => d.status === 'done').length
  const planned = trainingDaysOf(profile).length
  const streak = streakWeeks(sessions, planned)
  const last = sessions[sessions.length - 1]
  const n = calcNutrition(profile)
  const eaten = totalsFor(s.foodLog[todayStr()] || [], s.customFoods)

  const start = (tpl, date) => {
    if (!activeWorkout) s.startWorkout(tpl, date)
    navigate('/workout')
  }
  const wName = d => tx(TEMPLATES[d.workout || d.base].name, lang)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="heading text-4xl">{t('today.hi', { name: profile.name || 'Champ' })}</h1>
        <p className="text-muted">{t('app.tagline')}</p>
      </div>

      {/* Week plan */}
      <section className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{t('schedule.week')}</h2>
          <span className="text-sm text-muted tabular">{num(doneThisWeek, lang)}/{num(planned, lang)} {t('schedule.done')}</span>
        </div>
        <WeekStrip week={week} selected={selected} onSelect={setSelected} />
        {!sel && <p className="text-xs text-muted">{t('schedule.tapHint')}</p>}
        {sel && (sel.status === 'moved' || sel.status === 'skipped') && (
          <div className="flex items-center justify-between gap-3 rounded-lg bg-surface-2 p-3 text-sm">
            <span>
              {sel.status === 'moved'
                ? t('schedule.movedNote', { w: wName(sel), day: dayName(new Date(sel.movedTo + 'T00:00:00').getDay(), lang) })
                : t('schedule.skippedNote', { w: wName(sel) })}
            </span>
            <button type="button" className="btn-ghost !py-1.5 text-sm shrink-0" onClick={() => { undoReschedule(sel.date); setSelected(null) }}>
              {t('schedule.undo')}
            </button>
          </div>
        )}
      </section>

      {/* "I'm busy" panel for a selected upcoming day */}
      {sel && (sel.status === 'today' || sel.status === 'upcoming') && (
        <MakeupCard day={sel} week={week} mode="busy" onDone={() => setSelected(null)} />
      )}

      {/* Active workout always comes first */}
      {activeWorkout ? (
        <WorkoutCard templateKey={activeWorkout.templateKey} label={t('today.next')} resume onStart={() => navigate('/workout')} />
      ) : (
        <>
          {/* handle missed workouts one at a time, newest first, so two never get the same make-up day */}
          {missed.length > 0 && (
            <>
              <MakeupCard key={missed[missed.length - 1].date} day={missed[missed.length - 1]} week={week} mode="missed" />
              {missed.length > 1 && <p className="text-xs text-muted -mt-2 px-1">{t('schedule.moreMissed', { n: num(missed.length - 1, lang) })}</p>}
            </>
          )}

          {today.status === 'today' && (
            <WorkoutCard
              templateKey={today.workout}
              label={t('schedule.today')}
              note={today.makeupOf ? t('schedule.makeupNote', { day: dayName(new Date(today.makeupOf + 'T00:00:00').getDay(), lang) }) : null}
              onStart={() => start(today.workout, today.makeupOf || today.date)}
            >
              <button type="button" className="btn-ghost" onClick={() => setSelected(today.date)}>{t('schedule.busy')}</button>
            </WorkoutCard>
          )}

          {today.status !== 'today' && (
            <section className="card space-y-2">
              <h2 className="heading text-3xl">
                {today.status === 'done' ? t('schedule.doneTitle') : t('schedule.restTitle')}
              </h2>
              <p className="text-sm text-muted">{today.status === 'done' ? t('schedule.doneText') : t('schedule.restText')}</p>
              {next && (
                <p className="text-sm font-semibold text-accent">
                  {t('schedule.nextOn', { w: tx(TEMPLATES[next.workout].name, lang), day: dayName(next.wd, lang) })}
                </p>
              )}
            </section>
          )}
        </>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Stat label={t('today.thisWeek')} value={`${num(doneThisWeek, lang)}/${num(planned, lang)}`} />
        <Stat label={t('today.streak')} value={num(streak, lang)} sub={t('today.weeks')} />
        <Stat label={t('today.total')} value={num(sessions.length, lang)} />
      </div>

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
