import { describe, it, expect } from 'vitest'

function calculateRutDV(rutBody: string | number): string {
    const cleanBox = String(rutBody).replace(/[^\d]/g, '');
    if (!cleanBox) return '';

    let sum = 0;
    let multiplier = 2;

    for (let i = cleanBox.length - 1; i >= 0; i--) {
        sum += parseInt(cleanBox[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const rest = sum % 11;
    const dvResult = 11 - rest;

    if (dvResult === 11) return '0';
    if (dvResult === 10) return 'K';
    return String(dvResult);
}

function formatRutWithDV(rutBody: string | number): string {
    const body = String(rutBody).replace(/[^\d]/g, '');
    if (!body) return '';
    const dv = calculateRutDV(body);
    return `${body}-${dv}`;
}

function normalizeRut(rut: string): string {
    const clean = rut.replace(/[^\dkK]/g, '').toUpperCase();
    if (!clean) return '';
    return clean;
}

function cleanForComparison(rut: string): string {
    return rut.replace(/[^\dkK]/g, '').toUpperCase();
}

describe('RUT Utils', () => {
  describe('calculateRutDV', () => {
    it('should calculate correct DV for known RUTs', () => {
      expect(calculateRutDV('12345678')).toBe('5')
      expect(calculateRutDV('11111111')).toBe('1')
      expect(calculateRutDV('22222222')).toBe('2')
      expect(calculateRutDV('33333333')).toBe('3')
    })

    it('should return empty string for invalid input', () => {
      expect(calculateRutDV('')).toBe('')
    })
  })

  describe('formatRutWithDV', () => {
    it('should format RUT with correct DV', () => {
      expect(formatRutWithDV('12345678')).toBe('12345678-5')
      expect(formatRutWithDV(12345678)).toBe('12345678-5')
    })

    it('should return empty string for invalid input', () => {
      expect(formatRutWithDV('')).toBe('')
    })
  })

  describe('normalizeRut', () => {
    it('should remove all non-digit/K characters', () => {
      expect(normalizeRut('12.345.678-5')).toBe('123456785')
      expect(normalizeRut('12.345.678.k')).toBe('12345678K')
      expect(normalizeRut('12345678-5')).toBe('123456785')
    })

    it('should convert to uppercase', () => {
      expect(normalizeRut('12345678k')).toBe('12345678K')
    })

    it('should return empty string for invalid input', () => {
      expect(normalizeRut('')).toBe('')
      expect(normalizeRut('   ')).toBe('')
    })
  })

  describe('cleanForComparison', () => {
    it('should clean RUT for comparison', () => {
      expect(cleanForComparison('12.345.678-5')).toBe('123456785')
      expect(cleanForComparison('  12.345.678  ')).toBe('12345678')
    })

    it('should uppercase for consistent comparison', () => {
      expect(cleanForComparison('12345678K')).toBe('12345678K')
      expect(cleanForComparison('12345678k')).toBe('12345678K')
    })
  })
})
