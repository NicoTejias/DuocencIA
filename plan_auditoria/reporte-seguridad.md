# Reporte Auditoría de Seguridad — QuestIA
> Auditor: team-lead (directo) | Fecha: 2026-03-30

## VULNERABILIDADES CRÍTICAS 🔴

### 1. `convex/backup_system.ts` — Endpoint público sin autenticación
**Severidad: CRÍTICA**

```ts
export const backupCurrentPoints = query({
    args: {},
    handler: async (ctx) => {
        // NO hay requireAuth ni requireTeacher
        const enrollments = await ctx.db.query("enrollments").collect();
        const users = await ctx.db.query("users").collect();
        const courses = await ctx.db.query("courses").collect();
        // Retorna TODOS los datos
    }
});
```

Cualquier persona con acceso a la URL de Convex puede llamar `api.backup_system.backupCurrentPoints` y obtener nombres, emails, RUTs, cursos y puntos de TODOS los usuarios del sistema. **Esto viola la Ley 19.628 de protección de datos personales en Chile.**

**Acción urgente:** Agregar `requireAdmin(ctx)` al inicio del handler, o eliminar el archivo si es un script temporal.

### 2. Archivos de Firebase Admin SDK en disco
**Severidad: ALTA**
- `duocencia-3904a-firebase-adminsdk-fbsvc-8b67425808.json`
- `duocencia-3904a-firebase-adminsdk-fbsvc-cb61efaf8d.json`

**Buena noticia:** Están en `.gitignore` con el patrón `*-firebase-adminsdk-*.json` — **NO están en el repositorio git**.

**Riesgo residual:** Existen en disco local. Si alguien accede a la máquina de desarrollo o si accidentalmente se comparte el directorio, estas service account keys (con acceso de admin a Firebase) estarían expuestas. Deberían eliminarse del directorio del proyecto y almacenarse en un gestor de credenciales.

### 3. `convex/repair.ts` y `convex/admin_fix.ts` — Scripts de mantenimiento sin revisión
Estos archivos no se revisaron en detalle pero sus nombres sugieren que son scripts de mantenimiento/reparación. Si no tienen autenticación adecuada, podrían permitir modificación masiva de datos.

## VULNERABILIDADES MEDIAS 🟡

### 4. `convex/users.ts:7` — `getUserById` sin autorización
```ts
export const getUserById = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.userId); // Sin auth
    },
});
```
Cualquier usuario autenticado (o no autenticado) puede consultar el perfil completo de cualquier usuario si conoce su ID. Incluye email, RUT, perfil Belbin, push_token, etc.

### 5. `convex/quizzes.ts` — Action `generateQuiz` verifica identidad pero no ownership del curso
```ts
// Solo verifica que hay identidad, no que el usuario sea teacher del curso
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error("No autenticado");
// No verifica: ¿es este usuario el docente del curso del documento?
```
Un alumno autenticado podría llamar `generateQuiz` con el `document_id` de cualquier otro curso.

### 6. `src/App.tsx:64` — Modo simulación alumno basado en `localStorage`
```ts
const isSimulating = localStorage.getItem('questia_simulate_student') === 'true';
```
El flag de "modo simulación" (para que docentes vean la vista de alumno) solo vive en `localStorage`. Si un alumno manipula su `localStorage`, ¿puede acceder a la ruta `/alumno` con privilegios simulados? La lógica en `ProtectedRoute` parece manejar esto correctamente (solo funciona si `userRole === 'teacher' || userRole === 'admin'`), pero el código en `App.tsx:204-206` lee `isSimulating` directamente sin revalidar el rol.

### 7. `push_token` en tabla `users`
El token FCM se guarda en la tabla de usuarios y es retornable por `getUserById` (sin auth). Un atacante que conozca un user_id podría obtener el push token y usarlo para enviar notificaciones fraudulentas a través de la API de Firebase.

## BUENAS PRÁCTICAS DETECTADAS ✅

1. **Firebase config via env vars** — `src/lib/firebase.ts` lee toda la config de `import.meta.env.VITE_FIREBASE_*`. No hay credenciales hardcodeadas en el código fuente.

2. **GEMINI_API_KEY en servidor** — La API key de Gemini se lee de `process.env.GEMINI_API_KEY` (backend Convex), **nunca en el frontend**. Correcto.

3. **`.gitignore` cubre archivos críticos** — `.env`, `.env.local`, `*-firebase-adminsdk-*.json`, `google-services.json` están en `.gitignore`.

4. **`requireAuth/requireTeacher/requireAdmin`** — `convex/withUser.ts` provee helpers de auth bien implementados, y la mayoría de mutations los usa (121 referencias en 21 archivos).

5. **Rate limiting** — `convex/rateLimit.ts` implementa límites para `quiz_submit`, `auto_enroll`, `feedback_submit`. Buena práctica anti-abuso.

6. **Sin `dangerouslySetInnerHTML`** — Búsqueda en todo `src/` no encontró ningún uso. XSS por este vector está bien cubierto.

7. **Validación de dominio institucional** — `convex/users.ts` valida que el email sea de dominios permitidos (configurable en `institution_config`).

8. **HTTPS forzado en Capacitor** — `capacitor.config.ts` tiene `cleartext: false` y `androidScheme: 'https'`.

## ACCIONES URGENTES (ordenadas por prioridad)

1. **INMEDIATO** — Agregar `requireAdmin(ctx)` a `convex/backup_system.ts` o eliminarlo. Datos personales de todos los usuarios expuestos sin auth.

2. **INMEDIATO** — Revisar `convex/repair.ts` y `convex/admin_fix.ts`. Si no tienen auth, agregarla o eliminarlos.

3. **ESTA SEMANA** — Agregar auth a `getUserById` en `convex/users.ts`. Solo debería retornar datos básicos públicos, o requerir que el solicitante sea el propio usuario o un docente del mismo curso.

4. **ESTA SEMANA** — Verificar ownership en `generateQuiz` action: que el `document_id` pertenezca a un curso donde el usuario sea docente.

5. **ESTE MES** — Eliminar los archivos `*firebase-adminsdk*.json` del directorio del proyecto y documentar dónde guardarlos (variables de entorno del servidor, secret manager, etc.).

6. **ESTE MES** — Revisar `push_token` — no incluirlo en queries públicas de usuario.
