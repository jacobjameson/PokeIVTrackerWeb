import rawData from '../pokedex_frlg.json'

// Indexed by id for O(1) lookup
export const POKEDEX_MAP = Object.fromEntries(rawData.map(p => [p.id, p]))
export const POKEDEX_LIST = rawData

export function getSpecies(id) {
  return POKEDEX_MAP[id] ?? null
}

export function searchPokedex(query) {
  if (!query.trim()) return POKEDEX_LIST
  const q = query.trim().toLowerCase()
  return POKEDEX_LIST.filter(p =>
    p.name.toLowerCase().includes(q) || String(p.id).startsWith(q)
  )
}

export function evYieldSummary(species) {
  if (!species) return 'Unknown'
  const { evYield } = species
  const parts = []
  if (evYield.hp    > 0) parts.push(`${evYield.hp} HP`)
  if (evYield.atk   > 0) parts.push(`${evYield.atk} Atk`)
  if (evYield.def   > 0) parts.push(`${evYield.def} Def`)
  if (evYield.spAtk > 0) parts.push(`${evYield.spAtk} Sp.Atk`)
  if (evYield.spDef > 0) parts.push(`${evYield.spDef} Sp.Def`)
  if (evYield.spd   > 0) parts.push(`${evYield.spd} Speed`)
  return parts.length > 0 ? parts.join(', ') : 'None'
}

export const TYPE_COLORS = {
  fire:     '#f97316', water:    '#3b82f6', grass:    '#22c55e',
  electric: '#eab308', psychic:  '#ec4899', ice:      '#67e8f9',
  dragon:   '#6366f1', dark:     '#78716c', fairy:    '#f0abfc',
  fighting: '#ef4444', flying:   '#a5b4fc', poison:   '#c084fc',
  ground:   '#d97706', rock:     '#a8a29e', bug:      '#84cc16',
  ghost:    '#7c3aed', steel:    '#94a3b8', normal:   '#9ca3af',
}
