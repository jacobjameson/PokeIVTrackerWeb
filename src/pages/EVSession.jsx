import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessions } from '../hooks/useUserData'
import { sessionEVGains, STAT_KEYS } from '../lib/gen3Calculator'
import { POKEDEX_MAP } from '../lib/pokedex'

export default function EVSession() {
  const { sessions, loading, createSession, deleteSession } = useSessions()
  const navigate = useNavigate()
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    const ref = await createSession(newName.trim())
    setCreating(false)
    setShowNew(false)
    setNewName('')
    if (ref?.id) navigate(`/sessions/${ref.id}`)
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-white">EV Sessions</h1>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <span className="text-lg leading-none">+</span> New
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">⚡</div>
          <p className="font-medium">No sessions yet</p>
          <p className="text-sm mt-1">Create one to start tracking EV training.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map(session => {
            const evs = sessionEVGains(session.enemies ?? [], POKEDEX_MAP)
            const totalEV = STAT_KEYS.reduce((s, k) => s + (evs[k] ?? 0), 0)
            return (
              <div
                key={session.id}
                onClick={() => navigate(`/sessions/${session.id}`)}
                className="bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl p-4 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{session.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        session.isFinalized
                          ? 'bg-green-900/40 text-green-400'
                          : 'bg-blue-900/40 text-blue-400'
                      }`}>
                        {session.isFinalized ? 'Done' : 'Active'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {session.enemies?.length ?? 0} enemy types ·{' '}
                      {session.partyPokemonIds?.length ?? 0} party members
                    </div>
                  </div>
                  <div className="text-right">
                    {totalEV > 0 && (
                      <div className="text-sm font-bold text-orange-400">+{totalEV} EVs</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* New session modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-white mb-4">New EV Session</h3>
            <form onSubmit={handleCreate}>
              <input
                autoFocus
                type="text"
                placeholder="e.g. Sp.Atk Training"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-4"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowNew(false); setNewName('') }}
                  className="flex-1 py-2.5 border border-gray-700 rounded-lg text-gray-300 hover:text-white text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newName.trim() || creating}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-lg text-white text-sm font-semibold"
                >
                  {creating ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
