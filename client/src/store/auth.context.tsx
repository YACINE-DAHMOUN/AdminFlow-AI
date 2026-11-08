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
import {setSessionExpiredHandler} from '../services/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginDto) => Promise<void>
  register: (data: RegisterDto) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  sessionExpired: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionExpired, setSessionExpired] = useState(false) 

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getMe()
        setUser(currentUser)
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    initAuth()
  }, [])

   useEffect(() => {
    setSessionExpiredHandler(() => {
      setUser(null)            // → ProtectedRoute redirige vers /login
      setSessionExpired(true)  // → LoginPage affichera le message
    })

    return () => setSessionExpiredHandler(null)   // nettoyage
  }, [])

  const login = useCallback(async (data: LoginDto) => {
    const result = await authService.login(data)
    setUser(result.user)
    setSessionExpired(false)
  }, [])

  const register = useCallback(async (data: RegisterDto) => {
    const result = await authService.register(data)
    setSessionExpired(false)
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
        sessionExpired,
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