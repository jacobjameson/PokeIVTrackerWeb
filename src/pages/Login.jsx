import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const USERS = [
  { key: 'jacob',  label: 'Jacob',  emoji: '🔴' },
  { key: 'dallas', label: 'Dallas', emoji: '🔵' },
]

export default function Login() {
  const { selectUser } = useAuth()
  const navigate = useNavigate()

  function handleSelect(key) {
    selectUser(key)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white">
            <span className="text-red-500">Poké</span>IV Tracker
          </h1>
          <p className="text-gray-400 text-sm mt-2">FireRed / LeafGreen</p>
        </div>

        <p className="text-center text-gray-400 text-sm mb-6">Who's playing?</p>

        <div className="grid grid-cols-2 gap-4">
          {USERS.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className="flex flex-col items-center gap-3 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-2xl p-8 transition-all"
            >
              <span className="text-5xl">{emoji}</span>
              <span className="text-lg font-bold text-white">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
