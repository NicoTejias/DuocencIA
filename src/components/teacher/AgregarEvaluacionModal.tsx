import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Plus, Calendar, Clock, FileText, PenSquare, X } from 'lucide-react'
import { toast } from "sonner"

interface AgregarEvaluacionModalProps {
    courseId: string
    courseName: string
    sections: string[]
    onClose: () => void
}

export default function AgregarEvaluacionModal({ courseId, courseName, sections, onClose }: AgregarEvaluacionModalProps) {
    const createEvaluacion = useMutation(api.evaluaciones.createEvaluacion)

    const [titulo, setTitulo] = useState("")
    const [tipo, setTipo] = useState<"prueba" | "trabajo" | "informe">("prueba")
    const [descripcion, setDescripcion] = useState("")
    const [dia, setDia] = useState(new Date().getDate().toString().padStart(2, '0'))
    const [mes, setMes] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'))
    const [anio, setAnio] = useState(new Date().getFullYear().toString())
    const [horaStr, setHoraStr] = useState("12")
    const [minStr, setMinStr] = useState("00")
    const [puntos, setPuntos] = useState("")
    const [section, setSection] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!titulo.trim()) {
            toast.error("El título es requerido")
            return
        }

        const fechaStr = `${anio}-${mes}-${dia}`
        const fechaTimestamp = new Date(`${fechaStr}T12:00:00`).getTime()

        if (isNaN(fechaTimestamp)) {
            toast.error("La fecha seleccionada no es válida")
            return
        }
            
        setLoading(true)
        try {
            await createEvaluacion({
                course_id: courseId as any,
                titulo: titulo.trim(),
                tipo,
                descripcion: descripcion.trim() || undefined,
                fecha: fechaTimestamp,
                hora: `${horaStr}:${minStr}`,
                puntos: puntos ? parseInt(puntos) : undefined,
                section: section || undefined,
            })

            toast.success("Evaluación agregada correctamente")
            onClose()
        } catch (err: any) {
            toast.error(err.message || "Error al crear evaluación")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-surface border border-white/10 rounded-[2rem] max-w-md w-full p-6 animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary-light" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Nueva Evaluación</h2>
                            <p className="text-xs text-slate-400">{courseName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Tipo */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tipo</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { value: "prueba", label: "Prueba", icon: FileText, color: "red" },
                                { value: "trabajo", label: "Trabajo", icon: PenSquare, color: "primary" },
                                { value: "informe", label: "Informe", icon: FileText, color: "cyan" },
                            ].map((t) => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => setTipo(t.value as any)}
                                    className={`p-3 rounded-xl border text-center transition-all ${
                                        tipo === t.value
                                            ? t.color === "red" ? 'bg-red-500/20 border-red-500 text-red-400'
                                            : t.color === "primary" ? 'bg-primary/20 border-primary text-primary-light'
                                            : 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                    }`}
                                >
                                    <t.icon className="w-4 h-4 mx-auto mb-1" />
                                    <span className="text-[10px] font-bold">{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Título */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Título</label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Ej: Control 1 de Álgebra"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium outline-none focus:border-primary"
                        />
                    </div>

                    {/* Fecha y Hora */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                                <Calendar className="w-3 h-3 inline mr-1" />
                                Fecha (DD/MM/AAAA)
                            </label>
                            <div className="flex gap-1.5">
                                {/* Día */}
                                <select
                                    value={dia}
                                    onChange={(e) => setDia(e.target.value)}
                                    className="w-16 bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-white text-sm font-medium outline-none focus:border-primary appearance-none text-center cursor-pointer"
                                >
                                    {Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(d => (
                                        <option key={d} value={d} className="bg-surface text-white">{d}</option>
                                    ))}
                                </select>
                                
                                {/* Mes */}
                                <select
                                    value={mes}
                                    onChange={(e) => setMes(e.target.value)}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-white text-sm font-medium outline-none focus:border-primary appearance-none cursor-pointer"
                                >
                                    {[
                                        { v: '01', l: 'Enero' }, { v: '02', l: 'Febrero' }, { v: '03', l: 'Marzo' },
                                        { v: '04', l: 'Abril' }, { v: '05', l: 'Mayo' }, { v: '06', l: 'Junio' },
                                        { v: '07', l: 'Julio' }, { v: '08', l: 'Agosto' }, { v: '09', l: 'Septiembre' },
                                        { v: '10', l: 'Octubre' }, { v: '11', l: 'Noviembre' }, { v: '12', l: 'Diciembre' }
                                    ].map(m => (
                                        <option key={m.v} value={m.v} className="bg-surface text-white">{m.l}</option>
                                    ))}
                                </select>

                                {/* Año */}
                                <select
                                    value={anio}
                                    onChange={(e) => setAnio(e.target.value)}
                                    className="w-20 bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-white text-sm font-medium outline-none focus:border-primary appearance-none text-center cursor-pointer"
                                >
                                    {Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() + i).toString()).map(y => (
                                        <option key={y} value={y} className="bg-surface text-white">{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                                <Clock className="w-3 h-3 inline mr-1" />
                                Hora / Minuto (24h)
                            </label>
                            <div className="flex gap-2">
                                <select
                                    value={horaStr}
                                    onChange={(e) => setHoraStr(e.target.value)}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-white text-sm font-medium outline-none focus:border-primary appearance-none text-center cursor-pointer"
                                >
                                    {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(h => (
                                        <option key={h} value={h} className="bg-surface text-white">{h}</option>
                                    ))}
                                </select>
                                <span className="text-white font-bold flex items-center">:</span>
                                <select
                                    value={minStr}
                                    onChange={(e) => setMinStr(e.target.value)}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-white text-sm font-medium outline-none focus:border-primary appearance-none text-center cursor-pointer"
                                >
                                    {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(m => (
                                        <option key={m} value={m} className="bg-surface text-white">{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Puntos */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Puntos (opcional)</label>
                        <input
                            type="number"
                            value={puntos}
                            onChange={(e) => setPuntos(e.target.value)}
                            placeholder="100"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium outline-none focus:border-primary"
                        />
                    </div>

                    {/* Sección */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                            Aplica a Sección
                        </label>
                        <select
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium outline-none focus:border-primary appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-surface text-slate-400">Todas las secciones del curso</option>
                            {sections.map(sec => (
                                <option key={sec} value={sec} className="bg-surface text-white">{sec}</option>
                            ))}
                        </select>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Descripción (opcional)</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Detalles adicionales..."
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium outline-none focus:border-primary resize-none"
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-white/5 border border-white/10 text-slate-400 font-bold rounded-xl hover:bg-white/10 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    Agregar
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}