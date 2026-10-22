import { useTranslation } from 'react-i18next'
import { TEMPLATES } from '../lib/fitness'
import { dayShort } from '../lib/schedule'
import { tx, num } from '../i18n'

const STYLE = {
  done: 'bg-good border-good text-white',
  today: 'border-accent bg-accent-soft text-accent',
  missed: 'border-warn text-warn bg-surface',
  upcoming: 'border-line bg-surface',
  rest: 'border-transparent bg-surface-2 text-muted',
  moved: 'border-transparent bg-surface-2 text-muted line-through',
  skipped: 'border-transparent bg-surface-2 text-muted line-through'
}

/* 7-day strip (Sat -> Fri). Tap a gym day to move it. */
export default function WeekStrip({ week, selected, onSelect }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  return (
    <div className="grid grid-cols-7 gap-1">
      {week.map(d => {
        const tpl = d.workout || (d.status === 'moved' || d.status === 'skipped' ? d.base : null)
        const tappable = ['today', 'upcoming', 'missed', 'moved', 'skipped'].includes(d.status)
        return (
          <button
            key={d.date}
            id={'day-' + d.date}
            type="button"
            disabled={!tappable}
            onClick={() => onSelect(selected === d.date ? null : d.date)}
            aria-pressed={selected === d.date}
            title={t('schedule.' + d.status)}
            className={`min-w-0 rounded-lg border-2 px-0.5 py-1.5 flex flex-col items-center gap-0.5 ${STYLE[d.status]} ${d.makeupOf ? '!border-dashed !border-accent' : ''} ${selected === d.date ? 'ring-2 ring-accent ring-offset-1 ring-offset-surface' : ''}`}
          >
            <span className="text-[11px] font-semibold leading-none">{dayShort(d.wd, lang)}</span>
            <span className="text-[10px] leading-none opacity-80 tabular">{num(+d.date.slice(8), lang)}</span>
            <span className="text-[11px] leading-tight font-medium truncate w-full text-center">
              {tpl ? tx(TEMPLATES[tpl].short, lang) : t('schedule.rest')}
            </span>
          </button>
        )
      })}
    </div>
  )
}
