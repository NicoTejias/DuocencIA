# Reporte Auditoría de Arquitectura — QuestIA
> Auditor: team-lead (directo) | Fecha: 2026-03-30

## ARQUITECTURA ACTUAL

### Estructura de carpetas
```
src/
├── pages/          # 9 páginas (LandingPage, Login, Register, StudentDashboard, TeacherDashboard, BelbinTest, ProfilePage, RewardStorePage, AuthErrorPage/NotFound)
├── components/
│   ├── student/    # 17 componentes exclusivos del alumno
│   ├── teacher/    # 13 componentes exclusivos del docente
│   ├── admin/      # 1 componente (FAQManager)
│   ├── auth/       # 1 componente (UserSync)
│   └── [raíz]     # 8 componentes globales (ConfirmModal, NotificationBell, ChatPanel, etc.)
├── hooks/          # 1 hook (useGooglePicker.ts)
├── utils/          # 4 utils (documentParser, rutUtils, dashboardUtils, ExportData)
├── lib/            # 1 archivo (firebase.ts)
├── context/        # 1 context (ThemeContext.tsx)
└── test/           # setup.ts + rutUtils.test.ts

convex/             # 37 archivos de backend
├── schema.ts       # Schema de DB (29 tablas)
├── withUser.ts     # Auth helpers (requireAuth/Teacher/Admin)
├── [módulos]       # courses, users, quizzes, missions, rewards, etc.
└── _generated/     # Auto-generado por Convex
```

### Patrón arquitectónico
**Híbrido feature-based + layer-based** dentro de components/ (student/ y teacher/ son feature-based). Las páginas actúan como "shells" con tabs, y la lógica real está en los paneles dentro de components/.

### Stack de proveedores (main.tsx)
```
ClerkProvider → ConvexProviderWithClerk → BrowserRouter → UserSync → ThemeProvider → App
```

### Modelo de datos Convex (29 tablas)
| Tabla | Propósito |
|-------|-----------|
| users | Usuarios + campos Belbin/Bartle/streak |
| courses | Ramos (vinculados a teacher_id) |
| whitelists | Lista blanca de alumnos por RUT/email |
| enrollments | Inscripción alumno-ramo + puntos |
| missions | Misiones por ramo |
| quizzes | Quizzes IA (10 tipos) |
| quiz_attempts | Intentos en progreso (para retomar) |
| quiz_submissions | Resultados finales |
| rewards | Recompensas por ramo |
| redemptions | Canjes de recompensas |
| course_documents | Documentos PDF/DOCX subidos |
| badges / user_badges | Insignias (sin UI frontend) |
| attendance_sessions / logs | Asistencia QR+geo |
| evaluaciones | Evaluaciones programadas |
| grading_rubrics / results | Evaluación IA con Gemini |
| messages | Chat por ramo |
| notifications | Notificaciones en-app |
| point_transfer_requests | Traspasos de puntos entre ramos |
| feedback | Feedback de usuarios |
| careers | Carreras (sin UI completa) |
| admins | Tabla de admins por email |
| faqs / institution_config / rate_limits | Config global |
| course_groups | Grupos Belbin |

## PROBLEMAS DE ARQUITECTURA

### Componentes gigantes (requieren refactorización urgente)
| Archivo | Líneas | Problema |
|---------|--------|---------|
| `src/components/student/QuizPlayer.tsx` | 1.188 | Maneja 9+ tipos de quiz en un solo componente. Debería dividirse en subcomponentes por tipo |
| `src/pages/BelbinTest.tsx` | 758 | Test de 56 preguntas con lógica de scoring mezclada con UI |
| `src/components/teacher/AdminPanel.tsx` | 592 | Panel de admin con múltiples responsabilidades |
| `src/pages/TeacherDashboard.tsx` | 553 | Shell con demasiada lógica propia (efemérides, stats, etc.) |
| `src/components/teacher/CourseDetail.tsx` | 523 | Gestión completa de un ramo en un componente |
| `src/components/teacher/MaterialPanel.tsx` | 516 | Upload + parsing + gestión en un solo componente |

### Inconsistencias de organización
- `src/components/gamification/RewardStore.jsx` — carpeta `gamification/` existe solo para este archivo legacy. Todo lo demás está en student/ o teacher/.
- Solo 1 hook en `hooks/` (`useGooglePicker.ts`). La lógica de hooks está dispersa en los componentes.
- `ThemeContext.tsx` está en `context/` pero `ThemeProvider.tsx` está en `components/`. Deberían estar juntos.

### Separación de responsabilidades
- `App.tsx` (296 líneas) contiene `ProtectedRoute`, `PublicOnlyRoute` y `DashboardRedirect` como componentes internos. Deberían estar en `components/auth/`.
- `ProtectedRoute` en `App.tsx:63` usa `(user as any)?.role` — type assertion innecesaria porque el tipo debería estar definido.
- `DashboardRedirect` en `App.tsx` tiene lógica compleja de retry con timeouts (hasta 8 segundos), setState dentro de efectos — patrón frágil.

### State management
- No hay state management global centralizado (Redux, Zustand). Todo es Convex queries + React state local.
- ThemeContext existe pero se usa poco (solo para dark/light mode).
- Prop drilling visible en algunos paneles (courseId pasado varios niveles).

## QUÉ ELIMINAR
- `src/components/gamification/RewardStore.jsx` — import roto, funcionalidad duplicada en TiendaPanel
- `src/pages/RewardStorePage.tsx` — placeholder sin implementar
- `convex/backup_system.ts` — query sin auth que expone TODOS los enrollments/users/courses al mundo (ver reporte seguridad)
- `convex/repair.ts` y `convex/admin_fix.ts` — revisar si son scripts de mantenimiento que quedaron olvidados

## QUÉ MEJORAR
1. Dividir `QuizPlayer.tsx` en subcomponentes: `QuizPlayerMultipleChoice`, `QuizPlayerMatch`, `QuizPlayerWordSearch`, etc.
2. Mover `ProtectedRoute`, `PublicOnlyRoute`, `DashboardRedirect` a `src/components/auth/`
3. Crear más custom hooks: `useQuiz`, `useCourse`, `useEnrollment` para extraer lógica de componentes grandes
4. Estandarizar la carpeta `hooks/` con hooks reutilizables
5. Unificar `ThemeContext.tsx` + `ThemeProvider.tsx` en `context/theme/`

## PUNTOS CIEGOS
- **Sin lazy loading de rutas**: Todas las páginas se cargan en el bundle inicial. Con `QuizPlayer` de 1.188 líneas y `BelbinTest` de 758, el bundle es innecesariamente grande.
- **Sin Error Boundaries**: Si un componente falla, toda la app cae. Solo hay un handler global en `main.tsx`.
- **Convex actions sin verificación de ownership en algunos casos**: Las actions (generateQuiz) solo verifican identidad pero no que el usuario sea teacher del curso específico.
