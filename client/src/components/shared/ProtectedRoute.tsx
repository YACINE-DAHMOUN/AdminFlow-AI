import type { ReactNode } from 'react'
import { Navigate } from '@tanstack/react-router'
import { useAuth } from '../../store/auth.context'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  // Pendant le chargement — on n'affiche RIEN et on ne redirige PAS
  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        role="status"
        aria-live="polite"
        aria-label="Chargement de l'application"
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}