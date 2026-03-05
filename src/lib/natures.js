export const ALL_NATURES = [
  { id: 'hardy',   name: 'Hardy',   inc: null,    dec: null },
  { id: 'docile',  name: 'Docile',  inc: null,    dec: null },
  { id: 'serious', name: 'Serious', inc: null,    dec: null },
  { id: 'bashful', name: 'Bashful', inc: null,    dec: null },
  { id: 'quirky',  name: 'Quirky',  inc: null,    dec: null },
  { id: 'lonely',  name: 'Lonely',  inc: 'atk',   dec: 'def' },
  { id: 'brave',   name: 'Brave',   inc: 'atk',   dec: 'spd' },
  { id: 'adamant', name: 'Adamant', inc: 'atk',   dec: 'spAtk' },
  { id: 'naughty', name: 'Naughty', inc: 'atk',   dec: 'spDef' },
  { id: 'bold',    name: 'Bold',    inc: 'def',   dec: 'atk' },
  { id: 'relaxed', name: 'Relaxed', inc: 'def',   dec: 'spd' },
  { id: 'impish',  name: 'Impish',  inc: 'def',   dec: 'spAtk' },
  { id: 'lax',     name: 'Lax',     inc: 'def',   dec: 'spDef' },
  { id: 'timid',   name: 'Timid',   inc: 'spd',   dec: 'atk' },
  { id: 'hasty',   name: 'Hasty',   inc: 'spd',   dec: 'def' },
  { id: 'jolly',   name: 'Jolly',   inc: 'spd',   dec: 'spAtk' },
  { id: 'naive',   name: 'Naive',   inc: 'spd',   dec: 'spDef' },
  { id: 'modest',  name: 'Modest',  inc: 'spAtk', dec: 'atk' },
  { id: 'mild',    name: 'Mild',    inc: 'spAtk', dec: 'def' },
  { id: 'quiet',   name: 'Quiet',   inc: 'spAtk', dec: 'spd' },
  { id: 'rash',    name: 'Rash',    inc: 'spAtk', dec: 'spDef' },
  { id: 'calm',    name: 'Calm',    inc: 'spDef', dec: 'atk' },
  { id: 'gentle',  name: 'Gentle',  inc: 'spDef', dec: 'def' },
  { id: 'sassy',   name: 'Sassy',   inc: 'spDef', dec: 'spd' },
  { id: 'careful', name: 'Careful', inc: 'spDef', dec: 'spAtk' },
]

export function getNature(name) {
  return ALL_NATURES.find(n => n.name === name) ?? ALL_NATURES[0]
}

const STAT_LABELS = { atk: 'Atk', def: 'Def', spAtk: 'Sp.Atk', spDef: 'Sp.Def', spd: 'Speed' }

export function natureEffect(nature) {
  if (!nature.inc) return 'Neutral'
  return `+${STAT_LABELS[nature.inc]} / −${STAT_LABELS[nature.dec]}`
}

export function getNatureMultipliers(nature) {
  const m = { atk: 1, def: 1, spAtk: 1, spDef: 1, spd: 1 }
  if (nature.inc) m[nature.inc] = 1.1
  if (nature.dec) m[nature.dec] = 0.9
  return m
}
