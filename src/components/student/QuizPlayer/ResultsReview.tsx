import { CheckCircle2 } from 'lucide-react'

interface Props {
    questions: any[]
    quizType: string
    selectedOptions: any[]
}

export default function ResultsReview({ questions, quizType, selectedOptions }: Props) {
    return (
        <div className="space-y-4 md:space-y-6">
            {questions.map((q: any, i: number) => {
                const selected = selectedOptions?.[i]
                return (
                    <div key={i} className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/5">
                        <div className="flex items-start gap-3 md:gap-4 mb-3">
                            <span className="text-accent-light font-black text-sm shrink-0">{i + 1}.</span>
                            <div className="flex-1">
                                {quizType === 'true_false' && q.statement && <p className="text-white font-bold text-sm md:text-base mb-2">{q.statement}</p>}
                                {quizType === 'order_steps' && q.description && <p className="text-white font-bold text-sm md:text-base mb-2">{q.description}</p>}
                                {quizType === 'memory' && <p className="text-white font-bold text-sm md:text-base mb-2">Pareja {Math.floor(i / 2) + 1}</p>}
                                {quizType === 'word_search' && <p className="text-white font-bold text-sm md:text-base mb-2">Palabras: {q.words?.join(', ')}</p>}
                                {(quizType === 'trivia' || quizType === 'multiple_choice' || quizType === 'fill_blank' || quizType === 'quiz_sprint') && q.question && (
                                    <p className="text-white font-bold text-sm md:text-base mb-2">{q.question}</p>
                                )}
                                {quizType === 'match' && q.front && (
                                    <div className="space-y-2">
                                        <div className="bg-white/5 p-2 rounded-lg"><span className="text-accent-light text-xs">Concepto: </span><span className="text-white text-sm">{q.front}</span></div>
                                        <div className="bg-white/5 p-2 rounded-lg"><span className="text-accent-light text-xs">Definición: </span><span className="text-slate-300 text-sm">{q.back}</span></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Multiple choice / trivia / quiz_sprint options */}
                        {(quizType === 'multiple_choice' || quizType === 'trivia' || quizType === 'quiz_sprint') && q.options && (
                            <div className="grid grid-cols-1 gap-2">
                                {q.options.map((opt: string, optIdx: number) => {
                                    const isCorrect = optIdx === q.correct
                                    const isChosen = optIdx === selected
                                    let cls = 'text-xs md:text-sm p-2.5 md:p-3 rounded-lg border '
                                    if (isCorrect) cls += 'bg-green-500/10 border-green-500/30 text-green-400'
                                    else if (isChosen) cls += 'bg-red-500/10 border-red-500/30 text-red-400'
                                    else cls += 'bg-white/5 border-transparent text-slate-500'
                                    return (
                                        <div key={optIdx} className={cls}>
                                            {opt}
                                            {isCorrect && <span className="ml-2 text-[10px] font-black uppercase opacity-70">(Correcta)</span>}
                                            {isChosen && !isCorrect && <span className="ml-2 text-[10px] font-black uppercase opacity-70">(Tu elección)</span>}
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* Fill blank options */}
                        {quizType === 'fill_blank' && q.options && (
                            <div className="grid grid-cols-1 gap-2">
                                {q.options.map((opt: string, optIdx: number) => {
                                    const correctIdx = q.options.indexOf(q.answer)
                                    const isCorrect = optIdx === correctIdx
                                    const isChosen = optIdx === selected
                                    let cls = 'text-xs md:text-sm p-2.5 md:p-3 rounded-lg border '
                                    if (isCorrect) cls += 'bg-green-500/10 border-green-500/30 text-green-400'
                                    else if (isChosen) cls += 'bg-red-500/10 border-red-500/30 text-red-400'
                                    else cls += 'bg-white/5 border-transparent text-slate-500'
                                    return (
                                        <div key={optIdx} className={cls}>
                                            {opt}
                                            {isCorrect && <span className="ml-2 text-[10px] font-black uppercase opacity-70">(Correcta)</span>}
                                            {isChosen && !isCorrect && <span className="ml-2 text-[10px] font-black uppercase opacity-70">(Tu elección)</span>}
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* True/False review */}
                        {quizType === 'true_false' && (
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className={`p-3 rounded-lg border text-center font-bold text-sm ${selected === 1 ? (q.correct === true ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400') : q.correct === true ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/5 border-transparent text-slate-500'}`}>
                                        ✅ Verdadero {selected === 1 && '(Tu respuesta)'}
                                    </div>
                                    <div className={`p-3 rounded-lg border text-center font-bold text-sm ${selected === 0 ? (!q.correct ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400') : !q.correct ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/5 border-transparent text-slate-500'}`}>
                                        ❌ Falso {selected === 0 && '(Tu respuesta)'}
                                    </div>
                                </div>
                                {!q.correct && q.falsify && (
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                                        <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">La afirmación es FALSA. La versión correcta es:</p>
                                        <p className="text-sm text-amber-200 font-medium leading-relaxed">{q.falsify}</p>
                                    </div>
                                )}
                                {q.correct && (
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                                        <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">✅ Esta afirmación es VERDADERA</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Order steps review */}
                        {quizType === 'order_steps' && q.steps && (
                            <div className="space-y-1">
                                <p className="text-[10px] text-slate-500 font-black uppercase mb-2">Orden esperado:</p>
                                {q.steps.map((s: string, si: number) => {
                                    const isCorrectPos = Array.isArray(selected) && selected[si] === si
                                    return (
                                        <div key={si} className={`p-2 rounded-lg border text-sm flex items-center gap-2 ${isCorrectPos ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/5'}`}>
                                            <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px] font-black shrink-0">{si + 1}</span>
                                            <span className={isCorrectPos ? 'text-green-300' : 'text-slate-400'}>{s}</span>
                                            {isCorrectPos && <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto shrink-0" />}
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* Memory review */}
                        {quizType === 'memory' && q.pairs && (
                            <div className="space-y-2">
                                {q.pairs.map((p: any, pi: number) => (
                                    <div key={pi} className="bg-white/5 p-2 rounded-lg text-sm">
                                        <span className="text-pink-300 font-bold">{p.term}</span>
                                        <span className="text-slate-500 mx-2">↔</span>
                                        <span className="text-slate-300">{p.definition}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Word search review */}
                        {quizType === 'word_search' && q.words && (
                            <div className="flex flex-wrap gap-1">
                                {(Array.isArray(selected) ? selected : []).map((w: string, wi: number) => (
                                    <span key={wi} className="bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs px-2 py-1 rounded-full">{w}</span>
                                ))}
                            </div>
                        )}

                        {q.explanation && (
                            <div className="mt-3 md:mt-4 p-3 md:p-4 bg-accent/5 border border-accent/10 rounded-xl">
                                <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">Explicación</p>
                                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{q.explanation}</p>
                            </div>
                        )}
                        {q.fun_fact && (
                            <div className="mt-2 p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl">
                                <p className="text-cyan-300/80 text-xs">⚡ {q.fun_fact}</p>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
