import { useEffect, useState } from 'react'
import { AlertCircle, CalendarClock, Check, Loader2 } from 'lucide-react'
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
  const [pendingId, setPendingId] = useState<string | null>(null)   // l'échéance en cours de traitement
  const [announcement, setAnnouncement] = useState('')              // message lu par le lecteur d'écran


  const handleMarkAsDone = async (deadline: Deadline) => {
  setPendingId(deadline.id)
  try {
    const updated = await deadlineService.markAsDone(deadline.id)
    setDeadlines((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    )
    setAnnouncement(`Échéance "${updated.title}" marquée comme Réglée`)
  } catch {
    setAnnouncement('Impossible de mettre à jour cette échéance')
  } finally {
    setPendingId(null)
  }
}
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
      <p className="sr-only" aria-live="polite">{announcement}</p>


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
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 md:p-14 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-[2]" />
            <div className="relative size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <CalendarClock className="size-7 text-primary "aria-hidden= "true" />
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
          className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Gauche : titre + date */}
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">{deadline.title}</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(deadline.dueDate)} · {TYPE_LABELS[deadline.type]}
            </p>
          </div>

          {/* Droite : badge + bouton (le bouton seulement pour les échéances actives) */}
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={deadline.status} />
            {['PENDING', 'URGENT', 'OVERDUE'].includes(deadline.status) && (
              <button
                type="button"
                onClick={() => handleMarkAsDone(deadline)}
                disabled={pendingId === deadline.id}
                aria-label={`Marquer « ${deadline.title} » comme réglée`}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pendingId === deadline.id ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Check className="size-4" aria-hidden="true" />
                )}
                Réglée
              </button>
            )}
          </div>
        </li>
          ))}
        </ul>
      )}
    </div>
  )
}