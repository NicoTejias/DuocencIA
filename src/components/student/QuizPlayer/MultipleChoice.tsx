import { Clock, Zap } from 'lucide-react'

interface Props {
    currentQ: any
    selectedValue: number | null | undefined
    quizType: string
    timeLeft: number
    onAnswer: (optIdx: number) => void
}

export default function MultipleChoice({ currentQ, selectedValue, quizType, timeLeft, onAnswer }: Props) {
    const isTimedMode = quizType === 'quiz_sprint' || quizType === 'trivia'

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {quizType === 'quiz_sprint' && (
                <div className="flex items-center justify-center gap-2 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    <Clock className={`w-5 h-5 text-red-400 ${timeLeft <= 5 ? 'animate-pulse' : ''}`} />
                    <span className="text-2xl font-black text-red-400">{timeLeft}s</span>
                    {timeLeft <= 5 && <Zap className="w-4 h-4 text-red-400 animate-pulse" />}
                </div>
            )}
            {quizType === 'trivia' && (
                <div className="flex items-center justify-center gap-2 mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                    <Zap className={`w-5 h-5 text-yellow-400 ${timeLeft <= 5 ? 'animate-pulse' : ''}`} />
                    <span className="text-2xl font-black text-yellow-400">{timeLeft}s</span>
                    {timeLeft <= 5 && <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />}
                </div>
            )}
            {currentQ.fun_fact && quizType === 'trivia' && (
                <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-3 mb-4">
                    <p className="text-cyan-300/80 text-xs">⚡ {currentQ.fun_fact}</p>
                </div>
            )}
            <h3 className={`font-black text-white mb-6 leading-relaxed ${isTimedMode ? 'text-lg md:text-2xl' : 'text-xl md:text-3xl'} md:mb-8`}>
                {currentQ.question}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {currentQ.options?.map((opt: string, i: number) => {
                    const isSelected = selectedValue === i
                    const btnCls = isSelected
                        ? 'bg-accent/20 border-accent text-white'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-accent/40'
                    return (
                        <button
                            key={i}
                            onClick={() => onAnswer(i)}
                            className={`p-4 md:p-6 rounded-xl md:rounded-2xl border text-left font-semibold transition-all ${btnCls} active:scale-[0.98]`}
                        >
                            <div className="flex items-center gap-3 md:gap-4">
                                <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/20 flex items-center justify-center text-sm font-black shrink-0">
                                    {['A', 'B', 'C', 'D'][i]}
                                </span>
                                <span className="text-base md:text-lg">{opt}</span>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
