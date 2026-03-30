import { ChevronUp, ChevronDown } from 'lucide-react'

interface Props {
    currentQ: any
    stepOrder: number[]
    onMove: (fromIdx: number, direction: 'up' | 'down') => void
    onConfirm: () => void
}

export default function OrderSteps({ currentQ, stepOrder, onMove, onConfirm }: Props) {
    const steps = stepOrder.length > 0
        ? stepOrder.map((i) => currentQ.steps?.[i] || "")
        : (currentQ.steps || [])

    return (
        <div className="animate-in fade-in duration-300">
            <h3 className="text-lg md:text-xl font-bold text-white mb-2 text-center">
                {currentQ.description || "Ordena los pasos correctamente"}
            </h3>
            <p className="text-slate-500 text-sm text-center mb-6">Toca las flechas para mover cada paso ↑↓</p>
            <div className="space-y-2">
                {steps.map((step: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3 md:p-4">
                        <span className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs font-black text-accent-light shrink-0">
                            {i + 1}
                        </span>
                        <span className="flex-1 text-white text-sm md:text-base font-medium pl-2">{step}</span>
                        <div className="flex flex-col gap-0.5 shrink-0">
                            <button
                                onClick={() => onMove(i, 'up')}
                                disabled={i === 0}
                                className="p-1 bg-white/5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-all disabled:opacity-20"
                            >
                                <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onMove(i, 'down')}
                                disabled={i === steps.length - 1}
                                className="p-1 bg-white/5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-all disabled:opacity-20"
                            >
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={onConfirm}
                className="w-full mt-6 bg-accent/20 border border-accent/40 text-accent-light hover:bg-accent/30 font-bold py-4 rounded-xl transition-all active:scale-[0.98]"
            >
                Confirmar Orden
            </button>
        </div>
    )
}
