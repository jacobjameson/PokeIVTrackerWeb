import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRoster } from '../hooks/useUserData'
import { getSpecies } from '../lib/pokedex'
import { totalEVs } from '../lib/gen3Calculator'
import TypeBadge from '../components/TypeBadge'
import PokemonSprite from '../components/PokemonSprite'
import AddPokemonModal from './AddPokemonModal'

export default function MyPokemon() {
  const { roster, loading } = useRoster()
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
          className="gb-input flex-1"
        />
        <button
          onClick={() => setShowAdd(true)}
          className="gb-btn-primary px-4 py-2 text-sm"
        >
          + Add
        </button>
      </div>

      {roster.length === 0 ? (
        <div className="text-center py-16 text-gb-dim">
          <div className="font-pixel text-gb-green mb-4" style={{ fontSize: '0.5rem' }}>NO POKÉMON</div>
          <p className="text-sm">Add one to start tracking IVs and EVs.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(mon => {
            const species = getSpecies(mon.speciesId)
            const evTotal = totalEVs(mon.evs ?? {})
            const displayName = mon.nickname || species?.name || `#${mon.speciesId}`
            return (
              <button
                key={mon.id}
                onClick={() => navigate(`/pokemon/${mon.id}`)}
                className="w-full flex items-center gap-3 border border-gb-border rounded-xl p-3
                           hover:border-gb-green transition-colors text-left"
                style={{ background: '#0d1a0d' }}
              >
                {/* Sprite */}
                <div className="shrink-0" style={{ background: '#122012', borderRadius: 8, padding: 4 }}>
                  <PokemonSprite id={mon.speciesId} size={48} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-gb-text truncate">{displayName}</span>
                    {mon.nickname && species && (
                      <span className="text-xs text-gb-dim">{species.name}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {species?.types.map(t => <TypeBadge key={t} type={t} />)}
                  </div>
                </div>

                {/* Right info */}
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-gb-text">Lv.{mon.level}</div>
                  <div className="text-xs text-gb-dim">{mon.natureName}</div>
                  <div className={`text-xs font-mono mt-0.5 ${evTotal >= 510 ? 'text-yellow-400 font-bold' : 'text-gb-dim'}`}>
                    {evTotal}/510
                  </div>
                </div>
              </button>
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
      <div className="w-6 h-6 border-2 border-gb-green border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
