import { useEffect, useState } from 'react'
import { setServerActivityHandler } from '../services/api'
import { broadcastSession, onSessionMessage } from '../services/sessionChannel' 

const SESSION_MS = 15 * 60 * 1000
const WARNING_MS = 2 * 60 * 1000

export function useSessionTimer(onExpire: () => void) {
  const [lastActivity, setLastActivity] = useState(() => Date.now())
  const [now, setNow] = useState(() => Date.now())

  
  useEffect(() => {
    setServerActivityHandler(() => {
      const at = Date.now()
      setLastActivity(at)
      broadcastSession({ type: 'activity', at })
      
    
    })
    return () => setServerActivityHandler(null)
  }, [])

  // Un autre onglet a parlé au serveur : je remets mon chrono à son heure, SANS répéter
  useEffect(() => {
    return onSessionMessage((message) => {
      if (message.type === 'activity') setLastActivity(message.at)
    })
  }, [])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const remainingMs = Math.max(0, SESSION_MS - (now - lastActivity))
  const showWarning = remainingMs <= WARNING_MS

  useEffect(() => {
    if (remainingMs === 0) onExpire()
  }, [remainingMs, onExpire])

  return { showWarning, remainingMs }
}