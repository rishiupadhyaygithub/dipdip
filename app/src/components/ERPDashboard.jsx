import { useState } from 'react';
import { ERP } from '../data/erpData.js';

const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const TABS = ['SKU Performance', 'Inventory Health', 'P&L', 'CRM & Distributors'];

const fmt_lac = (n) => '₹' + (n / 100000).toFixed(1) + 'L';
const fmt_cr  = (n) => '₹' + (n / 10000000).toFixed(2) + 'Cr';

function TrendBar({ data, color = 'var(--gold)' }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 24, width: 64 }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1, borderRadius: 2,
          height: Math.max(3, (v / max) * 24),
          background: i === data.length - 1 ? color : 'rgba(255,255,255,.1)',
          transition: 'height .4s',
        }} />
      ))}
    </div>
  );
}

function AlertBadge({ sev, label }) {
  const map = {
    high: { bg: 'rgba(224,92,122,.12)', color: 'var(--red)', border: 'rgba(224,92,122,.25)' },
    med:  { bg: 'rgba(245,166,35,.1)',  color: 'var(--orange)', border: 'rgba(245,166,35,.22)' },
    low:  { bg: 'rgba(80,84,106,.12)', color: 'var(--text3)', border: 'rgba(80,84,106,.2)' },
  };
  const s = map[sev] || map.low;
  return (
    <span style={{
      fontSize: 10, fontFamily: 'var(--mono)', fontWeight: 700,
      padding: '2px 7px', borderRadius: 10,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap',
    }}>{label || sev.toUpperCase()}</span>
  );
}

function SignalLink({ signal_id }) {
  if (!signal_id) return null;
  return (
    <span style={{
      fontSize: 10, fontFamily: 'var(--mono)', fontWeight: 700,
      padding: '2px 7px', borderRadius: 10,
      background: 'rgba(91,156,246,.12)', color: 'var(--blue)',
      border: '1px solid rgba(91,156,246,.22)',
      whiteSpace: 'nowrap', marginLeft: 4,
    }}>→ Signal {signal_id}</span>
  );
}

// ── SKU Tab ──────────────────────────────────────────────────────────────
function SKUView() {
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
                  <TrendBar data={s.sales_units}
                    color={s.trend === 'up' || s.trend === 'spike' ? 'var(--green)' : s.trend === 'down' ? 'var(--red)' : 'var(--gold)'} />
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

// ── Inventory Tab ────────────────────────────────────────────────────────
function InventoryView() {
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

// ── P&L Tab ─────────────────────────────────────────────────────────────
function PLView() {
  const { pnl } = ERP;
  const fmtCr = n => '₹' + (n / 10000000).toFixed(2) + 'Cr';

  const rows = [
    { lbl: 'Revenue',      data: pnl.revenue,       fmt: fmtCr, cls: '' },
    { lbl: 'COGS',         data: pnl.cogs,           fmt: fmtCr, cls: 'red' },
    { lbl: 'Gross Margin', data: pnl.gross_margin,   fmt: fmtCr, cls: 'green' },
    { lbl: 'Gross Margin %', data: pnl.gm_pct,        fmt: v => v.toFixed(1) + '%', cls: 'green' },
    { lbl: 'OpEx',         data: pnl.opex,           fmt: fmtCr, cls: 'orange' },
    { lbl: 'EBITDA',       data: pnl.ebitda,         fmt: fmtCr, cls: 'gold' },
    { lbl: 'EBITDA %',     data: pnl.ebitda_pct,     fmt: v => v.toFixed(1) + '%', cls: 'gold' },
  ];

  const maxRev = Math.max(...pnl.revenue);

  return (
    <div>
      {/* Revenue bar chart */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-lbl" style={{ marginBottom: 16 }}>Monthly Revenue — Oct to Mar</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80, marginBottom: 8 }}>
          {pnl.revenue.map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{fmtCr(v)}</div>
              <div style={{
                width: '100%', borderRadius: '3px 3px 0 0',
                height: Math.max(6, (v / maxRev) * 60),
                background: i === pnl.revenue.length - 1 ? 'var(--gold)' : 'rgba(232,184,75,.25)',
                transition: 'height .5s',
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {MONTHS.map((m, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{m}</div>
          ))}
        </div>
      </div>

      {/* P&L Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 400 }}>Metric</th>
              {MONTHS.map(m => (
                <th key={m} style={{ padding: '8px 12px', textAlign: 'right', fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 400 }}>{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={r.lbl} style={{
                borderBottom: r.lbl.includes('%') ? '1px solid var(--line)' : '1px solid rgba(255,255,255,.03)',
                background: r.lbl === 'Gross Margin' || r.lbl === 'EBITDA' ? 'rgba(255,255,255,.015)' : 'transparent',
              }}>
                <td style={{ padding: '10px 12px', fontSize: 12, color: 'var(--text2)', fontWeight: r.lbl === 'Revenue' || r.lbl === 'EBITDA' ? 600 : 400 }}>{r.lbl}</td>
                {r.data.map((v, i) => (
                  <td key={i} style={{
                    padding: '10px 12px', textAlign: 'right',
                    fontFamily: 'var(--mono)',
                    color: r.cls === 'green' ? 'var(--green)' : r.cls === 'red' ? 'var(--red)' : r.cls === 'orange' ? 'var(--orange)' : r.cls === 'gold' ? 'var(--gold)' : 'var(--text)',
                    fontWeight: i === 5 ? 600 : 400,
                  }}>{r.fmt(v)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, padding: '12px 14px', background: 'rgba(78,204,163,.04)', border: '1px solid rgba(78,204,163,.12)', borderRadius: 8 }}>
        <span style={{ fontSize: 12, color: 'var(--green)' }}>
          ✓ FY26 tracking above plan · EBITDA at 18.7% avg vs 17.2% target · Dec peak at ₹1.08Cr EBITDA
        </span>
      </div>
    </div>
  );
}

// ── CRM Tab ──────────────────────────────────────────────────────────────
function CRMView() {
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

// ── Main Component ────────────────────────────────────────────────────────
export default function ERPDashboard() {
  const [tab, setTab] = useState(0);

  const highAlerts = ERP.alerts.filter(a => a.sev === 'high').length;

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

        {/* Header */}
        <div className="view-header" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div className="view-title">ERP & CRM — Live Data</div>
            <span style={{ fontSize: 10, fontFamily: 'var(--mono)', fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: 'rgba(78,204,163,.1)', color: 'var(--green)', border: '1px solid rgba(78,204,163,.2)' }}>
              ● Connected
            </span>
          </div>
          <div className="view-sub">Apex Retail India · FY 2025-26 · Read-only mirror from Tally + Sheets + Shopify</div>
        </div>

        {/* Connection bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', background: 'var(--bg1)', border: '1px solid var(--line)', borderRadius: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          {ERP.meta.sources.map(s => (
            <span key={s} style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--green)' }}>● {s}</span>
          ))}
          <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginLeft: 'auto' }}>Last sync: {ERP.meta.last_sync}</span>
          {highAlerts > 0 && (
            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--red)', fontWeight: 700 }}>
              ⚠ {highAlerts} high alerts surfaced to DecisionOS
            </span>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', marginBottom: 20, gap: 0 }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              padding: '10px 18px', fontSize: 13, fontWeight: 500,
              color: tab === i ? 'var(--gold)' : 'var(--text3)',
              border: 'none', borderBottom: tab === i ? '2px solid var(--gold)' : '2px solid transparent',
              background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all .15s',
            }}>{t}</button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 0 && <SKUView />}
        {tab === 1 && <InventoryView />}
        {tab === 2 && <PLView />}
        {tab === 3 && <CRMView />}

      </div>
    </div>
  );
}
