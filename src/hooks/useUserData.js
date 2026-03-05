import { useEffect, useState, useCallback } from 'react'
import { ref, onValue, push, set, update, remove } from 'firebase/database'
import { db } from '../firebase'
import { useAuth } from './useAuth'

// ── Roster Pokémon ─────────────────────────────────────────────────────────────

export function useRoster() {
  const { user } = useAuth()
  const [roster, setRoster] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setRoster([]); setLoading(false); return }
    const dbRef = ref(db, `users/${user.uid}/pokemon`)
    const unsub = onValue(
      dbRef,
      snap => {
        const val = snap.val() ?? {}
        const list = Object.entries(val)
          .map(([id, data]) => ({ id, ...data }))
          .sort((a, b) => (a.dateAdded ?? 0) - (b.dateAdded ?? 0))
        setRoster(list)
        setLoading(false)
      },
      err => { console.error('useRoster:', err); setLoading(false) }
    )
    return unsub
  }, [user?.uid])

  const addPokemon = useCallback((data) => {
    if (!user) return
    const newRef = push(ref(db, `users/${user.uid}/pokemon`))
    return set(newRef, { ...data, dateAdded: Date.now() }).then(() => ({ id: newRef.key }))
  }, [user?.uid])

  const updatePokemon = useCallback((id, data) => {
    if (!user) return
    return update(ref(db, `users/${user.uid}/pokemon/${id}`), data)
  }, [user?.uid])

  const deletePokemon = useCallback((id) => {
    if (!user) return
    return remove(ref(db, `users/${user.uid}/pokemon/${id}`))
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
    const dbRef = ref(db, `users/${user.uid}/sessions`)
    const unsub = onValue(
      dbRef,
      snap => {
        const val = snap.val() ?? {}
        const list = Object.entries(val)
          .map(([id, data]) => ({
            id,
            ...data,
            // RTDB stores arrays as objects when empty; normalize back
            enemies:          Array.isArray(data.enemies)          ? data.enemies          : Object.values(data.enemies ?? {}),
            partyPokemonIds:  Array.isArray(data.partyPokemonIds)  ? data.partyPokemonIds  : Object.values(data.partyPokemonIds ?? {}),
          }))
          .sort((a, b) => (b.date ?? 0) - (a.date ?? 0))
        setSessions(list)
        setLoading(false)
      },
      err => { console.error('useSessions:', err); setLoading(false) }
    )
    return unsub
  }, [user?.uid])

  const createSession = useCallback((name) => {
    if (!user) return
    const newRef = push(ref(db, `users/${user.uid}/sessions`))
    return set(newRef, {
      name,
      date: Date.now(),
      isFinalized: false,
      partyPokemonIds: [],
      enemies: [],
    }).then(() => ({ id: newRef.key }))
  }, [user?.uid])

  const updateSession = useCallback((id, data) => {
    if (!user) return
    return update(ref(db, `users/${user.uid}/sessions/${id}`), data)
  }, [user?.uid])

  const deleteSession = useCallback((id) => {
    if (!user) return
    return remove(ref(db, `users/${user.uid}/sessions/${id}`))
  }, [user?.uid])

  return { sessions, loading, createSession, updateSession, deleteSession }
}

// ── Settings ───────────────────────────────────────────────────────────────────

export function useSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState({ evMultiplier: 1 })

  useEffect(() => {
    if (!user) return
    const dbRef = ref(db, `users/${user.uid}/settings`)
    const unsub = onValue(
      dbRef,
      snap => { if (snap.val()) setSettings(snap.val()) },
      err  => console.error('useSettings:', err)
    )
    return unsub
  }, [user?.uid])

  const updateSettings = useCallback((data) => {
    if (!user) return
    return update(ref(db, `users/${user.uid}/settings`), data)
  }, [user?.uid])

  return { settings, updateSettings }
}
