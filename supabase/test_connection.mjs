/**
 * Test Supabase connectivity and find correct connection info
 */
const SUPABASE_URL = 'https://wzkwmiyzszegekpuqnaz.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6a3dtaXl6c3plZ2VrcHVxbmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjAwODQyNSwiZXhwIjoyMDkxNTg0NDI1fQ.jASfW4IVMWKhHyKkIX3h8lJjSfcM6nUpkNLlaJouMH4'

console.log('🔍 Verificando conectividad con Supabase REST API...')

// Test 1: REST API status
const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
  headers: {
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
  }
})

console.log(`Status: ${res.status} ${res.statusText}`)
const text = await res.text()
console.log(`Response: ${text.substring(0, 200)}`)

// Test 2: Check if we can query pg_tables
const res2 = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=count`, {
  headers: {
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    'Prefer': 'count=exact'
  }
})

console.log(`\nTest tabla profiles: ${res2.status} ${res2.statusText}`)
console.log(await res2.text())
