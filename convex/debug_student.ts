import { query } from "./_generated/server";
import { v } from "convex/values";

export const findStudentInWhitelists = query({
    args: { searchTerm: v.string() },
    handler: async (ctx, args) => {
        const allWhitelists = await ctx.db.query("whitelists").collect();
        const matches = allWhitelists.filter(w => 
            w.student_name?.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
            w.student_identifier.includes(args.searchTerm)
        );

        const results = [];
        for (const m of matches) {
            const course = await ctx.db.get(m.course_id);
            results.push({
                whitelist: m,
                courseName: course?.name,
                courseCode: course?.code
            });
        }
        return results;
    }
});
