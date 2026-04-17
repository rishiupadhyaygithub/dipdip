import { ERP } from '../../data/erpData.js';

export default function InventoryView() {
  const regions = ['north', 'south', 'east', 'west'];
  const regionLabels = { north: 'North', south: 'South', east: 'East', west: 'West' };

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { lbl: 'Total Inv. Value', val: '₹4.82Cr', sub: 'Across all regions', cls: '' },
          { lbl: 'Slow Movers', val: '2 SKUs', sub: 'SKU-089 · SKU-412', cls: 'orange' },
          { lbl: 'Critical Low', val: '4 zones', sub: 'Below reorder level', cls: 'red' },
          { lbl: 'POs Pending', val: '3', sub: '₹18.4L value', cls: '' },
        ].map(c => (
          <div key={c.lbl} className="card" style={{ margin: 0, padding: '14px 16px' }}>
            <div className="card-lbl">{c.lbl}</div>
            <div className="stat-num" style={{ fontSize: 20 }}>{c.val}</div>
            <div className="stat-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              {['SKU', 'Product', ...regions.map(r => regionLabels[r] + ' (units)'), ...regions.map(r => regionLabels[r] + ' (days)'), 'Alert'].map(h => (
                <th key={h} style={{
                  padding: '8px 10px', textAlign: 'left',
                  fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)',
                  textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 400, whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ERP.skus.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '11px 10px', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)' }}>{s.id}</td>
                <td style={{ padding: '11px 10px', fontWeight: 500, whiteSpace: 'nowrap', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</td>
                {regions.map(r => (
                  <td key={r} style={{ padding: '11px 10px', fontFamily: 'var(--mono)', textAlign: 'right',
                    color: s.inv[r] < s.reorder ? 'var(--red)' : 'var(--text2)' }}>
                    {s.inv[r].toLocaleString()}
                  </td>
                ))}
                {regions.map(r => (
                  <td key={r + '_d'} style={{ padding: '11px 10px', textAlign: 'right', fontFamily: 'var(--mono)',
                    color: s.cover[r] < 20 ? 'var(--red)' : s.cover[r] < 35 ? 'var(--orange)' : 'var(--green)' }}>
                    {s.cover[r]}d
                  </td>
                ))}
                <td style={{ padding: '11px 10px' }}>
                  {s.alert && <div style={{ fontSize: 11, color: s.alert_sev === 'high' ? 'var(--red)' : s.alert_sev === 'med' ? 'var(--orange)' : 'var(--text3)', maxWidth: 180, lineHeight: 1.4 }}>{s.alert}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 10, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
        Red = below reorder level · Days cover: red &lt;20d · orange &lt;35d · green ≥35d
      </div>
    </div>
  );
}
