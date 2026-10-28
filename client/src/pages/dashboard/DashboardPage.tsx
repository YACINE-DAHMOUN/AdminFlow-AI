import { useEffect, useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../store/auth.context'
import { PageHeading } from '../../components/shared/PageHeading'
import { StatCard } from '../../components/shared/StatCard'
import { EmptyState } from '../../components/shared/EmptyState'
import { deadlineService } from '../../services/deadline.service'
import { documentService } from '../../services/document.service'
import type { Deadline } from '../../types/deadline.types'
import type { DocumentSummary } from '../../types/document.types'
import { isActive } from '../../utils/deadline.utils'
import { formatDate } from '../../utils/format'
import { Link } from '@tanstack/react-router'
import { StatusBadge } from '../../components/shared/StatusBadge'


export default function DashboardPage() {
  const { user } = useAuth()

  // ─── 1. États ───
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [documents, setDocuments] = useState<DocumentSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // ─── 2. Chargement des deux listes EN MÊME TEMPS, une seule fois ───
  useEffect(() => {
    const load = async () => {
      try {
        const [deadlinesData, documentsData] = await Promise.all([
          deadlineService.getAll(),
          documentService.getAll(),
        ])
        setDeadlines(deadlinesData)
        setDocuments(documentsData)
      } catch {
        setError('Impossible de charger votre tableau de bord. Vérifiez que le serveur est lancé.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  // ─── Données dérivées : calculées depuis deadlines et documents ───

    // Carte 1 : documents envoyés ce mois-ci (plan FREE = 5 par mois)
    const now = new Date()
    const documentsThisMonth = documents.filter((d) => {
    const created = new Date(d.createdAt)
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length
    const remainingThisMonth = Math.max(0, 5 - documentsThisMonth)

    // Carte 2 : échéances à venir = À venir + Urgent
    const upcoming = deadlines.filter((d) => (d.status === 'PENDING' || d.status === 'URGENT')) 
    const nextDeadline = upcoming[0] 

    // Carte 3 : actions requises = Urgent + En retard
    const overdueCount = deadlines.filter((d) => d.status === 'OVERDUE').length
    const actionCount = deadlines.filter((d) => d.status === 'URGENT' || d.status === 'OVERDUE').length
    // Liste : les 3 prochaines échéances encore actives
    const nextThree = deadlines.filter((d) => isActive(d.status)).slice(0, 3)

  // ─── 3. Affichage ───
  return (
    <div className="max-w-5xl mx-auto">
      <PageHeading
        eyebrow="Accueil"
        title="Tableau de bord"
        description={`Bienvenue, ${user?.email ?? 'utilisateur'}`}
      />

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Chargement de votre tableau de bord…
        </div>
      ) : error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4"
        >
          <AlertCircle className="size-5 text-destructive mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard
  value={documents.length}
  label="Documents analysés"
  sublabel={`${remainingThisMonth} disponibles ce mois`}
  tone="primary"
/>
<StatCard
  value={upcoming.length}
  label="Échéances à venir"
  sublabel={nextDeadline ? `Prochaine : ${formatDate(nextDeadline.dueDate)}` : 'Aucune échéance à venir'}
  tone="highlight"
/>
<StatCard
  tone={actionCount > 0 ? 'alert' : 'success'}
  value={actionCount}
  label="Actions requises"
  sublabel={
  actionCount === 0
    ? 'Tout est à jour'
    : overdueCount > 0
      ? `dont ${overdueCount} en retard`
      : 'À régler sous 7 jours'
}
/>
          </div>
{documents.length === 0 ? (
  <EmptyState />
) : (
  <section aria-labelledby="next-deadlines-title">
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 id="next-deadlines-title" className="font-heading text-lg font-bold text-foreground">
        Prochaines échéances
      </h2>
      <Link to="/deadlines" aria-label="Voir toutes les échéances" className="shrink-0 whitespace-nowrap text-sm font-medium text-primary underline-offset-4 hover:underline ">
        Tout voir
        
      </Link>
    </div>

    {nextThree.length === 0 ? (
      <p className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Rien à régler pour le moment : tout est à jour.
      </p>
    ) : (
      <ul className="space-y-2">
        {nextThree.map((deadline) => (
          <li key={deadline.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{deadline.title}</p>
              <p className="text-sm text-muted-foreground">{formatDate(deadline.dueDate)}</p>
            </div>
            <StatusBadge status={deadline.status} /> 
          </li>
        ))}
      </ul>
    )}
  </section>
)}        </>
      )}
    </div>
  )
}