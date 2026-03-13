/**
 * Utilidades para el manejo de RUT Chilenos en Convex
 */

export function calculateRutDV(rutBody: string | number): string {
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

export function formatRutWithDV(rutBody: string | number): string {
    const body = String(rutBody).replace(/[^\d]/g, '');
    if (!body) return '';
    const dv = calculateRutDV(body);
    return `${body}-${dv}`;
}

export function normalizeRut(rut: string): string {
    // 1. Limpiar todo lo que no sea número o K
    const clean = rut.replace(/[^\dkK]/g, '').toUpperCase();
    if (!clean) return '';
    
    // Devolvemos el string limpio. No intentamos adivinar el DV ni poner guiones
    // para que la búsqueda inteligente de coincidencias parciales sea quien decida.
    return clean;
}

export function cleanForComparison(rut: string): string {
    return rut.replace(/[^\dkK]/g, '').toUpperCase();
}
