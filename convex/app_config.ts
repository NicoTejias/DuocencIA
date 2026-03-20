import { query, mutation } from "./_generated/server";
import { requireAuth, requireAdmin } from "./withUser";
import { v } from "convex/values";

const CONFIG_KEYS = {
    ALLOWED_EMAIL_DOMAINS: "allowed_email_domains",
    INSTITUTION_NAME: "institution_name",
    REQUIRE_EMAIL_VERIFICATION: "require_email_verification",
} as const;

const DEFAULT_ALLOWED_DOMAINS = "@duocuc.cl,@profesor.duoc.cl,@duoc.cl,@gmail.com,@outlook.com";

async function getConfigValue(ctx: any, key: string): Promise<string> {
    const config = await ctx.db
        .query("institution_config")
        .withIndex("by_key", (q: any) => q.eq("key", key))
        .first();
    return config?.value || "";
}

async function setConfigValue(ctx: any, key: string, value: string, userId: any) {
    const existing = await ctx.db
        .query("institution_config")
        .withIndex("by_key", (q: any) => q.eq("key", key))
        .first();

    if (existing) {
        await ctx.db.patch(existing._id, {
            value,
            updated_at: Date.now(),
            updated_by: userId,
        });
    } else {
        await ctx.db.insert("institution_config", {
            key,
            value,
            updated_at: Date.now(),
            updated_by: userId,
        });
    }
}

export const getLatestConfig = query({
    args: {},
    handler: async (_ctx) => {
        try {
            return {
                latestVersion: "1.0.12",
                downloadUrl: "https://github.com/NicoTejias/QuestIA/releases/download/v.1.0.12/QuestIA.1.0.12.apk", 
                isMandatory: true,
                message: "Versión 1.0.12: Optimizaciones de sistema y correcciones menores."
            };
        } catch (error) {
            console.error("Error in getLatestConfig:", error);
            return null;
        }
    },
});

export const getAllowedEmailDomains = query({
    args: {},
    handler: async (ctx) => {
        const value = await getConfigValue(ctx, CONFIG_KEYS.ALLOWED_EMAIL_DOMAINS);
        if (!value) {
            return DEFAULT_ALLOWED_DOMAINS.split(",");
        }
        return value.split(",").filter(d => d.trim().length > 0);
    },
});

export const getInstitutionConfig = query({
    args: {},
    handler: async (ctx) => {
        await requireAuth(ctx);
        
        const allowedDomains = await getConfigValue(ctx, CONFIG_KEYS.ALLOWED_EMAIL_DOMAINS);
        const institutionName = await getConfigValue(ctx, CONFIG_KEYS.INSTITUTION_NAME);
        const requireVerification = await getConfigValue(ctx, CONFIG_KEYS.REQUIRE_EMAIL_VERIFICATION);

        return {
            allowedDomains: allowedDomains ? allowedDomains.split(",").filter(d => d.trim().length > 0) : DEFAULT_ALLOWED_DOMAINS.split(","),
            institutionName: institutionName || "QuestIA",
            requireEmailVerification: requireVerification === "true",
        };
    },
});

export const updateAllowedDomains = mutation({
    args: {
        domains: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await requireAdmin(ctx);
        
        if (args.domains.length === 0) {
            throw new Error("Debe haber al menos un dominio permitido");
        }

        const normalizedDomains = args.domains.map(d => {
            let domain = d.trim().toLowerCase();
            if (!domain.startsWith("@")) {
                domain = "@" + domain;
            }
            return domain;
        });

        await setConfigValue(ctx, CONFIG_KEYS.ALLOWED_EMAIL_DOMAINS, normalizedDomains.join(","), user._id);
        
        return { success: true, domains: normalizedDomains };
    },
});

export const updateInstitutionName = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await requireAdmin(ctx);
        await setConfigValue(ctx, CONFIG_KEYS.INSTITUTION_NAME, args.name.trim(), user._id);
        return { success: true };
    },
});

export const getAllowedDomainsList = query({
    args: {},
    handler: async (ctx) => {
        try {
            const value = await getConfigValue(ctx, CONFIG_KEYS.ALLOWED_EMAIL_DOMAINS);
            if (!value) {
                return DEFAULT_ALLOWED_DOMAINS.split(",");
            }
            return value.split(",").filter(d => d.trim().length > 0);
        } catch (error) {
            return DEFAULT_ALLOWED_DOMAINS.split(",");
        }
    },
});

export const checkEmailAllowed = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        try {
            const domains = await getConfigValue(ctx, CONFIG_KEYS.ALLOWED_EMAIL_DOMAINS);
            const allowedList = domains 
                ? domains.split(",").filter(d => d.trim().length > 0)
                : DEFAULT_ALLOWED_DOMAINS.split(",");
            
            const emailLower = args.email.toLowerCase();
            const isAllowed = allowedList.some(domain => emailLower.endsWith(domain.toLowerCase()));
            
            return { isAllowed, allowedDomains: allowedList };
        } catch (error) {
            return { 
                isAllowed: true, 
                allowedDomains: DEFAULT_ALLOWED_DOMAINS.split(","),
                fallback: true 
            };
        }
    },
});
