import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useConvexAuth, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Loader2 } from 'lucide-react'

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

export default function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
    const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth()
    const user = useQuery(api.users.getProfile, isAuthenticated ? undefined : 'skip')
    const [waitCount, setWaitCount] = useState(0)

    useEffect(() => {
        if (isAuthLoading) {
            const timer = setTimeout(() => setWaitCount((c) => c + 1), 1500)
            return () => clearTimeout(timer)
        }
    }, [isAuthLoading])

    if (isAuthLoading && waitCount < 2) return <LoadingScreen />

    if (isAuthenticated && user) {
        const userRole = (user as any)?.role || 'student'
        const target = userRole === 'teacher' || userRole === 'admin' ? '/docente' : '/alumno'
        return <Navigate to={target} replace />
    }

    if (!isAuthenticated && waitCount >= 2) return <>{children}</>

    return <>{children}</>
}
