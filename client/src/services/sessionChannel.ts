// Les seuls messages possibles sur le canal : des événements, jamais de données sensibles
export type SessionMessage =
  | { type: 'activity'; at: number }   // le serveur a répondu (session renouvelée) à cette heure
  | { type: 'logout' }                 // déconnexion volontaire
  | { type: 'expired' }                // session expirée
  | { type: 'login' }                  // connexion ou inscription réussie

// Le canal (null si le navigateur ne connaît pas BroadcastChannel : on se passe alors de la synchro)
const channel = typeof BroadcastChannel !== 'undefined'
  ? new BroadcastChannel('plidea-session')
  : null

// Envoyer un message aux AUTRES onglets
export const broadcastSession = (message: SessionMessage) => {
  channel?.postMessage(message)
}

// Écouter les messages des autres onglets. Renvoie la fonction pour arrêter d'écouter (le nettoyage)
export const onSessionMessage = (handler: (message: SessionMessage) => void) => {
  if (!channel) return () => {}
  const listener = (event: MessageEvent<SessionMessage>) => handler(event.data)
  channel.addEventListener('message', listener)
  return () => channel.removeEventListener('message', listener)
}