import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Tarea diaria que se ejecuta para avisar a los alumnos que están por perder su racha
export const checkStreaksAndNotify = action({
    args: {},
    handler: async (ctx) => {
        // 1. Obtener todos los alumnos que tienen una racha activa (>0)
        // Usamos una query para filtrar
        const usersToNotify = await ctx.runQuery(api.streak_reminders.getUsersForStreakReminder);


        for (const user of usersToNotify) {
            if (user.push_token) {
                await ctx.runAction(api.fcm.sendPushNotification, {
                    token: user.push_token,
                    title: "¡No pierdas tu racha! 🔥",
                    body: `Llevas ${user.daily_streak} días seguidos. ¡Entra y completa un quiz antes de que termine el día!`,
                });
                // Marcar como notificado hoy
                await ctx.runMutation(api.streak_reminders.markUserNotified, { userId: user._id });

            }
        }
    },
});

// Query interna para filtrar usuarios (las acciones no pueden leer BD directamente con filtros complejos)
export const getUsersForStreakReminder = query({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();
        const todayDateStr = new Date(now).toLocaleDateString('es-CL', { timeZone: 'America/Santiago' });
        
        // Obtenemos alumnos con racha
        const studentsWithStreak = await ctx.db
            .query("users")
            .filter((q) => q.and(
                q.eq(q.field("role"), "student"),
                q.gt(q.field("daily_streak"), 0)
            ))
            .collect();

        // Filtrar los que NO han recibido bono hoy
        return studentsWithStreak.filter(u => {
            const lastBonus = u.last_daily_bonus_at || 0;
            const lastBonusDateStr = lastBonus ? new Date(lastBonus).toLocaleDateString('es-CL', { timeZone: 'America/Santiago' }) : "";
            
            // Si el último bono no fue hoy, significa que aún no han jugado hoy
            const hasNotPlayedToday = lastBonusDateStr !== todayDateStr;
            
            // Y si no les hemos notificado ya hoy (para no spamear)
            const lastNotified = u.last_notified_streak_at || 0;
            const lastNotifiedDateStr = lastNotified ? new Date(lastNotified).toLocaleDateString('es-CL', { timeZone: 'America/Santiago' }) : "";
            const hasNotNotifiedToday = lastNotifiedDateStr !== todayDateStr;

            return hasNotPlayedToday && hasNotNotifiedToday;
        });
    }
});

// Mutación para marcar como notificado
export const markUserNotified = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, {
            last_notified_streak_at: Date.now()
        });
    }
});
