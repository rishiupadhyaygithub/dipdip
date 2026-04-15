import { useState } from 'react';
import { randHash, initials } from '../../../lib/utils.js';

export default function Approve({ dec, user, updateDecision, addAuditEntry, addMemory, toast, goStep }) {
  const [reason, setReason] = useState('');

  function doAction(action) {
    const msgs = {
      approve:   'Decision approved — routing to execution',
      condition: 'Approved with conditions — execution will confirm each step',
      reject:    'Decision rejected — archived to memory',
      defer:     'Decision deferred — proposer notified'
    };

    if (action === 'approve') {
      const defaultSteps = dec.steps.length ? dec.steps : [
        { icon:'ERP', c:'rgba(167,139,250,.15)', tc:'#A78BFA', name:'Update ERP pricing table',   desc:'Pricing changes for approved decision.',         status:'pending', hash:'' },
        { icon:'CRM', c:'rgba(78,204,163,.12)',  tc:'#4ECCA3', name:'Notify sales team',          desc:'Team notifications and task creation.',          status:'pending', hash:'' },
        { icon:'A/B', c:'rgba(91,156,246,.12)',  tc:'#5B9CF6', name:'Launch A/B test',           desc:'Measure impact via controlled experiment.',      status:'pending', hash:'' },
        { icon:'SLK', c:'rgba(232,184,75,.1)',   tc:'#E8B84B', name:'Post to #strategy',          desc:'Decision summary to team channel.',              status:'pending', hash:'' },
      ];
      updateDecision(dec.id, { status: 'executing', steps: defaultSteps });
    } else if (action === 'reject') {
      updateDecision(dec.id, { status: 'rejected' });
      addMemory({
        id: 'm' + Date.now(), title: dec.title,
        date: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        decider: user.name, outcome: 'rejected', pred: dec.exp, actual: 'N/A',
        lesson: reason || 'Decision rejected before execution.'
      });
    } else if (action === 'defer') {
      updateDecision(dec.id, { status: 'review' });
    }

    addAuditEntry(dec.id, {
      type: action, actor: user.name, time: 'Just now',
      detail: reason || msgs[action], hash: randHash()
    });

    toast(msgs[action]);
    if (action === 'approve') setTimeout(() => goStep(4), 200);
  }

  return (
    <div>
      <div className="ai-block" style={{ marginBottom: 14 }}>
        <div className="ai-block-top"><span className="ai-tag">AI</span>
          <span className="ai-block-title">{dec.risk === 'Medium' ? 'Approve with rollback condition' : 'Recommended to proceed'}</span>
        </div>
        <div className="ai-block-body">
          {dec.risk === 'Medium'
            ? 'Price anchoring risk is the dominant concern — 3/3 past analogues formed permanent anchors. Recommend approving only with a Week 4 rollback trigger at +1.5% minimum revenue impact.'
            : 'Signals are positive and risk is manageable. Proceed with standard 8-week measurement window.'}
        </div>
        <div className="ai-caveat">Confidence {dec.confidence}% · This is a suggestion. You are the decision-maker.</div>
      </div>

      {/* Reviewer panel */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-lbl" style={{ marginBottom: 10 }}>Reviewer panel</div>
        {dec.reviewers.length === 0 && (
          <div className="rev-row">
            <div className="rev-av" style={{ background: 'rgba(232,184,75,.15)' }}>{initials(user.name)}</div>
            <div style={{ flex: 1 }}>
              <div className="rev-name">{user.name}</div>
              <div className="rev-role">{user.role} · you</div>
            </div>
            <span className="pill p-pending">pending</span>
          </div>
        )}
        {dec.reviewers.map(r => (
          <div className="rev-row" key={r.av}>
            <div className="rev-av" style={{ background: r.col }}>{r.av}</div>
            <div style={{ flex: 1 }}>
              <div className="rev-name">{r.name}</div>
              <div className="rev-role">{r.role}{r.name === user.name ? ' · you' : ''}</div>
              {r.comment && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>"{r.comment}"</div>}
            </div>
            <span className={`pill ${r.status === 'approved' ? 'p-approved' : r.status === 'flagged' ? 'p-watch' : 'p-pending'}`}>{r.status}</span>
          </div>
        ))}
      </div>

      {/* Override panel */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-lbl" style={{ marginBottom: 8 }}>Override AI assumptions</div>
        {[
          { label: 'Rollback trigger',     def: 'Week 4 · +1.5%' },
          { label: 'Measurement window',   def: '8 weeks' },
        ].map(item => (
          <div key={item.label} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <span style={{ fontSize:12, color:'var(--text2)', flex:1 }}>{item.label}</span>
            <input defaultValue={item.def} style={{ width:130, padding:'6px 10px', background:'var(--bg2)', border:'1px solid var(--line2)', borderRadius:7, fontSize:12, color:'var(--text)', fontFamily:'var(--mono)', outline:'none' }} />
            <span style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--text3)', minWidth:70, textAlign:'right' }}>AI default</span>
          </div>
        ))}
      </div>

      {/* Reasoning */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:6 }}>Your reasoning — stored permanently</div>
        <textarea className="form-input" rows={3} value={reason} onChange={e => setReason(e.target.value)}
          placeholder="e.g. Approving with rollback at week 4. I believe elasticity is slightly higher than the model assumes..." />
      </div>

      {/* Action buttons */}
      <div className="dec-actions">
        <button className="da-btn da-approve" onClick={() => doAction('approve')}>Approve</button>
        <button className="da-btn da-flag"    onClick={() => doAction('condition')}>With conditions</button>
        <button className="da-btn da-reject"  onClick={() => doAction('reject')}>Reject</button>
      </div>
      <button className="da-defer" onClick={() => doAction('defer')}>Defer — request more information</button>

      {/* Audit trail */}
      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-lbl" style={{ marginBottom: 10 }}>Audit trail</div>
        {dec.audit.map((a, i) => (
          <div className="audit-row" key={i}>
            <div className="a-dot" style={{ background: a.type==='approved'?'var(--green)':a.type==='flagged'?'var(--orange)':a.type==='ai'?'var(--blue)':'var(--text3)' }} />
            <div>
              <div className="a-act">{a.actor} · {a.type}</div>
              <div className="a-det">{a.detail}</div>
              {a.hash && <div className="a-hash">{a.hash}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
