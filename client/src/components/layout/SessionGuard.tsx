import { useAuth } from '../../store/auth.context'
import { useSessionTimer } from '../../hooks/useSessionTimer'
import { SessionWarningDialog } from '../shared/SessionWarningDialog'

export default function SessionGuard() {
  const { expireSession, refreshUser, logout } = useAuth()
  const { showWarning, remainingMs } = useSessionTimer(expireSession)

  return (
    <SessionWarningDialog
      open={showWarning}
      remainingMs={remainingMs}
      onStay={() => { refreshUser().catch(() => {}) }}
      onLogout={logout}
    />
  )
}