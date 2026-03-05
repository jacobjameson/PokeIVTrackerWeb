import { useState, useMemo } from 'react'
import { POKEDEX_LIST, getSpecies, evYieldSummary } from '../lib/pokedex'
import { STAT_KEYS, STAT_LABELS } from '../lib/gen3Calculator'
import TypeBadge from '../components/TypeBadge'
import { BaseStatBar } from '../components/StatBar'

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
    <div className="flex h-[calc(100vh-7rem)]">
      {/* List pane */}
      <div className={`flex flex-col ${selected ? 'hidden sm:flex' : 'flex'} w-full sm:w-64 border-r border-gray-800 bg-gray-950`}>
        <div className="p-3 border-b border-gray-800 space-y-2">
          <input
            type="text"
            placeholder="Search by name or #"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => setEvOnly(v => !v)}
            className={`text-xs px-3 py-1 rounded-full font-medium border transition-colors ${
              evOnly
                ? 'bg-orange-900/40 border-orange-700 text-orange-300'
                : 'border-gray-700 text-gray-400 hover:border-gray-600'
            }`}
          >
            EV Yields Only
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filtered.map(species => (
            <button
              key={species.id}
              onClick={() => setSelected(species)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-gray-800 border-b border-gray-900 transition-colors ${
                selected?.id === species.id ? 'bg-gray-800' : ''
              }`}
            >
              <span className="text-xs text-gray-500 font-mono w-9">
                #{String(species.id).padStart(3,'0')}
              </span>
              <span className="text-sm text-white flex-1 truncate">{species.name}</span>
              {evYieldSummary(species) !== 'None' && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" title="Has EV yield" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Detail pane */}
      {selected ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Back button (mobile) */}
          <button
            className="sm:hidden text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            onClick={() => setSelected(null)}
          >
            ← Back
          </button>

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                <span className="text-sm text-gray-500 font-mono">#{String(selected.id).padStart(3,'0')}</span>
              </div>
              <div className="flex gap-1.5 mt-1.5">
                {selected.types.map(t => <TypeBadge key={t} type={t} />)}
              </div>
            </div>
          </div>

          {/* EV Yield */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">EV Yield</h3>
            {evYieldSummary(selected) === 'None' ? (
              <p className="text-sm text-gray-500">No EV yield.</p>
            ) : (
              <div className="space-y-2">
                {STAT_KEYS.map(key => {
                  const val = selected.evYield?.[key] ?? 0
                  if (val === 0) return null
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{STAT_LABELS[key]}</span>
                      <span className="text-sm font-bold text-orange-400 font-mono">+{val}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Base stats */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-300">Base Stats</h3>
              <span className="text-xs text-gray-500">
                BST {STAT_KEYS.reduce((s, k) => s + (selected.baseStats[k] ?? 0), 0)}
              </span>
            </div>
            <div className="space-y-2.5">
              {STAT_KEYS.map(key => (
                <BaseStatBar key={key} label={STAT_LABELS[key]} value={selected.baseStats[key] ?? 0} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden sm:flex flex-1 items-center justify-center text-gray-600">
          Select a Pokémon to see details
        </div>
      )}
    </div>
  )
}
