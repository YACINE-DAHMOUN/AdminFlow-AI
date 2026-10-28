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

  // Vérification temporaire : À RETIRER avant le commit
  console.log({ deadlines, documents, isLoading, error })

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
          {/* Étape 3 : ces 0 seront remplacés par les vraies valeurs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard value={0} label="Documents analysés" sublabel="5 disponibles ce mois" tone="primary" />
            <StatCard value={0} label="Échéances à venir" sublabel="Aucune échéance détectée" tone="highlight" />
            <StatCard value={0} label="Actions requises" sublabel="Tout est à jour" tone="success" />
          </div>
          <EmptyState />
        </>
      )}
    </div>
  )
}