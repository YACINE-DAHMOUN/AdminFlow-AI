import { useNavigate } from '@tanstack/react-router'
import { LogOut, FileText, Bell, User } from 'lucide-react'
import { useAuth } from '../../store/auth.context'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login' })
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Barre de navigation */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 bg-[#1D4ED8] rounded-lg flex items-center justify-center"
              aria-hidden="true"
            >
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[#0F172A] text-sm">
              AdminFlow AI
            </span>
          </div>

          {/* Actions droite */}
          <div className="flex items-center gap-3">

            {/* Notifications */}
            <button
              aria-label="Notifications"
              className="p-2 text-[#94A3B8] hover:text-[#475569] hover:bg-[#F1F5F9] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-1"
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Profil */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
              <User className="w-4 h-4 text-[#475569]" aria-hidden="true" />
              <span className="text-sm text-[#475569] max-w-[160px] truncate">
                {user?.email ?? 'utilisateur'}
              </span>
              <span className="text-xs px-1.5 py-0.5 bg-[#EFF6FF] text-[#1D4ED8] rounded font-medium">
                {user?.plan ?? 'FREE'}
              </span>
            </div>

            {/* Déconnexion */}
            <button
              onClick={handleLogout}
              aria-label="Se déconnecter"
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:ring-offset-1 min-h-11"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main id="main-content" className="max-w-7xl mx-auto px-6 py-8">

        {/* Message de bienvenue */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#0F172A]">
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm text-[#475569]">
            Bienvenue, <span className="font-medium text-[#0F172A]">{user?.email}</span>
          </p>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Documents analysés', value: '0', sub: '5 disponibles ce mois', color: '#1D4ED8', bg: '#EFF6FF' },
            { label: 'Échéances à venir', value: '0', sub: 'Aucune échéance détectée', color: '#D97706', bg: '#FFFBEB' },
            { label: 'Actions requises', value: '0', sub: 'Tout est à jour', color: '#16A34A', bg: '#F0FDF4' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm"
            >
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3"
                style={{ backgroundColor: stat.bg }}
                aria-hidden="true"
              >
                <span
                  className="text-lg font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </span>
              </div>
              <p className="text-sm font-medium text-[#0F172A]">{stat.label}</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Zone principale vide — sera remplie Phase 6 */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center shadow-sm">
          <div
            className="w-14 h-14 bg-[#EFF6FF] rounded-xl flex items-center justify-center mx-auto mb-4"
            aria-hidden="true"
          >
            <FileText className="w-7 h-7 text-[#1D4ED8]" />
          </div>
          <h2 className="text-base font-semibold text-[#0F172A] mb-2">
            Aucun document analysé
          </h2>
          <p className="text-sm text-[#475569] max-w-sm mx-auto">
            Uploadez votre premier document administratif pour commencer
            l'analyse automatique par IA.
          </p>
          <button
            disabled
            aria-disabled="true"
            title="Disponible en Phase 3"
            className="mt-6 px-4 py-2.5 text-sm font-medium text-white bg-[#1D4ED8] rounded-lg opacity-50 cursor-not-allowed min-h-11"
          >
            Analyser un document
          </button>
          <p className="text-xs text-[#94A3B8] mt-2">
            Fonctionnalité disponible bientôt
          </p>
        </div>
      </main>
    </div>
  )
}