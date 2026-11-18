import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { authService } from "../services/auth.service";
import type { User, LoginDto, RegisterDto } from "../types/auth.types";
import { setSessionExpiredHandler } from "../services/api";
import { broadcastSession, onSessionMessage } from "../services/sessionChannel";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpired: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshUser: () => Promise<void>;
  expireSession: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const expireSession = useCallback(() => {
    setUser(null);
    setSessionExpired(true);
    broadcastSession({ type: "expired" });
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getMe();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(expireSession); // ← on passe la fonction, sans l'appeler
    return () => setSessionExpiredHandler(null);
  }, [expireSession]); // ← la dépendance

  useEffect(() => {
    return onSessionMessage((message) => {
      if (message.type === "logout") {
        setUser(null);
        setSessionExpired(false);
      }
      if (message.type === "expired") {
        setUser(null);
        setSessionExpired(true);
      }
      if (message.type === "login") {
        setSessionExpired(false);
        authService.getMe().then(setUser).catch(() => {
          setUser(null);
        });
      }
    });
  }, []);


  const login = useCallback(async (data: LoginDto) => {
    const result = await authService.login(data);
    setUser(result.user);
    setSessionExpired(false);
    broadcastSession({ type: 'login' });
  }, []);

  
  const register = useCallback(async (data: RegisterDto) => {
    const result = await authService.register(data);
    setSessionExpired(false);
    setUser(result.user);
    broadcastSession({ type: 'login' });

  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    broadcastSession({ type: 'logout' });
  }, []);

  const logoutAll = useCallback(async () => {
    await authService.logoutAll();
    setUser(null);
    broadcastSession({ type: 'logout' });
  }, []);

  const refreshUser = useCallback(async () => {
    const currentUser = await authService.getMe();
    setUser(currentUser);
  }, []);

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
        logoutAll,
        refreshUser,
        expireSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
