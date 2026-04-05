# Reglas de Inteligencia Artificial - QuestIA

- Siempre responde en **español**.
- Prioriza el modelo **gemini-3-flash-preview** para la generación de contenido académico.
- Si el modelo primario falla por cuota (429), utiliza el fallback configurado en `convex/geminiClient.ts`.
- No utilices otros modelos (como GPT) a menos que los de Google no estén disponibles.
