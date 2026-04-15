// ══════════════════════════════════════
// AI utilities — Claude integration
// ══════════════════════════════════════

export async function aiCall(prompt, sys, max = 600, apiKey) {
  if (!apiKey) return null;
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: max,
        system: sys,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const d = await r.json();
    return d.content?.[0]?.text || null;
  } catch {
    return null;
  }
}

export async function getBrief(user, db, apiKey) {
  const pending = db.decisions.filter(d => d.status === 'pending').length;
  const urgent = db.signals.filter(s => s.urg).length;
  const prompt = `User: ${user.name}, ${user.role} at ${user.org}. Pending: ${pending} decisions. Urgent signals: ${urgent}. Write a sharp 2-sentence executive morning brief. No fluff. Pure signal and action.`;
  const sys = `DecisionOS AI. Write crisp executive briefs. 2 sentences max.`;
  const live = await aiCall(prompt, sys, 120, apiKey);
  return live || `You have ${pending} decision${pending !== 1 ? 's' : ''} pending and ${urgent} high-impact market signal${urgent !== 1 ? 's' : ''} overnight. The SKU-123 competitor pricing move is most time-sensitive — the 48-hour response window is closing.`;
}

export async function enrichDec(dec, apiKey) {
  const prompt = `Decision: "${dec.title}" (${dec.type}, ${dec.urgency} urgency). Problem: ${dec.problem}. Why now: ${dec.whynow}. Return JSON: {"rec":"one sentence","conf":68,"risk":"Medium","risks":["r1","r2","r3"],"exp":"+3.1%","signal":"key signal","alt":"alternative"}. ONLY JSON.`;
  const sys = `DecisionOS enrichment engine. Return valid JSON only.`;
  const live = await aiCall(prompt, sys, 300, apiKey);
  if (live) {
    try { return JSON.parse(live.replace(/```json|```/g, '').trim()) } catch {
      // Fall through to deterministic templates when model output is malformed.
    }
  }
  const templates = {
    Strategic: {
      rec: 'Proceed with caution — simulate 3 scenarios before committing. Price anchoring risk is dominant.',
      conf: 68, risk: 'Medium',
      risks: ['Price anchor formation (3/3 past analogues)', 'Competitor retaliation within 72h', 'Margin compression ~2.4pp'],
      exp: '+2.8%–+4.1%',
      signal: 'Competitor A dropped prices 30% in Mumbai — detected 48h ago',
      alt: 'Bundle strategy outperformed price cut in Q3 2024 by 4.1pp'
    },
    Operational: {
      rec: 'Low risk expansion — demand positive and first-mover window closing.',
      conf: 72, risk: 'Low',
      risks: ['Distributor onboarding delay 3–6 weeks', 'Competitor B may preempt with exclusive agreements'],
      exp: '+4.0%–+6.5%',
      signal: 'Pune demand up 18% YoY — Competitor B onboarding aggressively',
      alt: 'Pilot one distributor before full network commitment'
    },
    Marketing: {
      rec: 'Strong timing with regulatory tailwind — proceed and front-run the deadline.',
      conf: 81, risk: 'Low',
      risks: ['Packaging lead time 90 days required', 'Consumer adoption uncertainty'],
      exp: '+7.2%–+10.5%',
      signal: 'Maharashtra eco-packaging regulation effective Q3 — 90-day window',
      alt: 'Premium eco-tier pricing may outperform standard bundle'
    }
  };
  return templates[dec.type] || templates.Strategic;
}

export async function memSearch(q, memory, apiKey) {
  const ms = memory.slice(0, 8)
    .map((m, i) => `${i + 1}. ${m.title} (${m.date}) ${m.outcome}: ${m.lesson.slice(0, 100)}`)
    .join('\n');
  const prompt = `Query: "${q}"\nMemory:\n${ms}\nAnswer in 2-3 sentences. Be specific. Reference decision names.`;
  const sys = `DecisionOS memory search. Answer queries about past decisions. Be specific.`;
  const live = await aiCall(prompt, sys, 180, apiKey);
  return live || mockMemSearch(q, memory);
}

function mockMemSearch(q, memory) {
  const ql = q.toLowerCase();
  if (ql.match(/price|sku.089|cut|anchor/))
    return `The SKU-089 price reduction (Aug 2024) is the most critical analogue — it resulted in a permanent price anchor where demand fell 9% below baseline within 6 weeks and never recovered. The SKU-045 bundle decision (Q3 2024) is the recommended alternative, achieving +7.1% actual vs +4.2% predicted by choosing bundling over price cuts.`;
  if (ql.match(/pune|expand|distribut|market/))
    return `The Pune market entry Phase 1 (Q4 2024) is directly applicable — it achieved +8.3% actual revenue vs +6.0% predicted. The key success factor was moving 45 days before Competitor B. The current expansion should replicate this timing advantage before Competitor B establishes exclusive distributor agreements.`;
  return `The most relevant past decision is "${memory[0]?.title}" (${memory[0]?.date}) with a ${memory[0]?.outcome} outcome — actual was ${memory[0]?.actual} vs predicted ${memory[0]?.pred}. Key lesson: ${memory[0]?.lesson?.slice(0, 130)}`;
}

export async function getOverviewAI(dec, userRole, apiKey) {
  const msgs = {
    Strategic: `Price anchoring is the critical risk — 3 of 3 past analogues formed permanent price anchors. Before approving, run the simulator and review the bundle alternative from Q3 2024.`,
    Operational: `Demand signals in the target region are strong and the first-mover window is closing. Risk is low. Recommend pilot with one distributor before full network commitment.`,
    Marketing: `Regulatory tailwind makes this well-timed. The binding constraint is 90-day packaging lead time — approve now to maintain the runway before the Q3 deadline.`
  };
  const fallback = msgs[dec.type] || msgs.Strategic;
  const live = await aiCall(
    `Decision: "${dec.title}". Problem: ${dec.problem}. Write a sharp 2-sentence strategic read for a ${userRole}. No preamble.`,
    `DecisionOS AI. 2 sentences max. Specific and actionable.`, 120, apiKey
  );
  return live || fallback;
}
