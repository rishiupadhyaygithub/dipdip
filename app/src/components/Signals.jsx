import { impCls } from '../lib/utils.js';

export default function Signals({ db, onCreateDecision }) {
  const highCount = db.signals.filter(s => s.impact === 'high').length;
  const medCount  = db.signals.filter(s => s.impact === 'med').length;
  const lowCount  = db.signals.filter(s => s.impact === 'low').length;

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
      {/* Stats row */}
      <div className="stats-row" style={{ padding:'20px 20px 0', flexShrink:0 }}>
        {[
          { lbl:'High severity', val:highCount, cls:'red' },
          { lbl:'Medium',        val:medCount,  cls:'' },
          { lbl:'Low',           val:lowCount,  cls:'green' },
          { lbl:'Last refreshed',val:'2h ago',  cls:'', sub:'' },
        ].map(s => (
          <div className="stat-c" key={s.lbl}>
            <div className="stat-lbl">{s.lbl}</div>
            <div className={`stat-num${s.cls?' '+s.cls:''}`}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="sig-wrap">
        <div className="view-header">
          <div className="view-title">Signal Radar</div>
          <div className="view-sub">External signals ranked by relevance. Pull-based — check when you want.</div>
        </div>

        {db.signals.map(s => (
          <div key={s.id} className={`sig-card ${s.urg ? 'urg' : 'warn'}`}>
            <div className="sig-top">
              <span className="sig-src">{s.src} · {s.time}</span>
              <span className={`imp-chip ${impCls(s.impact)}`}>{s.impact.toUpperCase()}</span>
            </div>
            <div className="sig-body">{s.body}</div>
            <div className="sig-acts">
              <button className="sig-act primary" onClick={() => onCreateDecision(s)}>
                Create decision →
              </button>
              <button className="sig-act">Dismiss</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
