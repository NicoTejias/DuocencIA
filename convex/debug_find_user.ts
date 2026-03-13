import { query } from "./_generated/server";
import { v } from "convex/values";

export const findUserAnywhere = query({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        const users = await ctx.db.query("users").collect();
        return users.filter(u => u.name?.toLowerCase().includes(args.name.toLowerCase()));
    }
});
