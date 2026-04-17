import { useState } from 'react';
import { ERP } from '../../data/erpData.js';
import { Sparkline, AlertBadge, SignalLink } from './Shared.jsx';

const fmt_lac = (n) => '₹' + (n / 100000).toFixed(1) + 'L';

export default function SKUView() {
  const [sort, setSort] = useState('id');
  const cols = [
    { key: 'id', label: 'SKU ID' }, { key: 'name', label: 'Product' },
    { key: 'cat', label: 'Category' }, { key: 'mrp', label: 'MRP' },
    { key: 'margin', label: 'Margin %' },
  ];
  const sorted = [...ERP.skus].sort((a, b) =>
    sort === 'margin' ? b.margin - a.margin : a[sort]?.localeCompare?.(b[sort]) || 0
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
          {ERP.skus.length} SKUs · {ERP.alerts.filter(a => a.sev === 'high').length} high-severity alerts
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {cols.slice(-2).map(c => (
            <button key={c.key}
              onClick={() => setSort(c.key)}
              style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                fontFamily: 'var(--mono)', border: '1px solid',
                background: sort === c.key ? 'var(--bg3)' : 'transparent',
                color: sort === c.key ? 'var(--text)' : 'var(--text3)',
                borderColor: sort === c.key ? 'var(--line2)' : 'var(--line)',
              }}>Sort {c.label}</button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              {['SKU', 'Product', 'Category', 'MRP', 'Cost', 'Margin', '6M Trend', 'Mar Revenue', 'Status', ''].map(h => (
                <th key={h} style={{
                  padding: '8px 12px', textAlign: 'left',
                  fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)',
                  textTransform: 'uppercase', letterSpacing: '.06em',
                  fontWeight: 400, whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(s => (
              <tr key={s.id} style={{
                borderBottom: '1px solid var(--line)',
                background: s.alert_sev === 'high' ? 'rgba(224,92,122,.02)' : 'transparent',
                transition: 'background .15s',
              }}>
                <td style={{ padding: '12px 12px', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', whiteSpace: 'nowrap' }}>{s.id}</td>
                <td style={{ padding: '12px 12px', fontWeight: 500, whiteSpace: 'nowrap' }}>{s.name}</td>
                <td style={{ padding: '12px 12px', color: 'var(--text3)', fontSize: 11 }}>{s.cat}</td>
                <td style={{ padding: '12px 12px', fontFamily: 'var(--mono)' }}>₹{s.mrp}</td>
                <td style={{ padding: '12px 12px', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>₹{s.cost}</td>
                <td style={{ padding: '12px 12px', fontFamily: 'var(--mono)', color: s.margin > 36 ? 'var(--green)' : s.margin < 30 ? 'var(--orange)' : 'var(--text)' }}>
                  {s.margin}%
                </td>
                <td style={{ padding: '12px 12px' }}>
                  <Sparkline data={s.sales_units}
                    color={s.trend === 'up' || s.trend === 'spike' ? '#4ecca3' : s.trend === 'down' ? '#e05c7a' : '#e8b84b'} />
                </td>
                <td style={{ padding: '12px 12px', fontFamily: 'var(--mono)', whiteSpace: 'nowrap' }}>
                  {fmt_lac(s.sales_rev[5])}
                </td>
                <td style={{ padding: '12px 12px' }}>
                  {s.alert_sev && <AlertBadge sev={s.alert_sev} label={s.trend === 'spike' ? 'SPIKE' : s.trend === 'down' ? 'DECLINING' : s.alert_sev === 'med' ? 'WATCH' : null} />}
                  {!s.alert_sev && <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--green)' }}>✓ NORMAL</span>}
                </td>
                <td style={{ padding: '12px 12px' }}>
                  {s.signal_id && <SignalLink signal_id={s.signal_id} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Alert summary */}
      <div style={{ marginTop: 16, borderTop: '1px solid var(--line)', paddingTop: 14 }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>
          Active Alerts from ERP — {ERP.alerts.length} total
        </div>
        {ERP.alerts.map((a, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8, marginBottom: 6,
            background: a.sev === 'high' ? 'rgba(224,92,122,.04)' : 'rgba(245,166,35,.02)',
            border: `1px solid ${a.sev === 'high' ? 'rgba(224,92,122,.12)' : 'rgba(245,166,35,.1)'}`,
          }}>
            <AlertBadge sev={a.sev} label={a.type} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', minWidth: 60 }}>{a.sku}</span>
            <span style={{ fontSize: 12, color: 'var(--text2)', flex: 1 }}>{a.msg}</span>
            {a.signal_id && (
              <span style={{
                fontSize: 10, fontFamily: 'var(--mono)',
                padding: '2px 8px', borderRadius: 10,
                background: 'rgba(91,156,246,.1)', color: 'var(--blue)',
                border: '1px solid rgba(91,156,246,.2)', whiteSpace: 'nowrap',
              }}>→ DecisionOS {a.signal_id}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
