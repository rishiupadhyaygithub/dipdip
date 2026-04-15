import { useState } from 'react';
import { CONNECTORS } from '../data/seed.js';

export default function Connectors() {
  const [conns, setConns] = useState(CONNECTORS);

  function connect(id) {
    setConns(prev => prev.map(c => c.id === id
      ? { ...c, status: 'connected', last: 'Just now', data: 'Syncing...' }
      : c
    ));
    setTimeout(() => {
      setConns(prev => prev.map(c => c.id === id
        ? { ...c, data: 'Connected · data syncing' }
        : c
      ));
    }, 1800);
  }

  const connected = conns.filter(c => c.status === 'connected').length;

  return (
    <div className="conn-wrap">
      <div className="view-header">
        <div className="view-title">Data Connectors</div>
        <div className="view-sub">Read-only. DecisionOS never writes back to your systems.</div>
      </div>

      {/* Summary bar */}
      <div className="conn-summary" style={{ marginBottom: 20 }}>
        <div className="conn-summary-stat"><strong>{connected}</strong> of {conns.length} connected</div>
        <div style={{ width: 1, height: 16, background: 'var(--line)' }} />
        <div className="conn-summary-stat">All connections are <strong>read-only</strong></div>
        <div style={{ width: 1, height: 16, background: 'var(--line)' }} />
        <div className="conn-summary-stat">Data stays in <strong>your systems</strong></div>
      </div>

      <div className="conn-grid">
        {conns.map(c => (
          <div className="conn-card" key={c.id}>
            <div className="conn-icon">{c.icon}</div>
            <div className="conn-info">
              <div className="conn-top">
                <div className="conn-name">{c.name}</div>
                <span className={`conn-badge${c.status === 'disconnected' ? ' off' : ''}`}>
                  {c.status === 'connected' ? '● connected' : '○ not connected'}
                </span>
              </div>
              <div className="conn-data">{c.desc}</div>
              {c.status === 'connected' ? (
                <>
                  <div className="conn-data" style={{ marginTop: 3 }}>{c.data}</div>
                  <div className="conn-sync">Last sync: {c.last}</div>
                </>
              ) : (
                <button className="conn-btn" onClick={() => connect(c.id)}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
