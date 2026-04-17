import { ERP } from '../../data/erpData.js';
import { Bar } from 'react-chartjs-2';

const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

export default function PLView() {
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

  const chartData = {
    labels: MONTHS,
    datasets: [{
      data: pnl.revenue,
      backgroundColor: pnl.revenue.map((_, i) => i === pnl.revenue.length - 1 ? '#e8b84b' : 'rgba(232,184,75,.25)'),
      borderRadius: { topLeft: 3, topRight: 3, bottomLeft: 0, bottomRight: 0 },
      borderSkipped: false,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { 
        display: true, 
        grid: { display: false, drawBorder: false }, 
        ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10, family: 'monospace' } }
      },
      y: { display: false, min: 0 }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => fmtCr(context.raw)
        }
      }
    },
    animation: { duration: 500 }
  };

  return (
    <div>
      {/* Revenue bar chart */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-lbl" style={{ marginBottom: 16 }}>Monthly Revenue — Oct to Mar</div>
        <div style={{ height: 120, marginBottom: 8, padding: '0 10px' }}>
          <Bar data={chartData} options={chartOptions} />
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
