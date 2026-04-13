import fetch from 'node-fetch'

const CONVEX_DEPLOYMENT = 'savory-jackal-316'
const CONVEX_URL = `https://${CONVEX_DEPLOYMENT}.convex.cloud`
const CONVEX_ADMIN_KEY = process.env.CONVEX_ADMIN_KEY

const SUPABASE_URL = 'https://wzkwmiyzszegekpuqnaz.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6a3dtaXl6c3plZ2VrcHVxbmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjAwODQyNSwiZXhwIjoyMDkxNTg0NDI1fQ.jASfW4IVMWKhHyKkIX3h8lJjSfcM6nUpkNLlaJouMH4'

if (!CONVEX_ADMIN_KEY) {
  console.error('Error: CONVEX_ADMIN_KEY no está configurada')
  console.log('Para obtenerla, ve a: https://dashboard.convex.dev -> Settings -> API Keys')
  process.exit(1)
}

async function convexQuery(functionName: string, args = {}) {
  const response = await fetch(`${CONVEX_URL}/api/async/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Convex ${CONVEX_ADMIN_KEY}`
    },
    body: JSON.stringify(args)
  })
  
  if (!response.ok) {
    throw new Error(`Convex error: ${response.status} ${response.statusText}`)
  }
  
  const result = await response.json()
  
  // Poll for result if it's async
  if (result.taskId) {
    console.log(`Task ${result.taskId} en progreso...`)
    while (true) {
      await new Promise(r => setTimeout(r, 1000))
      const statusRes = await fetch(`${CONVEX_URL}/api/status/${result.taskId}`, {
        headers: { 'Authorization': `Convex ${CONVEX_ADMIN_KEY}` }
      })
      const status = await statusRes.json()
      if (status.status === 'completed') return status.value
      if (status.status === 'failed') throw new Error(status.error)
    }
  }
  
  return result
}

async function supabaseInsert(table: string, data: any) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.text()
    console.error(`Error inserting into ${table}:`, error)
    return false
  }
  return true
}

async function supabaseUpsert(table: string, data: any) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.text()
    console.error(`Error upserting into ${table}:`, error)
    return false
  }
  return true
}

async function migrateUsers() {
  console.log('\n📦 Migrando usuarios...')
  const users = await convexQuery('export_queries:getAllUsers')
  console.log(`   Encontrados: ${users.length}`)
  
  let count = 0
  for (const user of users) {
    await supabaseUpsert('profiles', {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      avatar_url: user.avatarUrl,
      role: user.role || 'student',
      clerk_id: user.clerkId,
      is_verified: user.is_verified || false,
      is_demo: user.is_demo || false,
      student_id: user.student_id,
      terms_accepted_at: user.terms_accepted_at,
      daily_streak: user.daily_streak || 0,
      last_daily_bonus_at: user.last_daily_bonus_at,
      ice_cubes: user.ice_cubes || 0,
      push_token: user.push_token,
      belbin_profile: user.belbin_profile,
      bartle_profile: user.bartle_profile,
      created_at: new Date().toISOString()
    })
    count++
  }
  console.log(`   ✅ Migrados: ${count}`)
}

async function migrateCourses() {
  console.log('\n📦 Migrando cursos...')
  const courses = await convexQuery('export_queries:getAllCourses')
  console.log(`   Encontrados: ${courses.length}`)
  
  let count = 0
  for (const course of courses) {
    await supabaseUpsert('courses', {
      id: course._id,
      name: course.name,
      code: course.code,
      description: course.description,
      teacher_id: course.teacher_id,
      career_id: course.career_id,
      linked_sheets_id: course.linked_sheets_id,
      linked_sheets_name: course.linked_sheets_name,
      last_sheets_sync: course.last_sheets_sync,
      created_at: new Date().toISOString()
    })
    count++
  }
  console.log(`   ✅ Migrados: ${count}`)
}

async function migrateEnrollments() {
  console.log('\n📦 Migrando inscripciones...')
  const enrollments = await convexQuery('export_queries:getAllEnrollments')
  console.log(`   Encontrados: ${enrollments.length}`)
  
  let count = 0
  for (const e of enrollments) {
    await supabaseUpsert('enrollments', {
      id: e._id,
      user_id: e.user_id,
      course_id: e.course_id,
      ranking_points: e.ranking_points || 0,
      spendable_points: e.spendable_points || 0,
      group_id: e.group_id,
      section: e.section,
      active_multiplier: e.active_multiplier,
      created_at: new Date().toISOString()
    })
    count++
  }
  console.log(`   ✅ Migradas: ${count}`)
}

async function migrateWhitelists() {
  console.log('\n📦 Migrando whitelists...')
  const whitelists = await convexQuery('export_queries:getAllWhitelists')
  console.log(`   Encontrados: ${whitelists.length}`)
  
  let count = 0
  for (const w of whitelists) {
    await supabaseUpsert('whitelists', {
      id: w._id,
      course_id: w.course_id,
      student_identifier: w.student_identifier,
      student_name: w.student_name,
      section: w.section,
      created_at: new Date().toISOString()
    })
    count++
  }
  console.log(`   ✅ Migrados: ${count}`)
}

async function migrateQuizzes() {
  console.log('\n📦 Migrando quizzes...')
  const quizzes = await convexQuery('export_queries:getAllQuizzes')
  console.log(`   Encontrados: ${quizzes.length}`)
  
  let count = 0
  for (const quiz of quizzes) {
    await supabaseUpsert('quizzes', {
      id: quiz._id,
      course_id: quiz.course_id,
      document_id: quiz.document_id,
      teacher_id: quiz.teacher_id,
      title: quiz.title,
      quiz_type: quiz.quiz_type,
      questions: JSON.stringify(quiz.questions),
      difficulty: quiz.difficulty,
      num_questions: quiz.num_questions,
      created_at: new Date(quiz.created_at).toISOString(),
      is_active: quiz.is_active,
      max_attempts: quiz.max_attempts
    })
    count++
  }
  console.log(`   ✅ Migrados: ${count}`)
}

async function migrateRewards() {
  console.log('\n📦 Migrando recompensas...')
  const rewards = await convexQuery('export_queries:getAllRewards')
  console.log(`   Encontradas: ${rewards.length}`)
  
  let count = 0
  for (const r of rewards) {
    await supabaseUpsert('rewards', {
      id: r._id,
      course_id: r.course_id,
      name: r.name,
      description: r.description,
      cost: r.cost,
      stock: r.stock,
      image_url: r.image_url,
      created_at: new Date().toISOString()
    })
    count++
  }
  console.log(`   ✅ Migradas: ${count}`)
}

async function migrateMissions() {
  console.log('\n📦 Migrando misiones...')
  const missions = await convexQuery('export_queries:getAllMissions')
  console.log(`   Encontradas: ${missions.length}`)
  
  let count = 0
  for (const m of missions) {
    await supabaseUpsert('missions', {
      id: m._id,
      course_id: m.course_id,
      title: m.title,
      description: m.description,
      points: m.points,
      status: m.status,
      narrative: m.narrative,
      created_at: new Date().toISOString()
    })
    count++
  }
  console.log(`   ✅ Migradas: ${count}`)
}

async function migrateBadges() {
  console.log('\n📦 Migrando badges...')
  const badges = await convexQuery('export_queries:getAllBadges')
  console.log(`   Encontrados: ${badges.length}`)
  
  let count = 0
  for (const b of badges) {
    await supabaseUpsert('badges', {
      id: b._id,
      course_id: b.course_id,
      name: b.name,
      description: b.description,
      icon: b.icon,
      criteria_type: b.criteria_type,
      criteria_value: b.criteria_value,
      created_at: new Date().toISOString()
    })
    count++
  }
  console.log(`   ✅ Migrados: ${count}`)
}

async function migrateFaqs() {
  console.log('\n📦 Migrando FAQs...')
  const faqs = await convexQuery('export_queries:getAllFaqs')
  console.log(`   Encontradas: ${faqs.length}`)
  
  let count = 0
  for (const f of faqs) {
    await supabaseUpsert('faqs', {
      id: f._id,
      question: f.question,
      answer: f.answer,
      sort_order: f.order,
      category: f.category,
      created_at: f.created_at ? new Date(f.created_at).toISOString() : new Date().toISOString()
    })
    count++
  }
  console.log(`   ✅ Migradas: ${count}`)
}

async function migrateQuizSubmissions() {
  console.log('\n📦 Migrando quiz submissions...')
  const submissions = await convexQuery('export_queries:getAllQuizSubmissions')
  console.log(`   Encontrados: ${submissions.length}`)
  
  let count = 0
  for (const s of submissions) {
    await supabaseUpsert('quiz_submissions', {
      id: s._id,
      quiz_id: s.quiz_id,
      user_id: s.user_id,
      score: s.score,
      earned_points: s.earned_points,
      completed_at: new Date(s.completed_at).toISOString()
    })
    count++
  }
  console.log(`   ✅ Migrados: ${count}`)
}

async function migrateRedemptions() {
  console.log('\n📦 Migrando redemptions...')
  const redemptions = await convexQuery('export_queries:getAllRedemptions')
  console.log(`   Encontrados: ${redemptions.length}`)
  
  let count = 0
  for (const r of redemptions) {
    await supabaseUpsert('redemptions', {
      id: r._id,
      user_id: r.user_id,
      reward_id: r.reward_id,
      status: r.status,
      timestamp: r.timestamp
    })
    count++
  }
  console.log(`   ✅ Migrados: ${count}`)
}

async function migrateNotifications() {
  console.log('\n📦 Migrando notificaciones...')
  const notifications = await convexQuery('export_queries:getAllNotifications')
  console.log(`   Encontradas: ${notifications.length}`)
  
  let count = 0
  for (const n of notifications) {
    await supabaseUpsert('notifications', {
      id: n._id,
      user_id: n.user_id,
      title: n.title,
      message: n.message,
      type: n.type,
      read: n.read,
      related_id: n.related_id,
      created_at: new Date(n.created_at).toISOString()
    })
    count++
  }
  console.log(`   ✅ Migradas: ${count}`)
}

async function migrateMessages() {
  console.log('\n📦 Migrando mensajes...')
  const messages = await convexQuery('export_queries:getAllMessages')
  console.log(`   Encontrados: ${messages.length}`)
  
  let count = 0
  for (const m of messages) {
    await supabaseUpsert('messages', {
      id: m._id,
      course_id: m.course_id,
      user_id: m.user_id,
      content: m.content,
      type: m.type,
      created_at: new Date(m.created_at).toISOString()
    })
    count++
  }
  console.log(`   ✅ Migrados: ${count}`)
}

async function migrateCourseGroups() {
  console.log('\n📦 Migrando course groups...')
  const groups = await convexQuery('export_queries:getAllCourseGroups')
  console.log(`   Encontrados: ${groups.length}`)
  
  let count = 0
  for (const g of groups) {
    await supabaseUpsert('course_groups', {
      id: g._id,
      course_id: g.course_id,
      name: g.name,
      created_at: new Date(g.created_at).toISOString(),
      created_by: g.created_by,
      expires_at: g.expires_at
    })
    count++
  }
  console.log(`   ✅ Migrados: ${count}`)
}

async function main() {
  console.log('🚀 Iniciando migración de Convex a Supabase...\n')
  console.log('⚠️  IMPORTANTE: Necesitas configurar CONVEX_ADMIN_KEY')
  console.log('   Obténla en: https://dashboard.convex.dev → Settings → API Keys\n')
  
  try {
    await migrateUsers()
    await migrateCourses()
    await migrateEnrollments()
    await migrateWhitelists()
    await migrateQuizzes()
    await migrateRewards()
    await migrateMissions()
    await migrateBadges()
    await migrateFaqs()
    await migrateQuizSubmissions()
    await migrateRedemptions()
    await migrateNotifications()
    await migrateMessages()
    await migrateCourseGroups()
    
    console.log('\n✅ 🎉 Migración completada con éxito!')
  } catch (error) {
    console.error('\n❌ Error durante la migración:', error)
    process.exit(1)
  }
}

main()