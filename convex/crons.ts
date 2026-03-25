import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { api } from "./_generated/api";
import { pushNotification } from "./notifications";

// Job que se ejecuta semanalmente para detectar riesgo de deserción
export const checkRetentionAlerts = internalMutation({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();
        const FiveDaysMs = 5 * 24 * 60 * 60 * 1000;
        const TenDaysMs = 10 * 24 * 60 * 60 * 1000;
        const FourteenDaysMs = 14 * 24 * 60 * 60 * 1000;

        // 1. Obtener todas las carreras y sus contactos
        const careers = await ctx.db.query("careers").collect();
        const alertReports: Record<string, any> = {};

        for (const career of careers) {
            alertReports[career._id] = {
                careerName: career.name,
                coordinator: career.coordinator_email,
                director: career.director_email,
                jefeAdmin: career.jefe_admin_email,
                studentsAtRisk: {
                    low: [],    // 5 días
                    medium: [], // 10 días
                    high: []    // 14 días (Crítico)
                }
            };
        }

        // 2. Obtener todos los alumnos y sus últimos accesos (usando last_daily_bonus_at como proxy de actividad)
        const students = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("role"), "student"))
            .collect();

        for (const student of students) {
            const lastActivity = student.last_daily_bonus_at || 0;
            const inactivityDays = (now - lastActivity);
            
            let riskLevel: "low" | "medium" | "high" | null = null;
            if (inactivityDays >= FourteenDaysMs) riskLevel = "high";
            else if (inactivityDays >= TenDaysMs) riskLevel = "medium";
            else if (inactivityDays >= FiveDaysMs) riskLevel = "low";

            if (riskLevel) {
                // Buscar a qué carrera pertenece el alumno viendo sus enrollments
                const enrollments = await ctx.db
                    .query("enrollments")
                    .withIndex("by_user", (q) => q.eq("user_id", student._id))
                    .collect();

                const careerIds = new Set<string>();
                for (const en of enrollments) {
                    const course = await ctx.db.get(en.course_id);
                    if (course?.career_id) {
                        careerIds.add(course.career_id);
                    }
                }

                // Notificar al alumno de su propio riesgo (Incentivo)
                await pushNotification(
                    ctx,
                    student._id,
                    "🚨 ¡Te extrañamos en QuestIA!",
                    "Llevas varios días sin actividad. ¡Vuelve hoy para mantener tu racha y evitar alertas institucionales!",
                    "system"
                );

                // Agregar al reporte de las carreras correspondientes
                for (const careerId of careerIds) {
                    if (alertReports[careerId]) {
                        alertReports[careerId].studentsAtRisk[riskLevel].push({
                            name: student.name,
                            email: student.email,
                            days: Math.floor(inactivityDays / (24 * 60 * 60 * 1000))
                        });
                    }
                }
            }
        }

        // 3. Enviar reportes (Simulado por ahora con logs y notificaciones de sistema a admins)
        // En una implementación real, aquí se llamaría a un servicio de email (SendGrid/Resend)
        for (const careerId in alertReports) {
            const report = alertReports[careerId];
            const totalAtRisk = report.studentsAtRisk.low.length + report.studentsAtRisk.medium.length + report.studentsAtRisk.high.length;

            if (totalAtRisk > 0) {
                console.log(`[RETENTION ALERT] Carrera: ${report.careerName} - ${totalAtRisk} alumnos en riesgo.`);
                // Aquí iría la lógica de envío de email institucional
            }
        }

        return { success: true, processedCareers: careers.length };
    }
});
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Ejecutar reporte de retenciones todos los Lunes a las 08:00 AM CL
crons.weekly(
    "weekly-retention-report",
    { dayOfWeek: "monday", hourUTC: 12, minuteUTC: 0 }, // 12 UTC = 08:00 AM CL (aprox)
    internal.crons.checkRetentionAlerts
);

export default crons;
