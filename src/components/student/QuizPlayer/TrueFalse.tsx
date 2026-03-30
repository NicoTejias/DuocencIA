interface Props {
    currentQ: any
    selectedValue: number | null | undefined
    onAnswer: (value: boolean) => void
}

export default function TrueFalse({ currentQ, selectedValue, onAnswer }: Props) {
    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg md:text-2xl font-black text-white mb-6 md:mb-8 leading-relaxed">
                {currentQ.statement || currentQ.question}
            </h3>
            {currentQ.falsify && (
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 mb-6">
                    <p className="text-amber-300/80 text-xs font-medium">
                        💡 Si es falso, la respuesta correcta sería: <strong className="text-amber-200">{currentQ.falsify}</strong>
                    </p>
                </div>
            )}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
                <button
                    onClick={() => onAnswer(true)}
                    className={`p-6 md:p-8 rounded-2xl border-2 font-black text-lg md:text-xl transition-all active:scale-[0.97] ${
                        selectedValue === 1
                            ? 'bg-green-500/20 border-green-500 text-green-400'
                            : 'bg-green-500/5 border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-500/50'
                    }`}
                >
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl">✅</span>
                        <span>VERDADERO</span>
                    </div>
                </button>
                <button
                    onClick={() => onAnswer(false)}
                    className={`p-6 md:p-8 rounded-2xl border-2 font-black text-lg md:text-xl transition-all active:scale-[0.97] ${
                        selectedValue === 0
                            ? 'bg-red-500/20 border-red-500 text-red-400'
                            : 'bg-red-500/5 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50'
                    }`}
                >
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl">❌</span>
                        <span>FALSO</span>
                    </div>
                </button>
            </div>
        </div>
    )
}
