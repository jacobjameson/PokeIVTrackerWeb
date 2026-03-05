import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = loading

  useEffect(() => {
    return onAuthStateChanged(auth, setUser)
  }, [])

  const loginEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const registerEmail = (email, password, displayName) =>
    createUserWithEmailAndPassword(auth, email, password).then(cred => {
      if (displayName) updateProfile(cred.user, { displayName })
      return cred
    })

  const loginGoogle = () => signInWithPopup(auth, googleProvider)

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, loginEmail, registerEmail, loginGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
