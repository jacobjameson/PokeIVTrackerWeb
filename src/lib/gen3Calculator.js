import { getNature, getNatureMultipliers } from './natures'

const ZERO = { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spd: 0 }

function calcHP(base, iv, ev, level) {
  return Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + level + 10
}

function calcStat(base, iv, ev, level, natureMult) {
  const raw = Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + 5
  return Math.floor(raw * natureMult)
}

function possibleIVs(isHP, statValue, base, ev, level, natureMult) {
  // Guard: if any input is not a real number, bail out
  if (!Number.isFinite(statValue) || statValue <= 0) return []
  if (!Number.isFinite(base) || !Number.isFinite(level) || level < 1) return []
  const safeEv = Number.isFinite(ev) ? ev : 0
  const results = []
  for (let iv = 0; iv <= 31; iv++) {
    const result = isHP
      ? calcHP(base, iv, safeEv, level)
      : calcStat(base, iv, safeEv, level, natureMult)
    if (result === statValue) results.push(iv)
  }
  return results
}

function statResult(ivs) {
  if (ivs.length === 0) return { ivs: [], display: '—', isExact: false, quality: 'unknown' }
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
  // Merge with zeros so missing keys don't produce NaN
  const b = { ...ZERO, ...baseStats }
  const s = { ...ZERO, ...currentStats }
  const e = { ...ZERO, ...evs }
  const lv = Number(level) || 1

  return {
    hp:    statResult(possibleIVs(true,  s.hp,    b.hp,    e.hp,    lv, 1)),
    atk:   statResult(possibleIVs(false, s.atk,   b.atk,   e.atk,   lv, m.atk)),
    def:   statResult(possibleIVs(false, s.def,   b.def,   e.def,   lv, m.def)),
    spAtk: statResult(possibleIVs(false, s.spAtk, b.spAtk, e.spAtk, lv, m.spAtk)),
    spDef: statResult(possibleIVs(false, s.spDef, b.spDef, e.spDef, lv, m.spDef)),
    spd:   statResult(possibleIVs(false, s.spd,   b.spd,   e.spd,   lv, m.spd)),
  }
}

export function emptyEVs() {
  return { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spd: 0 }
}

export function totalEVs(evs) {
  return STAT_KEYS.reduce((sum, k) => sum + (Number(evs?.[k]) || 0), 0)
}

export function addEVs(current, gains, multiplier = 1) {
  const result = { ...ZERO, ...current }
  let remaining = Math.max(0, 510 - totalEVs(current))
  for (const key of STAT_KEYS) {
    if (remaining <= 0) break
    const gain = (Number(gains?.[key]) || 0) * multiplier
    if (gain <= 0) continue
    const canAdd = Math.min(gain, 255 - result[key], remaining)
    if (canAdd > 0) { result[key] += canAdd; remaining -= canAdd }
  }
  return result
}

export function sessionEVGains(enemies, pokedexMap) {
  const totals = emptyEVs()
  for (const enemy of enemies ?? []) {
    const species = pokedexMap[enemy.speciesId]
    if (!species) continue
    for (const key of STAT_KEYS) {
      totals[key] += (species.evYield?.[key] ?? 0) * enemy.count
    }
  }
  return totals
}
