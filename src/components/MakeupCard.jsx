import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore'
import { TEMPLATES } from '../lib/fitness'
import { recommendDay, shiftPlan, dayName } from '../lib/schedule'
import { tx } from '../i18n'

/*
  Shown when a workout was missed, or when the user says "I'm busy that day".
  Recommends the best free day to do it instead.
  mode: 'missed' (date already passed) | 'busy' (today or a future day)
*/
export default function MakeupCard({ day, week, mode, onDone }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const navigate = useNavigate()
  const { reschedule, applyMoves, startWorkout, activeWorkout, profile } = useStore()

  const tpl = day.workout
  const w = tx(TEMPLATES[tpl].name, lang)
  const rec = recommendDay(week, day, profile.backupDays || [])
  const shift = rec ? null : shiftPlan(week, day) // only when no free day is left
  const byDate = d => week.find(x => x.date === d)
  const firstT = shift && byDate(shift[0].to)
  const lastMove = shift && shift[shift.length - 1]
  const lastT = shift && byDate(lastMove.from)
  // rest days left this week: offered as an option when no backup day was recommended
  const todayDate = week.find(d => d.isToday)?.date || ''
  const restLeft = rec ? [] : week.filter(d => d.date >= todayDate && d.date !== day.date && !d.workout && d.status === 'rest')

  const moveTo = () => { reschedule(day.date, rec.date, tpl); onDone?.() }
  const skip = () => { reschedule(day.date, null, tpl); onDone?.() }
  const doNow = () => {
    if (!activeWorkout) startWorkout(tpl, day.date)
    navigate('/workout')
  }
  const canDoNow = mode === 'missed' || rec?.isToday

  return (
    <section className={`card space-y-3 ${mode === 'missed' ? '!border-warn' : ''}`}>
      <h2 className="font-semibold">
        {mode === 'missed'
          ? t('schedule.missedTitle', { w, day: dayName(day.wd, lang) })
          : t('schedule.busyTitle', { day: dayName(day.wd, lang) })}
      </h2>

      {rec ? (
        <div className="rounded-lg bg-accent-soft p-3 text-sm">
          {rec.isToday ? (
            <p className="font-semibold text-accent">{t('schedule.recommendToday')}</p>
          ) : (
            <>
              <p className="font-semibold text-accent">{t('schedule.recommend', { day: dayName(rec.wd, lang) })}</p>
              <p className="text-fg mt-1">{t('schedule.why', { w })}</p>
            </>
          )}
        </div>
      ) : shift ? (
        <div className="rounded-lg bg-accent-soft p-3 text-sm">
          <p className="font-semibold text-accent">{t('schedule.shiftTitle')}</p>
          <p className="text-fg mt-1">
            {t('schedule.shiftText', {
              w, day: dayName(firstT.wd, lang),
              last: tx(TEMPLATES[lastMove.templateKey].name, lang), lastDay: dayName(lastT.wd, lang)
            })}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted">{t('schedule.noDay')}</p>
      )}

      {restLeft.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted">{t('schedule.restOption')}</p>
          <div className="flex flex-wrap gap-2">
            {restLeft.map(d => (
              <button key={d.date} type="button" className="btn-ghost !py-1.5 text-sm"
                onClick={() => { reschedule(day.date, d.date, tpl); onDone?.() }}>
                {t('schedule.moveTo', { day: dayName(d.wd, lang) })}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {rec && !rec.isToday && (
          <button type="button" className="btn-primary" onClick={moveTo}>{t('schedule.moveTo', { day: dayName(rec.wd, lang) })}</button>
        )}
        {shift && (
          <button type="button" className="btn-primary" onClick={() => { applyMoves(shift); onDone?.() }}>{t('schedule.shift')}</button>
        )}
        {canDoNow && (
          <button type="button" className={rec?.isToday ? 'btn-primary' : 'btn-ghost'} onClick={doNow}>{t('schedule.doNow')}</button>
        )}
        <button type="button" className="btn-ghost" onClick={skip}>{t('schedule.skip')}</button>
      </div>
    </section>
  )
}
