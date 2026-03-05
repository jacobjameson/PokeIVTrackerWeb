import { getNature, getNatureMultipliers } from './natures'

// Gen 3 stat formulas
function calcHP(base, iv, ev, level) {
  return Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + level + 10
}

function calcStat(base, iv, ev, level, natureMult) {
  const raw = Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + 5
  return Math.floor(raw * natureMult)
}

// Returns array of possible IVs (0–31) that produce the given stat value
function possibleIVs(isHP, statValue, base, ev, level, natureMult) {
  const fn = isHP ? calcHP : calcStat
  const results = []
  for (let iv = 0; iv <= 31; iv++) {
    const result = isHP ? fn(base, iv, ev, level) : fn(base, iv, ev, level, natureMult)
    if (result === statValue) results.push(iv)
  }
  return results
}

// Returns { ivs: number[], display: string, isExact: boolean, quality: string }
function statResult(ivs) {
  if (ivs.length === 0) return { ivs: [], display: '—', isExact: false, quality: 'invalid' }
  const min = Math.min(...ivs)
  const max = Math.max(...ivs)
  const display = ivs.length === 1 ? `${ivs[0]}` : `${min}–${max}`
  let quality = 'low'
  if (min === 31) quality = 'perfect'
  else if (min >= 26) quality = 'great'
  else if (min >= 20) quality = 'good'
  return { ivs, display, isExact: ivs.length === 1, quality }
}

export const STAT_KEYS = ['hp', 'atk', 'def', 'spAtk', 'spDef', 'spd']
export const STAT_LABELS = { hp: 'HP', atk: 'Atk', def: 'Def', spAtk: 'Sp.Atk', spDef: 'Sp.Def', spd: 'Speed' }

export function calculateIVs({ baseStats, currentStats, evs, level, natureName }) {
  const nature = getNature(natureName)
  const m = getNatureMultipliers(nature)

  return {
    hp:    statResult(possibleIVs(true,  currentStats.hp,    baseStats.hp,    evs.hp,    level, 1)),
    atk:   statResult(possibleIVs(false, currentStats.atk,   baseStats.atk,   evs.atk,   level, m.atk)),
    def:   statResult(possibleIVs(false, currentStats.def,   baseStats.def,   evs.def,   level, m.def)),
    spAtk: statResult(possibleIVs(false, currentStats.spAtk, baseStats.spAtk, evs.spAtk, level, m.spAtk)),
    spDef: statResult(possibleIVs(false, currentStats.spDef, baseStats.spDef, evs.spDef, level, m.spDef)),
    spd:   statResult(possibleIVs(false, currentStats.spd,   baseStats.spd,   evs.spd,   level, m.spd)),
  }
}

export function emptyEVs() {
  return { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spd: 0 }
}

export function totalEVs(evs) {
  return STAT_KEYS.reduce((sum, k) => sum + (evs[k] ?? 0), 0)
}

export function addEVs(current, gains, multiplier = 1) {
  const result = { ...current }
  let remaining = Math.max(0, 510 - totalEVs(current))

  for (const key of STAT_KEYS) {
    if (remaining <= 0) break
    const gain = (gains[key] ?? 0) * multiplier
    if (gain <= 0) continue
    const canAdd = Math.min(gain, 255 - (result[key] ?? 0), remaining)
    if (canAdd > 0) {
      result[key] = (result[key] ?? 0) + canAdd
      remaining -= canAdd
    }
  }
  return result
}

// Sum EVs across all enemies in a session
export function sessionEVGains(enemies, pokedexMap) {
  const totals = emptyEVs()
  for (const enemy of enemies) {
    const species = pokedexMap[enemy.speciesId]
    if (!species) continue
    for (const key of STAT_KEYS) {
      totals[key] += (species.evYield[key] ?? 0) * enemy.count
    }
  }
  return totals
}
