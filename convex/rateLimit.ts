import type { MutationCtx } from "./_generated/server";

const RATE_LIMITS: Record<string, number> = {
    quiz_submit: 60000,      // 1 minuto entre submissions
    auto_enroll: 60000,      // 1 minuto entre enrolls
    feedback_submit: 300000,  // 5 minutos entre feedbacks
};

export async function checkRateLimit(
    ctx: MutationCtx,
    userId: any,
    action: string
): Promise<boolean> {
    const limit = RATE_LIMITS[action];
    if (!limit) return true;

    const existing = await ctx.db
        .query("rate_limits")
        .withIndex("by_user_action", (q) => 
            q.eq("user_id", userId).eq("action", action)
        )
        .first();

    if (existing) {
        const elapsed = Date.now() - existing.last_action_at;
        if (elapsed < limit) {
            const remaining = Math.ceil((limit - elapsed) / 1000);
            throw new Error(`Espera ${remaining} segundos antes de intentar de nuevo.`);
        }
        await ctx.db.patch(existing._id, { last_action_at: Date.now() });
    } else {
        await ctx.db.insert("rate_limits", {
            user_id: userId,
            action,
            last_action_at: Date.now(),
        });
    }

    return true;
}
