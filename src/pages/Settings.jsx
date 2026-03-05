import { useSettings } from '../hooks/useUserData'
import { useAuth } from '../hooks/useAuth'
import { useRoster, useSessions } from '../hooks/useUserData'
import { useState } from 'react'

const MULTIPLIER_OPTIONS = [
  { value: 1, label: 'Normal', desc: 'No modifier' },
  { value: 2, label: 'Macho Brace', desc: '×2 (or Pokérus alone)' },
  { value: 4, label: 'Pokérus + Brace', desc: '×4' },
]

export default function Settings() {
  const { settings, updateSettings } = useSettings()
  const { user } = useAuth()
  const { roster, deletePokemon } = useRoster()
  const { sessions, deleteSession } = useSessions()
  const [confirmReset, setConfirmReset] = useState(false)
  const [resetting, setResetting] = useState(false)

  async function handleReset() {
    setResetting(true)
    await Promise.all([
      ...roster.map(m => deletePokemon(m.id)),
      ...sessions.map(s => deleteSession(s.id)),
    ])
    setResetting(false)
    setConfirmReset(false)
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">

      {/* Account */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800">
          <h2 className="font-semibold text-white">Account</h2>
        </div>
        <div className="px-4 py-3 space-y-1">
          <div className="text-sm text-gray-300">{user?.displayName || 'No display name'}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
      </section>

      {/* EV Multiplier */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800">
          <h2 className="font-semibold text-white">EV Multiplier</h2>
          <p className="text-xs text-gray-500 mt-0.5">Applied to all EV session tallies.</p>
        </div>
        <div className="divide-y divide-gray-800">
          {MULTIPLIER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateSettings({ evMultiplier: opt.value })}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800 transition-colors text-left"
            >
              <div>
                <div className="text-sm font-medium text-white">{opt.label}</div>
                <div className="text-xs text-gray-500">{opt.desc}</div>
              </div>
              {settings.evMultiplier === opt.value && (
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">✓</div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Gen 3 Reference */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800">
          <h2 className="font-semibold text-white">Gen 3 Reference</h2>
        </div>
        <div className="px-4 py-4 space-y-3">
          <div>
            <div className="text-xs font-semibold text-gray-400 mb-1">HP formula:</div>
            <div className="text-xs font-mono bg-gray-800 text-gray-300 rounded-lg px-3 py-2">
              ⌊(2×Base + IV + ⌊EV/4⌋) × Lv/100⌋ + Lv + 10
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 mb-1">Other stats:</div>
            <div className="text-xs font-mono bg-gray-800 text-gray-300 rounded-lg px-3 py-2">
              ⌊(⌊(2×Base + IV + ⌊EV/4⌋) × Lv/100⌋ + 5) × Nature⌋
            </div>
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <div>Nature: ×1.1 boosted stat, ×0.9 lowered stat, ×1.0 neutral</div>
            <div>EV caps: 255/stat, 510 total · Effective per stat: ⌊255/4⌋ = 63</div>
          </div>
        </div>
      </section>

      {/* IV Quality legend */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800">
          <h2 className="font-semibold text-white">IV Color Guide</h2>
        </div>
        <div className="px-4 py-3 space-y-1.5 text-sm">
          <div className="flex items-center gap-2"><span className="text-orange-400 font-bold font-mono">31</span><span className="text-gray-400">Perfect</span></div>
          <div className="flex items-center gap-2"><span className="text-green-400 font-semibold font-mono">26–31</span><span className="text-gray-400">Great</span></div>
          <div className="flex items-center gap-2"><span className="text-blue-400 font-mono">20–25</span><span className="text-gray-400">Good</span></div>
          <div className="flex items-center gap-2"><span className="text-gray-400 font-mono">0–19</span><span className="text-gray-400">Low</span></div>
        </div>
      </section>

      {/* Danger zone */}
      <section className="bg-gray-900 border border-red-900/30 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-red-900/30">
          <h2 className="font-semibold text-red-400">Danger Zone</h2>
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-white">Delete all data</div>
              <div className="text-xs text-gray-500">
                {roster.length} Pokémon · {sessions.length} sessions
              </div>
            </div>
            <button
              onClick={() => setConfirmReset(true)}
              className="text-sm px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg border border-red-900/40 transition-colors"
            >
              Delete All
            </button>
          </div>
        </div>
      </section>

      {/* Confirm delete */}
      {confirmReset && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-white mb-2">Delete Everything?</h3>
            <p className="text-sm text-gray-400 mb-5">
              This permanently deletes all {roster.length} Pokémon and {sessions.length} EV sessions from your account. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-2.5 border border-gray-700 rounded-lg text-gray-300 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={resetting}
                className="flex-1 py-2.5 bg-red-700 hover:bg-red-600 disabled:opacity-50 rounded-lg text-white text-sm font-semibold"
              >
                {resetting ? 'Deleting…' : 'Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
