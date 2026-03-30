# Reporte Auditoría de Dependencias — QuestIA
> Agente: auditor-deps | Fecha: 2026-03-30

## INVENTARIO
- Producción: 23 deps | Desarrollo: 14 deps | Total: 37

## TRIPLE AUTH — VEREDICTO: CORRECTO (no es redundancia)
- `@clerk/clerk-react` → Frontend (UI login, sesión, token)
- `@convex-dev/auth` → Backend/Convex (bridge con Clerk, authTables en DB)
- `@auth/core` → Solo para Google OAuth provider en `convex/auth.ts:2`

## DEPENDENCIAS A ELIMINAR
| Dep | Razón |
|-----|-------|
| `@capacitor/device` | No se importa en NINGÚN archivo. Completamente sin usar. |
| `google-auth-library` | Solo en `convex/fcm.ts` (backend). Verificar si Convex la necesita en root. |
| `@google/generative-ai` | Solo en `convex/ai_feedback.ts`, `evaluator.ts`, `quizzes.ts`. Verificar si Convex la necesita en root. |

## PROBLEMA BUNDLE SIZE PRINCIPAL
- `import * as XLSX from 'xlsx'` en `src/utils/ExportData.ts:1` — import ESTÁTICO de ~500KB
- Debería ser dynamic import como ya se hace en `documentParser.ts`

## DEPENDENCIAS PESADAS (justificadas)
| Dep | Tamaño | Estado |
|-----|--------|--------|
| pdfjs-dist | ~800KB | OK — dynamic import correcto |
| xlsx | ~500KB | PROBLEMA — import estático en ExportData.ts |
| recharts | ~400KB | OK — tree-shakeable |
| firebase | ~200KB | OK — justificado para FCM |
| mammoth | ~200KB | OK — dynamic import correcto |
| framer-motion | ~150KB | OK — justificado |

## VERSIONES INESTABLES (riesgo breaking changes)
- `@auth/core: ^0.37.0` — versión 0.x
- `@convex-dev/auth: ^0.0.91` — versión 0.0.x (extremadamente temprana)

## CAPACITOR
- Configurado como "web wrapper" — carga desde `https://questia.cl`
- Sin soporte offline (remover `server.url` para bundle local)

## VERCEL
- Correcto y minimalista (solo catch-all SPA rewrite)
