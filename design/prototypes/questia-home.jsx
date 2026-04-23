
// QuestIA Dashboard Home Content

const MOCK_COURSES = [
  { id: "1", name: "Dibujo de Planos Eléctricos", code: "PEI1108", rank: 2, spendable_points: 450, ranking_points: 1850, students: 28, color: '#FFD633' },
  { id: "2", name: "Fundamentos de Programación", code: "INF1102", rank: 1, spendable_points: 380, ranking_points: 1560, students: 35, color: '#0050FF' },
  { id: "3", name: "Matemáticas Aplicadas", code: "MAT1201", rank: 5, spendable_points: 370, ranking_points: 1340, students: 22, color: '#10b981' },
];

const MOCK_EVALUACIONES = [
  { id: "e1", title: "Proyecto Final – Planos Eléctricos", course: "PEI1108", due: "Hoy, 23:59", urgent: true },
  { id: "e2", title: "Tarea 3 – Algoritmos", course: "INF1102", due: "Vie 25 Abr", urgent: false },
];

const RANK_COLORS = ['#FFD633','#c0c0c0','#cd7f32'];

function CourseCard({ course, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  const rankEmoji = course.rank === 1 ? '🥇' : course.rank === 2 ? '🥈' : course.rank === 3 ? '🥉' : `#${course.rank}`;

  return (
    <div
      onClick={() => onClick(course.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.04)' : '#111118',
        border: hovered ? `1px solid rgba(255,214,51,0.35)` : '1px solid rgba(255,255,255,0.06)',
        borderRadius: 18, padding: '22px', cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: hovered ? '0 8px 32px rgba(255,214,51,0.08)' : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* bg icon */}
      <div style={{ position: 'absolute', top: 14, right: 16, opacity: hovered ? 0.18 : 0.06, transition: 'opacity 0.2s', color: course.color, fontSize: 52, lineHeight: 1 }}>
        📚
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: `${course.color}18`, border: `1px solid ${course.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18
        }}>
          📖
        </div>
        <span style={{ fontFamily: 'Outfit, monospace', fontSize: 10, color: '#555577', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{course.code}</span>
      </div>

      <h4 style={{
        fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15,
        color: hovered ? '#FFE066' : '#f0f0f8', marginBottom: 18, lineHeight: 1.3,
        transition: 'color 0.2s', overflow: 'hidden', display: '-webkit-box',
        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
      }}>{course.name}</h4>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10, color: '#555577', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Ranking</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 16 }}>{typeof rankEmoji === 'string' && rankEmoji.startsWith('🥇') || rankEmoji === '🥇' || rankEmoji === '🥈' || rankEmoji === '🥉' ? rankEmoji : '🏅'}</span>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 900, color: '#f0f0f8' }}>
              {course.rank === 1 ? '1er' : course.rank === 2 ? '2do' : course.rank === 3 ? '3er' : `${course.rank}to`} lugar
            </span>
          </div>
        </div>
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: 12 }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10, color: '#555577', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Canjeable</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 14 }}>🪙</span>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 900, color: '#6699ff' }}>{course.spendable_points.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', marginLeft: -4 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{
              width: 22, height: 22, borderRadius: '50%',
              background: i < 3 ? '#1e1e2e' : `${course.color}22`,
              border: `2px solid #111118`,
              marginLeft: i === 0 ? 0 : -6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 8, fontWeight: 800, color: course.color,
            }}>
              {i === 3 ? `+${course.students - 3}` : ''}
            </div>
          ))}
        </div>
        <span style={{
          fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 800,
          color: '#FFD633', textTransform: 'uppercase', letterSpacing: '0.5px',
          display: 'flex', alignItems: 'center', gap: 4,
          transform: hovered ? 'translateX(3px)' : 'translateX(0)', transition: 'transform 0.2s',
        }}>
          ACCEDER
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:13,height:13}}><polyline points="9 18 15 12 9 6"/></svg>
        </span>
      </div>
    </div>
  );
}

function EvalCard({ ev }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 18px', background: '#111118',
      border: ev.urgent ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(255,255,255,0.06)',
      borderRadius: 14,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: ev.urgent ? 'rgba(239,68,68,0.12)' : 'rgba(255,214,51,0.08)',
        border: `1px solid ${ev.urgent ? 'rgba(239,68,68,0.2)' : 'rgba(255,214,51,0.12)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
      }}>
        {ev.urgent ? '⚠️' : '📋'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 600, color: '#f0f0f8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</div>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: '#555577', fontWeight: 500, marginTop: 2 }}>{ev.course}</div>
      </div>
      <span style={{
        fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 700,
        color: ev.urgent ? '#ef4444' : '#888',
        background: ev.urgent ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.04)',
        padding: '4px 10px', borderRadius: 8, whiteSpace: 'nowrap',
      }}>{ev.due}</span>
    </div>
  );
}

function HeroCard({ user }) {
  const circumference = 2 * Math.PI * 54;
  const progress = 0.72;

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(255,214,51,0.08) 0%, #111118 50%, rgba(0,80,255,0.05) 100%)',
      border: '1px solid rgba(255,214,51,0.15)',
      borderRadius: 24, padding: '32px 36px',
    }}>
      {/* Glow blobs */}
      <div style={{ position: 'absolute', top: -60, left: -40, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,214,51,0.07)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -40, right: -20, width: 200, height: 200, borderRadius: '50%', background: 'rgba(0,80,255,0.06)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(255,214,51,0.12)', border: '1px solid rgba(255,214,51,0.2)',
            borderRadius: 99, padding: '4px 14px', marginBottom: 16,
          }}>
            <svg viewBox="0 0 24 24" fill="#FFD633" style={{width:13,height:13}}>
              <path d="M12 3l-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/>
            </svg>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 800, color: '#FFE066', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Buenas tardes</span>
          </div>

          <h2 style={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 46,
            color: '#fff', lineHeight: 1.05, letterSpacing: '-2px',
            fontStyle: 'italic', margin: 0, marginBottom: 12,
          }}>
            ¡Hola, <span style={{ color: '#FFD633' }}>{user.name.split(' ')[0]}</span>!
          </h2>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, color: '#7777aa', fontWeight: 500, margin: 0, lineHeight: 1.5, maxWidth: 360 }}>
            Llevas <strong style={{ color: '#c0c0ff' }}>{user.ranking_points.toLocaleString()} pts</strong> de identidad en QuestIA. Tu racha es de <strong style={{ color: '#FFD633' }}>{user.streak} días 🔥</strong>
          </p>
        </div>

        {/* Rank ring */}
        <div style={{
          flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)',
          borderRadius: 24, padding: '20px 28px',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r="54" stroke="rgba(255,255,255,0.05)" strokeWidth="7" fill="transparent"/>
            <circle cx="60" cy="60" r="54" stroke="#FFD633" strokeWidth="7" fill="transparent"
              strokeDasharray={circumference} strokeDashoffset={circumference - circumference * progress}
              strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease', filter: 'drop-shadow(0 0 6px rgba(255,214,51,0.5))' }}/>
          </svg>
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 120, height: 120 }}>
            <span style={{ fontSize: 26 }}>🏆</span>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-1px' }}>#{user.rank}</span>
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10, fontWeight: 800, color: '#555577', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 8, fontStyle: 'italic' }}>
            Nivel {user.level} · ID
          </span>
        </div>
      </div>
    </div>
  );
}

function QuestiaDashboardHome({ user, onSelectCourse }) {
  const [selectedCourse, setSelectedCourse] = React.useState(null);

  const handleCourseClick = (id) => {
    setSelectedCourse(id);
    if (onSelectCourse) onSelectCourse(id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <HeroCard user={user} />

      {/* Evaluaciones */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 800, color: '#f0f0f8', margin: 0 }}>
            📅 Mis Evaluaciones
          </h3>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 700, color: '#555577', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {MOCK_EVALUACIONES.length} pendientes
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MOCK_EVALUACIONES.map(ev => <EvalCard key={ev.id} ev={ev} />)}
        </div>
      </section>

      {/* Courses */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 800, color: '#f0f0f8', margin: 0 }}>Mis Ramos</h3>
          <select style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, color: '#7777aa', fontFamily: 'Outfit, sans-serif',
            fontSize: 12, fontWeight: 700, padding: '6px 10px', outline: 'none', cursor: 'pointer',
          }}>
            <option>RECIENTES</option>
            <option>PUNTOS</option>
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {MOCK_COURSES.map(c => <CourseCard key={c.id} course={c} onClick={handleCourseClick} />)}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { QuestiaDashboardHome, MOCK_COURSES });
