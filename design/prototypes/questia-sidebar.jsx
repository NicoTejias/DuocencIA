
// QuestIA Sidebar Component
const QuestiaSidebar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    )},
    { id: 'misiones', label: 'Misiones', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
    )},
    { id: 'ranking', label: 'Ranking', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
    )},
    { id: 'tienda', label: 'Tienda', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
    )},
    { id: 'perfil', label: 'Mi Perfil', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    )},
  ];

  return (
    <aside style={{
      width: 220, minHeight: '100%', background: '#0d0d14',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', flexDirection: 'column', padding: '24px 0',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 20px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(255,214,51,0.15)', border: '1px solid rgba(255,214,51,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#FFD633" strokeWidth="2" className="w-5 h-5" style={{width:18,height:18}}>
              <path d="M12 3l-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 18, color: '#fff', letterSpacing: '-0.5px', fontStyle: 'italic' }}>
            Quest<span style={{ color: '#FFD633' }}>IA</span>
          </span>
        </div>
      </div>

      {/* User card */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', margin: '0 8px', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(255,214,51,0.3), rgba(0,80,255,0.3))',
            border: '1.5px solid rgba(255,214,51,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 800, color: '#FFD633', fontFamily: 'Outfit, sans-serif'
          }}>
            {user.name[0]}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 13, color: '#f0f0f8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 }}>
              {user.name}
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: '#FFD633', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Nivel {user.level}
            </div>
          </div>
        </div>

        {/* Points row */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <div style={{ flex: 1, background: 'rgba(255,214,51,0.08)', borderRadius: 8, padding: '6px 10px', border: '1px solid rgba(255,214,51,0.1)' }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10, color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ranking</div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, color: '#FFD633', fontWeight: 900 }}>{user.ranking_points.toLocaleString()}</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(0,80,255,0.08)', borderRadius: 8, padding: '6px 10px', border: '1px solid rgba(0,80,255,0.12)' }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10, color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Canje</div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, color: '#6699ff', fontWeight: 900 }}>{user.spendable_points.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {tabs.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 10, border: 'none',
              background: active ? 'rgba(255,214,51,0.12)' : 'transparent',
              color: active ? '#FFD633' : '#6666aa',
              fontFamily: 'Outfit, sans-serif', fontWeight: active ? 700 : 500,
              fontSize: 14, cursor: 'pointer', textAlign: 'left', width: '100%',
              transition: 'all 0.15s ease',
              borderLeft: active ? '2px solid #FFD633' : '2px solid transparent',
            }}>
              <span style={{ opacity: active ? 1 : 0.6 }}>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Streak */}
      <div style={{ padding: '16px', margin: '0 8px 8px', background: 'rgba(255,214,51,0.06)', borderRadius: 12, border: '1px solid rgba(255,214,51,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Racha diaria</div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, color: '#FFD633', fontWeight: 900, lineHeight: 1.2 }}>{user.streak} días 🔥</div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button onClick={onLogout} style={{
        margin: '8px 16px 0', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)',
        background: 'transparent', color: '#444466', fontFamily: 'Outfit, sans-serif',
        fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        transition: 'all 0.15s ease',
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:15,height:15}}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Cerrar Sesión
      </button>
    </aside>
  );
};

Object.assign(window, { QuestiaSidebar });
