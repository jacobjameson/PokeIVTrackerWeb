import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRoster } from '../hooks/useUserData'
import { getSpecies } from '../lib/pokedex'
import { calculateIVs, STAT_KEYS, STAT_LABELS, totalEVs } from '../lib/gen3Calculator'
import { getNature, getNatureMultipliers } from '../lib/natures'
import TypeBadge from '../components/TypeBadge'
import IVBadge from '../components/IVBadge'
import { BaseStatBar, EVBar } from '../components/StatBar'
import AddPokemonModal from './AddPokemonModal'

export default function PokemonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { roster, deletePokemon } = useRoster()
  const [showEdit, setShowEdit] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const mon = roster.find(m => m.id === id)
  if (!mon) return <div className="p-4 text-gray-400">Pokémon not found.</div>

  const species = getSpecies(mon.speciesId)
  const hasStats = STAT_KEYS.some(k => (mon.stats?.[k] ?? 0) > 0)
  const ivResults = hasStats
    ? calculateIVs({
        baseStats: species?.baseStats ?? {},
        currentStats: mon.stats ?? {},
        evs: mon.evs ?? {},
        level: mon.level,
        natureName: mon.natureName,
      })
    : null

  const nature = getNature(mon.natureName)
  const mults = getNatureMultipliers(nature)
  const displayName = mon.nickname || species?.name || `#${mon.speciesId}`
  const evTotal = totalEVs(mon.evs ?? {})

  function statColor(key) {
    if (!mults[key]) return 'text-gray-200'
    if (mults[key] > 1) return 'text-red-400'
    if (mults[key] < 1) return 'text-blue-400'
    return 'text-gray-200'
  }

  async function handleDelete() {
    await deletePokemon(id)
    navigate('/pokemon')
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* Header card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-xl font-bold text-white">{displayName}</h1>
              {mon.nickname && species && (
                <span className="text-sm text-gray-400">{species.name}</span>
              )}
            </div>
            <div className="text-xs text-gray-500 font-mono mb-2">
              #{String(mon.speciesId).padStart(3, '0')}
            </div>
            <div className="flex gap-1.5">
              {species?.types.map(t => <TypeBadge key={t} type={t} />)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">Lv.{mon.level}</div>
            <div className="text-sm text-gray-300 font-medium">{mon.natureName}</div>
            <div className="text-xs text-gray-500 mt-0.5">{nature.inc ? `+${STAT_LABELS[nature.inc]} / −${STAT_LABELS[nature.dec]}` : 'Neutral'}</div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setShowEdit(true)}
            className="flex-1 py-2 text-sm font-medium bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="py-2 px-4 text-sm font-medium bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* IV Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800">
          <h2 className="font-semibold text-white">Stats & IVs</h2>
          {!hasStats && (
            <p className="text-xs text-gray-500 mt-0.5">Enter current stats (via Edit) to calculate IVs.</p>
          )}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-gray-800">
              <th className="text-left px-4 py-2 font-medium">Stat</th>
              <th className="text-right px-3 py-2 font-medium">Value</th>
              <th className="text-right px-3 py-2 font-medium">Base</th>
              <th className="text-right px-3 py-2 font-medium">EV</th>
              <th className="text-right px-4 py-2 font-medium">IV</th>
            </tr>
          </thead>
          <tbody>
            {STAT_KEYS.map(key => {
              const label = STAT_LABELS[key]
              const statVal = mon.stats?.[key] ?? 0
              const baseVal = species?.baseStats?.[key] ?? 0
              const evVal = mon.evs?.[key] ?? 0
              const ivResult = ivResults?.[key]
              return (
                <tr key={key} className="border-b border-gray-800/50 last:border-0">
                  <td className={`px-4 py-2.5 font-medium ${statColor(key)}`}>{label}</td>
                  <td className="text-right px-3 py-2.5 font-mono text-white">{statVal || '—'}</td>
                  <td className="text-right px-3 py-2.5 font-mono text-gray-400">{baseVal}</td>
                  <td className="text-right px-3 py-2.5 font-mono text-gray-400">{evVal}</td>
                  <td className="text-right px-4 py-2.5">
                    {ivResult ? <IVBadge result={ivResult} /> : <span className="text-gray-600">—</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* EV spread */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-white">Effort Values</h2>
          <span className={`text-sm font-mono ${evTotal >= 510 ? 'text-orange-400 font-bold' : 'text-gray-400'}`}>
            {evTotal}/510
          </span>
        </div>
        <div className="space-y-2.5">
          {STAT_KEYS.map(key => (
            <EVBar key={key} label={STAT_LABELS[key]} value={mon.evs?.[key] ?? 0} />
          ))}
        </div>
      </div>

      {/* Base stats */}
      {species && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white">Base Stats</h2>
            <span className="text-sm text-gray-400">BST {species.baseStats.hp + species.baseStats.atk + species.baseStats.def + species.baseStats.spAtk + species.baseStats.spDef + species.baseStats.spd}</span>
          </div>
          <div className="space-y-2.5">
            {STAT_KEYS.map(key => (
              <BaseStatBar key={key} label={STAT_LABELS[key]} value={species.baseStats[key] ?? 0} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showEdit && (
        <AddPokemonModal
          onClose={() => setShowEdit(false)}
          initialData={mon}
        />
      )}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-white mb-2">Remove {displayName}?</h3>
            <p className="text-gray-400 text-sm mb-5">This will permanently delete this Pokémon and all its tracked data.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2.5 border border-gray-700 rounded-lg text-gray-300 hover:text-white text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-700 hover:bg-red-600 rounded-lg text-white text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
