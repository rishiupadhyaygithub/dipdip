import { useState } from 'react';

const ROLES = ['Head of Strategy', 'CEO', 'CPO', 'CFO', 'Growth Lead', 'Founder', 'COO'];

export default function Login({ onBoot }) {
  const [name, setName] = useState('Rishi Upadhyay');
  const [org, setOrg] = useState('Apex Retail India');
  const [role, setRole] = useState('Head of Strategy');
  const [key, setKey] = useState('');
  const [advOpen, setAdvOpen] = useState(false);

  function boot(demo = false) {
    onBoot({ name: name.trim() || 'User', org: org.trim() || 'My Company', role, key: demo ? '' : key.trim() }, demo);
  }

  function handleKey(e) {
    if (e.key === 'Enter') boot(false);
  }

  return (
    <div className="login-screen">
      <div className="login-bg">
        <div className="login-orb a" />
        <div className="login-orb b" />
      </div>

      <div className="login-card">
        <div className="login-logo">
          <div className="login-mark">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M4 10L8.5 14.5L16 5" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="login-brand">Decision<em>OS</em></div>
            <div className="login-tagline">AI Decision Intelligence</div>
          </div>
        </div>

        <div className="login-heading">Good to see you.</div>
        <div className="login-sub">Tell us who you are — we'll set up your decision workspace.</div>

        <div className="lf">
          <label>Your name</label>
          <input value={name} onChange={e => setName(e.target.value)} onKeyDown={handleKey} placeholder="Full name" />
        </div>

        <div className="lf-row">
          <div className="lf">
            <label>Organisation</label>
            <input value={org} onChange={e => setOrg(e.target.value)} onKeyDown={handleKey} placeholder="Company name" />
          </div>
          <div className="lf">
            <label>Your role</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="login-adv" onClick={() => setAdvOpen(o => !o)}>
          <span>{advOpen ? '▾' : '▸'}</span> Advanced — connect real AI
        </div>

        {advOpen && (
          <div className="login-adv-content open">
            <div className="lf">
              <label>Anthropic API Key <span className="login-key-optional">(optional)</span></label>
              <input type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="sk-ant-... paste here for live Claude AI" />
              <div className="adv-hint">Without a key, DecisionOS runs in demo mode with simulated AI. Everything works — signals, enrichment, simulation, memory search.</div>
            </div>
          </div>
        )}

        <button className="login-btn" onClick={() => boot(false)}>Enter DecisionOS →</button>
        <div className="login-enter-hint">Press Enter to connect</div>
        <div className="login-demo">or <span onClick={() => boot(true)}>launch with sample data instantly</span></div>
      </div>
    </div>
  );
}
