import { useAuth } from '../../store/auth.context'
import { PageHeading } from '../../components/shared/PageHeading'
import { StatCard } from '../../components/shared/StatCard'
import { EmptyState } from '../../components/shared/EmptyState'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeading
        eyebrow="Accueil"
        title="Tableau de bord"
        description={`Bienvenue, ${user?.email ?? 'utilisateur'}`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          value={0}
          label="Documents analysés"
          sublabel="5 disponibles ce mois"
          tone="primary"
        />
        <StatCard
          value={0}
          label="Échéances à venir"
          sublabel="Aucune échéance détectée"
          tone="highlight"
        />
        <StatCard
          value={0}
          label="Actions requises"
          sublabel="Tout est à jour"
          tone="success"
        />
      </div>

      <EmptyState />
    </div>
  )
}