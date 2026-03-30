import { describe, it, expect } from 'vitest'
import { formatRankingForExport } from '../../src/utils/ExportData'

describe('formatRankingForExport', () => {
    it('maps ranking data to export format with correct keys', () => {
        const input = [
            {
                name: 'Ana Torres',
                student_id: '12345678-9',
                section: 'A',
                belbin: 'Cerebro',
                points: 1500,
                spendable_points: 800,
                missions_completed: 5,
            },
        ]
        const result = formatRankingForExport(input)
        expect(result).toHaveLength(1)
        expect(result[0]['Posición']).toBe(1)
        expect(result[0]['Nombre']).toBe('Ana Torres')
        expect(result[0]['RUT/ID']).toBe('12345678-9')
        expect(result[0]['Sección']).toBe('A')
        expect(result[0]['Rol Belbin']).toBe('Cerebro')
        expect(result[0]['Puntos Totales']).toBe(1500)
        expect(result[0]['Puntos Canjeables']).toBe(800)
        expect(result[0]['Misiones Completadas']).toBe(5)
    })

    it('assigns sequential positions', () => {
        const input = [
            { name: 'Primero', points: 100 },
            { name: 'Segundo', points: 90 },
            { name: 'Tercero', points: 80 },
        ]
        const result = formatRankingForExport(input)
        expect(result[0]['Posición']).toBe(1)
        expect(result[1]['Posición']).toBe(2)
        expect(result[2]['Posición']).toBe(3)
    })

    it('falls back to N/A for missing name', () => {
        const result = formatRankingForExport([{}])
        expect(result[0]['Nombre']).toBe('N/A')
    })

    it('falls back to No realizado for missing belbin', () => {
        const result = formatRankingForExport([{ name: 'Test' }])
        expect(result[0]['Rol Belbin']).toBe('No realizado')
    })

    it('returns zero for missing numeric fields', () => {
        const result = formatRankingForExport([{ name: 'Test' }])
        expect(result[0]['Puntos Totales']).toBe(0)
        expect(result[0]['Puntos Canjeables']).toBe(0)
        expect(result[0]['Misiones Completadas']).toBe(0)
    })

    it('returns empty array for empty input', () => {
        expect(formatRankingForExport([])).toEqual([])
    })
})
