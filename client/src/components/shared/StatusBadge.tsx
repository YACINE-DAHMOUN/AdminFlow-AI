import type { DeadlineStatus } from '../../types/deadline.types'

// Hors du composant : créé une seule fois, pas à chaque rendu
const STATUS_CONFIG: Record<DeadlineStatus, { label: string; className: string }> = {
  OVERDUE:   { label: 'En retard', className: 'bg-destructive/10 text-destructive' },
  URGENT:    { label: 'Urgent',    className: 'bg-highlight/25 text-highlight-foreground' },
  PENDING:   { label: 'À venir',   className: 'bg-primary/10 text-primary' },
  DONE:      { label: 'Réglée',    className: 'bg-secondary text-secondary-foreground' },
  CANCELLED: { label: 'Annulée',   className: 'bg-muted text-muted-foreground' },
}

interface StatusBadgeProps {
  status: DeadlineStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = STATUS_CONFIG[status]

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${className}`}
    >
      {label}
    </span>
  )
}