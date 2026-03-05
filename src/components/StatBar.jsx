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
      <span className="text-xs text-gray-400 w-14 text-right">{label}</span>
      <div className="flex-1 bg-gray-800 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${barColor(value, 255)}`}
          style={{ width: `${Math.min(100, (value / 255) * 100)}%` }}
        />
      </div>
      <span className="text-xs font-mono text-gray-300 w-6 text-right">{value}</span>
    </div>
  )
}

export function EVBar({ label, value }) {
  const pct = (value / 255) * 100
  let color = 'bg-blue-600'
  if (value >= 252) color = 'bg-orange-500'
  else if (value >= 128) color = 'bg-green-500'

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 w-14 text-right">{label}</span>
      <div className="flex-1 bg-gray-800 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-mono w-8 text-right ${value >= 252 ? 'text-orange-400 font-bold' : 'text-gray-300'}`}>
        {value}
      </span>
    </div>
  )
}
