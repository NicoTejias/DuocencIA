import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from '../../convex/_generated/api';
import { ShieldCheck, Loader2, Mail, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function VerificationBanner() {
    const user = useQuery(api.users.getProfile);
    const verify = useMutation(api.users.verifyAccount);
    const { signIn } = useAuthActions();
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    if (!user || user.is_verified) return null;

    const handleSendEmail = async () => {
        if (!user.email) return;
        setLoading(true);
        try {
            await signIn("resend", { email: user.email });
            setSent(true);
            toast.success("Enlace de verificación enviado a " + user.email);
        } catch (err) {
            console.error(err);
            toast.error("Error al enviar el correo. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const handleSimulation = async () => {
        setLoading(true);
        try {
            await verify();
            toast.success("¡Cuenta marcada como verificada (Simulación)!");
        } catch (err) {
            toast.error("Error al verificar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-b border-amber-500/20 px-6 py-3 flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-top duration-500">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-500">
                    <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-center md:text-left">
                    <p className="text-sm font-bold text-amber-200">Verifica tu identidad docente/alumno</p>
                    <p className="text-[10px] text-amber-300/70 font-medium uppercase tracking-wider max-w-md">
                        Confirma tu correo <span className="text-white underline">{user.email}</span> para habilitar el canje de premios y asegurar tu progreso institucional.
                    </p>
                </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
                {!sent ? (
                    <button 
                        onClick={handleSendEmail}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black rounded-lg transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-3 h-3 animate-spin"/> : <Mail className="w-3 h-3" />}
                        ENVIAR ENLACE DE VERIFICACIÓN
                    </button>
                ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/30">
                        <Send className="w-3 h-3" />
                        ¡REVISA TU CORREO!
                    </div>
                )}

                <button 
                   onClick={handleSimulation}
                   disabled={loading}
                   className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-amber-400 text-[10px] font-bold rounded-lg transition-all border border-amber-500/20"
                >
                    ATURDIR (SIMULAR)
                </button>
            </div>
        </div>
    );
}
