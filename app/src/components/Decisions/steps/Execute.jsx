import { useState } from 'react';

export default function Execute({ dec, updateDecision, toast }) {
  const [steps, setSteps] = useState(dec.steps || []);

  if (!steps.length) {
    return (
      <div className="ddp-empty" style={{ height: 200 }}>
        <div className="ddp-empty-icon">⏳</div>
        <div className="ddp-empty-title">Approve first</div>
        <div className="ddp-empty-sub">Execution steps appear after approval.</div>
      </div>
    );
  }

  const pending  = steps.filter(s => s.status === 'pending');
  const done     = steps.filter(s => s.status === 'done');
  const running  = steps.filter(s => s.status === 'running');
  const allDone  = pending.length === 0 && running.length === 0;

  function runAll() {
    let delay = 0;

    steps.forEach((s, si) => {
      if (s.status !== 'pending') return;
      setTimeout(() => {
        setSteps(prev => prev.map((x, i) => i === si ? { ...x, status: 'running' } : x));
        setTimeout(() => {
          const hash = 'exec_hash #' + Math.random().toString(36).slice(2, 9);
          setSteps(prev => {
            const next = prev.map((x, i) => i === si ? { ...x, status: 'done', hash } : x);
            // Check if all done
            if (next.every(x => x.status === 'done')) {
              updateDecision(dec.id, { status: 'approved', steps: next });
              toast('All steps complete — decision is live');
            } else {
              updateDecision(dec.id, { steps: next });
            }
            return next;
          });
        }, 1000);
      }, delay);
      delay += 1400;
    });
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <div style={{ fontSize:13, fontWeight:500 }}>{steps.length} execution steps</div>
          <div style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--text3)', marginTop:2 }}>
            {done.length} done · {running.length} running · {pending.length} pending
          </div>
        </div>
        {allDone
          ? <span className="pill p-approved">All complete</span>
          : <button className="btn-prim" onClick={runAll}>Run all pending</button>
        }
      </div>

      <div className="card">
        {steps.map((s, i) => (
          <div className="exec-step" key={i}>
            <div className="exec-icon" style={{ background: s.c, color: s.tc }}>{s.icon}</div>
            <div className="exec-info">
              <div className="exec-name">
                {s.name}
                <span className={`pill ${s.status==='done'?'p-approved':s.status==='running'?'p-executing':'p-pending'}`}>
                  {s.status}
                </span>
              </div>
              <div className="exec-desc">{s.desc}</div>
              <div className="exec-hash">{s.hash || 'Awaiting execution'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
