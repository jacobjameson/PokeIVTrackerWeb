import { useState } from 'react'
import { useRoster } from '../hooks/useUserData'
import { searchPokedex, getSpecies } from '../lib/pokedex'
import { ALL_NATURES, natureEffect } from '../lib/natures'
import { emptyEVs } from '../lib/gen3Calculator'
import TypeBadge from '../components/TypeBadge'

const STAT_FIELDS = [
  { key: 'hp',    label: 'HP' },
  { key: 'atk',   label: 'Atk' },
  { key: 'def',   label: 'Def' },
  { key: 'spAtk', label: 'Sp.Atk' },
  { key: 'spDef', label: 'Sp.Def' },
  { key: 'spd',   label: 'Speed' },
]

export default function AddPokemonModal({ onClose, initialData = null }) {
  const { addPokemon, updatePokemon } = useRoster()
  const isEdit = !!initialData

  const [speciesSearch, setSpeciesSearch] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState(
    isEdit ? getSpecies(initialData.speciesId) : null
  )
  const [nickname, setNickname] = useState(initialData?.nickname ?? '')
  const [level, setLevel] = useState(initialData?.level ?? 50)
  const [natureName, setNatureName] = useState(initialData?.natureName ?? 'Hardy')
  const [stats, setStats] = useState(initialData?.stats ?? {})
  const [evs, setEvs] = useState(initialData?.evs ?? emptyEVs())
  const [saving, setSaving] = useState(false)

  const results = speciesSearch ? searchPokedex(speciesSearch).slice(0, 20) : []

  function setStat(key, val) {
    setStats(s => ({ ...s, [key]: val === '' ? '' : Number(val) }))
  }

  function setEv(key, val) {
    const n = Math.max(0, Math.min(255, Number(val) || 0))
    setEvs(e => ({ ...e, [key]: n }))
  }

  async function handleSave() {
    if (!selectedSpecies) return
    setSaving(true)
    const data = {
      speciesId: selectedSpecies.id,
      speciesName: selectedSpecies.name,
      nickname,
      level,
      natureName,
      stats: Object.fromEntries(
        STAT_FIELDS.map(({ key }) => [key, Number(stats[key]) || 0])
      ),
      evs,
    }
    try {
      if (isEdit) {
        await updatePokemon(initialData.id, data)
      } else {
        await addPokemon(data)
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-lg bg-gray-900 rounded-t-2xl sm:rounded-2xl border border-gray-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h2 className="font-bold text-white">{isEdit ? 'Edit Pokémon' : 'Add Pokémon'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">&times;</button>
        </div>

        <div className="p-4 space-y-5">
          {/* Species */}
          <section>
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2 block">Species</label>
            {selectedSpecies ? (
              <div className="flex items-center gap-3 bg-gray-800 rounded-lg p-3">
                <div className="flex-1">
                  <div className="font-semibold text-white">{selectedSpecies.name}</div>
                  <div className="flex gap-1 mt-1">
                    {selectedSpecies.types.map(t => <TypeBadge key={t} type={t} />)}
                  </div>
                </div>
                {!isEdit && (
                  <button
                    onClick={() => setSelectedSpecies(null)}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Change
                  </button>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Search by name or #…"
                  value={speciesSearch}
                  onChange={e => setSpeciesSearch(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                {results.length > 0 && (
                  <div className="mt-1 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                    {results.map(s => (
                      <button
                        key={s.id}
                        onClick={() => { setSelectedSpecies(s); setSpeciesSearch('') }}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 text-left text-sm"
                      >
                        <span className="text-gray-500 font-mono w-10">#{String(s.id).padStart(3,'0')}</span>
                        <span className="text-white flex-1">{s.name}</span>
                        <div className="flex gap-1">{s.types.map(t => <TypeBadge key={t} type={t} />)}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {selectedSpecies && (
            <>
              {/* Basic info */}
              <section>
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2 block">Info</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Nickname</label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={nickname}
                      onChange={e => setNickname(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Level</label>
                    <input
                      type="number"
                      min={1} max={100}
                      value={level}
                      onChange={e => setLevel(Math.max(1, Math.min(100, Number(e.target.value))))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="text-xs text-gray-400 mb-1 block">Nature</label>
                  <select
                    value={natureName}
                    onChange={e => setNatureName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    {ALL_NATURES.map(n => (
                      <option key={n.id} value={n.name}>
                        {n.name} — {natureEffect(n)}
                      </option>
                    ))}
                  </select>
                </div>
              </section>

              {/* Current stats */}
              <section>
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1 block">
                  Current Stats <span className="text-gray-600 font-normal normal-case">(for IV calc)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {STAT_FIELDS.map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                      <input
                        type="number"
                        min={1} max={999}
                        placeholder="—"
                        value={stats[key] ?? ''}
                        onChange={e => setStat(key, e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* EVs */}
              <section>
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1 block">
                  EVs <span className="text-gray-600 font-normal normal-case">(leave 0 if untrained)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {STAT_FIELDS.map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                      <input
                        type="number"
                        min={0} max={255}
                        value={evs[key] ?? 0}
                        onChange={e => setEv(key, e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-800 sticky bottom-0 bg-gray-900">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedSpecies || saving}
            className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-semibold transition-colors"
          >
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Pokémon'}
          </button>
        </div>
      </div>
    </div>
  )
}
