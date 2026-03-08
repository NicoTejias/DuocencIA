import { Routes, Route, Navigate } from 'react-router-dom'
import { useConvexAuth } from "convex/react"
import { useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import { Loader2 } from 'lucide-react'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import BelbinTest from './pages/BelbinTest'
import RewardStorePage from './pages/RewardStorePage'
import NotFoundPage from './pages/NotFoundPage'
import { Toaster } from 'sonner'

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-slate-400 font-medium">Cargando...</p>
      </div>
    </div>
  )
}

// Componente que protege rutas que requieren autenticación
function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  const { isLoading, isAuthenticated } = useConvexAuth()
  const user = useQuery(api.users.getProfile)

  console.log("ProtectedRoute:", { isLoading, isAuthenticated, user: user ? "doc" : user });

  if (isLoading) return <LoadingScreen />
  if (!isAuthenticated) return <Navigate to="/login" replace />

  // Si estamos autenticados pero el perfil no carga, esperamos.
  // Si carga como null (no encontrado en DB), mandamos a login.
  if (user === undefined) return <LoadingScreen />
  if (user === null) return <Navigate to="/login" replace />

  // Si se requiere un rol específico, verificar
  if (requiredRole && (user as any).role !== requiredRole) {
    const target = (user as any).role === 'teacher' ? '/docente' : '/alumno'
    // console.log("ProtectedRoute redirect to:", target);
    return <Navigate to={target} replace />
  }

  return <>{children}</>
}

// Componente que redirige a usuarios ya autenticados
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth()
  const user = useQuery(api.users.getProfile, isAuthenticated ? undefined : "skip")

  console.log("PublicOnlyRoute:", { isLoading, isAuthenticated, user: user ? "doc" : user });

  if (isLoading) return <LoadingScreen />

  // Si está autenticado, esperamos el perfil para saber a dónde mandarlo
  if (isAuthenticated && user === undefined) return <LoadingScreen />

  if (isAuthenticated && user) {
    const target = (user as any).role === 'teacher' ? '/docente' : '/alumno'
    // console.log("PublicOnlyRoute redirecting to:", target);
    return <Navigate to={target} replace />
  }

  return <>{children}</>
}

// Redirige al dashboard correcto según el rol del usuario
function DashboardRedirect() {
  const { isLoading, isAuthenticated } = useConvexAuth()
  const user = useQuery(api.users.getProfile, isAuthenticated ? undefined : "skip")

  console.log("DashboardRedirect:", { isLoading, isAuthenticated, user: user ? "doc" : user });

  if (isLoading) return <LoadingScreen />
  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (user === undefined) return <LoadingScreen />
  if (user === null) return <Navigate to="/login" replace />

  const target = (user as any).role === 'teacher' ? '/docente' : '/alumno'
  return <Navigate to={target} replace />
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        } />

        <Route path="/registro" element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        } />

        <Route path="/alumno" element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/docente" element={
          <ProtectedRoute requiredRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        } />

        <Route path="/test-belbin" element={
          <ProtectedRoute>
            <BelbinTest />
          </ProtectedRoute>
        } />

        <Route path="/tienda/:courseId" element={
          <ProtectedRoute>
            <RewardStorePage />
          </ProtectedRoute>
        } />

        {/* Ruta inteligente que redirige al dashboard correcto según el rol */}
        <Route path="/dashboard" element={
          <DashboardRedirect />
        } />

        {/* 404 Catch-all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="top-right" theme="dark" richColors />
    </>
  )
}

export default App
