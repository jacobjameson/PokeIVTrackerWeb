import { createContext, useContext, useState } from 'react'

const USERS = {
  jacob:  { uid: 'jacob',  displayName: 'Jacob' },
  dallas: { uid: 'dallas', displayName: 'Dallas' },
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pokeiv-user')
    return saved ? USERS[saved] ?? null : null
  })

  function selectUser(name) {
    const u = USERS[name]
    if (!u) return
    localStorage.setItem('pokeiv-user', name)
    setUser(u)
  }

  function logout() {
    localStorage.removeItem('pokeiv-user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, selectUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
