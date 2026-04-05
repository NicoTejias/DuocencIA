# Diseño: Gestión Centralizada de Canjes y Mejora de Notificaciones

**Fecha:** 2026-04-05
**Estado:** Implementado
**Contexto:** Actualmente, los profesores deben navegar curso por curso para ver y procesar canjes de recompensas. Además, las notificaciones de canjes son pasivas (no permiten acción directa ni navegación).

## Objetivos
1. Crear una vista única para que el docente gestione todos los canjes pendientes de todos sus cursos.
2. Hacer que las notificaciones sean interactivas, permitiendo marcar un canje como "entregado" directamente desde la campana.
3. Asegurar que el clic en la notificación lleve al usuario al lugar correcto.

## Arquitectura de Datos (Convex)
*   **Queries**: Creada `rewards:getTeacherRedemptions` que agrega los canjes de todos los ramos del docente.
*   **Mutations**: `rewards:markRedemptionDelivered` permite marcar el canje como completado.
*   **Notificaciones**: `related_id` ahora contiene el `redemptionId` para permitir acciones rápidas.

## Cambios en el Frontend (React/Vite)

### 1. Panel Centralizado de Canjes (`/teacher/redemptions`)
*   Sección en el panel lateral del profesor.
*   Tabla con columnas: Alumno, Recompensa, Curso, Fecha y Botón de Acción.
*   Filtros por Estado (Pendiente/Completado) y Curso.

### 2. Notificaciones Interactivas (`NotificationBell.tsx`)
*   Detectar notificaciones de tipo `redemption`.
*   Añadir botón "Marcar como Entregado" en la previsualización de la notificación.
*   Vincular el clic en la notificación para que redirija a la nueva página de gestión centralizada.

### 3. Integración de Modelo AI
*   (Ya acordado) Actualizar `convex/geminiClient.ts` para usar `gemini-3-flash-preview` como modelo primario.

## Plan de Verificación
1. Simular un canje de un alumno en un curso X.
2. Verificar que el profesor reciba la notificación y que aparezca el botón de acción rápida.
3. Verificar que el canje aparezca en la lista centralizada de todos los cursos.

---
**Nota de Idioma:** Todas las interacciones del sistema y feedback al usuario deben estar en español.
