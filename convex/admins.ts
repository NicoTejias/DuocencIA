import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin, requireAuth } from "./withUser";

export const addAdmin = mutation({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const currentUser = await requireAdmin(ctx);
        
        if (!args.email || !args.email.includes("@")) {
            throw new Error("Email inválido");
        }
        
        const existing = await ctx.db
            .query("admins")
            .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
            .first();
            
        if (existing) {
            throw new Error("Este usuario ya es administrador");
        }
        
        return await ctx.db.insert("admins", {
            email: args.email.toLowerCase(),
            created_at: Date.now(),
            created_by: currentUser._id,
        });
    },
});

export const removeAdmin = mutation({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        
        const admin = await ctx.db
            .query("admins")
            .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
            .first();
            
        if (!admin) {
            throw new Error("Este usuario no es administrador");
        }
        
        await ctx.db.delete(admin._id);
        return { success: true };
    },
});

export const listAdmins = query({
    args: {},
    handler: async (ctx) => {
        await requireAuth(ctx);
        return await ctx.db.query("admins").collect();
    },
});

export const isAdminEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const admin = await ctx.db
            .query("admins")
            .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
            .first();
        return !!admin;
    },
});
