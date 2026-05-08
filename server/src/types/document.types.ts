export interface CreateDocumentDto {
  userId: string
  name: string
  fileUrl: string
  fileSize: number
  mimeType: string
}

export interface DocumentResponse {
  id: string
  name: string
  type: string
  fileUrl: string
  fileSize: number | null
  mimeType: string | null
  extractedText: string | null
  summary: string | null
  status: string
  urgency: string
  createdAt: Date
}