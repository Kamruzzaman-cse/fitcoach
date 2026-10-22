import { num } from '../i18n'

/* Horizontal progress bar: value vs target */
export default function Bar({ label, value, max, unit, lang }) {
  const pct = Math.min(100, max ? (value / max) * 100 : 0)
  const over = value > max
  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="tabular text-muted">{num(Math.round(value), lang)} / {num(max, lang)} {unit}</span>
      </div>
      <div className="h-2 rounded-full bg-surface-2 mt-1 overflow-hidden">
        <div className={`h-full rounded-full ${over ? 'bg-warn' : 'bg-accent'}`} style={{ width: pct + '%' }} />
      </div>
    </div>
  )
}
