import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSessions, useRoster, useSettings } from '../hooks/useUserData'
import { getSpecies, searchPokedex, evYieldSummary, POKEDEX_MAP } from '../lib/pokedex'
import { sessionEVGains, addEVs, STAT_KEYS, STAT_LABELS } from '../lib/gen3Calculator'
import PokemonSprite from '../components/PokemonSprite'
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
  // Track which card just got tapped for flash animation
  const [flashId, setFlashId] = useState(null)

  const session = sessions.find(s => s.id === id)
  if (!session) return <div className="p-4 text-gb-dim">Session not found.</div>

  const multiplier = settings.evMultiplier ?? 1
  const enemies = session.enemies ?? []
  const rawGains = sessionEVGains(enemies, POKEDEX_MAP)
  const gains = Object.fromEntries(STAT_KEYS.map(k => [k, (rawGains[k] ?? 0) * multiplier]))
  const totalGained = STAT_KEYS.reduce((s, k) => s + gains[k], 0)
  const partyPokemon = roster.filter(m => session.partyPokemonIds?.includes(m.id))

  function tapEnemy(speciesId) {
    if (session.isFinalized) return
    const updated = enemies.map(e =>
      e.speciesId === speciesId ? { ...e, count: e.count + 1 } : e
    )
    updateSession(id, { enemies: updated })
    setFlashId(speciesId)
    setTimeout(() => setFlashId(null), 250)
  }

  function decrementEnemy(speciesId, e) {
    e.stopPropagation()
    if (session.isFinalized) return
    const updated = enemies.map(en =>
      en.speciesId === speciesId ? { ...en, count: Math.max(0, en.count - 1) } : en
    )
    updateSession(id, { enemies: updated })
  }

  function removeEnemy(speciesId, e) {
    e.stopPropagation()
    updateSession(id, { enemies: enemies.filter(en => en.speciesId !== speciesId) })
  }

  function addEnemy(speciesId) {
    if (enemies.some(e => e.speciesId === speciesId)) {
      tapEnemy(speciesId)
    } else {
      updateSession(id, { enemies: [...enemies, { speciesId, count: 1 }] })
    }
  }

  function toggleParty(monId) {
    const ids = session.partyPokemonIds ?? []
    updateSession(id, {
      partyPokemonIds: ids.includes(monId) ? ids.filter(i => i !== monId) : [...ids, monId]
    })
  }

  async function finalize() {
    setFinalizing(true)
    for (const mon of partyPokemon) {
      await updatePokemon(mon.id, { evs: addEVs(mon.evs ?? {}, gains) })
    }
    await updateSession(id, { isFinalized: true })
    setFinalizing(false)
    setShowFinalizeConfirm(false)
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col" style={{ minHeight: 'calc(100vh - 7rem)' }}>
      {/* Top bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gb-text text-lg">{session.name}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              session.isFinalized
                ? 'bg-gb-dim/30 text-gb-green'
                : 'bg-gb-faint text-gb-muted'
            }`}>
              {session.isFinalized ? '✓ Done' : '● Active'}
            </span>
          </div>
          {!session.isFinalized && (
            <button
              onClick={() => setShowPartyPicker(true)}
              className="text-xs border border-gb-border hover:border-gb-green text-gb-muted hover:text-gb-green px-3 py-1.5 rounded-lg transition-colors"
            >
              Party ({partyPokemon.length})
            </button>
          )}
        </div>

        {/* Party preview chips */}
        {partyPokemon.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {partyPokemon.map(mon => (
              <div key={mon.id} className="flex items-center gap-1 bg-gb-card border border-gb-border rounded-full px-2 py-0.5">
                <PokemonSprite id={mon.speciesId} size={20} />
                <span className="text-xs text-gb-muted">{mon.nickname || mon.speciesName}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enemy tap grid */}
      <div className="flex-1 px-4 pb-2">
        {enemies.length === 0 && !session.isFinalized ? (
          <div className="flex flex-col items-center justify-center py-16 text-gb-dim gap-3">
            <div className="font-pixel text-gb-green" style={{ fontSize: '0.5rem' }}>TAP TO BATTLE</div>
            <p className="text-sm text-center">Add enemy Pokémon below, then tap their card each time you defeat one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2">
            {enemies.map(enemy => {
              const species = getSpecies(enemy.speciesId)
              const isFlashing = flashId === enemy.speciesId
              const evSummary = species ? evYieldSummary(species) : ''
              return (
                <button
                  key={enemy.speciesId}
                  onClick={() => tapEnemy(enemy.speciesId)}
                  disabled={session.isFinalized}
                  className="relative flex flex-col items-center gap-1 rounded-xl border p-3 transition-all select-none"
                  style={{
                    background: isFlashing ? 'rgba(34,197,94,0.15)' : '#0d1a0d',
                    borderColor: isFlashing ? '#22c55e' : '#1c3a1c',
                    transform: isFlashing ? 'scale(0.96)' : 'scale(1)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Remove button */}
                  {!session.isFinalized && (
                    <button
                      onClick={e => removeEnemy(enemy.speciesId, e)}
                      className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center text-gb-dim hover:text-red-400 text-xs leading-none"
                    >
                      ✕
                    </button>
                  )}

                  <PokemonSprite id={enemy.speciesId} size={72} />

                  <span className="text-xs font-semibold text-gb-text text-center leading-tight">
                    {species?.name ?? `#${enemy.speciesId}`}
                  </span>

                  {evSummary && evSummary !== 'None' && (
                    <span className="text-xs text-yellow-400/80 text-center leading-tight">
                      {evSummary}
                    </span>
                  )}

                  {/* Count badge */}
                  <div className="flex items-center gap-2 mt-1">
                    {!session.isFinalized && (
                      <button
                        onClick={e => decrementEnemy(enemy.speciesId, e)}
                        className="w-6 h-6 flex items-center justify-center rounded bg-gb-faint hover:bg-gb-border text-gb-muted text-sm font-bold"
                      >
                        −
                      </button>
                    )}
                    <span className="font-pixel text-gb-green" style={{ fontSize: '0.6rem' }}>
                      ×{enemy.count}
                    </span>
                    {!session.isFinalized && (
                      <div className="w-6 h-6" /> // spacer to balance layout
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* EV bar + bottom controls */}
      <div className="sticky bottom-0 border-t border-gb-border px-4 py-3 space-y-2"
           style={{ background: '#0d1a0d' }}>
        {/* EV totals */}
        {totalGained > 0 && (
          <div className="flex gap-2 flex-wrap">
            {STAT_KEYS.filter(k => gains[k] > 0).map(k => (
              <span key={k} className="text-xs px-2 py-0.5 rounded-full border border-gb-border text-yellow-400">
                +{gains[k]} {STAT_LABELS[k]}
              </span>
            ))}
            <span className="text-xs px-2 py-0.5 rounded-full bg-gb-faint text-gb-muted">
              {totalGained} total · ×{multiplier}
            </span>
          </div>
        )}

        <div className="flex gap-2">
          {!session.isFinalized && (
            <>
              <button
                onClick={() => setShowEnemyPicker(true)}
                className="flex-1 py-2.5 text-sm font-semibold border border-gb-border hover:border-gb-green
                           text-gb-muted hover:text-gb-green rounded-lg transition-colors"
              >
                + Add Enemy
              </button>
              <button
                onClick={() => setShowFinalizeConfirm(true)}
                disabled={partyPokemon.length === 0 || enemies.length === 0}
                className="flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors disabled:opacity-30"
                style={{ background: '#166534', color: '#d1fae5' }}
                onMouseEnter={e => e.currentTarget.style.background = '#22c55e'}
                onMouseLeave={e => e.currentTarget.style.background = '#166534'}
              >
                Conclude Session
              </button>
            </>
          )}
          {session.isFinalized && (
            <div className="flex-1 text-center py-2.5 text-sm text-gb-green font-semibold">
              ✓ EVs applied to party
            </div>
          )}
        </div>
      </div>

      {/* Party picker */}
      {showPartyPicker && (
        <SlideUpModal title="Select Party" onClose={() => setShowPartyPicker(false)}>
          {roster.length === 0 ? (
            <p className="text-gb-dim text-sm px-4 py-3">No Pokémon in roster yet.</p>
          ) : roster.map(mon => {
            const selected = session.partyPokemonIds?.includes(mon.id)
            const species = getSpecies(mon.speciesId)
            return (
              <button key={mon.id} onClick={() => toggleParty(mon.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gb-raised border-b border-gb-border/50 last:border-0 transition-colors">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs ${selected ? 'border-gb-green bg-gb-green text-gb-bg' : 'border-gb-border'}`}>
                  {selected && '✓'}
                </div>
                <PokemonSprite id={mon.speciesId} size={32} />
                <span className="text-sm text-gb-text flex-1">{mon.nickname || species?.name}</span>
                <span className="text-xs text-gb-dim">Lv.{mon.level}</span>
              </button>
            )
          })}
          <div className="p-4">
            <button onClick={() => setShowPartyPicker(false)} className="gb-btn-primary w-full py-2.5 text-sm">Done</button>
          </div>
        </SlideUpModal>
      )}

      {/* Enemy picker */}
      {showEnemyPicker && (
        <EnemyPickerModal onSelect={addEnemy} onClose={() => setShowEnemyPicker(false)} />
      )}

      {/* Finalize confirm */}
      {showFinalizeConfirm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="gb-card p-6 max-w-sm w-full">
            <h3 className="font-bold text-gb-text mb-2">Conclude Session?</h3>
            <p className="text-sm text-gb-dim mb-3">Each party member will receive:</p>
            <div className="rounded-lg p-3 mb-4 space-y-1" style={{ background: '#122012' }}>
              {STAT_KEYS.filter(k => gains[k] > 0).map(k => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gb-muted">{STAT_LABELS[k]}</span>
                  <span className="text-yellow-400 font-bold font-mono">+{gains[k]}</span>
                </div>
              ))}
              {totalGained === 0 && <p className="text-gb-dim text-sm">No EVs earned.</p>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowFinalizeConfirm(false)}
                className="flex-1 py-2.5 border border-gb-border rounded-lg text-gb-muted text-sm">Cancel</button>
              <button onClick={finalize} disabled={finalizing}
                className="flex-1 py-2.5 gb-btn-primary text-sm disabled:opacity-50">
                {finalizing ? 'Saving…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SlideUpModal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center">
      <div className="w-full sm:max-w-md gb-card rounded-t-2xl sm:rounded-2xl max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gb-border">
          <h3 className="font-bold text-gb-text">{title}</h3>
          <button onClick={onClose} className="text-gb-dim hover:text-gb-text text-xl">×</button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  )
}

function EnemyPickerModal({ onSelect, onClose }) {
  const [search, setSearch] = useState('')
  const results = searchPokedex(search).slice(0, 60)

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center">
      <div className="w-full sm:max-w-md gb-card rounded-t-2xl sm:rounded-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gb-border">
          <h3 className="font-bold text-gb-text">Add Enemy</h3>
          <button onClick={onClose} className="text-gb-dim hover:text-gb-text text-xl">×</button>
        </div>
        <div className="px-4 py-3 border-b border-gb-border">
          <input autoFocus type="text" placeholder="Search…" value={search}
            onChange={e => setSearch(e.target.value)} className="gb-input w-full" />
        </div>
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-3 gap-2 p-3">
            {results.map(species => (
              <button key={species.id} onClick={() => { onSelect(species.id); onClose() }}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border border-gb-border hover:border-gb-green transition-colors"
                style={{ background: '#0d1a0d' }}>
                <PokemonSprite id={species.id} size={56} />
                <span className="text-xs text-gb-text text-center leading-tight">{species.name}</span>
                {evYieldSummary(species) !== 'None' && (
                  <span className="text-xs text-yellow-400/80 text-center leading-tight">
                    {evYieldSummary(species)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
