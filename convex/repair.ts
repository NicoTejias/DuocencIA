import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { normalizeRut } from "./rutUtils";
import { requireTeacher } from "./withUser";

/**
 * REPARACIÓN GLOBAL: Unifica RUTs en Users, Whitelists y Enrollments.
 * Este script asegura que todos los formatos coincidan y se recuperen los puntos.
 */
export const globalUnifyRuts = mutation({
  args: {},
  handler: async (ctx) => {
    // Bypass auth for CLI execution
    
    let usersFixed = 0;
    let whitelistFixed = 0;
    
    // 1. Limpiar RUTs de los perfiles de USUARIOS
    const allUsers = await ctx.db.query("users").collect();
    for (const u of allUsers) {
      if (u.student_id) {
        const clean = normalizeRut(u.student_id);
        // Si el RUT es de esos largos de Blackboard (más de 9 dígitos y contiene el original), 
        // intentamos extraer el RUT real (los últimos 8-9 caracteres significativos)
        let finalId = clean;
        if (clean.length > 10) {
          // Si es muy largo, probablemente tenga prefijos. 
          // Tomamos los últimos 9 caracteres que suelen ser el cuerpo + DV o solo cuerpo
          finalId = clean.slice(-9); 
        }

        if (u.student_id !== finalId) {
          await ctx.db.patch(u._id, { student_id: finalId });
          usersFixed++;
        }
      }
    }

    // 2. Limpiar RUTs en las WHITELISTS (las listas que acaba de subir el profe)
    const allWhitelists = await ctx.db.query("whitelists").collect();
    for (const w of allWhitelists) {
      const clean = normalizeRut(w.student_identifier);
      if (w.student_identifier !== clean) {
        await ctx.db.patch(w._id, { student_identifier: clean });
        whitelistFixed++;
      }
    }

    // 3. RE-VINCULACIÓN DE PUNTOS (Lo más importante)
    // Buscamos enrolamientos que existan pero que quizás no estén "conectados" 
    // correctamente al usuario por culpa del RUT.
    const enrollments = await ctx.db.query("enrollments").collect();
    let enrollmentsRepaired = 0;

    for (const en of enrollments) {
        const student = await ctx.db.get(en.user_id);
        if (!student) continue;

        // Verificar si el usuario del enrolamiento tiene el RUT que está en la whitelist de ese ramo
        const cleanUserId = normalizeRut(student.student_id || "");
        
        // Buscar en la whitelist de este ramo si existe este alumno con cualquier variante de su RUT
        const whitelistEntry = await ctx.db
            .query("whitelists")
            .withIndex("by_course", q => q.eq("course_id", en.course_id))
            .collect();
            
        const match = whitelistEntry.find(w => {
            const cleanW = normalizeRut(w.student_identifier);
            return cleanW === cleanUserId || 
                   (cleanW.length >= 7 && cleanUserId.includes(cleanW)) ||
                   (cleanUserId.length >= 7 && cleanW.includes(cleanUserId));
        });

        if (match && student.student_id !== match.student_identifier) {
            // Sincronizamos el RUT del usuario con el de la whitelist para que las queries de 'getCourseStudents' lo encuentren
            await ctx.db.patch(student._id, { student_id: match.student_identifier });
            enrollmentsRepaired++;
        }
    }

    return {
      usersFixed,
      whitelistFixed,
      enrollmentsRepaired,
      totalUsers: allUsers.length
    };
  }
});
