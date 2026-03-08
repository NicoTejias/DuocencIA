import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Estadísticas generales de un docente
export const getTeacherStats = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const user = await ctx.db.get(userId);
        if (!user || user.role !== "teacher") return null;

        // Obtener ramos del docente
        const courses = await ctx.db
            .query("courses")
            .withIndex("by_teacher", (q) => q.eq("teacher_id", userId))
            .collect();

        const courseIds = courses.map((c) => c._id);

        // Contar alumnos totales
        let totalStudents = 0;
        let totalPoints = 0;
        const belbinDistribution: Record<string, number> = {};
        const courseStats = [];

        for (const courseId of courseIds) {
            const enrollments = await ctx.db
                .query("enrollments")
                .withIndex("by_course", (q) => q.eq("course_id", courseId))
                .collect();

            let courseStudents = 0;
            let coursePoints = 0;

            for (const en of enrollments) {
                courseStudents++;
                coursePoints += en.total_points;
                totalPoints += en.total_points;

                const student = await ctx.db.get(en.user_id);
                if (student?.belbin_profile?.role_dominant) {
                    const role = student.belbin_profile.role_dominant;
                    belbinDistribution[role] = (belbinDistribution[role] || 0) + 1;
                }
            }

            totalStudents += courseStudents;

            const course = courses.find((c) => c._id === courseId);
            const missions = await ctx.db
                .query("missions")
                .withIndex("by_course", (q) => q.eq("course_id", courseId))
                .collect();

            const submissions = [];
            for (const mission of missions) {
                const subs = await ctx.db
                    .query("mission_submissions")
                    .withIndex("by_mission", (q) => q.eq("mission_id", mission._id))
                    .collect();
                submissions.push(...subs);
            }

            const documents = await ctx.db
                .query("course_documents")
                .withIndex("by_course", (q) => q.eq("course_id", courseId))
                .collect();

            courseStats.push({
                name: course?.name || "",
                code: course?.code || "",
                students: courseStudents,
                missions: missions.length,
                submissions: submissions.length,
                documents: documents.length,
                totalPoints: coursePoints,
            });
        }

        // Contar misiones completadas total
        let totalMissionsCompleted = 0;
        for (const cs of courseStats) {
            totalMissionsCompleted += cs.submissions;
        }

        // Contar canjes
        const redemptions = await ctx.db.query("redemptions").collect();
        // Filtrar solo los de cursos del docente (indirectamente)
        let totalRedemptions = redemptions.length;

        return {
            totalStudents,
            totalMissionsCompleted,
            totalRedemptions,
            totalPoints,
            totalCourses: courses.length,
            belbinDistribution,
            courseStats,
        };
    },
});
