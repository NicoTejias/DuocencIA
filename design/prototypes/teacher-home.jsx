
// QuestIA Teacher Home + Ramos Panel

const TEACHER_MOCK = {
  name: "Nicolás Tejias",
  email: "nicolas.tejias@duocuc.cl",
  courses: [
    { id: "c1", name: "Dibujo de Planos Eléctricos", code: "PEI1108", students: 28, registered: 22, description: "Técnicas de dibujo eléctrico y representación de circuitos." },
    { id: "c2", name: "Fundamentos de Programación", code: "INF1102", students: 35, registered: 30, description: "Introducción a la programación con Python y algoritmia." },
    { id: "c3", name: "Matemáticas Aplicadas", code: "MAT1201", students: 22, registered: 19, description: "Cálculo diferencial e integral aplicado a la ingeniería." },
  ],
  stats: {
    quizzes: 147,
    avgScore: 72,
    participation: 84,
    redemptions: 23,
  },
  kpis: {
    adoption: 79,       // % registered / whitelist
    quizzesPerStudent: 9.2,
    redemptions: 23,
  },
  activity: [
    { day: 'Lun', count: 18 }, { day: 'Mar', count: 24 }, { day: 'Mié', count: 31 },
    { day: 'Jue', count: 19 }, { day: 'Vie', count: 28 }, { day: 'Sáb', count: 8 }, { day: 'Dom', count: 5 },
  ],
};

// ── Mini bar chart (no recharts needed) ──────────────────────────────
function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.count));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80, padding: '0 4px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: '100%', borderRadius: 6,
            height: Math.max(6, (d.count / max) * 68),
            background: d.count === max ? 'rgba(0,80,255,0.7)' : 'rgba(0,80,255,0.25)',
            transition: 'height 0.3s ease',
          }} />
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10, color: '#444466', fontWeight: 600 }}>{d.day}</span>
        </div>
      ))}
    </div>
  );
}

// ── KPI progress bar ─────────────────────────────────────────────────
function KPIBar({ label, value, max, unit, goal, color }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 700, color: '#7777aa' }}>{label}</span>
        <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 900, color: '#f0f0f8' }}>{typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}{unit}</span>
      </div>
      <div style={{ height: 7, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10, color: '#333355', textAlign: 'right' }}>Meta: {goal}</span>
    </div>
  );
}

// ── Stat card ────────────────────────────────────────────────────────
function StatCard({ emoji, label, value, color, bg }) {
  return (
    <div style={{
      background: '#111118', border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: 16, padding: '16px 18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10, fontWeight: 700, color: '#444466', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
        <span style={{ fontSize: 18 }}>{emoji}</span>
      </div>
      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 900, color }}>{value}</div>
    </div>
  );
}

// ── Quick action card ────────────────────────────────────────────────
function QuickCard({ emoji, label, color, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${color}14` : `${color}0a`,
        border: `1px solid ${color}${hovered ? '35' : '18'}`,
        borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left',
        transition: 'all 0.15s ease',
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
    >
      <span style={{ fontSize: 22 }}>{emoji}</span>
      <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 700, color: '#d0d0f0' }}>{label}</span>
    </button>
  );
}

// ── Teacher Home ─────────────────────────────────────────────────────
function TeacherHome({ onTabChange }) {
  const { name, courses, stats, kpis, activity } = TEACHER_MOCK;
  const firstName = name.split(' ')[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0,80,255,0.1) 0%, #111118 60%, rgba(255,214,51,0.04) 100%)',
        border: '1px solid rgba(0,80,255,0.2)', borderRadius: 22, padding: '28px 32px',
      }}>
        <div style={{ position: 'absolute', top: -50, right: -40, width: 250, height: 250, borderRadius: '50%', background: 'rgba(0,80,255,0.07)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(0,80,255,0.12)', border: '1px solid rgba(0,80,255,0.22)',
            borderRadius: 99, padding: '4px 14px', marginBottom: 14,
          }}>
            <svg viewBox="0 0 24 24" fill="#5599ff" style={{width:12,height:12}}>
              <path d="M12 3l-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/>
            </svg>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 800, color: '#5599ff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Buenas tardes</span>
          </div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 40, color: '#fff', letterSpacing: '-1.5px', fontStyle: 'italic', marginBottom: 10, lineHeight: 1.1 }}>
            ¡Hola, <span style={{ color: '#FFD633' }}>{firstName}</span>!
          </h2>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, color: '#7777aa', fontWeight: 500, maxWidth: 480, lineHeight: 1.6 }}>
            Tienes <strong style={{ color: '#f0f0f8' }}>{courses.length} ramos activos</strong> en QuestIA. Esta semana <strong style={{ color: '#5599ff' }}>28 alumnos</strong> completaron al menos un quiz. ¡Sigue así!
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard emoji="📚" label="Ramos Activos" value={courses.length} color="#5599ff" />
        <StatCard emoji="✅" label="Quizzes Completados" value={stats.quizzes} color="#FFD633" />
        <StatCard emoji="📊" label="Puntaje Promedio" value={`${stats.avgScore}%`} color="#4ade80" />
        <StatCard emoji="🎯" label="Participación" value={`${stats.participation}%`} color="#f59e0b" />
      </div>

      {/* KPIs + Activity row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* KPIs */}
        <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 18, padding: '22px 24px' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 800, color: '#f0f0f8', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#5599ff" strokeWidth="2" style={{width:16,height:16}}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            Metas Semestrales
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <KPIBar label="1. Adopción Estudiantil" value={kpis.adoption} max={100} unit="%" goal="90%" color="linear-gradient(90deg, #22c55e, #4ade80)" />
            <KPIBar label="2. Quizzes / Alumno" value={kpis.quizzesPerStudent} max={15} unit=" qzs" goal="15 quizzes" color="linear-gradient(90deg, #0050FF, #5599ff)" />
            <KPIBar label="3. Recompensas Canjeadas" value={kpis.redemptions} max={50} unit=" canjes" goal="50 canjes" color="linear-gradient(90deg, #f59e0b, #FFD633)" />
          </div>
        </div>

        {/* Activity chart */}
        <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 18, padding: '22px 24px' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 800, color: '#f0f0f8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#5599ff" strokeWidth="2" style={{width:16,height:16}}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Conexiones (Últimos 7 días)
          </h3>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: '#333355', marginBottom: 18 }}>Alumnos activos por día</p>
          <MiniBarChart data={activity} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: '#444466' }}>Semana actual</span>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 800, color: '#5599ff' }}>
              {activity.reduce((s, d) => s + d.count, 0)} sesiones totales
            </span>
          </div>
        </div>
      </div>

      {/* Quick access */}
      <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 18, padding: '22px 24px' }}>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 800, color: '#f0f0f8', marginBottom: 16 }}>⚡ Acceso Rápido</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <QuickCard emoji="🎯" label="Crear Desafío" color="#0050FF" onClick={() => onTabChange('desafios')} />
          <QuickCard emoji="📄" label="Subir Material" color="#8b5cf6" onClick={() => onTabChange('material')} />
          <QuickCard emoji="🏆" label="Ver Ranking" color="#f59e0b" onClick={() => onTabChange('ranking')} />
        </div>
      </div>
    </div>
  );
}

// ── Ramos Panel ──────────────────────────────────────────────────────
function TeacherRamos({ onTabChange }) {
  const [search, setSearch] = React.useState('');
  const [showCreate, setShowCreate] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', code: '', description: '' });
  const [courses, setCourses] = React.useState(TEACHER_MOCK.courses);

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!form.name || !form.code) return;
    setCourses([...courses, { id: `c${Date.now()}`, name: form.name, code: form.code, description: form.description, students: 0, registered: 0 }]);
    setForm({ name: '', code: '', description: '' });
    setShowCreate(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Simulate student bar */}
      <div style={{
        background: '#111118', border: '1px solid rgba(251,191,36,0.15)',
        borderRadius: 16, padding: '14px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👤</div>
          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 800, color: '#f0f0f8', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Vista de Estudiante</div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: '#555577' }}>Prueba el sistema tal como lo ven tus alumnos</div>
          </div>
        </div>
        <button style={{
          background: '#fbbf24', color: '#000', fontFamily: 'Outfit, sans-serif',
          fontWeight: 800, fontSize: 12, padding: '9px 18px', borderRadius: 10,
          border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px',
          whiteSpace: 'nowrap',
        }}>
          Probar como Alumno
        </button>
      </div>

      {/* Search + create */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#444466" strokeWidth="2" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o código..."
            style={{
              width: '100%', background: '#111118', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12, padding: '11px 14px 11px 40px', color: '#f0f0f8',
              fontFamily: 'Outfit, sans-serif', fontSize: 13, outline: 'none',
            }}
          />
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          style={{
            background: showCreate ? 'rgba(0,80,255,0.2)' : '#0050FF',
            color: '#fff', border: 'none', borderRadius: 12, padding: '11px 20px',
            fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 13,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            whiteSpace: 'nowrap', transition: 'background 0.15s',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:15,height:15}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          NUEVO RAMO
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div style={{ background: '#111118', border: '1px solid rgba(0,80,255,0.25)', borderRadius: 16, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 800, color: '#f0f0f8', margin: 0 }}>Crear Ramo</h3>
          {[
            { key: 'name', placeholder: 'Nombre del ramo (ej. Electrotecnia I)' },
            { key: 'code', placeholder: 'Código (ej. ELT-101)' },
          ].map(f => (
            <input key={f.key} value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
              placeholder={f.placeholder}
              style={{ background: '#09090f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px', color: '#f0f0f8', fontFamily: 'Outfit, sans-serif', fontSize: 13, outline: 'none' }}
            />
          ))}
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
            placeholder="Descripción (opcional)..."
            style={{ background: '#09090f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px', color: '#f0f0f8', fontFamily: 'Outfit, sans-serif', fontSize: 13, outline: 'none', resize: 'none', height: 80 }}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleCreate} disabled={!form.name || !form.code} style={{
              background: !form.name || !form.code ? 'rgba(0,80,255,0.2)' : '#0050FF', color: '#fff', border: 'none',
              borderRadius: 10, padding: '10px 20px', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 13,
              cursor: !form.name || !form.code ? 'not-allowed' : 'pointer', opacity: !form.name || !form.code ? 0.5 : 1,
            }}>Crear Ramo</button>
            <button onClick={() => setShowCreate(false)} style={{ background: 'transparent', color: '#555577', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 16px', fontFamily: 'Outfit, sans-serif', fontSize: 13, cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Course cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {filtered.map(c => <RamoCard key={c.id} course={c} />)}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: '#333355', fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
            Sin resultados para "{search}"
          </div>
        )}
      </div>
    </div>
  );
}

function RamoCard({ course }) {
  const [hovered, setHovered] = React.useState(false);
  const regPct = course.students > 0 ? Math.round((course.registered / course.students) * 100) : 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(0,80,255,0.06)' : '#111118',
        border: hovered ? '1px solid rgba(0,80,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16, padding: '20px 22px', cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: hovered ? '0 8px 28px rgba(0,80,255,0.08)' : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: hovered ? '#7799ff' : '#f0f0f8', marginBottom: 4, lineHeight: 1.3, transition: 'color 0.2s' }}>{course.name}</h4>
          <span style={{ fontFamily: 'Outfit, monospace', fontSize: 10, color: '#444466', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{course.code}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 10 }}>
          <button style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#555577" strokeWidth="2" style={{width:13,height:13}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{width:13,height:13}}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>

      {course.description && (
        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: '#555577', lineHeight: 1.5, marginBottom: 14, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{course.description}</p>
      )}

      {/* Registration progress */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10, color: '#444466', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Registro</span>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 800, color: '#4ade80' }}>{course.registered}/{course.students}</span>
        </div>
        <div style={{ height: 5, background: 'rgba(255,255,255,0.04)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${regPct}%`, background: 'linear-gradient(90deg, #22c55e, #4ade80)', borderRadius: 99 }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{
          fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 800, color: '#5599ff',
          display: 'flex', alignItems: 'center', gap: 4,
          transform: hovered ? 'translateX(3px)' : 'none', transition: 'transform 0.2s',
        }}>
          VER DETALLE
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:13,height:13}}><polyline points="9 18 15 12 9 6"/></svg>
        </span>
      </div>
    </div>
  );
}

// ── Placeholder panel ────────────────────────────────────────────────
function TeacherPlaceholder({ emoji, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 400, gap: 14, opacity: 0.35 }}>
      <span style={{ fontSize: 60 }}>{emoji}</span>
      <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 800, color: '#7777aa', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
    </div>
  );
}

Object.assign(window, { TeacherHome, TeacherRamos, TeacherPlaceholder, TEACHER_MOCK });
