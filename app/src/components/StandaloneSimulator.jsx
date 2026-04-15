import { useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Legend, Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Legend, Tooltip);

const WKS = ['W1','W2','W3','W4','W5','W6','W7','W8'];
const mk  = end => WKS.map((_,i) => +(end*(Math.log1p(i*9/7)/Math.log(10))).toFixed(1));

const SLIDERS = [
  { key:'price',     label:'Price change',       unit:'%',    min:-30, max:30  },
  { key:'marketing', label:'Marketing spend',     unit:'L ₹', min:-10, max:20  },
  { key:'inventory', label:'Inventory level',     unit:'%',   min:-20, max:50  },
  { key:'headcount', label:'Headcount change',    unit:' FTE',min:-5,  max:10  },
];

const KEY_DRIVERS = [
  "Price elasticity in your segment: -0.82 (source: 14mo sales data)",
  "Competitor A price: ₹312 in comparable SKU (source: scraped Apr 10)",
  "Marketing ROI last 90d: 1.4x (source: Sheets — Campaign tracker)",
  "Inventory holding cost: ₹18/unit/day (source: Tally FY26)",
];

export default function StandaloneSimulator({ toast }) {
  const [vars, setVars] = useState({ price:0, marketing:0, inventory:0, headcount:0 });
  const [query, setQuery] = useState('');
  const [ran, setRan]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const toneClass = (v) => (v > 0 ? 'pos' : v < 0 ? 'neg' : 'neu');

  function runSim() {
    if (!query && Object.values(vars).every(v => v === 0)) return;
    setLoading(true); setRan(false);
    setTimeout(() => { setLoading(false); setRan(true); }, 1200);
  }

  const scenarios = [
    { label:'Conservative', confidence:81,
      revenue: +(vars.price*-0.4 + vars.marketing*0.3 + 2.1).toFixed(1),
      margin:  +(vars.price*-0.1 - vars.inventory*0.05 + 0.4).toFixed(1),
      cash:    +(vars.marketing*-0.5 - vars.headcount*0.8 + 1.2).toFixed(1) },
    { label:'Base case',    confidence:67, base:true,
      revenue: +(vars.price*-0.6 + vars.marketing*0.5 + 3.8).toFixed(1),
      margin:  +(vars.price*-0.2 - vars.inventory*0.08 + 0.8).toFixed(1),
      cash:    +(vars.marketing*-0.8 - vars.headcount*1.1 + 0.6).toFixed(1) },
    { label:'Aggressive',   confidence:41,
      revenue: +(vars.price*-0.9 + vars.marketing*0.9 + 6.2).toFixed(1),
      margin:  +(vars.price*-0.35 - vars.inventory*0.12 + 1.1).toFixed(1),
      cash:    +(vars.marketing*-1.2 - vars.headcount*1.5 - 0.8).toFixed(1) },
  ];

  const baseCase = scenarios[1];
  const chartData = {
    labels: WKS,
    datasets: [
      { label:'Conservative', data: mk(scenarios[0].revenue), borderColor:'rgba(78,204,163,.5)', borderWidth:1, pointRadius:0, tension:.45, borderDash:[4,3] },
      { label:'Base case',    data: mk(baseCase.revenue),     borderColor:'#5B9CF6', borderWidth:2, pointRadius:3, pointBackgroundColor:'#5B9CF6', tension:.45 },
      { label:'Aggressive',   data: mk(scenarios[2].revenue), borderColor:'rgba(232,184,75,.7)', borderWidth:1, pointRadius:0, tension:.45, borderDash:[4,3] },
    ]
  };
  const chartOpts = {
    responsive:true, animation:{ duration:400 },
    plugins:{ legend:{ display:true, position:'bottom', labels:{ font:{ size:10, family:"'JetBrains Mono'" }, color:'#454C60', boxWidth:16, padding:12 } } },
    scales:{
      x:{ grid:{ color:'rgba(255,255,255,.04)' }, ticks:{ color:'#454C60', font:{ size:10 } } },
      y:{ grid:{ color:'rgba(255,255,255,.04)' }, ticks:{ color:'#454C60', font:{ size:10 }, callback:v=>(v>0?'+':'')+v+'%' } }
    }
  };

  return (
    <div className="sim-wrap">
      <div className="view-header">
        <div className="view-title">Decision Simulator</div>
        <div className="view-sub">Set variables. AI shows what happens. You decide.</div>
      </div>

      <div className="sim-grid">
        {/* Left — inputs */}
        <div className="card">
          <div className="card-lbl sim-card-lbl">Input variables</div>
          <div className="sim-query-block">
            <label className="sim-query-label">Describe the scenario (optional)</label>
            <input
              className="sim-query-input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. What if we cut price on SKU-124 and increase ads?"
            />
          </div>
          <div className="sim-divider" />

          {SLIDERS.map(sl => (
            <div key={sl.key} className="sim-slider">
              <div className="sim-slider-head">
                <label className="sim-slider-label">{sl.label}</label>
                <span className={`sim-slider-value ${toneClass(vars[sl.key])}`}>
                  {vars[sl.key]>0?'+':''}{vars[sl.key]}{sl.unit}
                </span>
              </div>
              <input type="range" min={sl.min} max={sl.max} step={1} value={vars[sl.key]}
                onChange={e => setVars(v => ({ ...v, [sl.key]: +e.target.value }))}
                className="sim-slider-input"
              />
              <div className="sim-slider-scale">
                <span>{sl.min}{sl.unit}</span><span>0</span><span>+{sl.max}{sl.unit}</span>
              </div>
            </div>
          ))}

          <div className="sim-sources">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>
            All values sourced from connected Sheets + Tally. <a>View sources</a>
          </div>

          <button
            onClick={runSim}
            className="sim-run-btn"
          >
            {loading ? 'Running simulation...' : 'Run Simulation'}
          </button>
        </div>

        {/* Right — results */}
        <div>
          {!ran && !loading && (
            <div className="card sim-empty-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="sim-empty-icon">
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
              </svg>
              <div className="sim-empty-text">Set variables and run the simulation to see scenarios.</div>
            </div>
          )}

          {loading && (
            <div className="card sim-loading-card">
              <div className="ai-spin"><div className="spin"/><span>Calculating chain-reaction impact...</span></div>
            </div>
          )}

          {ran && (
            <>
              {/* Scenario cards */}
              <div className="sim-scenarios">
                {scenarios.map((sc) => (
                  <div key={sc.label} className={`card sim-scenario-card${sc.base ? ' base' : ''}`}>
                    {sc.base && <div className="sim-base-tag">BASE CASE</div>}
                    <div className="sim-scenario-title">{sc.label}</div>
                    {[{ l:'Revenue', v:sc.revenue, u:'%' }, { l:'Margin', v:sc.margin, u:'%' }, { l:'Cash flow', v:sc.cash, u:'L' }].map(m => (
                      <div key={m.l} className="sim-metric">
                        <div className="sim-metric-label">{m.l}</div>
                        <div className={`sim-metric-value ${toneClass(m.v)}`}>
                          {m.v>0?'+':''}{m.v}{m.u}
                        </div>
                      </div>
                    ))}
                    <div className="sim-metric-divider"/>
                    <div className="sim-confidence-label">Confidence</div>
                    <div className={`sim-confidence-value ${sc.confidence>70?'pos':sc.confidence>50?'warn':'neg'}`}>{sc.confidence}%</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="card sim-section-card">
                <div className="sim-chart-label">8-week revenue projection</div>
                <Line data={chartData} options={chartOpts} />
              </div>

              {/* Key drivers */}
              <div className="card sim-section-card">
                <div className="card-lbl sim-card-lbl-sm">
                  Key drivers <span className="sim-card-lbl-sub">— click any to view source</span>
                </div>
                {KEY_DRIVERS.map((d, i) => (
                  <div key={i} className="key-driver-row">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.5"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    <div className="key-driver-text">{d}</div>
                  </div>
                ))}
              </div>

              {!saved ? (
                <button
                  onClick={() => { setSaved(true); toast('Saved to Decision Log — pending approval'); }}
                  className="sim-save-btn"
                >
                  Save as Decision Draft
                </button>
              ) : (
                <div className="saved-banner">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                  Saved to Decision Log — pending approval
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
