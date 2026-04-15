import { useState } from 'react';
import { randHash, initials } from '../lib/utils.js';
import { enrichDec } from '../lib/ai.js';

export default function NewDecisionModal({ user, apiKey, defaults = {}, onClose, onSubmit }) {
  const [title, setTitle]      = useState(defaults.title || '');
  const [type, setType]        = useState('Strategic');
  const [urgency, setUrgency]  = useState('High');
  const [problem, setProblem]  = useState(defaults.problem || '');
  const [whynow, setWhynow]    = useState(defaults.whynow || '');
  const [alts, setAlts]        = useState('');

  async function submit() {
    if (!title.trim() || !problem.trim()) {
      alert('Please fill in title and problem.');
      return;
    }
    const dec = {
      id: 'd' + Date.now().toString(36),
      created: new Date().toISOString(),
      title: title.trim(), type, urgency,
      proposer: user.name, role: user.role, status: 'pending',
      problem: problem.trim(),
      whynow: whynow.trim(),
      alternatives: alts.trim(),
      confidence: 60, risk: 'Medium',
      exp: 'Simulating…', best: '—', worst: '—',
      ep: 50, bp: 25, wp: 25,
      reviewers: [{ name: user.name, role: user.role, status: 'pending', av: initials(user.name), col: 'rgba(232,184,75,.15)' }],
      audit: [{ type: 'proposed', actor: user.name, time: 'Just now', detail: 'Decision proposed', hash: randHash() }],
      steps: []
    };
    onSubmit(dec);
    onClose();
    // Async enrichment happens in App
    enrichDec(dec, apiKey).then(e => {
      onSubmit({ ...dec, confidence: e.conf, risk: e.risk, exp: e.exp }, true);
    });
  }

  return (
    <div className="modal-ov" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">
          <div>
            <div className="modal-title">New decision</div>
            <div className="modal-sub">AI enriches automatically after submission</div>
          </div>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="ff">
            <label>Title <span className="ff-req">*</span></label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Reduce SKU-123 price by 10% in West region" />
          </div>
          <div className="ff-row">
            <div className="ff">
              <label>Type</label>
              <select value={type} onChange={e => setType(e.target.value)}>
                {['Strategic','Operational','Financial','Marketing','Product'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="ff">
              <label>Urgency</label>
              <select value={urgency} onChange={e => setUrgency(e.target.value)}>
                {['Low','Medium','High','Critical'].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="ff">
            <label>Problem <span className="ff-req">*</span></label>
            <textarea rows={3} value={problem} onChange={e => setProblem(e.target.value)} placeholder="Describe the business situation or opportunity..." />
          </div>
          <div className="ff">
            <label>Why now?</label>
            <input value={whynow} onChange={e => setWhynow(e.target.value)} placeholder="What signal or deadline makes this time-sensitive?" />
          </div>
          <div className="ff">
            <label>Alternatives considered</label>
            <input value={alts} onChange={e => setAlts(e.target.value)} placeholder="e.g. Bundle strategy, increase ad spend, hold price" />
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-prim" onClick={submit}>Submit — AI enriches automatically</button>
        </div>
      </div>
    </div>
  );
}
