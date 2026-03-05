import { TYPE_COLORS } from '../lib/pokedex'

export default function TypeBadge({ type }) {
  const color = TYPE_COLORS[type.toLowerCase()] ?? '#9ca3af'
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {type}
    </span>
  )
}
