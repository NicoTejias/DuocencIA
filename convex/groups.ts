import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireTeacher } from "./withUser";

// Generar grupos inteligentes basados en perfiles Belbin
// Los grupos persisten hasta el fin del semestre (expires_at)
export const generateGroups = mutation({
    args: {
        course_id: v.id("courses"),
        group_size: v.number(),
        semester_end: v.optional(v.number()), // Timestamp fin de semestre
    },
    handler: async (ctx, args) => {
        const user = await requireTeacher(ctx);

        const course = await ctx.db.get(args.course_id);
        if (!course || (course.teacher_id !== user._id && user.role !== "admin")) {
            throw new Error("No autorizado para este ramo");
        }

        if (args.group_size < 2 || args.group_size > 8) {
            throw new Error("El tamaño del grupo debe ser entre 2 y 8");
        }

        // Obtener alumnos inscritos
        const enrollments = await ctx.db
            .query("enrollments")
            .withIndex("by_course", (q) => q.eq("course_id", args.course_id))
            .collect();

        if (enrollments.length < 2) {
            throw new Error("Se necesitan al menos 2 alumnos inscritos para generar grupos");
        }

        // Obtener datos de alumnos
        const userIds = new Set(enrollments.map(e => e.user_id));
        const users = await Promise.all(Array.from(userIds).map(id => ctx.db.get(id)));
        const userMap = new Map(users.filter(u => u !== null).map(u => [u._id, u]));

        const students = [];
        for (const en of enrollments) {
            const student = userMap.get(en.user_id);
            if (student) {
                students.push({
                    userId: student._id,
                    name: student.name || "Sin nombre",
                    belbinRole: student.belbin_profile?.role_dominant || "Sin determinar",
                    belbinCategory: student.belbin_profile?.category || "Sin categoría",
                    enrollmentId: en._id,
                });
            }
        }

        // Algoritmo de balanceo Belbin
        const mental = students.filter(s => s.belbinCategory === "Mental");
        const social = students.filter(s => s.belbinCategory === "Social");
        const accion = students.filter(s => s.belbinCategory === "Acción");
        const sinCategoria = students.filter(s => s.belbinCategory === "Sin categoría");

        const shuffle = <T,>(arr: T[]): T[] => {
            const a = [...arr];
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        };

        const shuffledMental = shuffle(mental);
        const shuffledSocial = shuffle(social);
        const shuffledAccion = shuffle(accion);
        const shuffledSin = shuffle(sinCategoria);

        const pool: typeof students = [];
        const maxLen = Math.max(shuffledMental.length, shuffledSocial.length, shuffledAccion.length, shuffledSin.length);

        for (let i = 0; i < maxLen; i++) {
            if (i < shuffledMental.length) pool.push(shuffledMental[i]);
            if (i < shuffledSocial.length) pool.push(shuffledSocial[i]);
            if (i < shuffledAccion.length) pool.push(shuffledAccion[i]);
            if (i < shuffledSin.length) pool.push(shuffledSin[i]);
        }

        const numGroups = Math.ceil(pool.length / args.group_size);
        const groups: (typeof students)[] = Array.from({ length: numGroups }, () => []);

        pool.forEach((student, index) => {
            groups[index % numGroups].push(student);
        });

        // Crear grupos en la tabla course_groups y asignar a enrollments
        const expiresAt = args.semester_end || (Date.now() + 180 * 24 * 60 * 60 * 1000); // 180 días por defecto
        const createdGroups: { id: any, name: string }[] = [];

        for (let groupIdx = 0; groupIdx < groups.length; groupIdx++) {
            const groupName = `Grupo ${groupIdx + 1}`;
            
            const groupId = await ctx.db.insert("course_groups", {
                course_id: args.course_id,
                name: groupName,
                created_at: Date.now(),
                created_by: user._id,
                expires_at: expiresAt,
            });

            createdGroups.push({ id: groupId, name: groupName });

            for (const student of groups[groupIdx]) {
                await ctx.db.patch(student.enrollmentId, {
                    group_id: groupId,
                });
            }
        }

        return {
            total_students: students.length,
            total_groups: groups.length,
            expires_at: expiresAt,
            groups: groups.map((members, i) => ({
                id: createdGroups[i].id,
                name: createdGroups[i].name,
                members: members.map(m => ({
                    name: m.name,
                    belbinRole: m.belbinRole,
                    belbinCategory: m.belbinCategory,
                })),
                stats: {
                    mental: members.filter(m => m.belbinCategory === "Mental").length,
                    social: members.filter(m => m.belbinCategory === "Social").length,
                    accion: members.filter(m => m.belbinCategory === "Acción").length,
                    sinCategoria: members.filter(m => m.belbinCategory === "Sin categoría").length,
                },
            })),
        };
    },
});

// Obtener grupos de un ramo
export const getGroups = query({
    args: { course_id: v.id("courses") },
    handler: async (ctx, args) => {
        try {
            await requireAuth(ctx);

            const courseGroups = await ctx.db
                .query("course_groups")
                .withIndex("by_course", (q) => q.eq("course_id", args.course_id))
                .collect();

            const enrollments = await ctx.db
                .query("enrollments")
                .withIndex("by_course", (q) => q.eq("course_id", args.course_id))
                .collect();

            const userIds = new Set(enrollments.map(e => e.user_id));
            const users = await Promise.all(Array.from(userIds).map(id => ctx.db.get(id)));
            const userMap = new Map(users.filter(u => u !== null).map(u => [u._id, u]));

            const result = courseGroups.map(group => {
                const members = enrollments
                    .filter(en => en.group_id === group._id)
                    .map(en => {
                        const student = userMap.get(en.user_id);
                        return {
                            name: student?.name || "Sin nombre",
                            belbinRole: student?.belbin_profile?.role_dominant || "Sin determinar",
                            belbinCategory: student?.belbin_profile?.category || "Sin categoría",
                            points: en.ranking_points ?? en.total_points ?? 0,
                        };
                    });

                return {
                    id: group._id,
                    name: group.name,
                    created_at: group.created_at,
                    expires_at: group.expires_at,
                    members,
                    stats: {
                        mental: members.filter(m => m.belbinCategory === "Mental").length,
                        social: members.filter(m => m.belbinCategory === "Social").length,
                        accion: members.filter(m => m.belbinCategory === "Acción").length,
                        total: members.length,
                    },
                };
            });

            return result;
        } catch {
            return [];
        }
    },
});

// Eliminar grupos de un curso
export const deleteGroups = mutation({
    args: { course_id: v.id("courses") },
    handler: async (ctx, args) => {
        const user = await requireTeacher(ctx);

        const course = await ctx.db.get(args.course_id);
        if (!course || (course.teacher_id !== user._id && user.role !== "admin")) {
            throw new Error("No autorizado para este ramo");
        }

        const groups = await ctx.db
            .query("course_groups")
            .withIndex("by_course", (q) => q.eq("course_id", args.course_id))
            .collect();

        const enrollments = await ctx.db
            .query("enrollments")
            .withIndex("by_course", (q) => q.eq("course_id", args.course_id))
            .collect();

        for (const group of groups) {
            await ctx.db.delete(group._id);
        }

        for (const en of enrollments) {
            if (en.group_id) {
                await ctx.db.patch(en._id, { group_id: undefined });
            }
        }

        return { deleted: groups.length };
    },
});

// Extender fecha de expiración de grupos
export const extendGroups = mutation({
    args: {
        course_id: v.id("courses"),
        new_expiry: v.number(),
    },
    handler: async (ctx, args) => {
        const user = await requireTeacher(ctx);

        const course = await ctx.db.get(args.course_id);
        if (!course || (course.teacher_id !== user._id && user.role !== "admin")) {
            throw new Error("No autorizado para este ramo");
        }

        const groups = await ctx.db
            .query("course_groups")
            .withIndex("by_course", (q) => q.eq("course_id", args.course_id))
            .collect();

        for (const group of groups) {
            await ctx.db.patch(group._id, { expires_at: args.new_expiry });
        }

        return { extended: groups.length };
    },
});
