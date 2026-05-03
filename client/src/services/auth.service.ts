import api from './api'
import type { AuthResponse, LoginDto, RegisterDto, User } from '../types/auth.types'

const TOKEN_KEY = 'adminflow_token'
const USER_KEY = 'adminflow_user'

export const authService = {

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', data)
    this.saveSession(response.data.data.token, response.data.data.user)
    return response.data
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', data)
    this.saveSession(response.data.data.token, response.data.data.user)
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/api/auth/logout')
    this.clearSession()
  },

  async getMe(): Promise<User> {
    const response = await api.get<{ success: boolean; data: User }>('/api/auth/me')
    return response.data.data
  },

  saveSession(token: string, user: User): void {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  getStoredUser(): User | null {
    const stored = localStorage.getItem(USER_KEY)
    if (!stored) return null
    try {
      return JSON.parse(stored) as User
    } catch {
      return null
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}