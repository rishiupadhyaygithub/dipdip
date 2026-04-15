import { pillCls, pillLabel, relT } from '../../lib/utils.js';

const FILTERS = [
  { key: 'all',       label: 'All' },
  { key: 'pending',   label: 'Pending' },
  { key: 'executing', label: 'Active' },
  { key: 'done',      label: 'Done' },
];

function filterDecs(decisions, f) {
  if (f === 'pending')   return decisions.filter(d => d.status === 'pending');
  if (f === 'executing') return decisions.filter(d => d.status === 'executing' || d.status === 'review');
  if (f === 'done')      return decisions.filter(d => d.status === 'approved' || d.status === 'rejected');
  return decisions;
}

export default function DecisionList({ db, filter, setFilter, activeDec, setActiveDec }) {
  const filtered = filterDecs(db.decisions, filter);

  return (
    <div className="dec-list-pane">
      <div className="dlp-hdr">
        <div className="dlp-filters">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`dlp-f${filter === f.key ? ' active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="dlp-body">
        {filtered.map(d => (
          <div
            key={d.id}
            className={`dec-card${activeDec === d.id ? ' sel' : ''}`}
            onClick={() => setActiveDec(d.id)}
          >
            <div className="dc-title">{d.title}</div>
            <div className="dc-meta">
              <span>{d.proposer}</span>
              <span>{relT(d.created)}</span>
              <span>{d.type}</span>
            </div>
            <div className="dc-btm">
              <span className={`pill ${pillCls(d.status)}`}>{pillLabel(d.status)}</span>
              <div className="conf-mini">
                <div className="conf-bar">
                  <div className="conf-fill" style={{ width: d.confidence + '%' }} />
                </div>
                <span className="conf-txt">{d.confidence}%</span>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--text3)', fontSize: 12 }}>
            No decisions in this view
          </div>
        )}
      </div>
    </div>
  );
}
