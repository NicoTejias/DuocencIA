
// QuestIA Mobile Dashboard

function QuestiaMobileDashboard({ user }) {
  const [activeTab, setActiveTab] = React.useState('inicio');

  const tabs = [
    { id: 'inicio', label: 'Inicio', emoji: '🏠' },
    { id: 'misiones', label: 'Misiones', emoji: '🎯' },
    { id: 'ranking', label: 'Ranking', emoji: '🏆' },
    { id: 'tienda', label: 'Tienda', emoji: '🎁' },
    { id: 'perfil', label: 'Perfil', emoji: '👤' },
  ];

  const circumference = 2 * Math.PI * 38;
  const progress = 0.72;

  return (
    <div style={{
      width: '100%', height: '100%', background: '#09090f',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: 'Outfit, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px 10px', background: '#0d0d14',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: 'rgba(255,214,51,0.15)', border: '1px solid rgba(255,214,51,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#FFD633" strokeWidth="2" style={{width:14,height:14}}>
              <path d="M12 3l-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/>
            </svg>
          </div>
          <span style={{ fontWeight: 900, fontSize: 15, color: '#fff', letterSpacing: '-0.5px', fontStyle: 'italic' }}>
            Quest<span style={{ color: '#FFD633' }}>IA</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(255,214,51,0.1)', borderRadius: 20,
            padding: '4px 10px', border: '1px solid rgba(255,214,51,0.15)'
          }}>
            <span style={{ fontSize: 13 }}>🔥</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#FFD633' }}>{user.streak}</span>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(255,214,51,0.3), rgba(0,80,255,0.3))',
            border: '1.5px solid rgba(255,214,51,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 800, color: '#FFD633',
          }}>
            {user.name[0]}
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
        {activeTab === 'inicio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Mini hero */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,214,51,0.1), rgba(0,80,255,0.06))',
              border: '1px solid rgba(255,214,51,0.15)', borderRadius: 18, padding: '18px 18px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,214,51,0.08)', filter: 'blur(40px)' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#777799', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Buenos tardes</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-1px', fontStyle: 'italic', lineHeight: 1.1 }}>
                    ¡Hola,<br /><span style={{ color: '#FFD633' }}>{user.name.split(' ')[0]}</span>!
                  </div>
                  <div style={{ fontSize: 12, color: '#7777aa', marginTop: 8, fontWeight: 500 }}>
                    <strong style={{ color: '#FFD633' }}>{user.streak} días</strong> de racha 🔥
                  </div>
                </div>
                {/* Rank ring small */}
                <div style={{ position: 'relative', width: 80, height: 80 }}>
                  <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.06)" strokeWidth="5" fill="transparent"/>
                    <circle cx="40" cy="40" r="34" stroke="#FFD633" strokeWidth="5" fill="transparent"
                      strokeDasharray={2*Math.PI*34} strokeDashoffset={(2*Math.PI*34) * (1-progress)}
                      strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px rgba(255,214,51,0.5))' }}/>
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 16 }}>🏆</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', lineHeight: 1 }}>#{user.rank}</span>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
                <div style={{ background: 'rgba(255,214,51,0.08)', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(255,214,51,0.1)' }}>
                  <div style={{ fontSize: 10, color: '#555577', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ranking pts</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#FFD633', marginTop: 2 }}>{user.ranking_points.toLocaleString()}</div>
                </div>
                <div style={{ background: 'rgba(0,80,255,0.08)', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(0,80,255,0.12)' }}>
                  <div style={{ fontSize: 10, color: '#555577', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Canjeable</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#6699ff', marginTop: 2 }}>{user.spendable_points.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Evaluacion urgente */}
            <div style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 14, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f0f8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Proyecto Final – Planos Eléctricos
                </div>
                <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, marginTop: 2 }}>Vence hoy, 23:59</div>
              </div>
            </div>

            {/* Courses */}
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#f0f0f8', marginBottom: 12 }}>Mis Ramos</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {window.MOCK_COURSES && window.MOCK_COURSES.map(course => (
                  <div key={course.id} style={{
                    background: '#111118', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 14, padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `${course.color}18`, border: `1px solid ${course.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, flexShrink: 0,
                    }}>📖</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f0f8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.name}</div>
                      <div style={{ fontSize: 11, color: '#555577', fontWeight: 600, marginTop: 2 }}>
                        {course.rank === 1 ? '🥇' : course.rank === 2 ? '🥈' : '🥉'} {course.rank}er lugar · 🪙 {course.spendable_points}
                      </div>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#FFD633" strokeWidth="2.5" style={{width:16,height:16,flexShrink:0}}>
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ranking' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#f0f0f8', marginBottom: 4 }}>🏆 Ranking Global</div>
            {[
              { rank: 1, name: 'Carlos Muñoz', pts: 5200 },
              { rank: 2, name: user.name, pts: user.ranking_points, isYou: true },
              { rank: 3, name: 'Sofía Herrera', pts: 4100 },
              { rank: 4, name: 'Diego López', pts: 3800 },
              { rank: 5, name: 'Camila Torres', pts: 3600 },
            ].map(p => (
              <div key={p.rank} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: p.isYou ? 'rgba(255,214,51,0.1)' : '#111118',
                border: p.isYou ? '1px solid rgba(255,214,51,0.25)' : '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14, padding: '12px 16px',
              }}>
                <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : `#${p.rank}`}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: p.isYou ? '#FFD633' : '#f0f0f8' }}>{p.name} {p.isYou ? '(Tú)' : ''}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 900, color: p.isYou ? '#FFD633' : '#7777aa' }}>{p.pts.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}

        {(activeTab === 'misiones' || activeTab === 'tienda' || activeTab === 'perfil') && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 48 }}>{activeTab === 'misiones' ? '🎯' : activeTab === 'tienda' ? '🎁' : '👤'}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#555577', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{tabs.find(t => t.id === activeTab)?.label}</span>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{
        background: '#0d0d14', borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', padding: '8px 0 16px',
      }}>
        {tabs.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, border: 'none', background: 'transparent', cursor: 'pointer',
              padding: '8px 4px',
            }}>
              <span style={{ fontSize: 20, filter: active ? 'none' : 'grayscale(1) opacity(0.4)', transition: 'filter 0.15s' }}>{tab.emoji}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: active ? '#FFD633' : '#444466', textTransform: 'uppercase', letterSpacing: '0.4px', fontFamily: 'Outfit, sans-serif', transition: 'color 0.15s' }}>{tab.label}</span>
              {active && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#FFD633' }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { QuestiaMobileDashboard });
