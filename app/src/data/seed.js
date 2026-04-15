// ══════════════════════════════════════
// SEED DATA — extracted from main.html
// ══════════════════════════════════════

export const SEED = {
  decisions: [
    {
      id: 'd1', created: '2026-03-15T07:20:00Z',
      title: 'Reduce SKU-123 price by 10% — West region',
      type: 'Strategic', urgency: 'High', proposer: 'Ananya Sharma', role: 'Head of Sales', status: 'pending',
      problem: 'Competitor A cut prices by 30% in Mumbai and Pune two days ago. SKU-123 demand down 12% MoM.',
      whynow: 'Competitor move detected 48h ago. Distributor reorder velocity dropping.',
      alternatives: 'Bundle strategy, increase ad spend 25%, hold and monitor 2 weeks',
      confidence: 68, risk: 'Medium', exp: '+3.1%', best: '+7.2%', worst: '-3.8%', ep: 51, bp: 22, wp: 27,
      reviewers: [
        { name: 'Rishi Upadhyay', role: 'Head of Strategy', status: 'pending', av: 'RU', col: 'rgba(232,184,75,.15)' },
        { name: 'Priya Mehta', role: 'CFO', status: 'approved', av: 'PM', col: 'rgba(78,204,163,.12)', comment: 'Directionally right. Needs measurement plan.' },
        { name: 'Karan Verma', role: 'Sales Ops', status: 'flagged', av: 'KV', col: 'rgba(245,166,35,.1)', comment: 'MRP floor clauses in West region — legal review needed.' }
      ],
      audit: [
        { type: 'proposed', actor: 'Ananya Sharma', time: '2h ago', detail: 'Decision proposed', hash: '#a3f9c2' },
        { type: 'ai', actor: 'AI Engine', time: '2h ago', detail: 'Enrichment complete — 7 signals, 5 risks, 3 analogues' },
        { type: 'approved', actor: 'Priya Mehta', time: '1h ago', detail: '"Directionally right."', hash: '#b7d3e1' },
        { type: 'flagged', actor: 'Karan Verma', time: '45m ago', detail: '"MRP floor clauses — legal review."', hash: '#c4f2a0' }
      ],
      steps: []
    },
    {
      id: 'd2', created: '2026-03-14T10:00:00Z',
      title: 'Expand to Pune distributor network',
      type: 'Operational', urgency: 'Medium', proposer: 'Karan Verma', role: 'Head of Sales Ops', status: 'review',
      problem: '3 qualified distributors in Pune have approached us. Coverage gap exists. Competitor B is onboarding aggressively.',
      whynow: 'Q2 planning window closes in 10 days.',
      alternatives: 'Expand through existing Mumbai distributor, defer to Q3',
      confidence: 55, risk: 'Low', exp: '+5.2%', best: '+9.1%', worst: '-1.2%', ep: 58, bp: 28, wp: 14,
      reviewers: [
        { name: 'Rishi Upadhyay', role: 'Head of Strategy', status: 'pending', av: 'RU', col: 'rgba(232,184,75,.15)' },
        { name: 'Priya Mehta', role: 'CFO', status: 'pending', av: 'PM', col: 'rgba(78,204,163,.12)' }
      ],
      audit: [
        { type: 'proposed', actor: 'Karan Verma', time: 'Yesterday', detail: 'Decision proposed', hash: '#d9e2f1' },
        { type: 'ai', actor: 'AI Engine', time: 'Yesterday', detail: 'Enrichment complete — 4 signals, 2 risks, 1 analogue' }
      ],
      steps: []
    },
    {
      id: 'd3', created: '2026-03-12T09:00:00Z',
      title: 'Launch eco-bundle campaign — Q2',
      type: 'Marketing', urgency: 'Low', proposer: 'Priya Mehta', role: 'CFO', status: 'executing',
      problem: 'Maharashtra eco-packaging regulations tightening Q3. Opportunity to lead brand positioning before compliance is mandatory.',
      whynow: '90-day packaging lead time. Must start now for Q3 readiness.',
      alternatives: 'Wait for regulation, maintain current packaging',
      confidence: 81, risk: 'Low', exp: '+8.4%', best: '+12.1%', worst: '+2.3%', ep: 62, bp: 24, wp: 14,
      reviewers: [],
      audit: [
        { type: 'approved', actor: 'Rishi Upadhyay', time: '3d ago', detail: 'Approved — excellent timing with regulatory tailwind', hash: '#e1f9a3' }
      ],
      steps: [
        { icon: 'ERP', c: 'rgba(167,139,250,.15)', tc: '#A78BFA', name: 'Update product bundles in SAP', desc: 'Eco-bundle SKUs created and priced.', status: 'done', hash: 'exec_hash #2a9b1f' },
        { icon: 'A/B', c: 'rgba(78,204,163,.1)', tc: '#4ECCA3', name: 'A/B test running', desc: 'Eco-bundle landing page variant vs control.', status: 'running', hash: 'exp_ecobundle_q2' }
      ]
    }
  ],

  signals: [
    { id: 's1', src: 'Competitor tracker', time: '2h ago', impact: 'high', body: 'Competitor A launched flash sale — 30% off comparable SKUs in Mumbai and Pune. Social sentiment spiked +22%. Price response decision recommended.', cat: 'Competitor', urg: true },
    { id: 's2', src: 'Demand model', time: '4h ago', impact: 'high', body: 'SKU-078 demand spiked 34% above forecast in East region. No obvious cause. Root cause investigation recommended — possible viral social or distributor stockpiling.', cat: 'Demand', urg: true },
    { id: 's3', src: 'News monitor', time: 'Yesterday', impact: 'med', body: 'Eco-packaging regulations tightening in Maharashtra Q3 2026. Affects 6 SKUs in portfolio. Supply chain review window ~90 days.', cat: 'Regulatory', urg: false },
    { id: 's4', src: 'ERP connector', time: '2d ago', impact: 'med', body: 'SKU-123 inventory in West region at 42 days cover — below 60-day target. Reorder should trigger within 7 days if demand recovers.', cat: 'Supply Chain', urg: false },
    { id: 's5', src: 'Marketing platform', time: '3d ago', impact: 'low', body: 'Ad spend on SKU-123 campaigns down 18% vs last month — may be contributing independently to the demand drop.', cat: 'Marketing', urg: false },
  ],

  memory: [
    { id: 'm1', title: 'SKU-089 price reduction — West region', date: 'Aug 2024', decider: 'Ananya Sharma', outcome: 'negative', pred: '+5.1%', actual: '-3.2%', lesson: 'Demand recovered +4% initially then fell 9% below pre-cut baseline within 6 weeks. Price anchor formed. Never reversed. Strongest cautionary analogue for any West region price cut.' },
    { id: 'm2', title: 'SKU-045 bundle strategy vs price cut', date: 'Q3 2024', decider: 'Rishi Upadhyay', outcome: 'positive', pred: '+4.2%', actual: '+7.1%', lesson: 'Choosing bundle over price cut maintained margin and grew basket size 11%. Best comparable precedent. Bundle strongly preferred over direct price cuts.' },
    { id: 'm3', title: 'Competitor B price match response', date: 'Jan 2025', decider: 'Priya Mehta', outcome: 'mixed', pred: '+3.0%', actual: '+2.1%', lesson: 'Demand stabilised +6% but margin compression of 1.8pp never recovered. Should have waited 2 more weeks to see if Competitor B reversed.' },
    { id: 'm4', title: 'Pune market entry — Phase 1', date: 'Q4 2024', decider: 'Karan Verma', outcome: 'positive', pred: '+6.0%', actual: '+8.3%', lesson: 'First-mover advantage in Pune North paid off. Distributor network established 45 days before Competitor B. Market share locked in first 60 days.' },
  ]
};

export const CONNECTORS = [
  { id: 'sheets', name: 'Google Sheets', status: 'connected', last: '10 min ago', icon: '📊', data: '32 tables · 4,812 rows', desc: 'Sales, inventory, and campaign trackers' },
  { id: 'tally',  name: 'Tally Prime',  status: 'connected', last: '2h ago',     icon: '🧾', data: 'FY25-26 ledger · 18 months', desc: 'P&L, balance sheet, cash flow' },
  { id: 'shopify',name: 'Shopify',       status: 'connected', last: 'Live',       icon: '🛒', data: '1,240 orders · 89 SKUs', desc: 'Real-time order and SKU data' },
  { id: 'gmail',  name: 'Gmail',         status: 'connected', last: '15 min ago', icon: '✉️', data: 'Evidence only · Read-only', desc: 'Supplier & distributor threads' },
  { id: 'hubspot',name: 'HubSpot CRM',   status: 'disconnected', last: '—',      icon: '📋', data: '—', desc: 'Pipeline, deals, and contacts' },
  { id: 'wa',     name: 'WhatsApp Business', status: 'disconnected', last: '—',  icon: '💬', data: '—', desc: 'Field sales and distributor comms' },
];
