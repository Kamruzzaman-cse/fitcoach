import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore'
import { SPLITS, TEMPLATES } from '../lib/fitness'
import { tx, num } from '../i18n'
import { WEEK_ORDER, DEFAULT_DAYS, sortDays, dayShort, weekPlan } from '../lib/schedule'

const GOALS = ['muscle', 'fat_loss', 'recomp']
const EQUIP = ['machines', 'free', 'home']

/* Choice card used for goal / equipment */
function Choice({ active, onClick, title, desc }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`text-left rounded-xl border p-3 transition ${active ? 'border-accent bg-accent-soft' : 'border-line bg-surface'}`}
    >
      <div className="font-semibold">{title}</div>
      <div className="text-xs text-muted">{desc}</div>
    </button>
  )
}

export default function Onboarding({ edit = false }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const navigate = useNavigate()
  const saved = useStore(s => s.profile)
  const saveProfile = useStore(s => s.saveProfile)
  const setSetting = useStore(s => s.setSetting)

  const [f, setF] = useState(
    saved || { name: '', sex: 'male', age: '', height: '', weight: '', goal: 'recomp', daysPerWeek: 6, trainingDays: DEFAULT_DAYS[6], equipment: 'machines' }
  )
  const [error, setError] = useState('')
  const up = (k, v) => setF(p => ({ ...p, [k]: v }))
  const days = f.trainingDays || DEFAULT_DAYS[f.daysPerWeek] || DEFAULT_DAYS[6]
  const toggleDay = d => up('trainingDays', days.includes(d) ? days.filter(x => x !== d) : [...days, d])
  const validDays = days.length >= 3 && days.length <= 6
  const preview = validDays ? weekPlan({ trainingDays: days }) : {}

  const submit = e => {
    e.preventDefault()
    const trainingDays = sortDays(days)
    const profile = { ...f, age: +f.age, height: +f.height, weight: +f.weight, trainingDays, daysPerWeek: trainingDays.length }
    if (!profile.age || !profile.height || !profile.weight) return setError(t('onboarding.required'))
    if (trainingDays.length < 3 || trainingDays.length > 6) return setError(t('schedule.pickRange'))
    saveProfile(profile)
    navigate('/')
  }

  return (
    <div className="min-h-full bg-bg">
      <form onSubmit={submit} className="mx-auto max-w-xl px-4 py-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <img src="./icon.svg" alt="" className="w-12 h-12 mb-3" />
            <h1 className="heading text-4xl">{t('onboarding.title')}</h1>
            <p className="text-muted mt-2">{t('onboarding.subtitle')}</p>
          </div>
          <button type="button" className="btn-ghost !px-3 !py-1.5 text-sm shrink-0" onClick={() => setSetting('lang', lang === 'en' ? 'bn' : 'en')}>
            {lang === 'en' ? 'বাংলা' : 'English'}
          </button>
        </div>

        <div className="card space-y-4">
          <div>
            <label className="label" htmlFor="ob-name">{t('onboarding.name')}</label>
            <input id="ob-name" className="input" value={f.name} onChange={e => up('name', e.target.value)} placeholder="Amit" />
          </div>
          <div>
            <span className="label">{t('onboarding.sex')}</span>
            <div className="grid grid-cols-2 gap-2">
              {['male', 'female'].map(s => (
                <Choice key={s} active={f.sex === s} onClick={() => up('sex', s)} title={t('onboarding.' + s)} desc="" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[['age', 'ob-age'], ['height', 'ob-height'], ['weight', 'ob-weight']].map(([k, id]) => (
              <div key={k}>
                <label className="label" htmlFor={id}>{t('onboarding.' + k)}</label>
                <input id={id} className="input tabular" type="number" inputMode="decimal" min="1" value={f[k]} onChange={e => up(k, e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-3">
          <span className="label">{t('onboarding.goal')}</span>
          <div className="grid gap-2 sm:grid-cols-3">
            {GOALS.map(g => (
              <Choice key={g} active={f.goal === g} onClick={() => up('goal', g)}
                title={t(`onboarding.goals.${g}`)} desc={t(`onboarding.goals.${g}_d`)} />
            ))}
          </div>
        </div>

        <div className="card space-y-3">
          <span className="label">{t('schedule.days')}</span>
          <p className="text-xs text-muted -mt-2">{t('schedule.daysHint')}</p>
          <div className="grid grid-cols-7 gap-1">
            {WEEK_ORDER.map(d => {
              const on = days.includes(d)
              return (
                <button key={d} id={'pick-day-' + d} type="button" aria-pressed={on} onClick={() => toggleDay(d)}
                  className={`rounded-lg border-2 py-2 flex flex-col items-center gap-1 min-w-0 ${on ? 'border-accent bg-accent text-white' : 'border-line bg-surface text-muted'}`}>
                  <span className="text-xs font-semibold">{dayShort(d, lang)}</span>
                  <span className="text-[10px] leading-none truncate w-full text-center">
                    {on && preview[d] ? tx(TEMPLATES[preview[d]].short, lang) : t('schedule.rest')}
                  </span>
                </button>
              )
            })}
          </div>
          <p className={`text-sm ${validDays ? 'text-muted' : 'text-warn'}`}>
            {validDays ? `${num(days.length, lang)} · ${tx(SPLITS[days.length].name, lang)}` : t('schedule.pickRange')}
          </p>
        </div>

        <div className="card space-y-3">
          <span className="label">{t('onboarding.equipment')}</span>
          <div className="grid gap-2 sm:grid-cols-3">
            {EQUIP.map(q => (
              <Choice key={q} active={f.equipment === q} onClick={() => up('equipment', q)}
                title={t(`onboarding.eq.${q}`)} desc={t(`onboarding.eq.${q}_d`)} />
            ))}
          </div>
        </div>

        {error && <p className="text-warn font-medium">{error}</p>}
        <div className="flex gap-2">
          {edit && <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>{t('common.cancel')}</button>}
          <button type="submit" className="btn-primary flex-1 text-lg">{edit ? t('common.save') : t('onboarding.start')}</button>
        </div>
      </form>
    </div>
  )
}
