import { Link, useRouterState } from '@tanstack/react-router'
import { LayoutDashboard, FileText, Upload, CalendarClock, Sparkles } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/documents', label: 'Mes documents', icon: FileText },
  { to: '/upload', label: 'Analyser', icon: Upload },
  { to: '/deadlines', label: 'Échéances', icon: CalendarClock },
]

export default function Sidebar() {
  const { location } = useRouterState()

  return (
    <aside className="flex flex-col w-60 shrink-0 h-screen bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="px-5 pt-6 pb-8">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
            <Sparkles className="size-4 text-sidebar-primary-foreground" />
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
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted">
          Menu
        </p>
        <ul className="space-y-0.5">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={[
                    'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                  ].join(' ')}
                >
                  {isActive && (
                    <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-sidebar-primary" />
                  )}
                  <Icon
                    className={['size-[18px] shrink-0', isActive ? 'text-sidebar-primary' : ''].join(' ')}
                  />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Plan card */}
      <div className="m-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-sidebar-accent-foreground">Plan Gratuit</p>
          <span className="rounded-full bg-sidebar-primary/20 px-2 py-0.5 text-[10px] font-bold text-sidebar-primary">
            FREE
          </span>
        </div>
        <p className="text-[11px] text-sidebar-muted">0 / 5 documents ce mois</p>
        <div className="mt-2 h-1 rounded-full bg-sidebar-border">
          <div className="h-full w-0 rounded-full bg-sidebar-primary" />
        </div>
        <button className="mt-3 w-full rounded-lg bg-sidebar-primary py-2 text-xs font-semibold text-sidebar-primary-foreground hover:opacity-90 transition-opacity">
          Passer à Pro ✦
        </button>
      </div>
    </aside>
  )
}