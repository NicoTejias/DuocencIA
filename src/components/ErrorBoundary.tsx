import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
    onReset?: () => void
}

interface State {
    hasError: boolean
    error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[ErrorBoundary]', error, info.componentStack)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null })
        this.props.onReset?.()
    }

    render() {
        if (!this.state.hasError) return this.props.children

        if (this.props.fallback) return this.props.fallback

        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-white font-bold text-lg mb-2">Algo salió mal</h2>
                <p className="text-slate-400 text-sm mb-6 max-w-sm">
                    {this.state.error?.message || 'Ocurrió un error inesperado.'}
                </p>
                <button
                    onClick={this.handleReset}
                    className="flex items-center gap-2 px-5 py-2.5 bg-accent/20 hover:bg-accent/30 border border-accent/30 text-accent-light rounded-xl font-bold text-sm transition-all"
                    aria-label="Reintentar cargar el componente"
                >
                    <RefreshCw className="w-4 h-4" />
                    Reintentar
                </button>
            </div>
        )
    }
}
