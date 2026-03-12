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

    // 2. Si ya tiene guion, confiamos en ese formato y lo devolvemos limpio
    if (rut.includes('-')) {
        const parts = rut.split('-');
        const body = parts[0].replace(/[^\d]/g, '');
        const dv = parts[1].trim().toUpperCase();
        return `${body}-${dv}`;
    }

    // 3. Si no tiene guion, pero tiene 9 dígitos, asumimos que el último es el DV
    if (clean.length === 9) {
        const body = clean.substring(0, 8);
        const dv = clean.substring(8);
        return `${body}-${dv}`;
    }
    
    // 4. Si tiene 8 dígitos o menos, asumimos que es solo el cuerpo y calculamos el DV
    const body = clean.replace(/[^\d]/g, '');
    return formatRutWithDV(body);
}

export function cleanForComparison(rut: string): string {
    return rut.replace(/[^\dkK]/g, '').toUpperCase();
}
