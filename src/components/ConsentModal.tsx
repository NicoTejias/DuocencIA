import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Shield, FileText, Check, ExternalLink, Sparkles } from 'lucide-react'

export default function ConsentModal() {
    const [checked, setChecked] = useState(false)
    const [loading, setLoading] = useState(false)
    const acceptTerms = useMutation(api.users.acceptTerms)

    const handleAccept = async () => {
        if (!checked || loading) return
        setLoading(true)
        try {
            await acceptTerms()
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] bg-surface flex items-center justify-center p-4">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)_0%,_transparent_50%)] opacity-10 pointer-events-none" />

            <div className="relative w-full max-w-lg bg-surface-light border border-white/10 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-br from-primary/20 to-transparent border-b border-white/5 px-8 pt-8 pb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/20">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tighter italic">
                            Quest<span className="text-primary">IA</span>
                        </span>
                    </div>
                    <h1 className="text-xl font-bold text-white">Bienvenido/a a QuestIA</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Antes de continuar, necesitamos tu consentimiento sobre cómo usamos tus datos.
                    </p>
                </div>

                {/* Body */}
                <div className="px-8 py-6 space-y-4">
                    {/* Privacy summary */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                        <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-primary-light shrink-0 mt-0.5" />
                            <div>
                                <p className="text-white text-sm font-semibold">¿Qué datos recopilamos?</p>
                                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                                    Nombre, correo electrónico, RUT (opcional), actividad en la plataforma (puntajes, quizzes)
                                    y perfiles de aprendizaje. <strong className="text-slate-300">No vendemos tus datos.</strong>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-accent-light shrink-0 mt-0.5" />
                            <div>
                                <p className="text-white text-sm font-semibold">¿Para qué los usamos?</p>
                                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                                    Exclusivamente para prestarte el servicio educativo: vincular tu cuenta a tus ramos,
                                    mostrar tu puntaje y enviarte notificaciones de tu curso.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-4 text-xs">
                        <Link
                            to="/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary-light hover:text-white transition-colors font-medium"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Términos y Condiciones
                        </Link>
                        <span className="text-slate-700">·</span>
                        <Link
                            to="/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary-light hover:text-white transition-colors font-medium"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Política de Privacidad
                        </Link>
                    </div>

                    {/* Checkbox */}
                    <button
                        onClick={() => setChecked(c => !c)}
                        className="w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left
                            hover:bg-white/5 active:scale-[0.99]
                            border-white/10 hover:border-primary/30"
                    >
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                            checked
                                ? 'bg-primary border-primary'
                                : 'bg-transparent border-white/20'
                        }`}>
                            {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            He leído y acepto los{' '}
                            <span className="text-white font-semibold">Términos y Condiciones</span>
                            {' '}y la{' '}
                            <span className="text-white font-semibold">Política de Privacidad</span>
                            {' '}de QuestIA. Autorizo el tratamiento de mis datos personales conforme a la Ley N° 19.628.
                        </p>
                    </button>
                </div>

                {/* Footer */}
                <div className="px-8 pb-8">
                    <button
                        onClick={handleAccept}
                        disabled={!checked || loading}
                        className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary
                            text-white font-bold py-4 rounded-2xl transition-all
                            disabled:opacity-40 disabled:cursor-not-allowed
                            enabled:hover:shadow-xl enabled:hover:shadow-primary/25
                            enabled:active:scale-[0.98]
                            flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="animate-pulse">Guardando...</span>
                        ) : (
                            <>
                                <Check className="w-5 h-5" />
                                Acepto y quiero continuar
                            </>
                        )}
                    </button>
                    <p className="text-center text-slate-600 text-xs mt-3">
                        Debes aceptar para usar QuestIA. Puedes revocar en cualquier momento escribiendo a privacidad@questia.cl
                    </p>
                </div>
            </div>
        </div>
    )
}
