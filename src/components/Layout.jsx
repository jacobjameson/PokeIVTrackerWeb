import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const tabs = [
  { to: '/pokemon',  label: 'Roster',   icon: StarIcon },
  { to: '/sessions', label: 'Train',    icon: BoltIcon },
  { to: '/pokedex',  label: 'Pokédex',  icon: BookIcon },
  { to: '/settings', label: 'Settings', icon: GearIcon },
]

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#060d06' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gb-border"
              style={{ background: '#0d1a0d' }}>
        <span className="font-pixel text-gb-green text-xs tracking-tight leading-none">
          PokéIV<br />
          <span className="text-gb-muted" style={{ fontSize: '0.55rem' }}>FR / LG</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gb-muted hidden sm:block">{user?.displayName}</span>
          <button
            onClick={logout}
            className="text-xs text-gb-dim hover:text-gb-green px-2 py-1 rounded border border-gb-border hover:border-gb-green transition-colors"
          >
            Switch
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="flex border-t border-gb-border" style={{ background: '#0d1a0d' }}>
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                isActive ? 'text-gb-green' : 'text-gb-dim hover:text-gb-muted'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="hidden sm:block text-xs">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

function StarIcon({ className }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
}
function BoltIcon({ className }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
}
function BookIcon({ className }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>
}
function GearIcon({ className }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
}
