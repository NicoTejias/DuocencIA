"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";

export const sendEmail = internalAction({
    args: {
        to: v.string(),
        subject: v.string(),
        html: v.string(),
    },
    handler: async (_ctx, args) => {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.error("[Email] RESEND_API_KEY no configurada en Convex");
            return { success: false };
        }

        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "QuestIA Reportes <reportes@questia.cl>",
                to: args.to,
                subject: args.subject,
                html: args.html,
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("[Email] Error al enviar a", args.to, "→", err);
            return { success: false };
        }

        console.log("[Email] Enviado a", args.to, "·", args.subject);
        return { success: true };
    },
});
