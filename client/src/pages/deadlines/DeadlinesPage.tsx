import { useEffect, useState } from 'react'
import { AlertCircle, CalendarClock, Check, Loader2 } from 'lucide-react'
import { PageHeading } from '../../components/shared/PageHeading'
import { deadlineService } from '../../services/deadline.service'
import type { Deadline, DeadlineStatus } from '../../types/deadline.types'
import { StatusBadge } from '../../components/shared/StatusBadge'

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

type FilterKey = 'ALL' | 'TODO' | 'OVERDUE' | 'DONE'

const ACTIVE_STATUSES: DeadlineStatus[] = ['PENDING', 'URGENT', 'OVERDUE']
const isActive = (status: DeadlineStatus) => ACTIVE_STATUSES.includes(status)

const FILTERS: { key: FilterKey; label: string; statuses: DeadlineStatus[] | null; emptyText: string }[] = [
  { key: 'ALL', label: 'Toutes', statuses: null, emptyText: 'Aucune échéance.' },
  { key: 'TODO', label: 'À faire', statuses: ACTIVE_STATUSES, emptyText: 'Rien à faire pour le moment : tout est réglé.' },
  { key: 'OVERDUE', label: 'En retard', statuses: ['OVERDUE'], emptyText: 'Aucune échéance en retard.' },
  { key: 'DONE', label: 'Réglées', statuses: ['DONE'], emptyText: 'Aucune échéance réglée pour le moment.' },
]

// Une échéance correspond si pas de filtre, ou si son statut est dans la liste
const matches = (deadline: Deadline, statuses: DeadlineStatus[] | null) =>
  statuses === null || statuses.includes(deadline.status)

export default function DeadlinesPage() {
  // ─── 1. États ─────────────────────────────────────
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const [filter, setFilter] = useState<FilterKey>('ALL') // l'onglet choisi

  const handleMarkAsDone = async (deadline: Deadline) => {
    setPendingId(deadline.id)
    try {
      const updated = await deadlineService.markAsDone(deadline.id)
      setDeadlines((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
      setAnnouncement(`Échéance « ${updated.title} » marquée comme réglée`)
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

  // ─── 3. Données dérivées : calculées, jamais stockées ──
  const activeFilter = FILTERS.find((f) => f.key === filter) ?? FILTERS[0]
  const visibleDeadlines = deadlines.filter((d) => matches(d, activeFilter.statuses))
  const countFor = (statuses: DeadlineStatus[] | null) =>
    deadlines.filter((d) => matches(d, statuses)).length

  // ─── 4. Affichage selon l'état ────────────────────
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
              <CalendarClock className="size-7 text-primary" aria-hidden="true" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2 font-heading">
            Aucune échéance détectée
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Les échéances extraites de vos documents apparaîtront ici automatiquement.
          </p>
        </div>
      ) : (
        <>
          {/* Onglets de filtre : défilent horizontalement sur mobile */}
          <div
            role="group"
            aria-label="Filtrer les échéances"
            className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 py-1 md:-mx-1 md:px-1"
          >
            {FILTERS.map((f) => {
              const isSelected = filter === f.key
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  aria-pressed={isSelected}
                  className={[
                    'inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors',
                    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',                   
                     isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-card text-muted-foreground hover:text-foreground',
                  ].join(' ')}
                >
                  {f.label}
                  <span
                    className={[
                      'rounded-full px-1.5 text-xs tabular-nums',
                      isSelected ? 'bg-primary-foreground/20' : 'bg-muted',
                    ].join(' ')}
                  >
                    {countFor(f.statuses)}
                  </span>
                </button>
              )
            })}
          </div>

          {visibleDeadlines.length === 0 ? (
            // Il y a des échéances, mais aucune dans ce filtre
            <p className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
              {activeFilter.emptyText}
            </p>
          ) : (
            <ul className="space-y-3">
              {visibleDeadlines.map((deadline) => (
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

                  {/* Droite : badge + bouton (seulement pour les échéances actives) */}
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={deadline.status} />
                    {isActive(deadline.status) && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsDone(deadline)}
                        disabled={pendingId === deadline.id}
                        aria-label={`Marquer « ${deadline.title} » comme réglée`}
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm font-medium text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors  outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
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
        </>
      )}
    </div>
  )
}