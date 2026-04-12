/**
 * Verifica que todas las tablas del schema existan en Supabase
 */
const SUPABASE_URL = 'https://wzkwmiyzszegekpuqnaz.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6a3dtaXl6c3plZ2VrcHVxbmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjAwODQyNSwiZXhwIjoyMDkxNTg0NDI1fQ.jASfW4IVMWKhHyKkIX3h8lJjSfcM6nUpkNLlaJouMH4'

const tables = [
  'profiles', 'courses', 'whitelists', 'enrollments',
  'rewards', 'redemptions', 'quizzes', 'quiz_submissions',
  'quiz_attempts', 'missions', 'mission_submissions',
  'notifications', 'evaluaciones', 'faqs', 'admins',
  'course_documents', 'badges', 'user_badges', 'feedback',
  'attendance_sessions', 'attendance_logs', 'messages',
  'point_transfer_requests', 'grading_rubrics', 'grading_results',
  'rate_limits', 'course_groups', 'institution_config', 'careers'
]

const headers = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
}

console.log('🔍 Verificando tablas en Supabase...\n')
let ok = 0, missing = 0

for (const table of tables) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?limit=0`, { headers })
  if (res.status === 200) {
    console.log(`  ✅ ${table}`)
    ok++
  } else {
    const text = await res.text()
    console.log(`  ❌ ${table} → ${res.status}: ${text.substring(0, 80)}`)
    missing++
  }
}

console.log(`\n📊 ${ok} tablas OK, ${missing} faltantes`)
