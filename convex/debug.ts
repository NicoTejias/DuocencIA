import { query } from "./_generated/server";
import { v } from "convex/values";

export const checkCourseWhitelist = query({
    args: { courseName: v.string(), section: v.string() },
    handler: async (ctx, args) => {
        // 1. Buscar el ramo (PÚBLICO PARA DEBUG REQUERIDO POR USUARIO)
        const courses = await ctx.db
            .query("courses")
            .collect();
        
        const targetCourse = courses.find(c => 
            c.name.toLowerCase().includes(args.courseName.toLowerCase()) || 
            c.code.toLowerCase().includes(args.courseName.toLowerCase())
        );

        if (!targetCourse) {
            return { error: "Course not found", availableCourses: courses.map(c => c.name) };
        }

        // 2. Buscar en la whitelist para ese ramo y sección
        const whitelistEntries = await ctx.db
            .query("whitelists")
            .withIndex("by_course", q => q.eq("course_id", targetCourse._id))
            .collect();
        
        const sectionEntries = whitelistEntries.filter(w => 
            w.section?.toLowerCase().includes(args.section.toLowerCase())
        );

        return {
            course: targetCourse.name,
            courseId: targetCourse._id,
            totalWhitelist: whitelistEntries.length,
            sectionMatches: sectionEntries.length,
            sampleEntries: sectionEntries.slice(0, 50).map(e => ({
                id: e.student_identifier,
                name: e.student_name,
                section: e.section
            }))
        };
    }
});
