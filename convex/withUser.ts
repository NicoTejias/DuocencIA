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
        if (!identity.email) {
            throw new Error("El perfil de Clerk no contiene un correo electrónico válido.");
        }

        // Buscar por email
        const userByEmail = await ctx.db
            .query("users")
            .withIndex("email", (q) => q.eq("email", identity.email))
            .first();
        
        if (userByEmail) {
            // Intentar vincular clerkId si estamos en una mutación
            if ((ctx as any).db.patch) {
                try {
                    await (ctx as any).db.patch(userByEmail._id, { clerkId: identity.subject });
                } catch (e) { /* ignore */ }
            }
            return userByEmail;
        }
        
        throw new Error(`No se encontró registro para ${identity.email}. Verifica que estés registrado.`);
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
