import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore'
import { SPLITS } from '../lib/fitness'
import { tx, num } from '../i18n'

function Segmented({ value, options, onChange, label }) {
  return (
    <div role="group" aria-label={label} className="grid gap-1 rounded-lg bg-surface-2 p-1" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map(o => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}
          className={`rounded-md py-1.5 text-sm font-medium ${value === o.value ? 'bg-surface text-fg shadow-sm' : 'text-muted'}`}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

const DATA_KEYS = ['profile', 'cycleIndex', 'swaps', 'sessions', 'weights', 'foodLog', 'customFoods', 'water']

export default function Settings() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const state = useStore()
  const { settings, setSetting, profile, importData, resetAll } = state
  const [msg, setMsg] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const fileRef = useRef(null)

  const exportData = () => {
    const data = Object.fromEntries(DATA_KEYS.map(k => [k, state[k]]))
    const blob = new Blob([JSON.stringify({ app: 'fitcoach', version: 1, data }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `fitcoach-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const onImport = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const json = JSON.parse(await file.text())
      if (json.app !== 'fitcoach') throw new Error()
      importData(json.data)
      setMsg(t('settings.imported'))
    } catch {
      setMsg(t('settings.importError'))
    }
    e.target.value = ''
  }

  return (
    <div className="space-y-4">
      <h1 className="heading text-4xl">{t('settings.title')}</h1>

      <section className="card space-y-4">
        <div>
          <span className="label">{t('settings.language')}</span>
          <Segmented label={t('settings.language')} value={settings.lang} onChange={v => setSetting('lang', v)}
            options={[{ value: 'en', label: 'English' }, { value: 'bn', label: 'বাংলা' }]} />
        </div>
        <div>
          <span className="label">{t('settings.theme')}</span>
          <Segmented label={t('settings.theme')} value={settings.theme} onChange={v => setSetting('theme', v)}
            options={['system', 'light', 'dark'].map(v => ({ value: v, label: t('settings.' + v) }))} />
        </div>
      </section>

      <section className="card space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{t('settings.profile')}</h2>
          <Link to="/profile" className="text-accent text-sm font-semibold">{t('settings.editProfile')} →</Link>
        </div>
        <p className="text-sm text-muted">
          {profile.name} · {num(profile.age, lang)} · {num(profile.height, lang)} {t('common.cm')} · {num(profile.weight, lang)} {t('common.kg')}
        </p>
        <p className="text-sm text-muted">
          {t('onboarding.goals.' + profile.goal)} · {tx(SPLITS[profile.daysPerWeek].name, lang)} · {t('onboarding.eq.' + profile.equipment)}
        </p>
      </section>

      <section className="card space-y-3">
        <h2 className="font-semibold">{t('settings.ai')}</h2>
        <div>
          <label className="label" htmlFor="set-key">{t('coach.keyLabel')}</label>
          <input id="set-key" className="input" type="password" value={settings.aiKey} onChange={e => setSetting('aiKey', e.target.value.trim())} />
        </div>
        <div>
          <label className="label" htmlFor="set-model">{t('settings.aiModel')}</label>
          <input id="set-model" className="input" value={settings.aiModel} onChange={e => setSetting('aiModel', e.target.value.trim())} />
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="font-semibold">{t('settings.data')}</h2>
        <p className="text-sm text-muted">{t('settings.dataNote')}</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-ghost" onClick={exportData}>{t('settings.export')}</button>
          <button type="button" className="btn-ghost" onClick={() => fileRef.current?.click()}>{t('settings.import')}</button>
          <input ref={fileRef} id="import-file" type="file" accept="application/json" hidden onChange={onImport} />
          <button type="button" className={`btn-ghost ${confirmReset ? '!border-warn text-warn' : ''}`}
            onClick={() => (confirmReset ? resetAll() : setConfirmReset(true))}>
            {confirmReset ? t('settings.resetConfirm') : t('settings.reset')}
          </button>
        </div>
        {msg && <p className="text-sm text-good">{msg}</p>}
      </section>

      <p className="text-center text-xs text-muted">FitCoach v1.0 · React + Vite</p>
    </div>
  )
}
