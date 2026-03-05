const QUALITY_STYLES = {
  perfect: 'text-orange-400 font-bold',
  great:   'text-green-400 font-semibold',
  good:    'text-blue-400',
  low:     'text-gray-400',
  invalid: 'text-red-500',
}

export default function IVBadge({ result }) {
  if (!result) return <span className="text-gray-600 font-mono">—</span>
  return (
    <span className={`font-mono text-sm ${QUALITY_STYLES[result.quality] ?? 'text-gray-400'}`}>
      {result.display}
    </span>
  )
}
