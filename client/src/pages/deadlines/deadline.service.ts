import api from '../../services/api'
import type { Deadline } from '../../types/deadline.types'



// L'API des échéances renvoie les objets directement (pas d'enveloppe { success, data })
export const deadlineService = {
  async getAll(): Promise<Deadline[]> {
    const response = await api.get<Deadline[]>('/api/deadlines')
    return response.data
  },

  async markAsDone(id: string): Promise<Deadline> {
    const response = await api.patch<Deadline>(`/api/deadlines/${id}/done`)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/deadlines/${id}`)
  },
}