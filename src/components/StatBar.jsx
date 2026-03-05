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
      <span className="text-xs text-gb-muted w-14 text-right">{label}</span>
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

  let fillColor
  if (met) fillColor = '#22c55e'
  else if (value >= 252) fillColor = '#f97316'
  else if (value >= 128) fillColor = '#3b82f6'
  else fillColor = '#2563eb'  // visible blue even for small values

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gb-muted w-14 text-right">{label}</span>
      <div className="flex-1 rounded-full h-2.5 relative overflow-hidden" style={{ background: '#1c3a1c' }}>
        {/* Target ghost bar (behind fill) */}
        {targetPct != null && (
          <div className="absolute inset-y-0 left-0 rounded-full"
               style={{ width: `${targetPct}%`, background: met ? 'transparent' : 'rgba(250,204,21,0.2)' }} />
        )}
        {/* Current fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all"
          style={{ width: `${pct}%`, background: fillColor }}
        />
      </div>
      <span className={`text-xs font-mono w-8 text-right ${value >= 252 ? 'text-yellow-400 font-bold' : 'text-gb-muted'}`}>
        {value}
      </span>
    </div>
  )
}
