import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Convex server module
vi.mock('../../convex/_generated/server', () => ({
    mutation: (obj: any) => obj,
    query: (obj: any) => obj,
}))

import * as withUser from '../../convex/withUser'
vi.mock('../../convex/withUser', () => ({
    requireTeacher: vi.fn(),
    requireAuth: vi.fn(),
    requireAdmin: vi.fn(),
}))

import { createBadge, awardBadge, revokeBadge, deleteBadge } from '../../convex/badges'

const mockTeacher = { _id: 'teacher1', role: 'teacher', name: 'Docente Test', email: 'doc@test.cl' }

const makeMockCtx = () => ({
    db: {
        get: vi.fn(),
        insert: vi.fn().mockResolvedValue('new_id'),
        delete: vi.fn(),
        query: vi.fn().mockReturnValue({
            withIndex: vi.fn().mockReturnThis(),
            filter: vi.fn().mockReturnThis(),
            first: vi.fn().mockResolvedValue(null),
            collect: vi.fn().mockResolvedValue([]),
        }),
    },
})

describe('badges.ts — seguridad', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(withUser.requireTeacher).mockResolvedValue(mockTeacher as any)
    })

    it('createBadge llama requireTeacher antes de insertar', async () => {
        const ctx = makeMockCtx()
        await (createBadge as any).handler(ctx, {
            course_id: 'course1',
            name: 'Estrella',
            description: 'Test',
            icon: '⭐',
            criteria_type: 'mastery',
        })
        expect(withUser.requireTeacher).toHaveBeenCalledWith(ctx)
        expect(ctx.db.insert).toHaveBeenCalledWith('badges', expect.objectContaining({ name: 'Estrella' }))
    })

    it('createBadge lanza si requireTeacher falla (usuario no es docente)', async () => {
        vi.mocked(withUser.requireTeacher).mockRejectedValue(new Error('No autorizado'))
        const ctx = makeMockCtx()
        await expect(
            (createBadge as any).handler(ctx, {
                course_id: 'course1',
                name: 'Test',
                description: 'Test',
                icon: '🎯',
                criteria_type: 'mastery',
            })
        ).rejects.toThrow('No autorizado')
        expect(ctx.db.insert).not.toHaveBeenCalled()
    })

    it('awardBadge llama requireTeacher', async () => {
        const ctx = makeMockCtx()
        ctx.db.get.mockResolvedValue({ _id: 'badge1', course_id: 'course1' })
        await (awardBadge as any).handler(ctx, {
            badge_id: 'badge1',
            student_id: 'student1',
            course_id: 'course1',
        })
        expect(withUser.requireTeacher).toHaveBeenCalledWith(ctx)
    })

    it('awardBadge no otorga insignia duplicada', async () => {
        const ctx = makeMockCtx()
        ctx.db.get.mockResolvedValue({ _id: 'badge1', course_id: 'course1' })
        // Simular que ya existe la insignia
        ctx.db.query.mockReturnValue({
            withIndex: vi.fn().mockReturnThis(),
            filter: vi.fn().mockReturnThis(),
            first: vi.fn().mockResolvedValue({ _id: 'existing_badge' }),
            collect: vi.fn().mockResolvedValue([]),
        })
        await expect(
            (awardBadge as any).handler(ctx, {
                badge_id: 'badge1',
                student_id: 'student1',
                course_id: 'course1',
            })
        ).rejects.toThrow()
        expect(ctx.db.insert).not.toHaveBeenCalled()
    })

    it('revokeBadge llama requireTeacher', async () => {
        const ctx = makeMockCtx()
        ctx.db.get.mockResolvedValue({ _id: 'user_badge1' })
        await (revokeBadge as any).handler(ctx, { user_badge_id: 'user_badge1' })
        expect(withUser.requireTeacher).toHaveBeenCalledWith(ctx)
        expect(ctx.db.delete).toHaveBeenCalledWith('user_badge1')
    })

    it('deleteBadge llama requireTeacher y borra user_badges primero', async () => {
        const ctx = makeMockCtx()
        ctx.db.get.mockResolvedValue({ _id: 'badge1' })
        const mockUserBadges = [{ _id: 'ub1' }, { _id: 'ub2' }]
        ctx.db.query.mockReturnValue({
            withIndex: vi.fn().mockReturnThis(),
            filter: vi.fn().mockReturnThis(),
            first: vi.fn().mockResolvedValue(null),
            collect: vi.fn().mockResolvedValue(mockUserBadges),
        })
        await (deleteBadge as any).handler(ctx, { badge_id: 'badge1' })
        expect(withUser.requireTeacher).toHaveBeenCalledWith(ctx)
        expect(ctx.db.delete).toHaveBeenCalledTimes(3) // 2 user_badges + 1 badge
    })
})
