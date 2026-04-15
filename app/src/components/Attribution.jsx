import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, BarElement,
  Filler, Legend, Tooltip
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Legend, Tooltip);

const ACC_OPTIONS = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color:'#454C60', font:{ size:10 } } },
    y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color:'#454C60', font:{ size:10 }, callback: v=>v+'%' }, min:40, max:90 }
  }
};
const DIST_OPTIONS = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color:'#454C60', font:{ size:11 } } },
    y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color:'#454C60', font:{ size:10 }, stepSize:2 } }
  }
};

export default function Attribution() {
  const accData = {
    labels: ["Q2'24","Q3'24","Q4'24","Q1'25","Q2'25","Q3'25","Q4'25","Q1'26"],
    datasets: [{ label:'Accuracy %', data:[52,57,61,63,67,70,72,74], borderColor:'#4ECCA3', backgroundColor:'rgba(78,204,163,.06)', borderWidth:2, pointRadius:4, pointBackgroundColor:'#4ECCA3', tension:.45, fill:true }]
  };
  const distData = {
    labels: ['Positive','Mixed','Negative','Rejected'],
    datasets: [{ data:[10,4,3,1], backgroundColor:['rgba(78,204,163,.2)','rgba(245,166,35,.18)','rgba(224,92,122,.18)','rgba(80,84,106,.2)'], borderColor:['#4ECCA3','#F5A623','#E05C7A','#50546A'], borderWidth:1, borderRadius:7 }]
  };

  return (
    <div className="attr-wrap">
      <div className="view-header">
        <div className="view-title">Attribution</div>
        <div className="view-sub">Closed-loop performance tracking for every decision made.</div>
      </div>

      <div className="stats-row" style={{ marginBottom:20 }}>
        {[
          { lbl:'Avg accuracy',      val:'74%',   cls:'green', sub:'+9pp vs manual' },
          { lbl:'Decisions tracked', val:'18',    cls:'',      sub:'This quarter' },
          { lbl:'Revenue attributed',val:'₹2.4Cr',cls:'gold',  sub:'Closed-loop verified' },
          { lbl:'Rollbacks triggered',val:'2',    cls:'red',   sub:'Loss prevented' },
        ].map(s => (
          <div className="stat-c" key={s.lbl}>
            <div className="stat-lbl">{s.lbl}</div>
            <div className={`stat-num${s.cls?' '+s.cls:''}`}>{s.val}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="chart-panel" style={{ marginBottom:16 }}>
        <div className="chart-panel-hdr"><span className="chart-panel-title">Forecast accuracy improvement</span></div>
        <Line data={accData} options={ACC_OPTIONS} />
      </div>
      <div className="chart-panel">
        <div className="chart-panel-hdr"><span className="chart-panel-title">Decision outcomes distribution</span></div>
        <Bar data={distData} options={DIST_OPTIONS} />
      </div>
    </div>
  );
}
