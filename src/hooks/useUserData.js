import { useEffect, useState, useCallback } from 'react'
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp, setDoc, getDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from './useAuth'

function userCol(uid, path) {
  return collection(db, 'users', uid, path)
}

function userDoc(uid, path, id) {
  return doc(db, 'users', uid, path, id)
}

// ── Roster Pokémon ─────────────────────────────────────────────────────────────

export function useRoster() {
  const { user } = useAuth()
  const [roster, setRoster] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setRoster([]); setLoading(false); return }
    const q = query(userCol(user.uid, 'pokemon'), orderBy('dateAdded', 'asc'))
    const unsub = onSnapshot(q, snap => {
      setRoster(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [user?.uid])

  const addPokemon = useCallback((data) => {
    if (!user) return
    return addDoc(userCol(user.uid, 'pokemon'), {
      ...data,
      dateAdded: serverTimestamp(),
    })
  }, [user?.uid])

  const updatePokemon = useCallback((id, data) => {
    if (!user) return
    return updateDoc(userDoc(user.uid, 'pokemon', id), data)
  }, [user?.uid])

  const deletePokemon = useCallback((id) => {
    if (!user) return
    return deleteDoc(userDoc(user.uid, 'pokemon', id))
  }, [user?.uid])

  return { roster, loading, addPokemon, updatePokemon, deletePokemon }
}

// ── EV Sessions ────────────────────────────────────────────────────────────────

export function useSessions() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setSessions([]); setLoading(false); return }
    const q = query(userCol(user.uid, 'sessions'), orderBy('date', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setSessions(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [user?.uid])

  const createSession = useCallback((name) => {
    if (!user) return
    return addDoc(userCol(user.uid, 'sessions'), {
      name,
      date: serverTimestamp(),
      isFinalized: false,
      partyPokemonIds: [],
      enemies: [],  // [{speciesId, count}] stored inline
    })
  }, [user?.uid])

  const updateSession = useCallback((id, data) => {
    if (!user) return
    return updateDoc(userDoc(user.uid, 'sessions', id), data)
  }, [user?.uid])

  const deleteSession = useCallback((id) => {
    if (!user) return
    return deleteDoc(userDoc(user.uid, 'sessions', id))
  }, [user?.uid])

  return { sessions, loading, createSession, updateSession, deleteSession }
}

// ── Settings ───────────────────────────────────────────────────────────────────

export function useSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState({ evMultiplier: 1 })

  useEffect(() => {
    if (!user) return
    const ref = userDoc(user.uid, 'settings', 'config')
    return onSnapshot(ref, snap => {
      if (snap.exists()) setSettings(snap.data())
    })
  }, [user?.uid])

  const updateSettings = useCallback((data) => {
    if (!user) return
    const ref = userDoc(user.uid, 'settings', 'config')
    return setDoc(ref, data, { merge: true })
  }, [user?.uid])

  return { settings, updateSettings }
}
