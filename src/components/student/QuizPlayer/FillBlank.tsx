interface Props {
    currentQ: any
    selectedValue: number | null | undefined
    onAnswer: (optIdx: number) => void
}

export default function FillBlank({ currentQ, selectedValue, onAnswer }: Props) {
    const sentence = currentQ.question || currentQ.statement || ""
    const parts = sentence.split("__")

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg md:text-2xl font-black text-white mb-4 leading-relaxed">
                {parts.length > 1 ? (
                    <>
                        {parts[0]}
                        <span className="border-b-2 border-accent text-accent-light mx-1 px-2">
                            {selectedValue != null
                                ? (currentQ.options?.[selectedValue as number] || "___")
                                : "___"}
                        </span>
                        {parts.slice(1).join("")}
                    </>
                ) : (
                    currentQ.question || currentQ.statement
                )}
            </h3>
            {currentQ.answer && (
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 mb-6">
                    <p className="text-amber-300/80 text-xs font-medium">
                        💡 Completa la oración seleccionando la respuesta correcta.
                    </p>
                </div>
            )}
            <div className="grid grid-cols-1 gap-3">
                {currentQ.options?.map((opt: string, i: number) => {
                    const isSelected = selectedValue === i
                    return (
                        <button
                            key={i}
                            onClick={() => onAnswer(i)}
                            className={`p-4 md:p-5 rounded-xl border text-left font-semibold transition-all active:scale-[0.98] ${
                                isSelected
                                    ? 'bg-accent/20 border-accent text-white'
                                    : 'bg-white/5 border-white/10 text-slate-300 hover:border-accent/40'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center text-xs font-black shrink-0">
                                    {['A', 'B', 'C', 'D'][i]}
                                </span>
                                <span className="text-sm md:text-base">{opt}</span>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
