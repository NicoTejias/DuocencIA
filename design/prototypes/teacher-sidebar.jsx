
// QuestIA Teacher Sidebar

const TeacherSidebar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:17,height:17}}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    )},
    { id: 'ramos', label: 'Mis Ramos', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:17,height:17}}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    )},
    { id: 'material', label: 'Material', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:17,height:17}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    )},
    { id: 'desafios', label: 'Desafíos', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:17,height:17}}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
    )},
    { id: 'ranking', label: 'Ranking', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:17,height:17}}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
    )},
    { id: 'recompensas', label: 'Recompensas', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:17,height:17}}><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
    )},
    { id: 'canjes', label: 'Gestión Canjes', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:17,height:17}}><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
    )},
    { id: 'perfil', label: 'Mi Perfil', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:17,height:17}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    )},
  ];

  return (
    <aside style={{
      width: 230, minHeight: '100%', background: '#0c0c15',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(255,214,51,0.15)', border: '1px solid rgba(255,214,51,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#FFD633" strokeWidth="2" style={{width:17,height:17}}>
              <path d="M12 3l-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/>
            </svg>
          </div>
          <div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 17, color: '#fff', letterSpacing: '-0.5px', fontStyle: 'italic' }}>
              Quest<span style={{ color: '#FFD633' }}>IA</span>
            </span>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 9, fontWeight: 800, color: '#0050FF', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: 1 }}>Panel Docente</div>
          </div>
        </div>
      </div>

      {/* User card */}
      <div style={{ padding: '14px 12px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', margin: '0 8px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,80,255,0.06)', border: '1px solid rgba(0,80,255,0.1)', borderRadius: 12, padding: '10px 12px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(0,80,255,0.4), rgba(0,80,255,0.2))',
            border: '1.5px solid rgba(0,80,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17,
          }}>👩‍🏫</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 13, color: '#f0f0f8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 }}>{user.name}</div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10, color: '#5577cc', fontWeight: 600, marginTop: 1 }}>{user.email}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto' }}>
        {tabs.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 13px', borderRadius: 10, border: 'none',
              background: active ? 'rgba(0,80,255,0.12)' : 'transparent',
              color: active ? '#5599ff' : '#5a5a88',
              fontFamily: 'Outfit, sans-serif', fontWeight: active ? 700 : 500,
              fontSize: 13.5, cursor: 'pointer', textAlign: 'left', width: '100%',
              transition: 'all 0.15s ease',
              borderLeft: active ? '2px solid #0050FF' : '2px solid transparent',
            }}>
              <span style={{ opacity: active ? 1 : 0.55 }}>{tab.icon}</span>
              {tab.label}
              {tab.id === 'desafios' && (
                <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 800, background: 'rgba(0,80,255,0.2)', color: '#5599ff', padding: '2px 7px', borderRadius: 99 }}>IA</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '10px 16px 18px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <button onClick={onLogout} style={{
          width: '100%', padding: '9px 13px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)',
          background: 'transparent', color: '#3a3a5a', fontFamily: 'Outfit, sans-serif',
          fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Cerrar Sesión
        </button>
        <div style={{ textAlign: 'center', marginTop: 8, fontFamily: 'Outfit, sans-serif', fontSize: 9, color: '#333355', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontStyle: 'italic' }}>
          QuestIA v1.1.0
        </div>
      </div>
    </aside>
  );
};

Object.assign(window, { TeacherSidebar });
