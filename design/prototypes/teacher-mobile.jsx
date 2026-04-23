
// QuestIA Teacher Mobile Dashboard

function TeacherMobileDashboard({ user }) {
  const [activeTab, setActiveTab] = React.useState('inicio');

  const tabs = [
    { id: 'inicio', label: 'Inicio', emoji: '📊' },
    { id: 'ramos', label: 'Ramos', emoji: '📚' },
    { id: 'desafios', label: 'Desafíos', emoji: '🎯' },
    { id: 'ranking', label: 'Ranking', emoji: '🏆' },
    { id: 'perfil', label: 'Perfil', emoji: '👤' },
  ];

  const { courses, stats, kpis, activity } = window.TEACHER_MOCK || {};

  return (
    <div style={{ width: '100%', height: '100%', background: '#09090f', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'Outfit, sans-serif' }}>
      {/* Header */}
      <div style={{
        padding: '13px 16px 10px', background: '#0c0c15',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,214,51,0.15)', border: '1px solid rgba(255,214,51,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#FFD633" strokeWidth="2" style={{width:13,height:13}}>
              <path d="M12 3l-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/>
            </svg>
          </div>
          <div>
            <span style={{ fontWeight: 900, fontSize: 14, color: '#fff', letterSpacing: '-0.5px', fontStyle: 'italic' }}>
              Quest<span style={{ color: '#FFD633' }}>IA</span>
            </span>
            <div style={{ fontSize: 8, fontWeight: 800, color: '#0050FF', textTransform: 'uppercase', letterSpacing: '1.5px', lineHeight: 1 }}>Panel Docente</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Notification */}
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#5599ff" strokeWidth="2" style={{width:15,height:15}}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <div style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: '#ef4444', border: '1.5px solid #09090f' }} />
          </div>
          {/* Avatar */}
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, rgba(0,80,255,0.4), rgba(0,80,255,0.2))', border: '1.5px solid rgba(0,80,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👩‍🏫</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 0' }}>
        {activeTab === 'inicio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Mini hero */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0,80,255,0.1), rgba(255,214,51,0.04))',
              border: '1px solid rgba(0,80,255,0.2)', borderRadius: 18, padding: '18px',
            }}>
              <div style={{ fontSize: 10, color: '#5577cc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Buenas tardes</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-1px', fontStyle: 'italic', lineHeight: 1.1 }}>
                ¡Hola,<br/><span style={{ color: '#FFD633' }}>{user.name.split(' ')[0]}</span>!
              </div>
              <div style={{ fontSize: 12, color: '#7777aa', marginTop: 8 }}>
                <strong style={{ color: '#f0f0f8' }}>{courses?.length}</strong> ramos activos · <strong style={{ color: '#5599ff' }}>28 alumnos</strong> activos hoy
              </div>
            </div>

            {/* Stats 2x2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { emoji: '📚', label: 'Ramos', value: courses?.length, color: '#5599ff' },
                { emoji: '✅', label: 'Quizzes', value: stats?.quizzes, color: '#FFD633' },
                { emoji: '📊', label: 'Promedio', value: `${stats?.avgScore}%`, color: '#4ade80' },
                { emoji: '🎯', label: 'Participación', value: `${stats?.participation}%`, color: '#f59e0b' },
              ].map((s, i) => (
                <div key={i} style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: '#444466', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</span>
                    <span style={{ fontSize: 14 }}>{s.emoji}</span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* KPIs compact */}
            <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: '16px' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#f0f0f8', marginBottom: 14 }}>🎯 Metas Semestrales</div>
              {[
                { label: 'Adopción', value: kpis?.adoption, max: 100, unit: '%', color: '#4ade80' },
                { label: 'Quizzes/Alumno', value: kpis?.quizzesPerStudent, max: 15, unit: ' qzs', color: '#5599ff' },
                { label: 'Canjes', value: kpis?.redemptions, max: 50, unit: '', color: '#FFD633' },
              ].map((k, i) => (
                <div key={i} style={{ marginBottom: i < 2 ? 12 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: '#555577', fontWeight: 600 }}>{k.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#f0f0f8' }}>{typeof k.value === 'number' && k.value % 1 !== 0 ? k.value.toFixed(1) : k.value}{k.unit}</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.04)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (k.value / k.max) * 100)}%`, background: k.color, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { emoji: '🎯', label: 'Desafío', tab: 'desafios' },
                { emoji: '📄', label: 'Material', tab: 'material' },
                { emoji: '🏆', label: 'Ranking', tab: 'ranking' },
              ].map((a, i) => (
                <button key={i} onClick={() => setActiveTab(a.tab)} style={{
                  background: 'rgba(0,80,255,0.08)', border: '1px solid rgba(0,80,255,0.15)',
                  borderRadius: 12, padding: '12px 8px', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                }}>
                  <span style={{ fontSize: 20 }}>{a.emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#7799ff' }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ramos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f0f0f8', marginBottom: 4 }}>📚 Mis Ramos</div>
            {courses?.map(c => {
              const pct = c.students > 0 ? Math.round((c.registered / c.students) * 100) : 0;
              return (
                <div key={c.id} style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f0f8' }}>{c.name}</div>
                      <div style={{ fontSize: 10, color: '#444466', fontWeight: 700, marginTop: 2 }}>{c.code}</div>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#5599ff" strokeWidth="2.5" style={{width:15,height:15,flexShrink:0,marginTop:3}}>
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 99, overflow: 'hidden', marginBottom: 4 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #22c55e, #4ade80)', borderRadius: 99 }} />
                  </div>
                  <div style={{ fontSize: 10, color: '#444466', fontWeight: 600 }}>{c.registered}/{c.students} registrados</div>
                </div>
              );
            })}
          </div>
        )}

        {(activeTab === 'desafios' || activeTab === 'ranking' || activeTab === 'perfil') && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 280, flexDirection: 'column', gap: 12, opacity: 0.35 }}>
            <span style={{ fontSize: 48 }}>{activeTab === 'desafios' ? '🎯' : activeTab === 'ranking' ? '🏆' : '👤'}</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#7777aa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{tabs.find(t => t.id === activeTab)?.label}</span>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ background: '#0c0c15', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', padding: '8px 0 16px' }}>
        {tabs.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, border: 'none', background: 'transparent', cursor: 'pointer', padding: '7px 4px',
            }}>
              <span style={{ fontSize: 18, filter: active ? 'none' : 'grayscale(1) opacity(0.35)', transition: 'filter 0.15s' }}>{tab.emoji}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: active ? '#5599ff' : '#333355', textTransform: 'uppercase', letterSpacing: '0.4px', fontFamily: 'Outfit, sans-serif', transition: 'color 0.15s' }}>{tab.label}</span>
              {active && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#0050FF' }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { TeacherMobileDashboard });
