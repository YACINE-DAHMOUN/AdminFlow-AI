import api from './api'
import type { AuthResponse, LoginDto, RegisterDto, User } from '../types/auth.types'

export const authService = {

  async register(data: RegisterDto): Promise<{ message:string}> {
    const response = await api.post<{ success: boolean; message: string }>(
      '/api/auth/register',
      data
    )
    return response.data
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

  async logoutAll(): Promise<void> {
    await api.post('/api/auth/logout-all')
  },

  async getMe(): Promise<User> {
    const response = await api.get<{ success: boolean; data: User }>(
      '/api/auth/me'
    )
    return response.data.data
  },
}