import { LogOut } from 'lucide-react'
import { useAuth } from '../../store/auth.context'

export default function Header() {
  const { logout, user } = useAuth()
  const initial = user?.email?.[0]?.toUpperCase() ?? 'U'

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-end gap-3 border-b border-border bg-background/85 backdrop-blur-md px-6">
      {/* Pilule utilisateur */}
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-1 py-1 pr-3 shadow-xs">
        <div className="size-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
          {initial}
        </div>
        <span className="hidden sm:block text-sm text-foreground max-w-[180px] truncate font-medium">
          {user?.email ?? 'utilisateur'}
        </span>
        <span className="rounded-full bg-highlight px-2 py-0.5 text-[10px] font-bold tracking-wider text-highlight-foreground">
          FREE
        </span>
      </div>

      {/* Déconnexion */}
      <button
        onClick={logout}
        className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground shadow-xs transition-colors hover:border-destructive/40 hover:text-destructive"
      >
        <LogOut className="size-4" />
        <span className="hidden sm:block">Déconnexion</span>
      </button>
    </header>
  )
}