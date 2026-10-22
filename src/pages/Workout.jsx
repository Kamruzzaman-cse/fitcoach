import { useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore, lastPerformance } from '../store/useStore'
import { TEMPLATES } from '../lib/fitness'
import { EX_BY_ID } from '../data/exercises'
import { tx, num, digits } from '../i18n'
import ExerciseInfo from '../components/ExerciseInfo'
import { Icon } from '../components/Icon'

const REST_SECONDS = 90

/* Live workout screen: log weight + reps for each set, rest timer, swap machines */
export default function Workout() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const navigate = useNavigate()
  const { profile, activeWorkout, sessions, updateSet, addSet, swapExercise, finishWorkout, cancelWorkout } = useStore()
  const [rest, setRest] = useState(0) // seconds left on the rest timer
  const [open, setOpen] = useState({}) // which exercise panels are open: { idx: 'info' | 'swap' }
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [error, setError] = useState('')
  const [, tick] = useState(0)

  // rest timer countdown
  useEffect(() => {
    if (rest <= 0) return
    const id = setTimeout(() => setRest(r => r - 1), 1000)
    if (rest === 1 && navigator.vibrate) navigator.vibrate(300)
    return () => clearTimeout(id)
  }, [rest])

  // refresh elapsed time every 30s
  useEffect(() => {
    const id = setInterval(() => tick(x => x + 1), 30000)
    return () => clearInterval(id)
  }, [])

  if (!activeWorkout) return <Navigate to="/" replace />

  const tpl = TEMPLATES[activeWorkout.templateKey]
  const elapsed = Math.floor((Date.now() - activeWorkout.startedAt) / 60000)
  const doneSets = activeWorkout.items.reduce((a, it) => a + it.sets.filter(s => s.done).length, 0)
  const totalSets = activeWorkout.items.reduce((a, it) => a + it.sets.length, 0)

  const toggle = (idx, panel) => setOpen(o => ({ ...o, [idx]: o[idx] === panel ? null : panel }))

  const toggleSet = (i, j, st) => {
    updateSet(i, j, { done: !st.done })
    if (!st.done) setRest(REST_SECONDS)
  }

  const finish = () => {
    if (!doneSets) return setError(t('workout.noneDone'))
    finishWorkout()
    navigate('/progress')
  }

  return (
    <div className="min-h-full bg-bg">
      <header className="sticky top-0 z-20 bg-bg/95 backdrop-blur border-b border-line" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between gap-3">
          <button type="button" className="btn-ghost !p-2" onClick={() => navigate('/')} aria-label={t('common.back')}>
            <Icon name="back" />
          </button>
          <div className="text-center min-w-0">
            <div className="heading text-2xl truncate">{tx(tpl.name, lang)}</div>
            <div className="text-xs text-muted tabular">
              {num(elapsed, lang)} {t('common.min')} · {num(doneSets, lang)}/{num(totalSets, lang)} {t('progress.sets')}
            </div>
          </div>
          <button type="button" className={`btn-ghost !px-3 !py-1.5 text-sm ${confirmCancel ? '!border-warn text-warn' : ''}`}
            onClick={() => { if (confirmCancel) { cancelWorkout(); navigate('/') } else setConfirmCancel(true) }}>
            {confirmCancel ? t('settings.resetConfirm') : t('common.cancel')}
          </button>
        </div>
        <div className="h-1 bg-surface-2"><div className="h-full bg-accent transition-all" style={{ width: (doneSets / totalSets) * 100 + '%' }} /></div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-4 pb-40 space-y-3">
        {confirmCancel && <p className="text-sm text-warn">{t('workout.confirmCancel')}</p>}

        {activeWorkout.items.map((it, i) => {
          const ex = EX_BY_ID[it.id]
          const last = lastPerformance(it.id, sessions)
          const allDone = it.sets.every(s => s.done)
          const isTime = it.type === 'time'
          return (
            <section key={i} className={`card ${allDone ? '!border-good' : ''}`}>
              <div className="flex items-start gap-3">
                <span className={`heading text-3xl ${allDone ? 'text-good' : 'text-accent'}`}>{num(i + 1, lang)}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display font-bold text-xl leading-tight">{ex.name}</h2>
                  <p className="text-xs text-muted">{tx(ex.target, lang)}</p>
                  <p className="text-sm mt-1 tabular">{digits(t('workout.target', { sets: it.sets.length, reps: it.reps }), lang)}</p>
                  {last && (
                    <p className="text-xs text-muted tabular">
                      {t('workout.last')}: {digits(last.map(s => isTime ? `${s.r}s` : `${s.w}×${s.r}`).join(', '), lang)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button type="button" className={`btn-ghost !py-1.5 text-sm ${open[i] === 'info' ? '!border-accent' : ''}`} onClick={() => toggle(i, 'info')}>
                  {t('workout.howTo')}
                </button>
                {ex.alts.length > 0 && (
                  <button type="button" className={`btn-ghost !py-1.5 text-sm ${open[i] === 'swap' ? '!border-accent' : ''}`} onClick={() => toggle(i, 'swap')}>
                    <Icon name="swap" size={16} /> {t('workout.swap')}
                  </button>
                )}
              </div>

              {open[i] === 'info' && <div className="mt-3 rounded-lg bg-surface-2 p-3"><ExerciseInfo ex={ex} /></div>}
              {open[i] === 'swap' && (
                <div className="mt-3 rounded-lg bg-surface-2 p-3">
                  <p className="text-sm font-semibold mb-2">{t('workout.swapTitle')}</p>
                  <div className="flex flex-wrap gap-2">
                    {[it.baseId, ...EX_BY_ID[it.baseId].alts, ...ex.alts]
                      .filter((v, k, arr) => v !== it.id && arr.indexOf(v) === k)
                      .map(id => (
                        <button key={id} type="button" className="btn-ghost !py-1.5 text-sm"
                          onClick={() => { swapExercise(i, id); setOpen(o => ({ ...o, [i]: null })) }}>
                          {EX_BY_ID[id].name}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* set rows */}
              <div className="mt-3 space-y-1.5">
                <div className="grid grid-cols-[2.5rem_1fr_1fr_2.75rem] gap-2 text-xs text-muted px-1">
                  <span>{t('workout.set')}</span>
                  <span>{isTime ? '' : t('workout.weight')}</span>
                  <span>{isTime ? t('workout.seconds') : t('workout.reps')}</span>
                  <span />
                </div>
                {it.sets.map((st, j) => (
                  <div key={j} className={`grid grid-cols-[2.5rem_1fr_1fr_2.75rem] gap-2 items-center rounded-lg px-1 py-1 ${st.done ? 'bg-good-soft' : ''}`}>
                    <span className="heading text-xl text-center">{num(j + 1, lang)}</span>
                    {isTime ? <span /> : (
                      <input id={`w-${i}-${j}`} aria-label={t('workout.weight')} className="input !py-2 text-center tabular" type="number" inputMode="decimal" min="0"
                        value={st.w} onChange={e => updateSet(i, j, { w: e.target.value })} />
                    )}
                    <input id={`r-${i}-${j}`} aria-label={t('workout.reps')} className="input !py-2 text-center tabular" type="number" inputMode="numeric" min="0"
                      value={st.r} onChange={e => updateSet(i, j, { r: e.target.value })} />
                    <button type="button" aria-pressed={st.done} aria-label={t('workout.set') + ' ' + (j + 1)}
                      onClick={() => toggleSet(i, j, st)}
                      className={`h-10 w-10 rounded-lg border-2 grid place-items-center ${st.done ? 'bg-good border-good text-white' : 'border-line text-transparent'}`}>
                      <Icon name="check" size={20} />
                    </button>
                  </div>
                ))}
                <button type="button" className="text-sm text-accent font-semibold px-1 pt-1" onClick={() => addSet(i)}>
                  + {t('workout.addSet')}
                </button>
              </div>
            </section>
          )
        })}

        {profile.goal !== 'muscle' && (
          <p className="card text-sm">{t('workout.cardio')}</p>
        )}
      </main>

      {/* bottom bar: rest timer + finish */}
      <div className="fixed bottom-0 inset-x-0 z-20 bg-surface border-t border-line" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto max-w-3xl px-4 py-3 space-y-2">
          {rest > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-accent-soft px-3 py-2">
              <span className="font-semibold text-accent">{t('workout.rest')}</span>
              <span className="heading text-3xl tabular text-accent">
                {digits(`${Math.floor(rest / 60)}:${String(rest % 60).padStart(2, '0')}`, lang)}
              </span>
              <div className="flex gap-2">
                <button type="button" className="btn-ghost !py-1 !px-2 text-sm" onClick={() => setRest(r => r + 30)}>+{num(30, lang)}s</button>
                <button type="button" className="btn-ghost !py-1 !px-2 text-sm" onClick={() => setRest(0)}>{t('workout.skipRest')}</button>
              </div>
            </div>
          )}
          {error && <p className="text-sm text-warn">{error}</p>}
          <button type="button" className="btn-primary w-full text-lg" onClick={finish}>
            <Icon name="check" size={20} /> {t('workout.finish')}
          </button>
        </div>
      </div>
    </div>
  )
}
