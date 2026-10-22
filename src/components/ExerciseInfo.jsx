import { useTranslation } from 'react-i18next'
import { tx } from '../i18n'
import { youtubeLink, imageLink, EQUIPMENT, MUSCLES } from '../data/exercises'
import { Icon } from './Icon'

/* How-to steps + links to photos/videos. Used in the library and during a workout. */
export default function ExerciseInfo({ ex }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        <span className="chip bg-accent-soft text-accent">{tx(MUSCLES[ex.group], lang)}</span>
        <span className="chip bg-surface-2 text-muted">{tx(EQUIPMENT[ex.equipment], lang)}</span>
      </div>
      <p className="text-sm text-muted">
        <b className="text-fg">{t('library.target')}:</b> {tx(ex.target, lang)}
      </p>
      <div>
        <p className="text-sm font-semibold mb-1">{t('workout.howTo')}</p>
        <ol className="list-decimal pl-5 space-y-0.5 text-sm">
          {tx(ex.steps, lang).map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </div>
      <div className="flex gap-2">
        <a className="btn-ghost !py-1.5 text-sm" href={imageLink(ex.name)} target="_blank" rel="noopener noreferrer">
          <Icon name="image" size={18} /> {t('workout.photo')}
        </a>
        <a className="btn-ghost !py-1.5 text-sm" href={youtubeLink(ex.name)} target="_blank" rel="noopener noreferrer">
          <Icon name="play" size={18} /> {t('workout.video')}
        </a>
      </div>
    </div>
  )
}
