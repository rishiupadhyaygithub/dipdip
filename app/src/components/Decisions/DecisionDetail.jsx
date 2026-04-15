import { useState } from 'react';
import { pillCls, pillLabel } from '../../lib/utils.js';
import Overview    from './steps/Overview.jsx';
import Enrichment  from './steps/Enrichment.jsx';
import Simulate    from './steps/Simulate.jsx';
import Approve     from './steps/Approve.jsx';
import Execute     from './steps/Execute.jsx';

const STEPS = ['Overview', 'Enrichment', 'Simulate', 'Approve', 'Execute'];

export default function DecisionDetail({ db, user, apiKey, activeDec, updateDecision, addAuditEntry, addMemory, toast }) {
  const [step, setStep] = useState(0);
  const d = db.decisions.find(x => x.id === activeDec);

  // Reset step when switching decisions
  const [lastDec, setLastDec] = useState(activeDec);
  if (lastDec !== activeDec) { setLastDec(activeDec); setStep(0); }

  if (!d) {
    return (
      <div className="dec-detail-pane" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--text3)' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: .4 }}>
          <path d="M5 12h14m-7-7v14" />
        </svg>
        <div style={{ fontSize: 14, marginTop: 12 }}>Select a decision</div>
        <div style={{ fontSize: 13, opacity: .7, marginTop: 4 }}>Click any decision to review, simulate outcomes, and approve.</div>
      </div>
    );
  }

  function goStep(i) { setStep(i); }

  return (
    <div className="dec-detail-pane">
      {/* Header */}
      <div className="dd-hdr">
        <div className="dd-hdr-top">
          <div className="dd-title">{d.title}</div>
          <span className={`pill ${pillCls(d.status)}`}>{pillLabel(d.status)}</span>
        </div>
        <div className="dd-meta">
          <span className="dd-meta-item">{d.proposer}</span>
          <span className="dd-meta-sep">·</span>
          <span className="dd-meta-item">{d.type}</span>
          <span className="dd-meta-sep">·</span>
          <span className="dd-meta-item" style={{ color: 'var(--gold)' }}>{d.urgency} urgency</span>
        </div>
        <div className="dd-progress">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`dp-step${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}
              onClick={() => goStep(i)}
            >
              <span className="dp-step-num">{i < step ? '✓' : i + 1}</span>
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Step body */}
      <div className="dd-body fu" key={`${d.id}-${step}`}>
        {step === 0 && <Overview    dec={d} user={user} apiKey={apiKey} />}
        {step === 1 && <Enrichment  dec={d} db={db} apiKey={apiKey} />}
        {step === 2 && <Simulate    dec={d} />}
        {step === 3 && (
          <Approve
            dec={d} user={user}
            updateDecision={updateDecision}
            addAuditEntry={addAuditEntry}
            addMemory={addMemory}
            toast={toast}
            goStep={goStep}
          />
        )}
        {step === 4 && (
          <Execute
            dec={d}
            updateDecision={updateDecision}
            toast={toast}
          />
        )}
      </div>

      {/* Footer Navigation */}
      <div style={{ padding: '16px 22px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
        <button className="btn-ghost" disabled={step === 0} onClick={() => goStep(Math.max(0, step - 1))}>← Back</button>
        <button className="btn-prim" disabled={step === 4} onClick={() => goStep(Math.min(4, step + 1))}>Next Step →</button>
      </div>
    </div>
  );
}
