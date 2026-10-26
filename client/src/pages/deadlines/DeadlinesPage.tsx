import { useEffect, useState } from 'react'
import { AlertCircle, CalendarClock, Loader2 } from 'lucide-react'
import { PageHeading } from '../../components/shared/PageHeading'
import { deadlineService } from '../../services/deadline.service'
import type { Deadline } from '../../types/deadline.types'
import {StatusBadge} from "../../components/shared/StatusBadge";

// Libellés lisibles pour les types d'échéance
const TYPE_LABELS: Record<Deadline['type'], string> = {
  URSSAF: 'URSSAF',
  IMPOTS: 'Impôts',
  BANQUE: 'Banque',
  FACTURE: 'Facture',
  COURRIER: 'Courrier',
  OTHER: 'Autre',
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

export default function DeadlinesPage() {
  // ─── 1. États ─────────────────────────────────────
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // ─── 2. Chargement des données au montage ─────────
  useEffect(() => {
    const load = async () => {
      try {
        const data = await deadlineService.getAll()
        setDeadlines(data)
      } catch {
        setError('Impossible de charger les échéances. Vérifiez que le serveur est lancé.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  // ─── 3. Affichage selon l'état ────────────────────
  return (
    <div className="max-w-5xl mx-auto">
      <PageHeading
        eyebrow="Calendrier"
        title="Échéances"
        description="Suivez toutes vos échéances fiscales et administratives"
      />

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Chargement des échéances…
        </div>
      ) : error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4"
        >
          <AlertCircle className="size-5 text-destructive mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      ) : deadlines.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-14 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-[2]" />
            <div className="relative size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <CalendarClock className="size-7 text-primary" />
            </div>
          </div>
          <h2
            className="text-lg font-bold text-foreground mb-2"
            style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
          >
            Aucune échéance détectée
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Les échéances extraites de vos documents apparaîtront ici automatiquement.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {deadlines.map((deadline) => (
            <li
              key={deadline.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
            >
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">{deadline.title}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(deadline.dueDate)} · {TYPE_LABELS[deadline.type]}
                </p>
              </div>
              <StatusBadge status={deadline.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}