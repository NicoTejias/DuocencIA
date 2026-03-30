import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireTeacher } from "./withUser";

// ─── Queries públicas / alumno ────────────────────────────────────────────────

/** Devuelve todas las insignias de un ramo (para panel docente y vista alumno). */
export const getBadgesByCourse = query({
    args: { course_id: v.id("courses") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("badges")
            .withIndex("by_course", (q) => q.eq("course_id", args.course_id))
            .collect();
    },
});

/** Insignias que el usuario autenticado ha ganado (en todos sus ramos). */
export const getMyBadges = query({
    handler: async (ctx) => {
        const user = await requireAuth(ctx);
        const userBadges = await ctx.db
            .query("user_badges")
            .withIndex("by_user_course", (q) => q.eq("user_id", user._id))
            .collect();

        const enriched = await Promise.all(
            userBadges.map(async (ub) => {
                const badge = await ctx.db.get(ub.badge_id);
                const course = await ctx.db.get(ub.course_id);
                return { ...ub, badge, courseName: course?.name, courseCode: course?.code };
            })
        );
        return enriched.filter((e) => e.badge !== null);
    },
});

// ─── Queries docente ──────────────────────────────────────────────────────────

/** Retorna los alumnos que tienen una insignia específica. */
export const getBadgeHolders = query({
    args: { badge_id: v.id("badges") },
    handler: async (ctx, args) => {
        await requireTeacher(ctx);
        const holders = await ctx.db
            .query("user_badges")
            .withIndex("by_badge", (q) => q.eq("badge_id", args.badge_id))
            .collect();

        return Promise.all(
            holders.map(async (ub) => {
                const user = await ctx.db.get(ub.user_id);
                return {
                    ...ub,
                    userName: user?.name || "Alumno",
                    userEmail: user?.email,
                };
            })
        );
    },
});

// ─── Mutations docente ────────────────────────────────────────────────────────

/** Crea una nueva insignia para un ramo. */
export const createBadge = mutation({
    args: {
        course_id: v.id("courses"),
        name: v.string(),
        description: v.string(),
        icon: v.string(),
        criteria_type: v.string(),
        criteria_value: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        await requireTeacher(ctx);
        return await ctx.db.insert("badges", args);
    },
});

/** Elimina una insignia y todos los user_badges asociados. */
export const deleteBadge = mutation({
    args: { badge_id: v.id("badges") },
    handler: async (ctx, args) => {
        await requireTeacher(ctx);
        const userBadges = await ctx.db
            .query("user_badges")
            .withIndex("by_badge", (q) => q.eq("badge_id", args.badge_id))
            .collect();
        for (const ub of userBadges) {
            await ctx.db.delete(ub._id);
        }
        await ctx.db.delete(args.badge_id);
    },
});

/** Otorga una insignia a un alumno (previene duplicados). */
export const awardBadge = mutation({
    args: {
        badge_id: v.id("badges"),
        student_id: v.id("users"),
        course_id: v.id("courses"),
    },
    handler: async (ctx, args) => {
        await requireTeacher(ctx);

        const existing = await ctx.db
            .query("user_badges")
            .withIndex("by_user_course", (q) =>
                q.eq("user_id", args.student_id).eq("course_id", args.course_id)
            )
            .filter((q) => q.eq(q.field("badge_id"), args.badge_id))
            .first();

        if (existing) {
            throw new Error("El alumno ya tiene esta insignia");
        }

        return await ctx.db.insert("user_badges", {
            user_id: args.student_id,
            badge_id: args.badge_id,
            course_id: args.course_id,
            earned_at: Date.now(),
        });
    },
});

/** Revoca una insignia de un alumno. */
export const revokeBadge = mutation({
    args: { user_badge_id: v.id("user_badges") },
    handler: async (ctx, args) => {
        await requireTeacher(ctx);
        await ctx.db.delete(args.user_badge_id);
    },
});
