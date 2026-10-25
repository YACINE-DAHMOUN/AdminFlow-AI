// Miroir exact des enums Prisma (server/prisma/schema.prisma)
export type DeadlineStatus = 'PENDING' | 'URGENT' | 'DONE' | 'OVERDUE' | 'CANCELLED'

export type DeadlineType = 'URSSAF' | 'IMPOTS' | 'BANQUE' | 'FACTURE' | 'COURRIER' | 'OTHER'

export type Urgency = 'LOW' | 'MEDIUM' | 'HIGH'

// Une échéance telle que renvoyée par GET /api/deadlines
export interface Deadline {
  id: string
  userId: string
  documentId: string | null
  title: string
  description: string | null
  dueDate: string        // ISO, ex. "2026-10-28T00:00:00.000Z"
  status: DeadlineStatus
  urgency: Urgency
  type: DeadlineType
  createdAt: string
  updatedAt: string
}