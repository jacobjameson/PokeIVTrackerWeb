import { useState, useMemo } from 'react'
import { POKEDEX_LIST, evYieldSummary } from '../lib/pokedex'
import { STAT_KEYS, STAT_LABELS } from '../lib/gen3Calculator'
import TypeBadge from '../components/TypeBadge'
import PokemonSprite from '../components/PokemonSprite'
import { BaseStatBar } from '../components/StatBar'
import CLASSIC_SETS from '../data/classic_sets.json'

export default function Pokedex() {
  const [search, setSearch] = useState('')
  const [evOnly, setEvOnly] = useState(false)
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    let list = POKEDEX_LIST
    if (evOnly) list = list.filter(p => evYieldSummary(p) !== 'None')
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) || String(p.id).startsWith(q)
      )
    }
    return list
  }, [search, evOnly])

  return (
    <div className="flex" style={{ height: 'calc(100vh - 7rem)' }}>
      {/* List pane */}
      <div className={`flex flex-col ${selected ? 'hidden sm:flex' : 'flex'} w-full sm:w-64 border-r border-gb-border`}
           style={{ background: '#060d06' }}>
        <div className="p-3 border-b border-gb-border space-y-2">
          <input type="text" placeholder="Name or #" value={search}
            onChange={e => setSearch(e.target.value)} className="gb-input w-full" />
          <button
            onClick={() => setEvOnly(v => !v)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              evOnly ? 'border-yellow-600 text-yellow-400 bg-yellow-900/20' : 'border-gb-border text-gb-dim hover:border-gb-green'
            }`}
          >
            EV Yields Only
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filtered.map(species => (
            <button key={species.id} onClick={() => setSelected(species)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left border-b border-gb-border/30 transition-colors ${
                selected?.id === species.id ? 'bg-gb-raised' : 'hover:bg-gb-card'
              }`}>
              <PokemonSprite id={species.id} size={32} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gb-text truncate">{species.name}</div>
                <div className="text-xs text-gb-dim font-mono">#{String(species.id).padStart(3,'0')}</div>
              </div>
              {evYieldSummary(species) !== 'None' && (
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Detail pane */}
      {selected ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <button className="sm:hidden text-sm text-gb-green hover:text-gb-bright flex items-center gap-1"
            onClick={() => setSelected(null)}>← Back</button>

          <div className="flex items-center gap-4">
            <div className="rounded-xl border border-gb-border p-2" style={{ background: '#122012' }}>
              <PokemonSprite id={selected.id} size={96} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gb-text">{selected.name}</h2>
              <div className="text-xs text-gb-dim font-mono mb-2">#{String(selected.id).padStart(3,'0')}</div>
              <div className="flex gap-1.5">{selected.types.map(t => <TypeBadge key={t} type={t} />)}</div>
            </div>
          </div>

          <div className="gb-card p-4">
            <h3 className="text-sm font-semibold text-gb-muted mb-3">EV Yield</h3>
            {evYieldSummary(selected) === 'None' ? (
              <p className="text-sm text-gb-dim">No EV yield.</p>
            ) : (
              <div className="space-y-2">
                {STAT_KEYS.map(key => {
                  const val = selected.evYield?.[key] ?? 0
                  if (!val) return null
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gb-muted">{STAT_LABELS[key]}</span>
                      <span className="text-sm font-bold text-yellow-400 font-mono">+{val}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="gb-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gb-muted">Base Stats</h3>
              <span className="text-xs text-gb-dim">
                BST {STAT_KEYS.reduce((s, k) => s + (selected.baseStats[k] ?? 0), 0)}
              </span>
            </div>
            <div className="space-y-2.5">
              {STAT_KEYS.map(key => (
                <BaseStatBar key={key} label={STAT_LABELS[key]} value={selected.baseStats[key] ?? 0} />
              ))}
            </div>
          </div>

          {/* Classic Sets */}
          <div className="gb-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-semibold text-gb-muted">Classic Sets</h3>
              <span className="text-xs px-2 py-0.5 rounded-full border border-gb-border text-gb-dim">
                competitive EV spreads
              </span>
            </div>
            {(CLASSIC_SETS[String(selected.id)] ?? []).length === 0 ? (
              <div className="rounded-xl border border-dashed border-gb-border/60 px-4 py-4 text-center">
                <p className="text-xs text-gb-dim">No classic sets for this Pokémon.</p>
                <p className="text-xs text-gb-dim/50 mt-0.5">Sets are available for fully-evolved, commonly used Pokémon.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(CLASSIC_SETS[String(selected.id)] ?? []).map((set, i) => (
                  <div key={i} className="rounded-xl border p-3 space-y-2"
                       style={{ background: '#0a160a', borderColor: '#1c3a1c' }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gb-text">{set.label}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded border border-gb-border text-gb-muted">
                        {set.nature}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {STAT_KEYS.filter(k => (set.evs[k] ?? 0) > 0).map(k => (
                        <span key={k} className="text-xs px-2 py-0.5 rounded-full border border-gb-border text-yellow-400">
                          {set.evs[k]} {STAT_LABELS[k]}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {set.moves.map(m => (
                        <span key={m} className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background: '#122012', color: '#86efac' }}>
                          {m}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gb-dim italic">{set.note}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden sm:flex flex-1 items-center justify-center text-gb-dim text-sm">
          Select a Pokémon
        </div>
      )}
    </div>
  )
}
