import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from '../../src/components/ErrorBoundary'

// Silencia los console.error de React durante tests de error boundaries
beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
})

function BrokenComponent({ shouldThrow }: { shouldThrow: boolean }) {
    if (shouldThrow) throw new Error('Error de prueba')
    return <div>Componente OK</div>
}

describe('ErrorBoundary', () => {
    it('renderiza children cuando no hay error', () => {
        render(
            <ErrorBoundary>
                <div>Contenido normal</div>
            </ErrorBoundary>
        )
        expect(screen.getByText('Contenido normal')).toBeTruthy()
    })

    it('muestra UI de error cuando un hijo lanza', () => {
        render(
            <ErrorBoundary>
                <BrokenComponent shouldThrow={true} />
            </ErrorBoundary>
        )
        expect(screen.getByText('Algo salió mal')).toBeTruthy()
        expect(screen.getByText('Error de prueba')).toBeTruthy()
    })

    it('muestra el botón Reintentar en la UI de error', () => {
        render(
            <ErrorBoundary>
                <BrokenComponent shouldThrow={true} />
            </ErrorBoundary>
        )
        expect(screen.getByRole('button', { name: /reintentar/i })).toBeTruthy()
    })

    it('llama onReset y resetea el estado al hacer clic en Reintentar', () => {
        const onReset = vi.fn()
        render(
            <ErrorBoundary onReset={onReset}>
                <BrokenComponent shouldThrow={true} />
            </ErrorBoundary>
        )
        const retryBtn = screen.getByRole('button', { name: /reintentar/i })
        fireEvent.click(retryBtn)
        expect(onReset).toHaveBeenCalledOnce()
    })

    it('acepta un fallback personalizado', () => {
        render(
            <ErrorBoundary fallback={<div>Fallback custom</div>}>
                <BrokenComponent shouldThrow={true} />
            </ErrorBoundary>
        )
        expect(screen.getByText('Fallback custom')).toBeTruthy()
        expect(screen.queryByText('Algo salió mal')).toBeNull()
    })

    it('no afecta siblings — muestra children sin error correctamente', () => {
        render(
            <>
                <ErrorBoundary>
                    <div>Panel A</div>
                </ErrorBoundary>
                <ErrorBoundary>
                    <BrokenComponent shouldThrow={true} />
                </ErrorBoundary>
            </>
        )
        expect(screen.getByText('Panel A')).toBeTruthy()
        expect(screen.getByText('Algo salió mal')).toBeTruthy()
    })
})
