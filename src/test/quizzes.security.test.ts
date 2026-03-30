import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../convex/_generated/server', () => ({
    mutation: (obj: any) => obj,
    action: (obj: any) => obj,
    query: (obj: any) => obj,
    internalMutation: (obj: any) => obj,
    internalAction: (obj: any) => obj,
}))
vi.mock('../../convex/_generated/api', () => ({ api: {}, internal: {} }))
vi.mock('../../convex/geminiClient', () => ({ getGeminiModel: vi.fn() }))

import * as withUser from '../../convex/withUser'
vi.mock('../../convex/withUser', () => ({
    requireAuth: vi.fn(),
    requireTeacher: vi.fn(),
    requireAdmin: vi.fn(),
}))

import { submitQuiz, getOrCreateAttempt } from '../../convex/quizzes'

const mockUser = { _id: 'user1', role: 'student', name: 'Test Student', email: 'test@test.cl' }

const makeMockCtx = () => ({
    db: {
        get: vi.fn(),
        insert: vi.fn().mockResolvedValue('new_id'),
        patch: vi.fn(),
        query: vi.fn().mockReturnValue({
            withIndex: vi.fn().mockReturnThis(),
            filter: vi.fn().mockReturnThis(),
            first: vi.fn().mockResolvedValue(null),
            collect: vi.fn().mockResolvedValue([]),
        }),
    },
    scheduler: {
        runAfter: vi.fn(),
    },
})

describe('quizzes.ts — seguridad', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(withUser.requireAuth).mockResolvedValue(mockUser as any)
    })

    it('submitQuiz llama requireAuth al inicio', async () => {
        vi.mocked(withUser.requireAuth).mockRejectedValue(new Error('No autenticado'))
        const ctx = makeMockCtx()
        await expect(
            (submitQuiz as any).handler(ctx, { quiz_id: 'quiz1' })
        ).rejects.toThrow('No autenticado')
        expect(withUser.requireAuth).toHaveBeenCalledWith(ctx)
        expect(ctx.db.get).not.toHaveBeenCalled()
    })

    it('submitQuiz lanza si quiz no existe', async () => {
        const ctx = makeMockCtx()
        ctx.db.get.mockResolvedValue(null) // quiz no encontrado
        // Necesita pasar rate limit — mockeamos checkRateLimit implícitamente
        // La query de rate limit devuelve null (no hay rate limit registrado)
        await expect(
            (submitQuiz as any).handler(ctx, { quiz_id: 'quiz1' })
        ).rejects.toThrow('Quiz no encontrado')
    })

    it('getOrCreateAttempt llama requireAuth', async () => {
        vi.mocked(withUser.requireAuth).mockRejectedValue(new Error('No autenticado'))
        const ctx = makeMockCtx()
        await expect(
            (getOrCreateAttempt as any).handler(ctx, { quiz_id: 'quiz1' })
        ).rejects.toThrow('No autenticado')
        expect(withUser.requireAuth).toHaveBeenCalledWith(ctx)
    })
})

// Para los tests de scoring usamos role:teacher para evitar lógica de intentos/puntos/enrollment
const mockTeacher = { _id: 'teacher1', role: 'teacher', name: 'Docente Test', email: 'doc@test.cl' }

describe('quizzes.ts — lógica de scoring (puntaje, modo simulación docente)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(withUser.requireAuth).mockResolvedValue(mockTeacher as any)
    })

    it('true/false: respuesta correcta = score 100 con 1 pregunta', async () => {
        const ctx = makeMockCtx()
        const quiz = {
            _id: 'quiz1',
            quiz_type: 'true_false',
            max_attempts: 1,
            num_questions: 1,
            difficulty: 'facil',
            questions: [{ correct: true }],
        }
        ctx.db.get.mockResolvedValue(quiz)
        const attempt = {
            _id: 'attempt1',
            status: 'in_progress',
            selected_options: [1], // 1 = Verdadero, correcto porque correct:true
            last_updated: Date.now(),
        }
        ctx.db.query.mockReturnValue({
            withIndex: vi.fn().mockReturnThis(),
            filter: vi.fn().mockReturnThis(),
            first: vi.fn().mockResolvedValue(null),
            collect: vi.fn().mockResolvedValue([attempt]),
        })
        ctx.db.patch.mockResolvedValue(undefined)
        const result = await (submitQuiz as any).handler(ctx, { quiz_id: 'quiz1', time_penalty: 0 })
        expect(result.score).toBe(100)
        expect(result.is_simulation).toBe(true)
    })

    it('multiple_choice: respuesta incorrecta = score 0', async () => {
        const ctx = makeMockCtx()
        const quiz = {
            _id: 'quiz1',
            quiz_type: 'multiple_choice',
            max_attempts: 1,
            num_questions: 1,
            difficulty: 'facil',
            questions: [{ correct: 2, options: ['A', 'B', 'C', 'D'] }],
        }
        ctx.db.get.mockResolvedValue(quiz)
        const attempt = {
            _id: 'attempt1',
            status: 'in_progress',
            selected_options: [0], // seleccionó 0, correcta es 2
            last_updated: Date.now(),
        }
        ctx.db.query.mockReturnValue({
            withIndex: vi.fn().mockReturnThis(),
            filter: vi.fn().mockReturnThis(),
            first: vi.fn().mockResolvedValue(null),
            collect: vi.fn().mockResolvedValue([attempt]),
        })
        ctx.db.patch.mockResolvedValue(undefined)
        const result = await (submitQuiz as any).handler(ctx, { quiz_id: 'quiz1', time_penalty: 0 })
        expect(result.score).toBe(0)
    })

    it('multiple_choice: 2 correctas de 4 = score 50', async () => {
        const ctx = makeMockCtx()
        const quiz = {
            _id: 'quiz1',
            quiz_type: 'multiple_choice',
            max_attempts: 1,
            num_questions: 4,
            difficulty: 'facil',
            questions: [
                { correct: 0 }, // acertada
                { correct: 1 }, // acertada
                { correct: 2 }, // fallada (seleccionó 0)
                { correct: 3 }, // fallada (seleccionó 0)
            ],
        }
        ctx.db.get.mockResolvedValue(quiz)
        const attempt = {
            _id: 'attempt1',
            status: 'in_progress',
            selected_options: [0, 1, 0, 0],
            last_updated: Date.now(),
        }
        ctx.db.query.mockReturnValue({
            withIndex: vi.fn().mockReturnThis(),
            filter: vi.fn().mockReturnThis(),
            first: vi.fn().mockResolvedValue(null),
            collect: vi.fn().mockResolvedValue([attempt]),
        })
        ctx.db.patch.mockResolvedValue(undefined)
        const result = await (submitQuiz as any).handler(ctx, { quiz_id: 'quiz1', time_penalty: 0 })
        expect(result.score).toBe(50)
    })
})
