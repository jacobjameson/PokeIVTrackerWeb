function barColor(value, max) {
  const pct = value / max
  if (pct >= 0.9) return 'bg-orange-400'
  if (pct >= 0.6) return 'bg-green-500'
  if (pct >= 0.35) return 'bg-blue-500'
  return 'bg-gray-500'
}

export function BaseStatBar({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gb-dim w-14 text-right">{label}</span>
      <div className="flex-1 rounded-full h-2.5" style={{ background: '#1c3a1c' }}>
        <div
          className={`h-2.5 rounded-full ${barColor(value, 255)}`}
          style={{ width: `${Math.min(100, (value / 255) * 100)}%` }}
        />
      </div>
      <span className="text-xs font-mono text-gb-muted w-6 text-right">{value}</span>
    </div>
  )
}

// target: optional number — if provided, renders a ghost bar showing the target EV
export function EVBar({ label, value, target }) {
  const pct = (value / 255) * 100
  const targetPct = target ? (Math.min(255, target) / 255) * 100 : null

  const met = target != null && value >= target
  let color = met ? '#22c55e' : value >= 252 ? '#f97316' : value >= 128 ? '#3b82f6' : '#166534'

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gb-dim w-14 text-right">{label}</span>
      <div className="flex-1 rounded-full h-2.5 relative" style={{ background: '#1c3a1c' }}>
        {/* Target ghost marker */}
        {targetPct != null && !met && (
          <div className="absolute top-0 bottom-0 rounded-full opacity-25"
               style={{ width: `${targetPct}%`, background: '#facc15' }} />
        )}
        {/* Current fill */}
        <div
          className="h-2.5 rounded-full transition-all absolute top-0 left-0"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className={`text-xs font-mono w-8 text-right ${value >= 252 ? 'text-yellow-400 font-bold' : 'text-gb-muted'}`}>
        {value}
      </span>
    </div>
  )
}
