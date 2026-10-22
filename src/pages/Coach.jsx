import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore'
import { askCoach, serverCoachAvailable } from '../lib/ai'
import { Icon } from '../components/Icon'

/* Very small markdown: **bold** and bullet lines. Keeps the bundle tiny. */
function Message({ text }) {
  return (
    <div className="space-y-1">
      {text.split('\n').filter(l => l.trim()).map((line, i) => {
        const bullet = /^\s*[-*•]\s+/.test(line)
        const clean = line.replace(/^\s*[-*•]\s+/, '').replace(/^#+\s*/, '')
        const parts = clean.split(/\*\*(.+?)\*\*/g).map((p, k) => (k % 2 ? <b key={k}>{p}</b> : p))
        return bullet ? <div key={i} className="flex gap-2"><span>•</span><span>{parts}</span></div> : <p key={i}>{parts}</p>
      })}
    </div>
  )
}

export default function Coach() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const state = useStore()
  const { chat, pushChat, clearChat, settings, setSetting } = state
  const [input, setInput] = useState('')
  const [keyInput, setKeyInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef(null)
  const [server, setServer] = useState(null) // null = checking, true/false = shared coach available

  useEffect(() => { if (!settings.aiKey) serverCoachAvailable().then(setServer) }, [settings.aiKey])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chat.length, busy])

  const send = async text => {
    const msg = (text ?? input).trim()
    if (!msg || busy) return
    setInput(''); setError('')
    const userMsg = { role: 'user', text: msg }
    pushChat(userMsg)
    setBusy(true)
    try {
      const reply = await askCoach(useStore.getState(), [...chat, userMsg], lang)
      pushChat({ role: 'model', text: reply })
    } catch (e) {
      setError(t('coach.error', { msg: e.message }))
    } finally {
      setBusy(false)
    }
  }

  if (!settings.aiKey && server === null) return <p className="text-muted">{t('coach.thinking')}</p>

  if (!settings.aiKey && !server) {
    return (
      <div className="space-y-4">
        <h1 className="heading text-4xl">{t('coach.title')}</h1>
        <p className="text-muted">{t('coach.intro')}</p>
        <section className="card space-y-3">
          <h2 className="font-semibold">{t('coach.noKeyTitle')}</h2>
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            <li>{t('coach.noKey1')} <a className="text-accent underline" href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">aistudio.google.com/apikey</a></li>
            <li>{t('coach.noKey2')}</li>
            <li>{t('coach.noKey3')}</li>
          </ol>
          <form className="flex gap-2" onSubmit={e => { e.preventDefault(); if (keyInput.trim()) setSetting('aiKey', keyInput.trim()) }}>
            <input id="ai-key" className="input" type="password" placeholder={t('coach.keyLabel')} aria-label={t('coach.keyLabel')}
              value={keyInput} onChange={e => setKeyInput(e.target.value)} />
            <button type="submit" className="btn-primary">{t('common.save')}</button>
          </form>
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 min-h-[calc(100dvh-11rem)]">
      <div className="flex items-center justify-between">
        <h1 className="heading text-4xl">{t('coach.title')}</h1>
        {chat.length > 0 && <button type="button" className="text-sm text-muted underline" onClick={clearChat}>{t('coach.clear')}</button>}
      </div>

      <div className="flex-1 space-y-3">
        {chat.length === 0 && (
          <div className="space-y-3">
            <p className="text-muted">{t('coach.intro')}</p>
            <div className="flex flex-col gap-2">
              {['s1', 's2', 's3'].map(k => (
                <button key={k} type="button" className="btn-ghost !justify-start text-left text-sm font-medium" onClick={() => send(t('coach.' + k))}>
                  {t('coach.' + k)}
                </button>
              ))}
            </div>
          </div>
        )}
        {chat.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'bg-accent text-white rounded-br-sm' : 'bg-surface border border-line rounded-bl-sm'}`}>
              {m.role === 'user' ? m.text : <Message text={m.text} />}
            </div>
          </div>
        ))}
        {busy && <p className="text-sm text-muted">{t('coach.thinking')}</p>}
        {error && <p className="text-sm text-warn">{error}</p>}
        <div ref={endRef} />
      </div>

      <form className="sticky bottom-24 flex gap-2 bg-bg pt-2" onSubmit={e => { e.preventDefault(); send() }}>
        <input id="coach-input" className="input" placeholder={t('coach.placeholder')} aria-label={t('coach.placeholder')}
          value={input} onChange={e => setInput(e.target.value)} />
        <button type="submit" className="btn-primary !px-3" disabled={busy || !input.trim()} aria-label={t('coach.send')}>
          <Icon name="send" size={20} />
        </button>
      </form>
    </div>
  )
}
