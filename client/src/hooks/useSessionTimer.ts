import { useEffect, useState } from 'react'
import { setServerActivityHandler } from '../services/api'

// ⚠️ Doit correspondre au serveur : server/src/core/config/index.ts → session.idleMs
const SESSION_MS = 2 * 60 * 1000
const WARNING_MS = 1                       * 60 * 1000     // on prévient 2 minutes avant

export function useSessionTimer(onExpire: () => void) {
  const [lastActivity, setLastActivity] = useState(() => Date.now())
  const [now, setNow] = useState(() => Date.now())

  // 1. Chaque réponse réussie du serveur remet le chrono à zéro
  useEffect(() => {
    setServerActivityHandler(() => setLastActivity(Date.now()))
    return () => setServerActivityHandler(null)
  }, [])

  // 2. L'horloge : « now » est mis à jour chaque seconde
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  // 3. Tout le reste est calculé (état dérivé)
  const remainingMs = Math.max(0, SESSION_MS - (now - lastActivity))
  const showWarning = remainingMs <= WARNING_MS

  // 4. À zéro : on expire la session
  useEffect(() => {
    if (remainingMs === 0) onExpire()
  }, [remainingMs, onExpire])

  return { showWarning, remainingMs }
}