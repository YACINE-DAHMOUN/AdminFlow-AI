import type { RefObject } from 'react'
import { LogOut, Menu } from 'lucide-react'
import { useAuth } from '../../store/auth.context'

interface HeaderProps {
  onOpenNav: () => void
  isNavOpen: boolean
  menuButtonRef: RefObject<HTMLButtonElement>
}

export default function Header({ onOpenNav, isNavOpen, menuButtonRef }: HeaderProps) {
  const { logout, user } = useAuth()
  const initial = user?.email?.[0]?.toUpperCase() ?? 'U'

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/85 backdrop-blur-md px-4 md:px-6">
      {/* Burger : mobile uniquement */}
      <button
        ref={menuButtonRef}
        type="button"
        onClick={onOpenNav}
        aria-label="Ouvrir le menu"
        aria-expanded={isNavOpen}
        aria-controls="app-sidebar"
        className="md:hidden -ml-2 inline-flex size-11 items-center justify-center rounded-lg text-foreground hover:bg-muted"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <div className="ml-auto flex items-center gap-3">
        {/* Pilule utilisateur */}
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-1 py-1 pr-3 shadow-xs">
          <div
            className="size-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0"
            aria-hidden="true"
          >
            {initial}
          </div>
          {/* Caché visuellement sur mobile, mais toujours lu par les lecteurs d'écran */}
          <span className="sr-only sm:not-sr-only sm:block text-sm text-foreground max-w-[240px] truncate font-medium">
            {user?.email ?? 'utilisateur'}
          </span>
          <span className="rounded-full bg-highlight px-2 py-0.5 text-[10px] font-bold tracking-wider text-highlight-foreground">
            <span className="sr-only">Plan </span>FREE
          </span>
        </div>

        {/* Déconnexion : icône seule sur mobile, donc aria-label obligatoire */}
        <button
          type="button"
          onClick={logout}
          aria-label="Déconnexion"
          className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm font-medium text-muted-foreground shadow-xs transition-colors hover:border-destructive/40 hover:text-destructive"
        >
          <LogOut className="size-4" aria-hidden="true" />
          <span className="hidden sm:block">Déconnexion</span>
        </button>
      </div>
    </header>
  )
}