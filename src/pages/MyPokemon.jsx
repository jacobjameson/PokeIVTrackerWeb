import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRoster } from '../hooks/useUserData'
import { getSpecies } from '../lib/pokedex'
import { STAT_KEYS, totalEVs } from '../lib/gen3Calculator'
import TypeBadge from '../components/TypeBadge'
import AddPokemonModal from './AddPokemonModal'

export default function MyPokemon() {
  const { roster, loading, deletePokemon } = useRoster()
  const navigate = useNavigate()
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = roster.filter(mon => {
    const name = (mon.nickname || mon.speciesName || '').toLowerCase()
    return name.includes(search.toLowerCase())
  })

  if (loading) return <Spinner />

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search roster…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <span className="text-lg leading-none">+</span> Add
        </button>
      </div>

      {roster.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">⭐</div>
          <p className="font-medium">No Pokémon yet</p>
          <p className="text-sm mt-1">Add one to start tracking IVs and EVs.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(mon => {
            const species = getSpecies(mon.speciesId)
            const evTotal = totalEVs(mon.evs ?? {})
            const displayName = mon.nickname || species?.name || `#${mon.speciesId}`
            return (
              <div
                key={mon.id}
                onClick={() => navigate(`/pokemon/${mon.id}`)}
                className="flex items-center gap-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl p-3 cursor-pointer transition-colors"
              >
                <span className="text-xs text-gray-500 font-mono w-10">
                  #{String(mon.speciesId).padStart(3, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white truncate">{displayName}</span>
                    {mon.nickname && species && (
                      <span className="text-xs text-gray-500">{species.name}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {species?.types.map(t => <TypeBadge key={t} type={t} />)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-white">Lv.{mon.level}</div>
                  <div className="text-xs text-gray-400">{mon.natureName}</div>
                  <div className={`text-xs font-mono mt-0.5 ${evTotal >= 510 ? 'text-orange-400 font-bold' : 'text-gray-500'}`}>
                    {evTotal}/510 EVs
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showAdd && <AddPokemonModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
