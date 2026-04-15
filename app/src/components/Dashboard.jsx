import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  PointElement, LineElement,
  Filler, Legend, Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getBrief } from '../lib/ai.js';
import { statusColor, pillCls, pillLabel, impCls } from '../lib/utils.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Legend, Tooltip);

function useTypewriter(finalText, ms = 16) {
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!finalText) return;
    setText('');
    setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setText(finalText.slice(0, i));
      if (i >= finalText.length) { clearInterval(iv); setDone(true); }
    }, ms);
    return () => clearInterval(iv);
  }, [finalText]);
  return { text, done };
}

const CHART_OPTIONS = {
  responsive: true,
  animation: { duration: 800, easing: 'easeOutQuart' },
  plugins: {
    legend: { display: true, position: 'bottom', labels: { font: { size: 11, family: "'JetBrains Mono'" }, color: '#454C60', boxWidth: 18, padding: 16 } },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#454C60', font: { size: 10, family: "'JetBrains Mono'" } } },
    y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#454C60', font: { size: 10, family: "'JetBrains Mono'" }, callback: v => (v > 0 ? '+' : '') + v + '%' } }
  }
};

export default function Dashboard({ db, user, apiKey, setView, openDec }) {
  const [briefRaw, setBriefRaw] = useState('');
  const { text: brief, done: briefDone } = useTypewriter(briefRaw, 16);

  useEffect(() => {
    getBrief(user, db, apiKey).then(setBriefRaw);
  }, [user, db, apiKey]);

  const pendingCount  = db.decisions.filter(d => d.status === 'pending').length;
  const signalCount   = db.signals.filter(s => s.urg).length;

  const chartData = {
    labels: ['Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb'],
    datasets: [
      { label: 'Predicted', data: [2.1,3.4,1.8,4.2,2.9,-1.2,3.8,5.1,2.3,4.7,3.1,6.2], borderColor: 'rgba(91,156,246,.5)', borderWidth: 1.5, pointRadius: 0, tension: .45, fill: false, borderDash: [5,3] },
      { label: 'Actual',    data: [2.4,2.9,2.1,5.1,2.2,-2.8,4.3,4.8,3.1,5.4,2.7,7.1], borderColor: '#E8B84B', backgroundColor: 'rgba(232,184,75,.05)', borderWidth: 2, pointRadius: 3.5, pointBackgroundColor: '#E8B84B', pointBorderColor: 'transparent', tension: .45, fill: true }
    ]
  };

  return (
    <div className="dash-body">
      {/* AI Brief */}
      <div className="brief-card">
        <div className="brief-tag">AI Brief</div>
        <div className={`brief-text${briefRaw && !briefDone ? ' typing' : ''}`}>
          {brief || 'Loading morning brief...'}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { lbl: 'Pending review',     val: pendingCount, cls: 'gold', sub: 'Decisions awaiting you' },
          { lbl: 'Signals today',      val: signalCount,  cls: 'red',  sub: 'High-impact alerts' },
          { lbl: 'Forecast accuracy',  val: '74%',        cls: 'green',sub: '+9pp vs manual baseline' },
          { lbl: 'Revenue attributed', val: '₹2.4Cr',     cls: '',     sub: 'Closed-loop verified' },
        ].map(s => (
          <div className="stat-c" key={s.lbl}>
            <div className="stat-lbl">{s.lbl}</div>
            <div className={`stat-num${s.cls ? ' ' + s.cls : ''}`}>{s.val}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Two-col panels */}
      <div className="dash-cols">
        {/* Decisions queue */}
        <div className="dash-panel">
          <div className="dp-hdr">
            <span className="dp-title">Decisions queue</span>
            <button className="dp-link" onClick={() => setView('decisions')}>View all →</button>
          </div>
          <div className="dp-body">
            {db.decisions.slice(0, 4).map(d => (
              <div className="mini-dec" key={d.id} onClick={() => { setView('decisions'); setTimeout(() => openDec(d.id), 60); }}>
                <div className="mini-dec-dot" style={{ '--dot-color': statusColor(d.status) }} />
                <div className="mini-dec-info">
                  <div className="mini-dec-title">{d.title}</div>
                  <div className="mini-dec-meta">{d.proposer} · {d.type}</div>
                </div>
                <span className={`mini-pill ${pillCls(d.status)}`}>{pillLabel(d.status)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live signals */}
        <div className="dash-panel">
          <div className="dp-hdr">
            <span className="dp-title">Live signals</span>
            <button className="dp-link" onClick={() => setView('signals')}>View all →</button>
          </div>
          <div className="dp-body">
            {db.signals.slice(0, 4).map(s => (
              <div className="mini-sig" key={s.id}>
                <div className="ms-top">
                  <span className="ms-cat">{s.cat}</span>
                  <span className={`imp-chip ${impCls(s.impact)}`}>{s.impact.toUpperCase()}</span>
                </div>
                <div className="ms-body">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-panel">
        <div className="chart-panel-hdr">
          <span className="chart-panel-title">Decision outcomes — predicted vs actual</span>
          <span className="chart-panel-sub">12 months · revenue impact %</span>
        </div>
        <Line data={chartData} options={CHART_OPTIONS} />
      </div>
    </div>
  );
}
