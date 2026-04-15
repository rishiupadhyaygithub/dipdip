import { useState, useEffect } from 'react';
import { getOverviewAI } from '../../../lib/ai.js';

function useTypewriter(finalText, ms = 14) {
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!finalText) return;
    setText(''); setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++; setText(finalText.slice(0, i));
      if (i >= finalText.length) { clearInterval(iv); setDone(true); }
    }, ms);
    return () => clearInterval(iv);
  }, [finalText]);
  return { text, done };
}

export default function Overview({ dec, user, apiKey }) {
  const [aiRaw, setAiRaw] = useState('');
  const { text: aiText, done } = useTypewriter(aiRaw, 14);

  useEffect(() => {
    getOverviewAI(dec, user.role, apiKey).then(setAiRaw);
  }, [dec.id]);

  return (
    <div>
      <div className="two-c">
        <div className="card">
          <div className="card-lbl">Expected outcome</div>
          <div className="card-big" style={{ color: 'var(--blue)' }}>{dec.exp}</div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>revenue impact</div>
        </div>
        <div className="card">
          <div className="card-lbl">Model confidence</div>
          <div className="card-big" style={{ color: 'var(--gold)' }}>{dec.confidence}%</div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>signal quality</div>
        </div>
      </div>
      <div className="two-c">
        <div className="card">
          <div className="card-lbl">Risk level</div>
          <div className="card-big" style={{ color: 'var(--orange)' }}>{dec.risk}</div>
        </div>
        <div className="card">
          <div className="card-lbl">Worst case probability</div>
          <div className="card-big" style={{ color: 'var(--red)' }}>{dec.wp}% chance</div>
        </div>
      </div>
      <div className="card"><div className="card-lbl">Problem</div><div className="card-val">{dec.problem}</div></div>
      <div className="card"><div className="card-lbl">Why now</div><div className="card-val">{dec.whynow}</div></div>
      {dec.alternatives && <div className="card"><div className="card-lbl">Alternatives</div><div className="card-val">{dec.alternatives}</div></div>}

      <div className="ai-block">
        <div className="ai-block-top"><span className="ai-tag">AI</span><span className="ai-block-title">Quick read</span></div>
        <div className={`ai-block-body${aiRaw && !done ? ' typing' : ''}`}>
          {aiText || <span style={{ opacity: .4 }}>Analysing...</span>}
        </div>
        <div className="ai-caveat">Confidence {dec.confidence}% · You remain the decision-maker</div>
      </div>
    </div>
  );
}
