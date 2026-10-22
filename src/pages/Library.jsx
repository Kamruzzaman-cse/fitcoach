import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EXERCISES, MUSCLES, EX_BY_ID, EQUIPMENT } from '../data/exercises'
import { tx } from '../i18n'
import ExerciseInfo from '../components/ExerciseInfo'
import { Icon } from '../components/Icon'

export default function Library() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [q, setQ] = useState('')
  const [group, setGroup] = useState('all')
  const [openId, setOpenId] = useState(null)

  const list = EXERCISES.filter(e =>
    (group === 'all' || e.group === group) &&
    (e.name + ' ' + e.target.en + ' ' + e.target.bn).toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <h1 className="heading text-4xl">{t('library.title')}</h1>
      <input id="lib-search" className="input" placeholder={t('library.search')} value={q} onChange={e => setQ(e.target.value)} />

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {['all', ...Object.keys(MUSCLES)].map(g => (
          <button key={g} type="button" onClick={() => setGroup(g)} aria-pressed={group === g}
            className={`shrink-0 rounded-full border px-3 py-1 text-sm ${group === g ? 'bg-accent border-accent text-white' : 'border-line bg-surface'}`}>
            {g === 'all' ? t('library.all') : tx(MUSCLES[g], lang)}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {list.map(ex => {
          const isOpen = openId === ex.id
          return (
            <article key={ex.id} className="card !p-0">
              <button type="button" className="w-full flex items-center justify-between gap-3 p-4 text-left"
                onClick={() => setOpenId(isOpen ? null : ex.id)} aria-expanded={isOpen}>
                <div className="min-w-0">
                  <div className="font-display font-bold text-xl leading-tight">{ex.name}</div>
                  <div className="text-xs text-muted">{tx(MUSCLES[ex.group], lang)} · {tx(EQUIPMENT[ex.equipment], lang)}</div>
                </div>
                <Icon name="chevron" className={`shrink-0 text-muted transition ${isOpen ? 'rotate-90' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 space-y-3 border-t border-line pt-3">
                  <ExerciseInfo ex={ex} />
                  {ex.alts.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-1">{t('library.alternatives')}</p>
                      <div className="flex flex-wrap gap-2">
                        {ex.alts.map(a => (
                          <button key={a} type="button" className="chip bg-surface-2 text-fg !text-sm" onClick={() => setOpenId(a)}>
                            {EX_BY_ID[a].name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
