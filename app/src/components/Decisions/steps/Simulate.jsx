import { useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Legend, Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Legend, Tooltip);

const WKS = ['W1','W2','W3','W4','W5','W6','W7','W8'];
const mk = (end) => WKS.map((_,i) => +(end * (Math.log1p(i*9/7)/Math.log(10))).toFixed(1));

export default function Simulate() {
  const [mag, setMag]   = useState(10);
  const [ela, setEla]   = useState(55);
  const [cmp, setCmp]   = useState(40);
  const [sup, setSup]   = useState(20);

  const m = mag/100, e = ela/100, c = cmp/100, s = sup/100;
  const base = m*(0.3+e*0.5)*100 + s*5 - 0.8;
  const bv = +(base*1.6+1.5-c*2).toFixed(1);
  const ev = +(base-c*2).toFixed(1);
  const wv = +(base*0.2-c*4-2).toFixed(1);
  const bp = Math.max(10, Math.round(20+e*12-c*8));
  const wp = Math.max(10, Math.round(15+c*20-e*8));
  const ep = Math.max(10, 100-bp-wp);
  const conf = Math.min(90, Math.max(40, Math.round(45+e*18+s*12-c*10)));
  const du = +(m*(0.3+e*0.5)*100*0.55+s*4.2).toFixed(1);
  const mh = +(m*24).toFixed(1);

  const cav = conf < 55
    ? 'Low confidence — gather more data before committing.'
    : c > 0.6
      ? 'High retaliation risk dominates. Monitor 1 week before executing.'
      : 'Reasonable confidence. Commit with rollback trigger at week 4.';

  const chartData = {
    labels: WKS,
    datasets: [
      { label: 'Best',     data: mk(bv), borderColor: 'rgba(78,204,163,.5)',  borderWidth: 1, pointRadius: 0, tension: .45, fill: false, borderDash: [4,3] },
      { label: 'Expected', data: mk(ev), borderColor: '#5B9CF6', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#5B9CF6', tension: .45, fill: false },
      { label: 'Worst',    data: mk(wv), borderColor: 'rgba(224,92,122,.5)', borderWidth: 1, pointRadius: 0, tension: .45, fill: false, borderDash: [4,3] }
    ]
  };
  const chartOpts = {
    responsive: true, animation: { duration: 300 },
    plugins: { legend: { display: true, position: 'bottom', labels: { font: { size: 10, family:"'JetBrains Mono'" }, color: '#454C60', boxWidth: 16, padding: 12 } } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#454C60', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#454C60', font: { size: 10 }, callback: v => (v>0?'+':'')+v+'%' } }
    }
  };

  const ela_label = ela < 30 ? 'Low' : ela < 60 ? 'Medium' : ela < 80 ? 'High' : 'Very high';

  return (
    <div>
      {/* Controls */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="card-lbl" style={{ marginBottom: 12 }}>Adjust assumptions</div>
        {[
          { label: 'Impact magnitude',       val: mag+'%',     set: setMag, min:2,  max:25,  cur:mag },
          { label: 'Demand elasticity',      val: ela_label,   set: setEla, min:0,  max:100, cur:ela },
          { label: 'Competitor response risk',val: cmp+'%',    set: setCmp, min:0,  max:100, cur:cmp },
          { label: 'Supporting action strength',val: sup+'%',  set: setSup, min:0,  max:100, cur:sup },
        ].map(sl => (
          <div className="sl-row" key={sl.label}>
            <span className="sl-lbl">{sl.label}</span>
            <input type="range" min={sl.min} max={sl.max} value={sl.cur} onChange={e => sl.set(+e.target.value)} />
            <span className="sl-v">{sl.val}</span>
          </div>
        ))}
      </div>

      {/* Scenario tiles */}
      <div className="three-c">
        {[
          { cls: 'b', type: 'Best case',  val: bv, prob: bp, note: 'Competitor holds, demand responds well' },
          { cls: 'e', type: 'Expected',   val: ev, prob: ep, note: 'Partial recovery, margin compressed',  active: true },
          { cls: 'w', type: 'Worst case', val: wv, prob: wp, note: 'Price war starts, anchor forms' },
        ].map(sc => (
          <div className={`sc-tile${sc.active ? ' s-active' : ''}`} key={sc.type}>
            <div className={`sc-type ${sc.cls}`}>{sc.type}</div>
            <div className={`sc-val ${sc.cls}`}>{(sc.val > 0 ? '+' : '')}{sc.val}%</div>
            <div className="sc-p">{sc.prob}% likely</div>
            <div className="sc-note">{sc.note}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card" style={{ marginBottom: 12 }}>
        <Line data={chartData} options={chartOpts} />
      </div>

      {/* Drivers */}
      <div className="card">
        <div className="card-lbl" style={{ marginBottom: 10 }}>What drives the expected outcome</div>
        {[
          { lbl: 'Demand elasticity response',  w: Math.min(95,du*9)+'%',  val: '+'+du+'%',   cls:'pos', bg:'var(--blue)' },
          { lbl: 'Margin compression',          w: Math.min(95,mh*4)+'%',  val: '−'+mh+'pp',  cls:'neg', bg:'var(--red)' },
          { lbl: 'Competitor retaliation risk', w: cmp+'%',                val: cmp+'% risk', cls:'neu', bg:'var(--orange)' },
          { lbl: 'Seasonal headwind',           w: '26%',                  val: '−1.1%',      cls:'neg', bg:'var(--text3)' },
        ].map(dr => (
          <div className="dr-row" key={dr.lbl}>
            <span className="dr-lbl">{dr.lbl}</span>
            <div className="dr-bg"><div className="dr-fill" style={{ width: dr.w, background: dr.bg }} /></div>
            <span className={`dr-val ${dr.cls}`}>{dr.val}</span>
          </div>
        ))}
        <div className="conf-row">
          <span className="cr-lbl">Model confidence</span>
          <div className="cr-bg"><div className="cr-fill" style={{ width: conf+'%' }} /></div>
          <span className="cr-val">{conf}%</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8 }}>{cav}</div>
      </div>
    </div>
  );
}
