import { useState, useEffect } from 'react';
import { enrichDec } from '../../../lib/ai.js';

export default function Enrichment({ dec, db, apiKey }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    enrichDec(dec, apiKey).then(setData);
  }, [dec.id]);

  if (!data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '30px 0', color: 'var(--text3)' }}>
        <div className="spin" /><span>Running AI enrichment...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="ai-block" style={{ marginBottom: 14 }}>
        <div className="ai-block-top">
          <span className="ai-tag">AI</span>
          <span className="ai-block-title">
            {data.risk === 'High' ? 'High risk — simulate before approving' : data.risk === 'Medium' ? 'Proceed with caution' : 'Recommended to proceed'}
          </span>
        </div>
        <div className="ai-block-body">{data.rec}</div>
        <div className="ai-caveat">Expected: {data.exp} · Model confidence: {data.conf}%</div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-lbl" style={{ marginBottom: 10 }}>Key signal</div>
        <div style={{ padding: 10, background: 'rgba(224,92,122,.05)', border: '1px solid rgba(224,92,122,.15)', borderRadius: 8, fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--red)', marginBottom: 4 }}>HIGH IMPACT</div>
          {data.signal}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-lbl" style={{ marginBottom: 10 }}>Identified risks</div>
        <div className="risk-list">
          {(data.risks || []).map((r, i) => (
            <div className="risk-row" key={i}>
              <div className="risk-sev" style={{ background: i === 0 ? 'var(--red)' : i === 1 ? 'var(--orange)' : 'var(--text3)' }} />
              <div className="risk-body">
                <div className="risk-title">
                  {r.split('(')[0].trim()}
                  <span className={`pill ${i < 2 ? 'p-rejected' : 'p-watch'}`} style={{ fontSize: 9 }}>
                    {i === 0 ? 'Critical' : i === 1 ? 'Medium' : 'Low'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-lbl">Alternative worth simulating</div>
        <div className="card-val">{data.alt}</div>
      </div>

      <div className="card">
        <div className="card-lbl" style={{ marginBottom: 10 }}>Past decision analogues</div>
        {db.memory.slice(0, 3).map(m => (
          <div key={m.id} style={{ border: '1px solid var(--line)', borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{m.title}</div>
              <span className={`pill p-${m.outcome === 'positive' ? 'pos' : m.outcome === 'negative' ? 'neg' : 'mixed'}`}>{m.outcome}</span>
            </div>
            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6 }}>{m.date} · {m.decider} · Actual: {m.actual}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', background: 'var(--bg2)', padding: '8px', borderRadius: 6, lineHeight: 1.6 }}>{m.lesson.slice(0, 150)}…</div>
          </div>
        ))}
      </div>
    </div>
  );
}
