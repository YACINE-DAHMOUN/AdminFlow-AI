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

  // Vérifie la session au démarrage via le cookie httpOnly
  useEffect(() => {
  const initAuth = async () => {
    try {
      const currentUser = await authService.getMe()
      setUser(currentUser)
    } catch {
      // 401 = pas de session active — c'est normal au démarrage
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }
  initAuth()
}, [])

  const login = useCallback(async (data: LoginDto) => {
    const result = await authService.login(data)
    setUser(result.user)
  }, [])

  const register = useCallback(async (data: RegisterDto) => {
    const result = await authService.register(data)
    setUser(result.user)
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

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}