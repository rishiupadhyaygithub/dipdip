import { ERP } from '../../data/erpData.js';

export default function CRMView() {
  const stageColor = {
    'Qualified': 'var(--text3)', 'Proposal': 'var(--blue)',
    'Negotiation': 'var(--orange)', 'Closed Won': 'var(--green)', 'Lost': 'var(--red)'
  };
  const statusColor = { active: 'var(--green)', watch: 'var(--orange)', new: 'var(--blue)', 'at-risk': 'var(--red)' };

  const pipelineTotal = ERP.crm_pipeline.filter(d => d.probability > 0 && d.probability < 100)
    .reduce((sum, d) => sum + d.value_cr * d.probability / 100, 0);

  return (
    <div>
      {/* Pipeline stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { lbl: 'Pipeline (weighted)', val: '₹' + pipelineTotal.toFixed(2) + 'Cr', cls: '' },
          { lbl: 'Active Deals', val: ERP.crm_pipeline.filter(d => d.probability > 0 && d.probability < 100).length, cls: '' },
          { lbl: 'Blocked by Decision', val: '1', cls: 'red', sub: 'DMart ₹3.2Cr' },
          { lbl: 'Active Distributors', val: ERP.distributors.filter(d => d.status === 'active').length + '/' + ERP.distributors.length, cls: '' },
        ].map(c => (
          <div key={c.lbl} className="card" style={{ margin: 0, padding: '14px 16px' }}>
            <div className="card-lbl">{c.lbl}</div>
            <div className={`stat-num ${c.cls}`} style={{ fontSize: 20 }}>{c.val}</div>
            {c.sub && <div className="stat-sub">{c.sub}</div>}
          </div>
        ))}
      </div>

      {/* Deal Pipeline */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Deal Pipeline</div>
        {ERP.crm_pipeline.map(d => (
          <div key={d.id} style={{
            background: 'var(--bg1)', border: `1px solid ${d.blocked_by ? 'rgba(224,92,122,.25)' : 'var(--line)'}`,
            borderRadius: 10, padding: '14px 16px', marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
                {d.name}
                {d.blocked_by && (
                  <span style={{ fontSize: 10, fontFamily: 'var(--mono)', padding: '2px 7px', borderRadius: 10, background: 'rgba(224,92,122,.1)', color: 'var(--red)', border: '1px solid rgba(224,92,122,.2)' }}>
                    BLOCKED → Decision d1
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                {d.owner} · SKUs: {d.skus.join(', ')} · Due {d.due}
              </div>
              {d.loss_reason && <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 3 }}>Lost: {d.loss_reason}</div>}
              {d.next_action && d.probability > 0 && (
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>Next: {d.next_action}</div>
              )}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--mono)', marginBottom: 3 }}>₹{d.value_cr}Cr</div>
              <div style={{ fontSize: 11, color: stageColor[d.stage] || 'var(--text3)', fontFamily: 'var(--mono)', fontWeight: 600 }}>{d.stage}</div>
              {d.probability > 0 && d.probability < 100 && (
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{d.probability}% win probability</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Distributor Table */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Distributor Performance — Mar 2026</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              {['Distributor', 'City', 'Mar Rev', 'vs Target', 'YoY', 'Top SKU', 'Due Days', 'Status'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 400, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ERP.distributors.map(d => (
              <tr key={d.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '11px 10px', fontWeight: 500 }}>{d.name}</td>
                <td style={{ padding: '11px 10px', color: 'var(--text3)', fontSize: 11 }}>{d.city}</td>
                <td style={{ padding: '11px 10px', fontFamily: 'var(--mono)' }}>₹{d.rev_lac}L</td>
                <td style={{ padding: '11px 10px', fontFamily: 'var(--mono)', color: d.achievement >= 100 ? 'var(--green)' : d.achievement >= 85 ? 'var(--gold)' : 'var(--red)' }}>
                  {d.achievement}%
                </td>
                <td style={{ padding: '11px 10px', fontFamily: 'var(--mono)', color: !d.yoy_growth ? 'var(--text3)' : d.yoy_growth > 0 ? 'var(--green)' : 'var(--red)' }}>
                  {d.yoy_growth !== null ? (d.yoy_growth > 0 ? '+' : '') + d.yoy_growth + '%' : 'New'}
                </td>
                <td style={{ padding: '11px 10px', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)' }}>{d.top_sku}</td>
                <td style={{ padding: '11px 10px', fontFamily: 'var(--mono)', color: d.dues_days > 35 ? 'var(--red)' : d.dues_days > 25 ? 'var(--orange)' : 'var(--text2)' }}>
                  {d.dues_days}d
                </td>
                <td style={{ padding: '11px 10px' }}>
                  <span style={{ fontSize: 10, fontFamily: 'var(--mono)', fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: 'transparent', color: statusColor[d.status] || 'var(--text3)' }}>
                    ● {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
