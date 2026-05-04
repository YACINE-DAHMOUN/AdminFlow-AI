import {
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router'
import { AuthProvider } from './store/auth.context'
import { useAuth } from './store/auth.context'
import ProtectedRoute from './components/shared/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'

// ─── LAYOUTS ──────────────────────────────────────────

// Layout racine — wrap toute l'app
function RootLayout() {
  return <Outlet />
}

// Layout protégé — vérifie l'auth avant d'afficher
function AuthLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  )
}

// ─── ROUTES ───────────────────────────────────────────

const rootRoute = createRootRoute({
  component: RootLayout,
})

// Route index — redirige selon l'état d'auth
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function IndexRedirect() {
    const { isAuthenticated, isLoading } = useAuth()
    if (isLoading) return null
    if (isAuthenticated) {
      window.location.replace('/dashboard')
    } else {
      window.location.replace('/login')
    }
    return null
  },
})

// Routes publiques
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
})

// Layout protégé
const protectedLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: AuthLayout,
})

// Routes protégées
const dashboardRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: '/dashboard',
  component: DashboardPage,
})

// ─── ROUTER ───────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  protectedLayout.addChildren([
    dashboardRoute,
  ]),
])

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// ─── APP ──────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}