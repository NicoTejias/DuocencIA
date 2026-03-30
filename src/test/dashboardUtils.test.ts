import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getGreeting, getFirstName } from '../../src/utils/dashboardUtils'

describe('dashboardUtils', () => {
    describe('getFirstName', () => {
        it('returns first word of full name', () => {
            expect(getFirstName('Juan Pérez González')).toBe('Juan')
        })

        it('returns single name unchanged', () => {
            expect(getFirstName('María')).toBe('María')
        })

        it('returns empty string for undefined', () => {
            expect(getFirstName(undefined)).toBe('')
        })

        it('returns empty string for empty string', () => {
            expect(getFirstName('')).toBe('')
        })
    })

    describe('getGreeting', () => {
        beforeEach(() => {
            vi.useFakeTimers()
        })
        afterEach(() => {
            vi.useRealTimers()
        })

        it('returns buenos días in the morning (8am)', () => {
            vi.setSystemTime(new Date('2025-01-01T08:00:00'))
            expect(getGreeting()).toBe('Buenos días')
        })

        it('returns buenas tardes in the afternoon (14pm)', () => {
            vi.setSystemTime(new Date('2025-01-01T14:00:00'))
            expect(getGreeting()).toBe('Buenas tardes')
        })

        it('returns buenas noches at night (21pm)', () => {
            vi.setSystemTime(new Date('2025-01-01T21:00:00'))
            expect(getGreeting()).toBe('Buenas noches')
        })

        it('returns buenos días at midnight boundary (0am)', () => {
            vi.setSystemTime(new Date('2025-01-01T00:00:00'))
            expect(getGreeting()).toBe('Buenos días')
        })

        it('returns buenas tardes at boundary (12pm exactly)', () => {
            vi.setSystemTime(new Date('2025-01-01T12:00:00'))
            expect(getGreeting()).toBe('Buenas tardes')
        })

        it('returns buenas noches at boundary (20pm)', () => {
            vi.setSystemTime(new Date('2025-01-01T20:00:00'))
            expect(getGreeting()).toBe('Buenas noches')
        })
    })
})
