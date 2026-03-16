import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./withUser";

export const checkMyQuizAttempts = query({
    args: { quiz_id: v.id("quizzes") },
    handler: async (ctx, args) => {
        const user = await requireAuth(ctx);
        const attempts = await ctx.db
            .query("quiz_attempts")
            .withIndex("by_quiz_user", (q) => q.eq("quiz_id", args.quiz_id).eq("user_id", user._id))
            .collect();

        return {
            total: attempts.length,
            inProgress: attempts.filter(a => a.status === "in_progress").length,
            completed: attempts.filter(a => a.status === "completed").length,
            attempts: attempts.map(a => ({
                id: a._id,
                status: a.status,
                last_updated: new Date(a.last_updated).toISOString(),
                q_idx: a.current_question_index
            }))
        };
    }
});
