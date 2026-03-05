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
import CLASSIC_SETS from '../data/classic_sets.json'

export default function PokemonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { roster, updatePokemon, deletePokemon } = useRoster()
  const [showEdit, setShowEdit] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [targetConfirm, setTargetConfirm] = useState(null) // set object pending confirmation

  const mon = roster.find(m => m.id === id)
  if (!mon) return <div className="p-4 text-gb-dim">Pokémon not found.</div>

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

  const classicSets = CLASSIC_SETS[String(mon.speciesId)] ?? []
  const targetEvs = mon.targetEvs ?? null
  const targetNature = mon.targetNature ?? null

  function statColor(key) {
    if (!mults[key]) return 'text-gb-text'
    if (mults[key] > 1) return 'text-red-400'
    if (mults[key] < 1) return 'text-blue-400'
    return 'text-gb-text'
  }

  async function handleDelete() {
    await deletePokemon(id)
    navigate('/pokemon')
  }

  async function applyTarget(set) {
    await updatePokemon(id, { targetEvs: set.evs, targetNature: set.nature })
    setTargetConfirm(null)
  }

  async function clearTarget() {
    await updatePokemon(id, { targetEvs: null, targetNature: null })
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* Header card */}
      <div className="gb-card p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-xl font-bold text-gb-text">{displayName}</h1>
              {mon.nickname && species && (
                <span className="text-sm text-gb-dim">{species.name}</span>
              )}
            </div>
            <div className="text-xs text-gb-dim font-mono mb-2">
              #{String(mon.speciesId).padStart(3, '0')}
            </div>
            <div className="flex gap-1.5">
              {species?.types.map(t => <TypeBadge key={t} type={t} />)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gb-text">Lv.{mon.level}</div>
            <div className="text-sm text-gb-muted font-medium">{mon.natureName}</div>
            <div className="text-xs text-gb-dim mt-0.5">{nature.inc ? `+${STAT_LABELS[nature.inc]} / −${STAT_LABELS[nature.dec]}` : 'Neutral'}</div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setShowEdit(true)}
            className="flex-1 py-2 text-sm font-medium border border-gb-border hover:border-gb-green text-gb-muted hover:text-gb-green rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="py-2 px-4 text-sm font-medium border border-red-900/50 hover:border-red-500/60 text-red-500/70 hover:text-red-400 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* IV Table */}
      <div className="gb-card overflow-hidden">
        <div className="px-4 py-3 border-b border-gb-border">
          <h2 className="font-semibold text-gb-text">Stats & IVs</h2>
          {!hasStats && (
            <p className="text-xs text-gb-dim mt-0.5">Enter current stats (via Edit) to calculate IVs.</p>
          )}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gb-muted border-b border-gb-border">
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
                <tr key={key} className="border-b border-gb-border/40 last:border-0">
                  <td className={`px-4 py-2.5 font-medium ${statColor(key)}`}>{label}</td>
                  <td className="text-right px-3 py-2.5 font-mono text-gb-text">{statVal || '—'}</td>
                  <td className="text-right px-3 py-2.5 font-mono text-gb-dim">{baseVal}</td>
                  <td className="text-right px-3 py-2.5 font-mono text-gb-dim">{evVal}</td>
                  <td className="text-right px-4 py-2.5">
                    {ivResult ? <IVBadge result={ivResult} /> : <span className="text-gb-dim/40">—</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* EV spread */}
      <div className="gb-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gb-text">Effort Values</h2>
          <div className="flex items-center gap-3">
            {targetEvs && (
              <button onClick={clearTarget} className="text-xs text-gb-dim hover:text-red-400 transition-colors">
                Clear Target
              </button>
            )}
            <span className={`text-sm font-mono ${evTotal >= 510 ? 'text-yellow-400 font-bold' : 'text-gb-dim'}`}>
              {evTotal}/510
            </span>
          </div>
        </div>
        {targetEvs && (
          <div className="mb-3 px-3 py-2 rounded-lg border border-gb-border/60 text-xs text-gb-dim"
               style={{ background: '#0a160a' }}>
            Target: <span className="text-gb-green font-semibold">{targetNature}</span> nature ·
            {STAT_KEYS.filter(k => (targetEvs[k] ?? 0) > 0).map(k => (
              <span key={k} className="ml-1 text-yellow-400">{targetEvs[k]} {STAT_LABELS[k]}</span>
            ))}
          </div>
        )}
        <div className="space-y-2.5">
          {STAT_KEYS.map(key => {
            const current = mon.evs?.[key] ?? 0
            const target = targetEvs?.[key] ?? 0
            const needed = Math.max(0, target - current)
            return (
              <div key={key}>
                <EVBar label={STAT_LABELS[key]} value={current} target={target || undefined} />
                {targetEvs && target > 0 && needed > 0 && (
                  <div className="text-right text-xs text-gb-dim mt-0.5 font-mono">
                    +{needed} needed
                  </div>
                )}
                {targetEvs && target > 0 && needed === 0 && (
                  <div className="text-right text-xs text-gb-green mt-0.5">✓</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Base stats */}
      {species && (
        <div className="gb-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gb-text">Base Stats</h2>
            <span className="text-sm text-gb-dim">BST {STAT_KEYS.reduce((s,k) => s + (species.baseStats[k] ?? 0), 0)}</span>
          </div>
          <div className="space-y-2.5">
            {STAT_KEYS.map(key => (
              <BaseStatBar key={key} label={STAT_LABELS[key]} value={species.baseStats[key] ?? 0} />
            ))}
          </div>
        </div>
      )}

      {/* Classic Sets */}
      {classicSets.length > 0 && (
        <div className="gb-card p-4">
          <h2 className="font-semibold text-gb-text mb-3">Classic Sets</h2>
          <div className="space-y-3">
            {classicSets.map((set, i) => {
              const isActive = targetEvs &&
                STAT_KEYS.every(k => (targetEvs[k] ?? 0) === (set.evs[k] ?? 0)) &&
                targetNature === set.nature
              return (
                <div key={i} className="rounded-xl border p-3 space-y-2 transition-colors"
                     style={{ background: '#0a160a', borderColor: isActive ? '#22c55e' : '#1c3a1c' }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-sm font-semibold text-gb-text">{set.label}</span>
                      <span className="ml-2 text-xs px-1.5 py-0.5 rounded border border-gb-border text-gb-muted">
                        {set.nature}
                      </span>
                    </div>
                    {isActive ? (
                      <span className="text-xs text-gb-green shrink-0 font-semibold">● Active Target</span>
                    ) : (
                      <button
                        onClick={() => setTargetConfirm(set)}
                        className="text-xs px-2.5 py-1 rounded-lg border border-gb-border hover:border-gb-green text-gb-muted hover:text-gb-green transition-colors shrink-0"
                      >
                        Set Target
                      </button>
                    )}
                  </div>

                  {/* EV chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {STAT_KEYS.filter(k => (set.evs[k] ?? 0) > 0).map(k => (
                      <span key={k} className="text-xs px-2 py-0.5 rounded-full border border-gb-border text-yellow-400">
                        {set.evs[k]} {STAT_LABELS[k]}
                      </span>
                    ))}
                  </div>

                  {/* Moves */}
                  <div className="flex flex-wrap gap-1.5">
                    {set.moves.map(m => (
                      <span key={m} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: '#122012', color: '#86efac' }}>
                        {m}
                      </span>
                    ))}
                  </div>

                  {/* Note */}
                  <p className="text-xs text-gb-dim italic">{set.note}</p>
                </div>
              )
            })}
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

      {/* Target confirm modal */}
      {targetConfirm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="gb-card p-6 max-w-sm w-full">
            <h3 className="font-bold text-gb-text mb-1">{targetConfirm.label}</h3>
            <p className="text-xs text-gb-dim mb-3">Set this as your EV training target?</p>
            <div className="rounded-lg p-3 mb-4 space-y-1" style={{ background: '#0a160a' }}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gb-muted">Nature</span>
                <span className="text-gb-green font-semibold">{targetConfirm.nature}</span>
              </div>
              {STAT_KEYS.filter(k => (targetConfirm.evs[k] ?? 0) > 0).map(k => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gb-muted">{STAT_LABELS[k]}</span>
                  <span className="text-yellow-400 font-bold font-mono">{targetConfirm.evs[k]}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setTargetConfirm(null)}
                className="flex-1 py-2.5 border border-gb-border rounded-lg text-gb-muted text-sm">Cancel</button>
              <button onClick={() => applyTarget(targetConfirm)}
                className="flex-1 py-2.5 gb-btn-primary text-sm">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="gb-card p-6 max-w-sm w-full">
            <h3 className="font-bold text-gb-text mb-2">Remove {displayName}?</h3>
            <p className="text-gb-dim text-sm mb-5">This will permanently delete this Pokémon and all its tracked data.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2.5 border border-gb-border rounded-lg text-gb-muted text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-900/60 hover:bg-red-800/80 rounded-lg text-red-200 text-sm font-semibold"
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
