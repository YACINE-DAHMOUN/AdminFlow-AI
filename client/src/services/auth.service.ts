import api from './api'
import type { AuthResponse, LoginDto, RegisterDto, User } from '../types/auth.types'

export const authService = {

  async register(data: RegisterDto): Promise<{ user: User }> {
    const response = await api.post<{ success: boolean; data: { user: User } }>(
      '/api/auth/register',
      data
    )
    return response.data.data
  },

  async login(data: LoginDto): Promise<{ user: User }> {
    const response = await api.post<{ success: boolean; data: { user: User } }>(
      '/api/auth/login',
      data
    )
    return response.data.data
  },

  async logout(): Promise<void> {
    await api.post('/api/auth/logout')
  },

  async getMe(): Promise<User> {
    const response = await api.get<{ success: boolean; data: User }>(
      '/api/auth/me'
    )
    return response.data.data
  },
}