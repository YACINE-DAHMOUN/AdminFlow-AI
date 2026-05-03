import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { authService } from '../services/auth.service'
import type { User, LoginDto, RegisterDto } from '../types/auth.types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginDto) => Promise<void>
  register: (data: RegisterDto) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Vérifie la session existante au démarrage
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken()
      if (!token) {
        setIsLoading(false)
        return
      }
      try {
        const currentUser = await authService.getMe()
        setUser(currentUser)
      } catch {
        authService.clearSession()
      } finally {
        setIsLoading(false)
      }
    }
    initAuth()
  }, [])

  const login = useCallback(async (data: LoginDto) => {
    const response = await authService.login(data)
    setUser(response.data.user)
  }, [])

  const register = useCallback(async (data: RegisterDto) => {
    const response = await authService.register(data)
    setUser(response.data.user)
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const currentUser = await authService.getMe()
    setUser(currentUser)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook personnalisé — usage : const { user, login } = useAuth()
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}