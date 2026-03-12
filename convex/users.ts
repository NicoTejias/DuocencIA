import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { normalizeRut } from "./rutUtils";
import { requireAuth } from "./withUser";
import { getAuthUserId } from "@convex-dev/auth/server";

// Obtener el perfil del usuario actual autenticado
export const getProfile = query({
    args: {},
    handler: async (ctx) => {
        try {
            const userId = await getAuthUserId(ctx);
            if (!userId) return null;
            const user = await ctx.db.get(userId);
            if (!user) return null;

            // Retornar el perfil con un is_verified calculado
            return {
                ...user,
                is_verified: !!(user.is_verified || user.emailVerificationTime)
            };
        } catch (e) {
            console.error("Error in getProfile:", e);
            return null;
        }
    },
});

export const saveBelbinProfile = mutation({
    args: {
        role_dominant: v.string(),
        category: v.string(),
        scores: v.object({
            Cerebro: v.optional(v.number()),
            Evaluador: v.optional(v.number()),
            Especialista: v.optional(v.number()),
            Impulsor: v.optional(v.number()),
            Implementador: v.optional(v.number()),
            Finalizador: v.optional(v.number()),
            Coordinador: v.optional(v.number()),
            Investigador: v.optional(v.number()),
            Cohesionador: v.optional(v.number())
        }),
    },
    handler: async (ctx, args) => {
        const user = await requireAuth(ctx);

        await ctx.db.patch(user._id, {
            belbin_profile: {
                role_dominant: args.role_dominant,
                category: args.category,
                scores: args.scores,
            },
        });

        return { success: true };
    },
});

// Auto-enrollment: cruza el student_id con las whitelists activas
// Normaliza el RUT del alumno antes de comparar para evitar problemas de formato
export const autoEnroll = mutation({
    args: {},
    handler: async (ctx) => {
        const user = await requireAuth(ctx);
        if (!user || !user.student_id) return { enrolled: 0 };

        // Normalizar el RUT del alumno para que matchee con la whitelist
        const normalizedId = normalizeRut(user.student_id);
        const rawId = user.student_id.trim();

        // Buscar por RUT normalizado Y por RUT sin normalizar (para backwards compatibility)
        const byNormalized = normalizedId
            ? await ctx.db
                .query("whitelists")
                .withIndex("by_identifier", (q) =>
                    q.eq("student_identifier", normalizedId)
                )
                .collect()
            : [];

        const byRaw = await ctx.db
            .query("whitelists")
            .withIndex("by_identifier", (q) =>
                q.eq("student_identifier", rawId)
            )
            .collect();

        // Combinar sin duplicados
        const seen = new Set<string>();
        const matchingWhitelists = [];
        for (const item of [...byNormalized, ...byRaw]) {
            if (!seen.has(item._id)) {
                seen.add(item._id);
                matchingWhitelists.push(item);
            }
        }

        let enrolled = 0;
        for (const item of matchingWhitelists) {
            // Verificar que no exista ya la inscripción
            const existing = await ctx.db
                .query("enrollments")
                .withIndex("by_user", (q) => q.eq("user_id", user._id))
                .filter((q) => q.eq(q.field("course_id"), item.course_id))
                .unique();

            if (!existing) {
                await ctx.db.insert("enrollments", {
                    user_id: user._id,
                    course_id: item.course_id,
                    ranking_points: 0,
                    spendable_points: 0,
                    total_points: 0, // Legacy compatibility
                });
                enrolled++;
            }
        }

        return { enrolled };
    },
});

// Verifica si un RUT está en alguna whitelist para permitir el registro
export const checkWhitelist = query({
    args: { student_id: v.string() },
    handler: async (ctx, args) => {
        const normalized = normalizeRut(args.student_id);
        const entry = await ctx.db
            .query("whitelists")
            .withIndex("by_identifier", (q) => q.eq("student_identifier", normalized))
            .first();
        return { allowed: !!entry };
    },
});

export const updateProfile = mutation({
    args: {
        name: v.optional(v.string()),
        student_id: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await requireAuth(ctx);
        const patch: any = {};
        if (args.name !== undefined) patch.name = args.name;

        if (args.student_id !== undefined) {
            // Normalizar si es alumno
            patch.student_id = (user.role === "student")
                ? normalizeRut(args.student_id)
                : args.student_id;
        }

        if (Object.keys(patch).length > 0) {
            await ctx.db.patch(user._id, patch);
        }
        return { success: true };
    },
});

export const verifyAccount = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("No autenticado");
        await ctx.db.patch(userId, { is_verified: true });
        return { success: true };
    },
});

// Mutación de utilidad para corregir IDs no normalizados y sincronizar inscripciones
export const fixAllStudentIds = mutation({
    args: {},
    handler: async (ctx) => {
        // Obtenemos todos los usuarios y whitelists
        const users = await ctx.db.query("users").collect();
        const whitelists = await ctx.db.query("whitelists").collect();

        let fixed = 0;
        let enrolled = 0;

        for (const u of users) {
            // Solo normalizamos e inscribimos si es alumno y tiene ID
            if (u.role === "student" && u.student_id) {
                let currentId = u.student_id;
                const normalized = normalizeRut(u.student_id);

                // 1. Corregir formato del ID
                if (normalized && normalized !== u.student_id) {
                    await ctx.db.patch(u._id, { student_id: normalized });
                    currentId = normalized;
                    fixed++;
                }

                // 2. Sincronizar con Whitelist
                const cleanId = currentId.replace(/[^\dkK]/g, '').toUpperCase();

                for (const w of whitelists) {
                    const wNormalized = w.student_identifier ? normalizeRut(w.student_identifier) : null;
                    const wClean = w.student_identifier ? w.student_identifier.replace(/[^\dkK]/g, '').toUpperCase() : "";

                    if (
                        (wNormalized && wNormalized === currentId) ||
                        (wClean && wClean === cleanId) ||
                        (w.student_identifier === currentId)
                    ) {
                        // Coinciden los IDs. Verificar si ya existe inscripción (enrollment)
                        const existing = await ctx.db
                            .query("enrollments")
                            .withIndex("by_user", (q) => q.eq("user_id", u._id))
                            .filter((q) => q.eq(q.field("course_id"), w.course_id))
                            .unique();

                        if (!existing) {
                            await ctx.db.insert("enrollments", {
                                user_id: u._id,
                                course_id: w.course_id,
                                ranking_points: 0,
                                spendable_points: 0,
                                total_points: 0,
                                section: w.section || undefined,
                            });
                            enrolled++;
                        }
                    }
                }
            }
        }
        return { fixed, enrolled };
    }
});

// Compra de "Congelar Racha" (Ice Cube)
export const buyIceCube = mutation({
    args: { course_id: v.id("courses") },
    handler: async (ctx, args) => {
        const user = await requireAuth(ctx);
        const COST = 200;

        // 1. Verificar inscripción y puntos disponibles en ese ramo
        const enrollment = await ctx.db
            .query("enrollments")
            .withIndex("by_user", (q) => q.eq("user_id", user._id))
            .filter((q) => q.eq(q.field("course_id"), args.course_id))
            .unique();

        if (!enrollment) throw new Error("No estás inscrito en este ramo");
        
        const currentPoints = enrollment.spendable_points ?? 0;
        if (currentPoints < COST) {
            throw new Error(`Puntos insuficientes. Necesitas ${COST} puntos y tienes ${currentPoints}.`);
        }

        // 2. Descontar puntos
        await ctx.db.patch(enrollment._id, {
            spendable_points: currentPoints - COST,
            // total_points se mantiene igual ya que es el acumulado histórico
        });

        // 3. Otorgar el "Cubo de Hielo"
        const currentCubes = user.ice_cubes || 0;
        await ctx.db.patch(user._id, {
            ice_cubes: currentCubes + 1
        });

        return { success: true, new_cubes: currentCubes + 1 };
    },
});

export const savePushToken = mutation({
    args: { token: v.string() },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("No autenticado");
        await ctx.db.patch(userId, { push_token: args.token });
    },
});
