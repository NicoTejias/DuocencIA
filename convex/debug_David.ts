import { query } from "./_generated/server";
import { v } from "convex/values";

export const getStudentEnrollments = query({
    args: { studentId: v.string() },
    handler: async (ctx, args) => {
        // 1. Find user by student_id
        const user = await ctx.db
            .query("users")
            .withIndex("by_student_id", q => q.eq("student_id", args.studentId))
            .first();
        
        if (!user) {
            return { error: "User not found with this student_id in profile" };
        }

        // 2. Find enrollments
        const enrollments = await ctx.db
            .query("enrollments")
            .withIndex("by_user", q => q.eq("user_id", user._id))
            .collect();
        
        const courses = [];
        for (const en of enrollments) {
            const course = await ctx.db.get(en.course_id);
            courses.push({
                enrollment: en,
                course: course
            });
        }

        return {
            user: { _id: user._id, name: user.name, email: user.email, student_id: user.student_id },
            courses: courses
        };
    }
});
