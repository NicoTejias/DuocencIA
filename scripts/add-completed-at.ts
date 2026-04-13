// Script para agregar columna missing a quiz_attempts
// Ejecutar con: npx tsx scripts/add-completed-at.ts

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

// Cargar env
const raw = readFileSync('.env.local', 'utf8')
for (const line of raw.split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const eq = line.indexOf('=')
  if (eq < 0) continue
  const key = line.slice(0, eq).trim()
  const val = line.slice(eq + 1).trim()
  if (!(key in process.env)) process.env[key] = val
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  console.log('Agregando columna completed_at a quiz_attempts...')
  
  // Verificar si existe
  const { data: cols } = await supabase.rpc('pg_catalog.pg_column_exists', { 
    table_name: 'quiz_attempts', 
    column_name: 'completed_at' 
  }).catch(() => ({ data: null }))
  
  // Agregar columna (usando alter table)
  const { error } = await supabase.from('quiz_attempts').select('completed_at').limit(1)
  
  if (error && error.message.includes('completed_at')) {
    console.log('Columna no existe, creando...')
    // No podemos hacer ALTER TABLE directamente desde el cliente
    // El usuario debe ejecutar esto desde Supabase Dashboard SQL
    console.log(`
EJECUTAR EN SUPABASE DASHBOARD SQL EDITOR:
-------------------------------------------
ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS completed_at BIGINT;
    `)
  } else {
    console.log('Columna ya existe o verificación no concluyente')
  }
}

main().catch(console.error)