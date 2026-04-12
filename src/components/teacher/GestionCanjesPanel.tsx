import { useState } from 'react'
import { Loader2, Gift, CheckCircle, Search, Calendar, User, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { useProfile } from '../../hooks/useProfile'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import { RewardsAPI } from '../../lib/api'

export default function GestionCanjesPanel() {
    const { user } = useProfile()
    const [filter, setFilter] = useState<'pending' | 'completed'>('pending')
    const [selectedSection, setSelectedSection] = useState<string>('all')
    const [searchTerm, setSearchTerm] = useState('')
    
    const { data: redemptions, refetch, isLoading } = useSupabaseQuery(
        () => user ? RewardsAPI.getTeacherRedemptions(user.clerk_id, filter) : Promise.resolve([]),
        [user, filter]
    )

    const [processingId, setProcessingId] = useState<string | null>(null)

    const handleDeliver = async (id: any) => {
        if (!user) return
        setProcessingId(id)
        try {
            await RewardsAPI.markRedemptionDelivered(id)
            toast.success("Recompensa marcada como entregada")
            refetch()
        } catch (err: any) {
            toast.error(err.message || "Error al procesar el canje")
        } finally {
            setProcessingId(null)
        }
    }

    // Obtener secciones únicas para el filtro
    const sections = ['all', ...new Set((redemptions || []).map(r => r.section || 'Sin Sección'))]

    const filtered = (redemptions || []).filter(r => {
        const matchesSearch = 
            r.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.reward_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.course_name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesSection = selectedSection === 'all' || r.section === selectedSection;
        
        return matchesSearch && matchesSection;
    })

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex bg-surface-light border border-white/5 p-1 rounded-xl shadow-inner">
                    <button 
                        onClick={() => setFilter('pending')}
                        className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${filter === 'pending' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        PENDIENTES
                    </button>
                    <button 
                        onClick={() => setFilter('completed')}
                        className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${filter === 'completed' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        ENTREGADOS
                    </button>
                </div>

                <div className="flex-1 w-full max-w-md relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-accent transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Buscar por alumno, premio o ramo..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface-light border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-all placeholder:text-slate-600 shadow-inner"
                    />
                </div>
            </div>

            {/* Filtro de Secciones */}
            {sections.length > 2 && (
                <div className="flex flex-wrap gap-2 p-1 bg-white/5 border border-white/5 rounded-2xl overflow-x-auto no-scrollbar">
                    {sections.map(section => (
                        <button
                            key={section}
                            onClick={() => setSelectedSection(section)}
                            className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap border
                                ${selectedSection === section 
                                    ? 'bg-primary/20 text-primary border-primary/30 shadow-sm shadow-primary/10' 
                                    : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5'
                                }`}
                        >
                            {section === 'all' ? 'TODAS LAS SECCIONES' : section}
                        </button>
                    ))}
                </div>
            )}

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-surface-light border border-white/5 rounded-3xl">
                    <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
                    <p className="text-slate-400 animate-pulse">Cargando canjes...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-surface-light border border-dashed border-white/10 rounded-3xl p-16 text-center shadow-xl">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Gift className="w-10 h-10 text-slate-700" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2 tracking-tight">No hay canjes {filter === 'pending' ? 'pendientes' : 'entregados'}</h4>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium">
                        {searchTerm ? 'No se encontraron resultados para tu búsqueda.' : filter === 'pending' ? '¡Todo al día! No tienes recompensas por entregar en este momento.' : 'Aún no has entregado ninguna recompensa.'}
                    </p>
                </div>
            ) : (
                <div className="bg-surface-light border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black/20 border-b border-white/5">
                                <tr className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.15em]">
                                    <th className="px-6 py-5">Alumno</th>
                                    <th className="px-6 py-5">Recompensa</th>
                                    <th className="px-6 py-5">Ramo</th>
                                    <th className="px-6 py-5 text-center">Sección</th>
                                    <th className="px-6 py-5">Fecha</th>
                                    <th className="px-6 py-5 text-right uppercase">Estado / Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filtered.map((r: any) => (
                                    <tr key={r._id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                                                    <User className="w-4 h-4 text-accent-light" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white group-hover:text-accent-light transition-colors">{r.student_name}</p>
                                                    <p className="text-[10px] text-slate-500 font-medium">{r.student_email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Gift className="w-4 h-4 text-primary opacity-60" />
                                                <span className="text-sm font-black text-white italic">{r.reward_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-3 h-3 text-slate-600" />
                                                <span className="text-xs text-slate-400 font-bold">{r.course_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                {r.section || "---"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Calendar className="w-3 h-3" />
                                                <span className="text-xs font-medium">
                                                    {new Date(r.timestamp).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {r.status === 'pending' ? (
                                                <button 
                                                    onClick={() => handleDeliver(r._id)}
                                                    disabled={processingId === r._id}
                                                    className="bg-accent hover:bg-accent-light disabled:opacity-50 text-white text-[10px] font-black px-4 py-2 rounded-xl transition-all shadow-lg shadow-accent/20 uppercase tracking-widest flex items-center gap-2 ml-auto"
                                                >
                                                    {processingId === r._id ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="w-3 h-3" />
                                                    )}
                                                    ENTREGAR
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-1.5 justify-end text-green-500 font-black text-[10px] uppercase tracking-widest">
                                                    <CheckCircle className="w-4 h-4" />
                                                    ENTREGADO
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
