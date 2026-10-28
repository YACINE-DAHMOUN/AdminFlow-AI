import type { DeadlineStatus } from '../../types/deadline.types'
import { Badge } from './Badge'

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
    <Badge className={className}>{label}</Badge>
  )
}