/**
 * Script de migración: aplica el esquema SQL inicial en Supabase
 * Ejecutar con: node supabase/apply_migration.mjs
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SUPABASE_URL = 'https://wzkwmiyzszegekpuqnaz.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6a3dtaXl6c3plZ2VrcHVxbmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjAwODQyNSwiZXhwIjoyMDkxNTg0NDI1fQ.jASfW4IVMWKhHyKkIX3h8lJjSfcM6nUpkNLlaJouMH4'

const sql = readFileSync(join(__dirname, 'migrations', '001_initial_schema.sql'), 'utf-8')

// Split into statements at semicolons, filter empty
const statements = sql
  .split(/;\s*\n/)
  .map(s => s.trim())
  .filter(s => s.length > 5 && !s.startsWith('--'))

console.log(`📦 Aplicando ${statements.length} sentencias SQL...\n`)

let success = 0
let failed = 0

for (const stmt of statements) {
  const query = stmt.endsWith(';') ? stmt : stmt + ';'
  
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query }),
    })

    if (!res.ok) {
      // Try the pg-meta endpoint instead
      const res2 = await fetch(`${SUPABASE_URL}/pg-meta/v1/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ query }),
      })
      
      if (!res2.ok) {
        const text = await res2.text()
        // Ignore "already exists" errors
        if (text.includes('already exists') || text.includes('duplicate')) {
          console.log(`  ⚠️  Ya existe (ignorado): ${stmt.substring(0, 60)}...`)
          success++
        } else {
          console.error(`  ❌ Error: ${text.substring(0, 120)}`)
          console.error(`     SQL: ${stmt.substring(0, 80)}`)
          failed++
        }
        continue
      }
    }
    
    const shortStmt = stmt.substring(0, 70).replace(/\n/g, ' ')
    console.log(`  ✅ OK: ${shortStmt}`)
    success++
  } catch (err) {
    console.error(`  ❌ Excepción: ${err.message}`)
    failed++
  }
}

console.log(`\n📊 Resultado: ${success} exitosas, ${failed} fallidas`)
