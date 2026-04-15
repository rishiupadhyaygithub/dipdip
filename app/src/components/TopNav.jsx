import { initials } from '../lib/utils.js';

const TABS = [
  { id: 'dashboard',  label: 'Dashboard' },
  { id: 'decisions',  label: 'Decisions', badge: 'pending' },
  { id: 'simulator',  label: 'Simulator' },
  { id: 'signals',    label: 'Signals',   badge: 'signals', alert: true },
  { id: 'memory',     label: 'Memory' },
  { id: 'attribution',label: 'Attribution' },
  { id: 'connectors', label: 'Connectors' },
];

export default function TopNav({ view, setView, user, aiLive, db, onNewDecision }) {
  const pendingCount = db.decisions.filter(d => d.status === 'pending').length;
  const signalCount  = db.signals.filter(s => s.urg).length;

  function badge(tab) {
    if (tab.badge === 'pending') return pendingCount;
    if (tab.badge === 'signals') return signalCount;
    return 0;
  }

  return (
    <nav className="topnav">
      <div className="tn-logo">
        <div className="tn-mark">
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M4 10L8.5 14.5L16 5" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="tn-brand">Decision<em>OS</em></div>
      </div>

      <div className="tn-tabs" role="tablist" aria-label="Primary sections">
        {TABS.map(tab => {
          const n = badge(tab);
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={view === tab.id}
              aria-current={view === tab.id ? 'page' : undefined}
              className={`tn-tab${view === tab.id ? ' active' : ''}`}
              onClick={() => setView(tab.id)}
            >
              {tab.label}
              {tab.badge && n > 0 && (
                <span className={`tab-badge${tab.alert ? ' alert' : ''}`}>{n}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="tn-right">
        <div className="ai-pill">
          <div className={`ai-dot${aiLive ? ' live' : ''}`} />
          <span>{aiLive ? 'Live AI' : 'Demo'}</span>
        </div>
        <div className="tn-user">
          <div className="tn-avatar">{initials(user.name)}</div>
          <span className="tn-username">{user.name}</span>
        </div>
        <button className="btn-new" onClick={onNewDecision}>+ Decision</button>
      </div>
    </nav>
  );
}
