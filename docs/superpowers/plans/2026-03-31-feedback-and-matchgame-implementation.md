# Plan de Implementación: Feedback (Capturas) y MatchGame (Aleatorización)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir múltiples capturas de pantalla en el feedback y fijar el orden aleatorio en el juego de relacionar.

**Architecture:** Usaremos Convex Storage para las imágenes y `useMemo` para la estabilidad del juego.

**Tech Stack:** React, Convex, Lucide-React, Sonner.

---

### Task 1: Actualización del Esquema de Base de Datos

**Files:**
- Modify: `convex/schema.ts`

- [ ] **Paso 1: Agregar el campo `image_urls` a la tabla `feedback`**

```typescript
// convex/schema.ts
// ... alrededor de la línea 332
    feedback: defineTable({
        user_id: v.id("users"),
        content: v.string(),
        type: v.union(v.literal("bug"), v.literal("suggestion"), v.literal("opinion")),
        created_at: v.number(),
        page_url: v.optional(v.string()),
        image_urls: v.optional(v.array(v.string())), // Agregar esto
    }).index("by_user", ["user_id"]),
```

- [ ] **Paso 2: Compilar el esquema de Convex**

Correr: `npx convex dev --once`
Esperar a que se apliquen los cambios en el dashboard de Convex.

### Task 2: Actualización de la Mutación de Feedback

**Files:**
- Modify: `convex/feedback.ts`

- [ ] **Paso 1: Modificar los argumentos y el handler de `sendFeedback`**

```typescript
// convex/feedback.ts
export const sendFeedback = mutation({
  args: {
    content: v.string(),
    type: v.union(v.literal("bug"), v.literal("suggestion"), v.literal("opinion")),
    page_url: v.optional(v.string()),
    image_urls: v.optional(v.array(v.string())), // Nuevo argumento
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    
    return await ctx.db.insert("feedback", {
      user_id: user._id,
      content: args.content,
      type: args.type,
      page_url: args.page_url,
      image_urls: args.image_urls, // Guardar URLs
      created_at: Date.now(),
    });
  },
});
```

- [ ] **Paso 2: Commit**

```bash
git add convex/schema.ts convex/feedback.ts
git commit -m "feat: add image_urls to feedback schema and mutation"
```

### Task 3: Estabilizar Aleatorización en MatchGame

**Files:**
- Modify: `src/components/student/QuizPlayer/MatchGame.tsx`

- [ ] **Paso 1: Implementar `useMemo` para el barajado de definiciones**

```tsx
// src/components/student/QuizPlayer/MatchGame.tsx
import { useMemo } from 'react' // Asegurar import

// Dentro del componente MatchGame:
const shuffledDefinitions = useMemo(() => {
    return [...questions]
        .map((q, originalIndex) => ({ ...q, originalIndex }))
        .sort(() => Math.random() - 0.5);
}, [questions]);
```

- [ ] **Paso 2: Usar `shuffledDefinitions` en el renderizado**

```tsx
// Reemplazar el map actual de la columna derecha
<div className="space-y-2 md:space-y-4">
    {shuffledDefinitions.map((q: any, i: number) => {
        const realIdx = q.originalIndex
        return (
            <button
                key={`right-${i}`}
                disabled={matchedPairs.includes(realIdx)}
                onClick={() => onSelect(realIdx, true)}
                className={`w-full p-3 md:p-4 rounded-xl border text-left text-sm md:text-base font-bold transition-all ${
                    matchedPairs.includes(realIdx)
                        ? 'bg-green-500/10 border-green-500/20 text-green-500/50 cursor-default'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
            >
                {q.back || q.definition || `Definición ${realIdx + 1}`}
            </button>
        )
    })}
</div>
```

- [ ] **Paso 3: Verificar visualmente**

Abrir un quiz de tipo "Match" y comprobar que al hacer clic en un concepto de la izquierda, la columna derecha NO cambie su orden.

- [ ] **Paso 4: Commit**

```bash
git add src/components/student/QuizPlayer/MatchGame.tsx
git commit -m "fix: static randomization for MatchGame definitions"
```

### Task 4: UI de Feedback - Selección y Previsualización de Imágenes

**Files:**
- Modify: `src/components/FeedbackButton.tsx`

- [ ] **Paso 1: Agregar estados y lógica de manejo de archivos**

```tsx
const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
const [previews, setPreviews] = useState<string[]>([]);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 5) {
        toast.error("Máximo 5 imágenes por feedback");
        return;
    }
    
    setSelectedFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...newPreviews]);
};

const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
};
```

- [ ] **Paso 2: Renderizar la zona de capturas en el formulario**

```tsx
{/* Dentro del formulario, antes del botón de enviar */}
<div className="space-y-2">
    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
        Capturas (Mín. 1 si es Error)
    </label>
    <div className="flex flex-wrap gap-2 p-2 bg-black/20 rounded-2xl border border-white/5">
        {previews.map((url, i) => (
            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden group border border-white/10">
                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                <button 
                   type="button"
                   onClick={() => removeFile(i)}
                   className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <X className="w-4 h-4 text-white" />
                </button>
            </div>
        ))}
        {selectedFiles.length < 5 && (
            <label className="w-16 h-16 flex items-center justify-center bg-white/5 border border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                <input type="file" multiple accept="image/*" className="sr-only" onChange={handleFileChange} />
                <Plus className="w-6 h-6 text-slate-500" />
            </label>
        )}
    </div>
</div>
```

### Task 5: Lógica de Carga a Convex Storage y Envío Final

**Files:**
- Modify: `src/components/FeedbackButton.tsx`

- [ ] **Paso 1: Implementar la subida secuencial en `handleSubmit`**

```tsx
const generateUploadUrl = useMutation(api.storage.generateUploadUrl); // Si no existe, crear o usar direct fetch si Convex lo soporta

// En handleSubmit:
const imageUrls: string[] = [];

for (const file of selectedFiles) {
    // 1. Obtener URL de carga
    const uploadUrl = await generateUploadUrl();
    
    // 2. Subir archivo
    const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
    });
    
    const { storageId } = await result.json();
    
    // 3. Obtener URL pública (opcional, podrías guardar el storageId)
    // Para simplificar, asumiremos que el backend resuelve la URL o guardamos el ID.
    // Usaremos storageId para mayor robustez en Convex.
    imageUrls.push(storageId);
}

// 4. Enviar mutación con IDs de imágenes
await sendFeedback({
    content: content.trim(),
    type,
    page_url: window.location.href,
    image_ids: imageUrls // Asegurarse que el backend acepte string[] si son storageIds
});
```

- [ ] **Paso 2: Commit final**

```bash
git add src/components/FeedbackButton.tsx
git commit -m "feat: implement image upload and preview in feedback form"
```
