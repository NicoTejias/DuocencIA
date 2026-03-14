import type { QueryCtx, MutationCtx } from "./_generated/server";

export async function requireAuth(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new Error("No autenticado por el proveedor externo");
    }

    // Buscar al usuario por su clerkId
    const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .first();

    if (!user) {
        // Podríamos intentar buscar por email si el clerkId no existe aún (migración)
        const userByEmail = await ctx.db
            .query("users")
            .withIndex("email", (q) => q.eq("email", identity.email))
            .first();
        
        if (userByEmail) {
            // Vincular el clerkId al usuario existente de forma silenciosa si es posible
            if ((ctx as any).db.patch) {
                try {
                    await (ctx as any).db.patch(userByEmail._id, { clerkId: identity.subject });
                } catch (e) {
                    // Fallar silenciosamente si es una query (no permite patch)
                }
            }
            return userByEmail;
        }
        
        throw new Error(`Usuario no encontrado en la base de datos para el correo: ${identity.email || 'desconocido'}`);
    }
    
    return user;
}

export async function requireTeacher(ctx: QueryCtx | MutationCtx) {
    const user = await requireAuth(ctx);
    if (user.role !== "teacher") {
        throw new Error("No tienes permisos de docente");
    }
    return user;
}
