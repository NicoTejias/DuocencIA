import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./withUser";
import { internal } from "./_generated/api";

export const getCareers = query({
    args: {},
    handler: async (ctx) => {
        await requireAdmin(ctx);
        return await ctx.db.query("careers").collect();
    },
});

// Query para que docentes puedan ver las carreras (solo lectura, para asignar ramos)
export const listCareers = query({
    args: {},
    handler: async (ctx) => {
        const careers = await ctx.db.query("careers").collect();
        return careers.map(c => ({ _id: c._id, name: c.name }));
    },
});

export const createCareer = mutation({
    args: {
        name: v.string(),
        coordinator_email: v.string(),
        director_email: v.string(),
        jefe_admin_email: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        return await ctx.db.insert("careers", {
            name: args.name,
            coordinator_email: args.coordinator_email,
            director_email: args.director_email,
            jefe_admin_email: args.jefe_admin_email,
            created_at: Date.now(),
        });
    },
});

export const updateCareer = mutation({
    args: {
        career_id: v.id("careers"),
        name: v.string(),
        coordinator_email: v.string(),
        director_email: v.string(),
        jefe_admin_email: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        const { career_id, ...fields } = args;
        await ctx.db.patch(career_id, fields);
    },
});

export const deleteCareer = mutation({
    args: { career_id: v.id("careers") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        await ctx.db.delete(args.career_id);
    },
});

// Trigger on-demand para que el admin envíe los reportes sin esperar el cron
export const sendReportsNow = mutation({
    args: {},
    handler: async (ctx) => {
        await requireAdmin(ctx);
        await ctx.scheduler.runAfter(0, internal.reports.sendWeeklyCoordinatorReports, {});
        await ctx.scheduler.runAfter(500, internal.reports.sendMonthlyDirectorReports, {});
        return { triggered: true };
    },
});
