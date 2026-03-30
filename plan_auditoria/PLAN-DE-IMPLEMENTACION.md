# Plan de Implementación de Mejoras — QuestIA
> Generado a partir de auditoría completa | Fecha: 2026-03-30
> Fuentes: reporte-arquitectura.md, reporte-calidad-codigo.md, reporte-seguridad.md, reporte-dependencias.md, reporte-features-ux.md

---

## RESUMEN EJECUTIVO

QuestIA es una plataforma **funcionalmente rica pero con deuda técnica acumulada**. Tiene 29 tablas en Convex, 9 tipos de quiz, gamificación completa y features avanzadas (evaluación IA, grupos Belbin). Los problemas son de calidad, seguridad y UX — no de funcionalidad base.

**Puntuación por área:**
| Área | Estado | Urgencia |
|------|--------|---------|
| Seguridad | ⚠️ 2 vulnerabilidades críticas | INMEDIATA |
| Arquitectura | 🟡 Funcional pero componentes gigantes | MEDIA |
| Calidad código | 🟡 126 `any`, sin tests | MEDIA |
| Dependencias | 🟢 En orden, 1 problema de bundle | BAJA |
| Features/UX | 🟡 Badges sin UI, accesibilidad mínima | MEDIA |

---

## FASE 0 — SEGURIDAD URGENTE (Esta semana)

> Estas tareas no esperan. Son riesgos reales ahora mismo.

### Tarea 0.1 — Proteger `backup_system.ts`
**Archivo:** `convex/backup_system.ts`
**Problema:** Query público sin autenticación que devuelve emails, RUTs y puntos de TODOS los usuarios.
**Acción:** Agregar `const user = await requireAdmin(ctx)` como primera línea del handler.

### Tarea 0.2 — Auditar `repair.ts` y `admin_fix.ts`
**Archivos:** `convex/repair.ts`, `convex/admin_fix.ts`
**Acción:** Verificar si tienen auth. Si son scripts temporales de mantenimiento, eliminarlos. Si son necesarios, proteger con `requireAdmin`.

### Tarea 0.3 — Restringir `getUserById`
**Archivo:** `convex/users.ts:7`
**Problema:** Devuelve perfil completo (email, RUT, push_token) de cualquier usuario sin verificación.
**Acción:** Agregar auth y filtrar campos: retornar solo nombre e imagen públicamente; campos sensibles solo al propio usuario o admins.

### Tarea 0.4 — Verificar ownership en `generateQuiz`
**Archivo:** `convex/quizzes.ts:9`
**Problema:** Solo verifica identidad, no que el usuario sea docente del curso del documento.
**Acción:** Después de obtener el documento, verificar que `doc.teacher_id === identity.userId` o que el usuario sea admin.

---

## FASE 1 — ELIMINAR CÓDIGO MUERTO (1-2 días)

> Limpiar antes de construir. Reduce confusión y bundle size.

### Tarea 1.1 — Eliminar archivos muertos
- `src/pages/RewardStorePage.tsx` — placeholder sin funcionalidad
- `src/components/gamification/RewardStore.jsx` — import roto, duplicado
- Remover ruta `/tienda/:courseId` en `App.tsx`
- `src/assets/react.svg` — asset por defecto de Vite sin usar
- `convex/test_notification.ts` — verificar si es solo para testing

### Tarea 1.2 — Arreglar bundle size crítico
**Archivo:** `src/utils/ExportData.ts:1`
**Problema:** `import * as XLSX from 'xlsx'` — carga ~500KB en el bundle inicial
**Acción:** Convertir a dynamic import:
```ts
// ANTES
import * as XLSX from 'xlsx'

// DESPUÉS
const exportToExcel = async () => {
  const XLSX = await import('xlsx')
  // ...
}
```

### Tarea 1.3 — Eliminar `window.confirm()` reemplazando por `ConfirmModal`
**4 archivos:** `ProfilePage.tsx`, `CrearRecompensaPanel.tsx`, `EvaluadorIAPanel.tsx`, `MaterialPanel.tsx`
Ya existe `ConfirmModal.tsx` — solo hay que usarlo.

---

## FASE 2 — FIXES DE CALIDAD URGENTES (1 semana)

### Tarea 2.1 — Corregir bug de `setTimeout` en render
**Archivo:** `src/App.tsx:55`
```tsx
// ACTUAL — bug: setTimeout sin cleanup en cuerpo del componente
setTimeout(() => setStuckCount(c => c + 1), 1000)

// CORRECCIÓN
useEffect(() => {
  const t = setTimeout(() => setStuckCount(c => c + 1), 1000)
  return () => clearTimeout(t)
}, [])
```

### Tarea 2.2 — Corregir texto corrupto en BelbinTest
**Archivo:** `src/pages/BelbinTest.tsx:30`
Corregir: "Explorar soluciones nunca antes尝试adas" → "Explorar soluciones nunca antes intentadas"

### Tarea 2.3 — Corregir typo en EvaluacionesPanel
**Archivo:** `src/components/student/EvaluacionesPanel.tsx:148`
"No hay trabajosprogramados" → "No hay trabajos programados"

### Tarea 2.4 — Remover `console.log` de producción
**Archivos prioritarios:** `PushNotificationManager.tsx`, `lib/firebase.ts`
Reemplazar por condición `if (import.meta.env.DEV) console.log(...)` o eliminar.

### Tarea 2.5 — Extraer helper de Gemini en Convex
**Archivos:** `convex/quizzes.ts`, `convex/ai_feedback.ts`, `convex/evaluator.ts`
Crear `convex/geminiClient.ts` con función helper para evitar duplicación.

---

## FASE 3 — FEATURES INCOMPLETAS (2-3 semanas)

### Tarea 3.1 — Implementar UI de Badges/Insignias (ALTO IMPACTO)
El schema tiene `badges` y `user_badges` con estructura completa. La UI no existe.

**Para docentes** (en `CourseDetail.tsx` o nuevo panel):
- Crear insignia: nombre, ícono (emoji), criterio (asistencia, mejora, maestría)
- Ver qué alumnos tienen qué insignias

**Para alumnos** (en `DashboardHome.tsx` o `PerfilPanel.tsx`):
- Panel "Mis Insignias" con grid de badges ganados/bloqueados

### Tarea 3.2 — Implementar historial de quizzes del alumno
**Schema disponible:** `quiz_submissions` y `quiz_attempts`
Crear panel en `CourseDetailView.tsx`:
- Lista de quizzes completados con puntaje y fecha
- Indicar qué preguntas fallaron (si se almacenan)

### Tarea 3.3 — Notificaciones push para evaluaciones próximas
El módulo `evaluaciones` existe pero no genera notificaciones.
Agregar a `convex/crons.ts` un job diario que revise evaluaciones próximas (48h) y llame `fcm.ts` para notificar a los alumnos inscritos.

---

## FASE 4 — REFACTORIZACIÓN ARQUITECTÓNICA (2-4 semanas)

> Solo después de tener las fases anteriores resueltas.

### Tarea 4.1 — Dividir QuizPlayer.tsx (1.188 líneas)
Crear directorio `src/components/student/QuizPlayer/`:
```
QuizPlayer/
├── index.tsx           (orquestador + lógica común)
├── MultipleChoice.tsx
├── MatchGame.tsx
├── TrueFalse.tsx
├── FillBlank.tsx
├── WordSearch.tsx
├── QuizSprint.tsx
├── Memory.tsx
└── OrderSteps.tsx
```

### Tarea 4.2 — Mover auth components fuera de App.tsx
Crear `src/components/auth/`:
- `ProtectedRoute.tsx`
- `PublicOnlyRoute.tsx`
- `DashboardRedirect.tsx`

Y simplificar `App.tsx` a solo routing.

### Tarea 4.3 — Agregar lazy loading a rutas
```tsx
// En App.tsx
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'))
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'))
const BelbinTest = lazy(() => import('./pages/BelbinTest'))
```
Con `<Suspense fallback={<LoadingScreen />}>` wrapping las rutas.

### Tarea 4.4 — Eliminar `any` en archivos críticos
Priorizar:
1. `src/App.tsx` — usar `Doc<"users">` de Convex generated types
2. `src/lib/firebase.ts` — tipar app, analytics, messaging correctamente
3. `convex/withUser.ts` — usar discriminated union para MutationCtx vs QueryCtx

---

## FASE 5 — ACCESIBILIDAD Y UX (2 semanas)

### Tarea 5.1 — Agregar `aria-label` a botones de iconos
Priorizar navegación principal: tabs del alumno (emojis sin texto), botones de sidebar, botones de acción en tarjetas.

### Tarea 5.2 — Agregar Error Boundaries
Crear `src/components/ErrorBoundary.tsx` y wrappear:
- `<StudentDashboard>` con su propio boundary
- `<TeacherDashboard>` con su propio boundary
- `<QuizPlayer>` con boundary específico

### Tarea 5.3 — Exportación de datos para docentes
Agregar a `AnaliticasPanel.tsx` o nuevo panel:
- Exportar asistencia a Excel
- Exportar historial de quizzes por alumno
- Exportar resultados de evaluación IA

---

## FASE 6 — TESTING (ongoing)

### Tarea 6.1 — Tests de lógica crítica de Convex
Usar `convex-test` para testear:
- `courses.ts` — creación, permisos por owner
- `quizzes.ts` — generateQuiz, scoring
- `enrollments` — puntos, ranking

### Tarea 6.2 — Tests de componentes críticos
- `ProtectedRoute` — flujos de auth y redirect
- `QuizPlayer` — al menos un test por tipo de quiz
- `App` routing — navegación según rol

### Meta: 30% cobertura en 3 meses, 60% en 6 meses.

---

## RESUMEN DE PRIORIDADES

| Prioridad | Tareas | Esfuerzo estimado |
|-----------|--------|------------------|
| 🔴 URGENTE (esta semana) | 0.1, 0.2, 0.3, 0.4 | 2-4 horas |
| 🟠 ALTA (esta semana) | 1.1, 1.2, 1.3, 2.1, 2.2, 2.3 | 1-2 días |
| 🟡 MEDIA (próximas 2-3 semanas) | 2.4, 2.5, 3.1, 3.2, 3.3 | 2-3 semanas |
| 🟢 BAJA (próximo mes) | 4.x, 5.x | 4-6 semanas |
| 🔵 CONTINUO | 6.x (testing) | Ongoing |

---

## ARCHIVOS DE REFERENCIA
- [reporte-arquitectura.md](reporte-arquitectura.md)
- [reporte-calidad-codigo.md](reporte-calidad-codigo.md)
- [reporte-seguridad.md](reporte-seguridad.md)
- [reporte-dependencias.md](reporte-dependencias.md)
- [reporte-features-ux.md](reporte-features-ux.md)
