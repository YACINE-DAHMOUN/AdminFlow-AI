import type { DocumentStatus } from '../../types/document.types'
import { Badge } from './Badge'

// Badge de l'état de l'analyse IA (mêmes couleurs que les échéances pour le même sens)
const ANALYSIS_STATUS: Record<DocumentStatus, { label: string; className: string }> = {
  PENDING: { label: 'En attente', className: 'bg-muted text-muted-foreground' },
  PROCESSING: { label: 'Analyse en cours', className: 'bg-highlight/25 text-highlight-foreground' },
  DONE: { label: 'Analysé', className: 'bg-secondary text-secondary-foreground' },
  ERROR: { label: 'Échec', className: 'bg-destructive/10 text-destructive' },
}
interface StatusBadgeProps {
  status: DocumentStatus
}

export function AnalysisBadge({ status }: StatusBadgeProps) {
  const { label, className } = ANALYSIS_STATUS[status]

  return (
    <Badge className={className}>{label}</Badge>
  )
}