import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { Loader2 } from 'lucide-react'
import { useProfile } from '../../hooks/useProfile'

function LoadingScreen() {
    return (
        <div className="min-h-screen bg-surface flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-slate-400 font-medium">Cargando QuestIA...</p>
            </div>
        </div>
    )
}

interface ProtectedRouteProps {
    children: React.ReactNode
    requiredRole?: string
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { isLoaded, isSignedIn } = useUser()
    const { user, isLoading } = useProfile()
    const location = useLocation()
    const [stuckCount, setStuckCount] = useState(0)

    useEffect(() => {
        if (isLoading || !isSignedIn || user !== null) return
        if (stuckCount > 6) return
        const timer = setTimeout(() => setStuckCount(c => c + 1), 1000)
        return () => clearTimeout(timer)
    }, [user, stuckCount, isLoading, isSignedIn])

    // Still loading Clerk
    if (!isLoaded || isLoading) return <LoadingScreen />

    // Not signed in → login
    if (!isSignedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Profile not yet created (UserSync is running) — wait a bit then redirect
    if (user === null) {
        if (stuckCount > 6) return <Navigate to="/login" replace />
        return <LoadingScreen />
    }

    const userRole = user.role || 'student'
    const isSimulating = localStorage.getItem('questia_simulate_student') === 'true'

    const canAccessAsStudent =
        requiredRole === 'student' &&
        (userRole === 'student' || userRole === 'demo_student' ||
            (isSimulating && (userRole === 'teacher' || userRole === 'demo_teacher' || userRole === 'admin')))

    const isTeacherRole = userRole === 'teacher' || userRole === 'demo_teacher' || userRole === 'admin'

    if (
        requiredRole &&
        !canAccessAsStudent &&
        userRole !== requiredRole &&
        !(requiredRole === 'teacher' && isTeacherRole)
    ) {
        return <Navigate to={isTeacherRole ? '/docente' : '/alumno'} replace />
    }

    return <>{children}</>
}
