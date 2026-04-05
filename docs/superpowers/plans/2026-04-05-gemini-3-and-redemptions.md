# Plan de Implementación: Gestión Centralizada de Canjes y Gemini 3

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar al modelo Gemini 3 y crear una interfaz centralizada para que los profesores gestionen canjes de recompensas de todos sus ramos en un solo lugar.

**Architecture:** 
1. Actualización de jerarquía de modelos en `geminiClient`.
2. Nueva query en `convex/redemptions.ts` que aggrega canjes por docente.
3. Nuevo componente `GestionCanjesPanel` integrado como pestaña en el Dashboard docente.
4. Mejora interactiva en `NotificationBell`.

**Tech Stack:** Convex (Backend), React + Tailwind (Frontend), Lucide Icons.

---

### Tarea 1: Actualizar Modelo AI y Reglas de Idioma
**Files:**
- Modify: `convex/geminiClient.ts`
- Create: `GEMINI.md`

- [ ] **Paso 1: Actualizar `GEMINI_MODELS` y comentarios**
```typescript
// convex/geminiClient.ts
const GEMINI_MODELS = [
    "gemini-3-flash-preview", 
    "gemini-2.5-flash"
];
```
- [ ] **Paso 2: Actualizar `getGeminiModel` (default value)**
```typescript
export async function getGeminiModel(modelName = "gemini-3-flash-preview") { ... }
```
- [ ] **Paso 3: Crear `GEMINI.md` en la raíz**
Contenido: "Siempre responde en español. Prioriza modelos Gemini 3 para generación de contenido académico."

---

### Tarea 2: Backend - Queries para Canjes Centralizados
**Files:**
- Modify: `convex/redemptions.ts` (Validar si existe o crear)

- [ ] **Paso 1: Crear query `getTeacherRedemptions`**
Debe obtener todos los cursos del docente y luego todos los canjes asociados a esos cursos.
```typescript
export const getTeacherRedemptions = query({
    args: { status: v.optional(v.union(v.literal("pending"), v.literal("completed"))) },
    handler: async (ctx, args) => {
        const user = await requireTeacher(ctx);
        const myCourses = await ctx.db.query("courses").withIndex("by_teacher", q => q.eq("teacher_id", user._id)).collect();
        const courseIds = myCourses.map(c => c._id);
        
        // Obtener todas las recompensas de esos ramos para cruzar
        const rewards = await ctx.db.query("rewards").collect(); // Optimizar si hay muchos
        const myRewardsMap = new Map(rewards.filter(r => courseIds.includes(r.course_id)).map(r => [r._id, r]));
        
        const allRedemptions = await ctx.db.query("redemptions").collect();
        const myRedemptions = allRedemptions.filter(r => myRewardsMap.has(r.reward_id));
        
        // Filtrar por status si se pide
        const filtered = args.status ? myRedemptions.filter(r => r.status === args.status) : myRedemptions;
        
        // Enriquecer con datos de usuario y recompensa
        return await Promise.all(filtered.map(async (r) => {
            const student = await ctx.db.get(r.user_id);
            const reward = myRewardsMap.get(r.reward_id);
            const course = myCourses.find(c => c._id === reward?.course_id);
            return {
                ...r,
                studentName: student?.name || "Desconocido",
                rewardName: reward?.name || "Eliminada",
                courseName: course?.name || "Desconocido"
            };
        }));
    }
});
```

---

### Tarea 3: Frontend - Panel de Gestión de Canjes
**Files:**
- Create: `src/components/teacher/GestionCanjesPanel.tsx`

- [ ] **Paso 1: Implementar el panel con tabla y acciones**
Debe mostrar la lista obtenida de `getTeacherRedemptions` y permitir marcar como completado.

---

### Tarea 4: Frontend - Integración en Dashboard
**Files:**
- Modify: `src/pages/TeacherDashboard.tsx`

- [ ] **Paso 1: Añadir pestaña "Canjes" al arreglo `tabs`**
```typescript
{ id: 'canjes', label: 'Gestión Canjes', icon: <ArrowRightLeft className="w-5 h-5" /> }
```
- [ ] **Paso 2: Renderizar `GestionCanjesPanel` cuando `activeTab === 'canjes'`**

---

### Tarea 5: Frontend - Notificaciones Interactivas
**Files:**
- Modify: `src/components/NotificationBell.tsx`

- [ ] **Paso 1: Manejar el clic en notificaciones de tipo 'redemption'**
Si el tipo es canje, redirigir a la pestaña `canjes`.
- [ ] **Paso 2: Mostrar botón "Entregar" directamente en el dropdown**
Añadir una acción rápida si la notificación tiene un `related_id` de canje pendiente.

---

### Tarea 6: Verificación Final
- [ ] **Paso 1: Test de generación de Quiz con Gemini 3**
- [ ] **Paso 2: Test de flujo completo de Canje -> Notificación -> Entrega rápida**
