import api from './api'
import type { DocumentSummary } from '../types/document.types'

// L'API des documents renvoie les objets directement (pas d'enveloppe { success, data })
export const documementService = {
  async getAll(): Promise<DocumentSummary[]> {
    const response = await api.get<{ success: boolean; data: DocumentSummary[] }>(`/api/documents`) 
    return response.data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/documents/${id}`)
  },
}