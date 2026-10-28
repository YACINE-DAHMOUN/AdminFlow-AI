import type { Urgency } from "./deadline.types"

 // Miroir exact des enums Prisma (server/prisma/schema.prisma)
export type DocumentType = 'URSSAF' | 'IMPOTS' | 'BANQUE' | 'CONTRAT' | 'FACTURE' | 'COURRIER' | 'OTHER'

export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'ERROR'

// Un document tel que renvoyé par GET /api/documents
export interface DocumentSummary {
  id: string
  name: string
  type: DocumentType
  fileUrl: string
  fileSize: number | null
  mimeType: string | null
  summary: string | null
  status: DocumentStatus
  urgency: Urgency
  createdAt: string
  updatedAt: string
}
 
 