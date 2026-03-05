import { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useSessions, useRoster, useSettings } from '../hooks/useUserData'
import { getSpecies, searchPokedex, evYieldSummary, POKEDEX_MAP } from '../lib/pokedex'
import { sessionEVGains, addEVs, STAT_KEYS, STAT_LABELS } from '../lib/gen3Calculator'
import TypeBadge from '../components/TypeBadge'

export default function SessionDetail() {
  const { id } = useParams()
  const { sessions, updateSession } = useSessions()
  const { roster, updatePokemon } = useRoster()
  const { settings } = useSettings()

  const [showPartyPicker, setShowPartyPicker] = useState(false)
  const [showEnemyPicker, setShowEnemyPicker] = useState(false)
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false)
  const [finalizing, setFinalizing] = useState(false)

  const session = sessions.find(s => s.id === id)
  if (!session) return <div className="p-4 text-gray-400">Session not found.</div>

  const multiplier = settings.evMultiplier ?? 1
  const enemies = session.enemies ?? []
  const rawGains = sessionEVGains(enemies, POKEDEX_MAP)
  const gains = Object.fromEntries(
    STAT_KEYS.map(k => [k, (rawGains[k] ?? 0) * multiplier])
  )
  const totalGained = STAT_KEYS.reduce((s, k) => s + gains[k], 0)

  const partyPokemon = roster.filter(m => session.partyPokemonIds?.includes(m.id))

  function incrementEnemy(speciesId) {
    const updated = enemies.map(e =>
      e.speciesId === speciesId ? { ...e, count: e.count + 1 } : e
    )
    updateSession(id, { enemies: updated })
  }

  function decrementEnemy(speciesId) {
    const updated = enemies.map(e =>
      e.speciesId === speciesId ? { ...e, count: Math.max(0, e.count - 1) } : e
    )
    updateSession(id, { enemies: updated })
  }

  function removeEnemy(speciesId) {
    updateSession(id, { enemies: enemies.filter(e => e.speciesId !== speciesId) })
  }

  function addEnemy(speciesId) {
    if (enemies.some(e => e.speciesId === speciesId)) {
      incrementEnemy(speciesId)
    } else {
      updateSession(id, { enemies: [...enemies, { speciesId, count: 1 }] })
    }
  }

  function togglePartyMember(monId) {
    const ids = session.partyPokemonIds ?? []
    const updated = ids.includes(monId) ? ids.filter(i => i !== monId) : [...ids, monId]
    updateSession(id, { partyPokemonIds: updated })
  }

  async function finalize() {
    setFinalizing(true)
    for (const mon of partyPokemon) {
      const newEvs = addEVs(mon.evs ?? {}, gains, 1) // gains already has multiplier applied
      await updatePokemon(mon.id, { evs: newEvs })
    }
    await updateSession(id, { isFinalized: true })
    setFinalizing(false)
    setShowFinalizeConfirm(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">{session.name}</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            session.isFinalized
              ? 'bg-green-900/40 text-green-400'
              : 'bg-blue-900/40 text-blue-400'
          }`}>
            {session.isFinalized ? 'Finalized' : 'Active'}
          </span>
        </div>
      </div>

      {/* Party */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h2 className="font-semibold text-white">Training Party</h2>
          {!session.isFinalized && (
            <button
              onClick={() => setShowPartyPicker(true)}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Edit
            </button>
          )}
        </div>
        {partyPokemon.length === 0 ? (
          <div className="px-4 py-3">
            <button
              onClick={() => !session.isFinalized && setShowPartyPicker(true)}
              className="text-sm text-gray-500 hover:text-blue-400 transition-colors"
            >
              {session.isFinalized ? 'No party selected.' : '+ Select party members…'}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {partyPokemon.map(mon => {
              const species = getSpecies(mon.speciesId)
              return (
                <div key={mon.id} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="text-xs text-gray-500 font-mono w-10">
                    #{String(mon.speciesId).padStart(3,'0')}
                  </span>
                  <span className="text-sm font-medium text-white flex-1">
                    {mon.nickname || species?.name}
                  </span>
                  <span className="text-xs text-gray-400">Lv.{mon.level}</span>
                  {species?.types.map(t => <TypeBadge key={t} type={t} />)}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Enemies */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h2 className="font-semibold text-white">Enemies</h2>
          {!session.isFinalized && (
            <button
              onClick={() => setShowEnemyPicker(true)}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              + Add
            </button>
          )}
        </div>
        {enemies.length === 0 ? (
          <div className="px-4 py-3 text-sm text-gray-500">
            {session.isFinalized ? 'No enemies tracked.' : 'Tap + Add to track enemies.'}
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {enemies.map(enemy => {
              const species = getSpecies(enemy.speciesId)
              return (
                <div key={enemy.speciesId} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">
                      {species?.name ?? `#${enemy.speciesId}`}
                    </div>
                    <div className="text-xs text-orange-400/80 truncate">
                      {species ? evYieldSummary(species) : ''}
                    </div>
                  </div>
                  {session.isFinalized ? (
                    <span className="text-sm font-mono text-gray-300">×{enemy.count}</span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => decrementEnemy(enemy.speciesId)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-lg font-bold transition-colors"
                      >
                        −
                      </button>
                      <button
                        onClick={() => incrementEnemy(enemy.speciesId)}
                        className="w-12 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm font-mono font-bold transition-colors select-none"
                      >
                        {enemy.count}
                      </button>
                      <button
                        onClick={() => incrementEnemy(enemy.speciesId)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-lg font-bold transition-colors"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeEnemy(enemy.speciesId)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:text-red-400 transition-colors ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* EV Tally */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-white">EV Totals</h2>
          <span className="text-xs text-gray-500">×{multiplier} multiplier</span>
        </div>
        {totalGained === 0 ? (
          <p className="text-sm text-gray-500">No EVs tracked yet.</p>
        ) : (
          <div className="space-y-1.5">
            {STAT_KEYS.filter(k => gains[k] > 0).map(k => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{STAT_LABELS[k]}</span>
                <span className="text-sm font-bold text-orange-400 font-mono">+{gains[k]}</span>
              </div>
            ))}
            <div className="border-t border-gray-800 pt-1.5 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Total</span>
              <span className="text-sm font-bold text-orange-400 font-mono">{totalGained}</span>
            </div>
          </div>
        )}
      </div>

      {/* Finalize */}
      {!session.isFinalized && (
        <button
          onClick={() => setShowFinalizeConfirm(true)}
          disabled={partyPokemon.length === 0 || enemies.length === 0}
          className="w-full py-3 bg-green-700 hover:bg-green-600 disabled:opacity-30 text-white font-semibold rounded-xl transition-colors"
        >
          Finalize & Apply EVs to Party
        </button>
      )}
      {session.isFinalized && (
        <div className="flex items-center gap-2 justify-center text-green-400 text-sm font-medium py-2">
          <span>✓</span> Session finalized — EVs applied to party.
        </div>
      )}

      {/* Party picker modal */}
      {showPartyPicker && (
        <PickerModal title="Select Party" onClose={() => setShowPartyPicker(false)}>
          {roster.length === 0 ? (
            <p className="text-gray-400 text-sm px-4 py-3">No Pokémon in roster yet.</p>
          ) : (
            roster.map(mon => {
              const species = getSpecies(mon.speciesId)
              const selected = session.partyPokemonIds?.includes(mon.id)
              return (
                <button
                  key={mon.id}
                  onClick={() => togglePartyMember(mon.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left border-b border-gray-800 last:border-0"
                >
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                    selected ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-600'
                  }`}>
                    {selected && '✓'}
                  </span>
                  <span className="text-sm font-medium text-white flex-1">
                    {mon.nickname || species?.name}
                  </span>
                  <span className="text-xs text-gray-400">Lv.{mon.level}</span>
                </button>
              )
            })
          )}
        </PickerModal>
      )}

      {/* Enemy picker modal */}
      {showEnemyPicker && (
        <EnemyPickerModal
          onSelect={addEnemy}
          onClose={() => setShowEnemyPicker(false)}
        />
      )}

      {/* Finalize confirm */}
      {showFinalizeConfirm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-white mb-2">Apply EVs to Party?</h3>
            <p className="text-sm text-gray-400 mb-2">
              Each party member will receive:
            </p>
            <div className="bg-gray-800 rounded-lg p-3 mb-4 space-y-1">
              {STAT_KEYS.filter(k => gains[k] > 0).map(k => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gray-300">{STAT_LABELS[k]}</span>
                  <span className="text-orange-400 font-bold font-mono">+{gains[k]}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mb-4">Caps at 255/stat and 510 total are enforced per Pokémon.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFinalizeConfirm(false)}
                className="flex-1 py-2.5 border border-gray-700 rounded-lg text-gray-300 hover:text-white text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={finalize}
                disabled={finalizing}
                className="flex-1 py-2.5 bg-green-700 hover:bg-green-600 disabled:opacity-50 rounded-lg text-white text-sm font-semibold"
              >
                {finalizing ? 'Applying…' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PickerModal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center">
      <div className="w-full sm:max-w-md bg-gray-900 rounded-t-2xl sm:rounded-2xl border border-gray-800 max-h-[70vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 sticky top-0 bg-gray-900">
          <h3 className="font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
        </div>
        {children}
        <div className="p-4 sticky bottom-0 bg-gray-900 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

function EnemyPickerModal({ onSelect, onClose }) {
  const [search, setSearch] = useState('')
  const results = searchPokedex(search).slice(0, 40)

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center">
      <div className="w-full sm:max-w-md bg-gray-900 rounded-t-2xl sm:rounded-2xl border border-gray-800 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h3 className="font-bold text-white">Add Enemy</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
        </div>
        <div className="px-4 py-3 border-b border-gray-800">
          <input
            autoFocus
            type="text"
            placeholder="Search by name or #…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="overflow-y-auto flex-1">
          {results.map(species => (
            <button
              key={species.id}
              onClick={() => { onSelect(species.id); onClose() }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 text-left border-b border-gray-800/50"
            >
              <span className="text-xs text-gray-500 font-mono w-10">
                #{String(species.id).padStart(3,'0')}
              </span>
              <span className="text-sm text-white flex-1">{species.name}</span>
              <span className="text-xs text-orange-400/80 text-right max-w-[120px] truncate">
                {evYieldSummary(species)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
