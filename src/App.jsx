import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Layout from './components/Layout'
import Login from './pages/Login'
import MyPokemon from './pages/MyPokemon'
import PokemonDetail from './pages/PokemonDetail'
import EVSession from './pages/EVSession'
import SessionDetail from './pages/SessionDetail'
import Pokedex from './pages/Pokedex'
import Settings from './pages/Settings'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/pokemon" replace />} />
        <Route path="pokemon" element={<MyPokemon />} />
        <Route path="pokemon/:id" element={<PokemonDetail />} />
        <Route path="sessions" element={<EVSession />} />
        <Route path="sessions/:id" element={<SessionDetail />} />
        <Route path="pokedex" element={<Pokedex />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
