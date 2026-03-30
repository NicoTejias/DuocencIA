# Reporte Auditoría de Calidad de Código — QuestIA
> Auditor: team-lead (directo) | Fecha: 2026-03-30

## ESTADO GENERAL DE CALIDAD

El código es **funcional pero con deuda técnica significativa**. El proyecto creció rápido y se nota: componentes muy grandes, uso extensivo de `any`, errores silenciados, y cobertura de tests prácticamente nula. No hay bugs críticos obvios, pero hay varios patrones que pueden causar problemas a medida que escale.

**Cobertura de tests:** 1 archivo de test (`src/test/rutUtils.test.ts`) que cubre solo la validación de RUT chileno. El resto del proyecto (13.000+ líneas) no tiene tests.

## PROBLEMAS CRÍTICOS

### 1. `any` extensivo — 126 ocurrencias en 30 archivos
El tipo `any` aparece en prácticamente todos los componentes principales:
- `src/components/student/QuizPlayer.tsx` — 19 usos de `any`
- `src/components/teacher/MaterialPanel.tsx` — 20 usos de `any`
- `src/components/teacher/RankingDocentePanel.tsx` — 8 usos de `any`
- `src/components/teacher/AnaliticasPanel.tsx` — 8 usos de `any`

Esto anula los beneficios de TypeScript y oculta bugs potenciales.

### 2. `(user as any)?.role` en `App.tsx:63` y `:97`
El tipo de usuario viene de Convex y debería estar tipado correctamente. Este cast es síntoma de que los tipos generados de Convex no se están aprovechando.

### 3. `backup_system.ts` — Query sin auth que expone toda la DB
`convex/backup_system.ts` es un query público (sin `requireAuth`) que retorna TODOS los enrollments, usuarios y cursos. Cualquiera puede llamarlo. (Ver reporte seguridad.)

### 4. Errores silenciados en varios lugares
- `convex/withUser.ts:32` — `catch (e) { /* ignore */ }` silencia error al vincular clerkId
- `src/pages/StudentDashboard.tsx:50` — `.catch(() => { })` silencia error de auto-enrolamiento
- `src/lib/firebase.ts` usa `any` para `app`, `analytics`, `messaging` y puede fallar silenciosamente

### 5. `console.log` en producción — 23 ocurrencias en 14 archivos
Archivos más críticos:
- `src/components/PushNotificationManager.tsx` — 5 console.log/error (puede loguear tokens FCM)
- `src/main.tsx` — 2 console.error en handlers globales (OK para debug pero debería usar logger)
- `src/lib/firebase.ts` — 3 console.error/warn

## ANTI-PATTERNS DETECTADOS

### React patterns
- **`setTimeout` dentro de render** en `App.tsx:55`: `setTimeout(() => setStuckCount(c => c + 1), 1000)` — se ejecuta en cada render sin cleanup. Debería ser `useEffect`.
- **`localStorage` leído en render** en `App.tsx:64`: `localStorage.getItem('questia_simulate_student')` en el cuerpo del componente sin `useMemo` ni `useState` — puede causar inconsistencias SSR/hydration.
- **`window.confirm()`** en 4 archivos: `ProfilePage.tsx`, `CrearRecompensaPanel.tsx`, `EvaluadorIAPanel.tsx`, `MaterialPanel.tsx`. El proyecto tiene `ConfirmModal.tsx` pero no se usa globalmente.

### TypeScript patterns
- **`(ctx as any).db.patch`** en `convex/withUser.ts:28` — cast para detectar si es MutationCtx. Hay forma tipada de hacerlo.
- **`(q: any)`** en `convex/users.ts:57` — en queries Convex, los argumentos tienen tipos generados.

### Código duplicado
- La lógica de "cargar usuario + verificar rol" se repite en `ProtectedRoute`, `PublicOnlyRoute` y `DashboardRedirect` en `App.tsx`. Es prácticamente el mismo código 3 veces.
- El patrón de inicialización de Gemini (`process.env.GEMINI_API_KEY` → `new GoogleGenerativeAI()`) se repite en `quizzes.ts`, `ai_feedback.ts` y `evaluator.ts`. Debería extraerse a un helper.

## CÓDIGO A ELIMINAR

| Archivo/Código | Razón |
|----------------|-------|
| `src/components/gamification/RewardStore.jsx` | Import roto, código muerto |
| `src/pages/RewardStorePage.tsx` | Placeholder sin funcionalidad |
| `convex/backup_system.ts` | Script de mantenimiento sin auth, riesgo de seguridad |
| `convex/repair.ts` | Verificar si es script temporal olvidado |
| `convex/admin_fix.ts` | Ídem — verificar si es script temporal |
| `convex/test_notification.ts` | Nombre sugiere que es para testing, no producción |
| `src/assets/react.svg` | Asset por defecto de Vite, no se usa en la app |

## MEJORAS PRIORITARIAS

### 1. Extraer subcomponentes de QuizPlayer (ALTO IMPACTO)
`QuizPlayer.tsx` con 1.188 líneas maneja 9 tipos de quiz. Dividir en:
```
QuizPlayer/ (directorio)
├── index.tsx           (orquestador)
├── MultipleChoice.tsx
├── MatchGame.tsx
├── TrueFalse.tsx
├── FillBlank.tsx
├── WordSearch.tsx
├── QuizSprint.tsx
└── Memory.tsx
```

### 2. Eliminar todos los `any` explícitos
Aprovechar los tipos generados por Convex en `convex/_generated/dataModel.d.ts`. El tipo `Doc<"users">` ya tiene todos los campos tipados.

### 3. Convertir `setTimeout` en render a `useEffect`
```tsx
// App.tsx:55 — ACTUAL (bug)
setTimeout(() => setStuckCount(c => c + 1), 1000)

// Debería ser:
useEffect(() => {
  const timer = setTimeout(() => setStuckCount(c => c + 1), 1000)
  return () => clearTimeout(timer)
}, [stuckCount])
```

### 4. Reemplazar `window.confirm()` por `ConfirmModal`
Ya existe `src/components/ConfirmModal.tsx`. Usarlo en los 4 lugares que tienen `window.confirm()`.

### 5. Extraer helper de Gemini en Convex
```ts
// convex/geminiClient.ts (nuevo)
export function getGeminiClient() {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error("GEMINI_API_KEY no configurada")
  return new GoogleGenerativeAI(key)
}
```

## ESTRATEGIA DE TESTING

### Lo que existe
- `src/test/rutUtils.test.ts` — Tests de validación de RUT chileno (única cobertura)
- `src/test/setup.ts` — Configuración de Vitest con jsdom
- Vitest + Testing Library configurados y listos para usar

### Prioridades de testing (de mayor a menor impacto)

1. **`convex/` functions** — Las queries/mutations de Convex son la lógica de negocio crítica. Testear con `convex-test` library.
2. **`QuizPlayer.tsx`** — Componente más grande y complejo. Tests por tipo de quiz.
3. **`App.tsx` routing** — `ProtectedRoute` y `DashboardRedirect` tienen lógica de auth compleja.
4. **`utils/documentParser.ts`** — Lógica pura, fácil de testear.
5. **`utils/ExportData.ts`** — Lógica de exportación.

### Cobertura objetivo inmediato
- 0% → 30% en 3 sprints priorizando lógica de negocio crítica (auth, quizzes, puntos)
