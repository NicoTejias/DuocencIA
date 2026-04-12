/**
 * Aplica el esquema SQL directamente en Supabase via pg
 * node supabase/run_migration.mjs
 */
import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const client = new pg.Client({
  connectionString: 'postgresql://postgres.wzkwmiyzszegekpuqnaz:P5lento0-.,@aws-0-sa-east-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

console.log('🔌 Conectando a Supabase PostgreSQL...')
await client.connect()
console.log('✅ Conectado!\n')

const sql = readFileSync(join(__dirname, 'migrations', '001_initial_schema.sql'), 'utf-8')

console.log('📦 Ejecutando migración completa...\n')

try {
  await client.query(sql)
  console.log('✅ ¡Schema creado exitosamente! Todas las tablas están listas.')
} catch (err) {
  console.error('❌ Error aplicando migration:', err.message)
  process.exit(1)
} finally {
  await client.end()
}
