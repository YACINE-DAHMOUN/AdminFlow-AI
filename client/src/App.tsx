import {
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router'
import { AuthProvider, useAuth } from './store/auth.context'
import ProtectedRoute from './components/shared/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import UploadPage from './pages/documents/UploadPage'
import DocumentsPage from './pages/documents/DocumentsPage'

function RootLayout() {
  return <Outlet />
}

function AuthLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  )
}

const rootRoute = createRootRoute({ component: RootLayout })

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

const protectedLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: AuthLayout,
})

const dashboardRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: '/dashboard',
  component: DashboardPage,
})

const uploadRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: '/upload',
  component: UploadPage,
})

const documentsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: '/documents',
  component: DocumentsPage,
})

// ─── ROUTER — construit APRÈS toutes les routes ───────
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  protectedLayout.addChildren([
    dashboardRoute,
    uploadRoute,
    documentsRoute,
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

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}