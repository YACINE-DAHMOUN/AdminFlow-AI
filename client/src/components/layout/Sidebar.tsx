import { useEffect, useRef } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { LayoutDashboard, FileText, Upload, CalendarClock, Sparkles, X } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/documents', label: 'Mes documents', icon: FileText },
  { to: '/upload', label: 'Analyser', icon: Upload },
  { to: '/deadlines', label: 'Échéances', icon: CalendarClock },
] as const

interface SidebarProps {
  isOpen: boolean // tiroir ouvert (mobile uniquement)
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { location } = useRouterState()
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // À l'ouverture du tiroir, le focus va sur « Fermer le menu »
  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus()
  }, [isOpen])

  return (
    <aside
      id="app-sidebar"
      aria-label="Menu principal"
      role={isOpen ? 'dialog' : undefined}
      aria-modal={isOpen || undefined}
      className={[
        // Mobile : tiroir fixe, caché à gauche par défaut
        'fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-sidebar text-sidebar-foreground',
        'duration-200 ease-out motion-reduce:transition-none',
        // invisible = hors de l'écran ET hors de la navigation clavier.
        // À l'ouverture, visible tout de suite (sinon on ne peut pas y mettre le focus) ;
        // à la fermeture, invisible seulement à la fin de l'animation.
        isOpen
          ? 'visible translate-x-0 transition-transform'
          : 'invisible -translate-x-full transition-[transform,visibility]',
        // Desktop (≥ 768 px) : sidebar classique, toujours visible
        'md:visible md:static md:z-auto md:w-60 md:shrink-0 md:translate-x-0',
      ].join(' ')}
    >
      {/* Logo + bouton Fermer (mobile) */}
      <div className="flex items-center justify-between gap-2 px-5 pt-6 pb-8">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
            <Sparkles className="size-4 text-sidebar-primary-foreground" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight" style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}>
              AdminFlow <span className="text-sidebar-primary">AI</span>
            </p>
            <p className="text-[11px] text-sidebar-muted leading-tight mt-0.5">
              L'IA administrative
            </p>
          </div>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Fermer le menu"
          className="md:hidden -mr-2 inline-flex size-11 items-center justify-center rounded-lg text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      {/* Navigation */}
      <nav aria-label="Navigation principale" className="flex-1 overflow-y-auto px-3">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted" aria-hidden="true">
          Menu
        </p>
        <ul className="space-y-0.5">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to
            return (
              <li key={to}>
                <Link
                  to={to}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'relative flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                  ].join(' ')}
                >
                  {isActive && (
                    <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-sidebar-primary" aria-hidden="true" />
                  )}
                  <Icon
                    className={['size-[18px] shrink-0', isActive ? 'text-sidebar-primary' : ''].join(' ')}
                    aria-hidden="true"
                  />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Carte du plan */}
      <div className="m-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-sidebar-accent-foreground">Plan Gratuit</p>
          <span className="rounded-full bg-sidebar-primary/20 px-2 py-0.5 text-[10px] font-bold text-sidebar-primary">
            FREE
          </span>
        </div>
        <p className="text-[11px] text-sidebar-muted">0 / 5 documents ce mois</p>
        <div className="mt-2 h-1 rounded-full bg-sidebar-border" aria-hidden="true">
          <div className="h-full w-0 rounded-full bg-sidebar-primary" />
        </div>
        <button
          type="button"
          className="mt-3 w-full min-h-11 rounded-lg bg-sidebar-primary py-2 text-xs font-semibold text-sidebar-primary-foreground hover:opacity-90 transition-opacity"
        >
          Passer à Pro <span aria-hidden="true">✦</span>
        </button>
      </div>
    </aside>
  )
}