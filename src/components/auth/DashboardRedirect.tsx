import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Loader2, ShieldAlert } from 'lucide-react'
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

export default function DashboardRedirect() {
    const { user, isLoading, isAuthenticated } = useProfile()
    const [isStuck, setIsStuck] = useState(false)
    const [hasRetried, setHasRetried] = useState(false)
    const [waitCount, setWaitCount] = useState(0)

    useEffect(() => {
        if (!isAuthenticated && !isLoading && !hasRetried && waitCount < 3) {
            const timer = setTimeout(() => setWaitCount((c) => c + 1), 2000)
            return () => clearTimeout(timer)
        }
    }, [isLoading, isAuthenticated, hasRetried, waitCount])

    useEffect(() => {
        if (isLoading) return
        const timer = setTimeout(() => {
            if (user === null && isAuthenticated && !hasRetried) setIsStuck(true)
        }, 8000)
        return () => clearTimeout(timer)
    }, [isLoading, isAuthenticated, user, hasRetried])

    const handleRetry = () => {
        setIsStuck(false)
        setHasRetried(true)
        window.location.reload()
    }

    if (isLoading) return <LoadingScreen />
    if (!isAuthenticated && waitCount < 3) return <LoadingScreen />
    if (!isAuthenticated) return <Navigate to="/login" replace />

    if (user === null) {
        if (isStuck) {
            return (
                <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
                    <ShieldAlert className="w-16 h-16 text-amber-500 mb-4" />
                    <h1 className="text-xl font-bold text-white mb-2">Problema al cargar tu perfil</h1>
                    <p className="text-slate-400 text-sm mb-6">
                        Estamos tardando más de lo normal. Esto puede ser por:<br />
                        • Tu correo no es institucional<br />
                        • Problemas de conexión<br />
                        • La cuenta no está registrada en QuestIA
                    </p>
                    <div className="space-y-3 w-full max-w-xs">
                        <button
                            onClick={handleRetry}
                            className="w-full bg-white/10 text-white font-bold py-3 rounded-xl border border-white/5"
                        >
                            Reintentar
                        </button>
                        <button
                            onClick={() => {
                                localStorage.clear()
                                window.location.href = '/login'
                            }}
                            className="w-full bg-red-500/20 text-red-500 font-bold py-3 rounded-xl border border-red-500/20"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            )
        }
        return <LoadingScreen />
    }

    const userRole = user.role || 'student'
    const isTeacherRole = userRole === 'teacher' || userRole === 'admin' || userRole === 'demo_teacher'
    const target = isTeacherRole ? '/docente' : '/alumno'
    return <Navigate to={target} replace />
}
