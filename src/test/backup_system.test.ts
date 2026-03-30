import { describe, it, expect, vi } from 'vitest';
import { backupCurrentPoints } from '../../convex/backup_system';

// Mock de las dependencias de Convex
vi.mock("../../convex/_generated/server", () => ({
  query: (obj: any) => obj,
}));

// Mock del helper de auth
import * as auth from '../../convex/withUser';
vi.mock("../../convex/withUser", () => ({
  requireAdmin: vi.fn(),
}));

describe('backupCurrentPoints security', () => {
  it('should call requireAdmin at the beginning of the handler', async () => {
    const mockCtx = {
      db: { query: () => ({ collect: () => [] }) },
      auth: {},
    };
    
    // Ejecutamos el handler (que ahora es el objeto que pasamos a query)
    await (backupCurrentPoints as any).handler(mockCtx);
    
    expect(auth.requireAdmin).toHaveBeenCalledWith(mockCtx);
  });
});
