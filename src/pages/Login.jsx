import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const USERS = [
  { key: 'jacob',  label: 'Jacob',  color: '#ef4444' },
  { key: 'dallas', label: 'Dallas', color: '#3b82f6' },
]

export default function Login() {
  const { selectUser } = useAuth()
  const navigate = useNavigate()

  function handleSelect(key) {
    selectUser(key)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
         style={{ background: '#060d06' }}>

      {/* Game Boy screen bezel */}
      <div className="w-full max-w-xs" style={{
        background: '#0d1a0d',
        border: '3px solid #1c3a1c',
        borderRadius: '16px',
        boxShadow: '0 0 40px rgba(34,197,94,0.08), inset 0 1px 0 rgba(255,255,255,0.03)',
        padding: '2rem',
      }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="font-pixel text-gb-green mb-1" style={{ fontSize: '0.7rem', lineHeight: 2 }}>
            POKEIV
          </div>
          <div className="font-pixel text-gb-dim" style={{ fontSize: '0.4rem', letterSpacing: '0.2em' }}>
            TRACKER — FR/LG
          </div>
          <div className="mt-4 border-t border-gb-border" />
        </div>

        {/* Player select */}
        <p className="text-center text-gb-muted text-xs mb-5 tracking-wider">SELECT PLAYER</p>

        <div className="space-y-3">
          {USERS.map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-lg border border-gb-border
                         hover:border-gb-green transition-all group"
              style={{ background: '#122012' }}
            >
              {/* Sprite placeholder circle colored by player */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0"
                   style={{ background: color }}>
                {label[0]}
              </div>
              <span className="font-pixel text-gb-text group-hover:text-gb-green transition-colors"
                    style={{ fontSize: '0.65rem' }}>
                {label.toUpperCase()}
              </span>
              <span className="ml-auto text-gb-dim group-hover:text-gb-green transition-colors text-lg">▶</span>
            </button>
          ))}
        </div>

        <p className="text-center mt-6 text-gb-dim" style={{ fontSize: '0.5rem', fontFamily: 'monospace' }}>
          FireRed / LeafGreen Edition
        </p>
      </div>
    </div>
  )
}
