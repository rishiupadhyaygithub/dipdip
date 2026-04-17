import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export function Sparkline({ data, color = 'var(--gold)' }) {
  const chartData = {
    labels: data.map((_, i) => String(i)),
    datasets: [{
      data: data,
      backgroundColor: data.map((_, i) => i === data.length - 1 ? color : 'rgba(255,255,255,0.1)'),
      borderRadius: 2,
      borderSkipped: false,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: { display: false, min: 0 }
    },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    animation: { duration: 400 }
  };

  return (
    <div style={{ height: 24, width: 64 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export function AlertBadge({ sev, label }) {
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
    }}>{label || (sev && sev.toUpperCase())}</span>
  );
}

export function SignalLink({ signal_id }) {
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
