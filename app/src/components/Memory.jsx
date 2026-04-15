import { useState, useRef } from 'react';
import { memSearch } from '../lib/ai.js';

function useTypewriter(finalText, ms = 15) {
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  const run = (t) => {
    clearInterval(ref.current);
    setText(''); setDone(false);
    let i = 0;
    ref.current = setInterval(() => {
      i++; setText(t.slice(0, i));
      if (i >= t.length) { clearInterval(ref.current); setDone(true); }
    }, ms);
  };
  return { text, done, run };
}

export default function Memory({ db, apiKey }) {
  const [query, setQuery]     = useState('');
  const [ansRaw, setAnsRaw]   = useState('');
  const [showAns, setShowAns] = useState(false);
  const [filtered, setFiltered] = useState(null);
  const { text: ansText, done: ansDone, run: runAns } = useTypewriter('', 15);
  const timerRef = useRef(null);

  function onQuery(q) {
    setQuery(q);
    clearTimeout(timerRef.current);
    if (q.length < 3) { setShowAns(false); setFiltered(null); return; }
    setShowAns(true);
    timerRef.current = setTimeout(async () => {
      const ans = await memSearch(q, db.memory, apiKey);
      setAnsRaw(ans);
      runAns(ans);
      const fl = db.memory.filter(m =>
        m.title.toLowerCase().includes(q.toLowerCase()) ||
        m.lesson.toLowerCase().includes(q.toLowerCase())
      );
      setFiltered(fl.length ? fl : db.memory);
    }, 400);
  }

  const list = filtered ?? db.memory;

  return (
    <div className="mem-wrap">
      <div className="view-header">
        <div className="view-title">Memory</div>
        <div className="view-sub">Immutable record of every decision, context, and outcome.</div>
      </div>

      <div className="mem-search">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={e => onQuery(e.target.value)}
          placeholder="Ask anything — e.g. why did we cut SKU-089 price?"
        />
      </div>

      {showAns && (
        <div className="mem-ai-ans">
          <div className="brief-tag mem-ai-tag">AI Answer</div>
          <div className={`brief-text${ansRaw && !ansDone ? ' typing' : ''}`}>{ansText}</div>
        </div>
      )}

      {list.map(m => (
        <div className="mem-card" key={m.id}>
          <div className="mc-title">
            {m.title}
            <span className={`pill p-${m.outcome==='positive'?'pos':m.outcome==='negative'?'neg':m.outcome==='rejected'?'rejected':'mixed'}`}>{m.outcome}</span>
          </div>
          <div className="mc-meta">{m.date} · {m.decider} · Predicted {m.pred} → Actual {m.actual}</div>
          <div className="mc-lesson">{m.lesson}</div>
        </div>
      ))}
    </div>
  );
}
