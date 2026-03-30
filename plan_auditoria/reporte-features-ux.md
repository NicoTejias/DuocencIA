# Reporte Auditoría de Features y UX — QuestIA
> Agente: analista-features | Fecha: 2026-03-30

## MAPA COMPLETO DE RUTAS
| Ruta | Componente | Protección |
|------|-----------|------------|
| `/` | LandingPage | Pública |
| `/login` | LoginPage | Solo no-autenticados |
| `/registro` | RegisterPage | Solo no-autenticados |
| `/alumno` | StudentDashboard | role=student |
| `/docente` | TeacherDashboard | role=teacher/admin |
| `/test-belbin` | BelbinTest | Autenticado |
| `/tienda/:courseId` | RewardStorePage | Autenticado |
| `/perfil` | ProfilePage | Autenticado |
| `/dashboard` | DashboardRedirect | Redirige según rol |
| `/auth-error` | AuthErrorPage | Pública |
| `*` | NotFoundPage | 404 |

## TABLAS CONVEX (29 tablas)
users, courses, whitelists, enrollments, missions, mission_submissions, rewards, redemptions, course_documents, quizzes, quiz_submissions, quiz_attempts, notifications, point_transfer_requests, messages, attendance_sessions, attendance_logs, badges, user_badges, feedback, grading_rubrics, grading_results, faqs, evaluaciones, institution_config, careers, admins, rate_limits, course_groups

## FEATURES INCOMPLETAS / ROTAS

### CRÍTICAS
1. **RewardStorePage** (`src/pages/RewardStorePage.tsx`) — Solo texto estático, no funciona. La ruta `/tienda/:courseId` es un placeholder.
2. **RewardStore.jsx** (`src/components/gamification/RewardStore.jsx`) — Import roto: usa `../../_generated/api` (debería ser `../../../convex/_generated/api`). Legacy sin usar.
3. **Badges** — Tablas `badges` y `user_badges` en schema pero CERO UI en frontend. Feature de gamificación sin implementar.
4. **BelbinTest** (`src/pages/BelbinTest.tsx:30`) — Texto corrupto con caracteres chinos: "Explorar soluciones nunca antes尝试adas"

### MENORES
5. **EvaluacionesPanel** (`src/components/student/EvaluacionesPanel.tsx:148`) — Typo: "No hay trabajosprogramados" (falta espacio)
6. **console.log en producción** (`src/components/PushNotificationManager.tsx:34,54`) — Loguea tokens de push
7. **autoEnroll silencia errores** (`src/pages/StudentDashboard.tsx:50`) — `.catch(() => { })` silencia fallo de enrolamiento, el alumno nunca sabe

## PROBLEMAS UX

### Accesibilidad (CRÍTICO)
- Solo 11 usos de `aria-` en toda la app
- Botones de iconos sin `aria-label`
- Tabs del alumno usan emojis como iconos sin texto accesible (📊🔔🎯🏆🎁👤❓)
- `window.confirm()` usado en 9 lugares — no accesible ni estilizable (el proyecto tiene `ConfirmModal.tsx` pero no se usa globalmente)
- Sin skip-to-content ni landmarks ARIA
- Contraste probable bajo WCAG AA en textos `text-slate-500/600`

### Otros UX
- Versión hardcodeada "Questia v1.1.0" en `TeacherDashboard.tsx:154` (debería leer de variable)
- Efemérides educativas con datos incorrectos (ej: fecha de nacimiento de Arturo Prat)
- Botón "SALIR" modo simulación puede solaparse con FeedbackButton en móvil

## FEATURES A ELIMINAR
1. `src/pages/RewardStorePage.tsx` — Placeholder sin funcionalidad
2. `src/components/gamification/RewardStore.jsx` — Legacy con import roto, funcionalidad ya existe en TiendaPanel
3. Efemérides educativas — Datos incorrectos, solo 12 entradas

## FEATURES FALTANTES DE ALTO IMPACTO
1. **UI de Badges/Insignias** — Schema existe, UI no existe. Gamificación básica sin implementar.
2. **Historial de quizzes del alumno** — Sin panel de progreso, puntajes históricos, revisión de errores.
3. **Exportación de datos para docentes** — Asistencia, notas IA, historial quizzes. Necesario para registros Duoc UC.
4. **Onboarding/tutorial guiado** — Plataforma compleja sin guía de primeros pasos para docentes nuevos.
5. **Notificaciones de evaluaciones próximas** — El módulo existe pero no genera push notifications.

## PUNTOS CIEGOS
- Sin integración con sistemas Duoc UC (SIGA) — duplicación de trabajo para docentes
- Sin reportes formales PDF/Excel para actas institucionales
- Sin modo offline real (PWA solo cachea assets)
- Sin progreso visual por competencia/unidad temática
- Sin recuperación de quiz interrumpido (crítico en móvil con conexión intermitente)
- Solo 1 archivo de test: `rutUtils.test.ts`
