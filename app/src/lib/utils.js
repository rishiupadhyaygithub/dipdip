// ══════════════════════════════════════
// Utility helpers
// ══════════════════════════════════════

export function statusColor(s) {
  return {
    pending: 'var(--gold)', approved: 'var(--green)',
    executing: 'var(--green)', review: 'var(--blue)',
    rejected: 'var(--red)', watch: 'var(--orange)'
  }[s] || 'var(--text3)';
}

export function pillCls(s) {
  return {
    pending: 'p-pending', approved: 'p-approved',
    executing: 'p-executing', review: 'p-review',
    rejected: 'p-rejected', watch: 'p-watch'
  }[s] || 'p-pending';
}

export function pillLabel(s) {
  return {
    pending: 'Pending', approved: 'Approved',
    executing: 'Executing', review: 'In review',
    rejected: 'Rejected', watch: 'Watch'
  }[s] || s;
}

export function impCls(i) {
  return { high: 'ic-high', med: 'ic-med', low: 'ic-low' }[i] || 'ic-med';
}

export function relT(iso) {
  try {
    const ms = Date.now() - new Date(iso).getTime();
    if (ms < 3_600_000) return Math.round(ms / 60000) + 'm ago';
    if (ms < 86_400_000) return Math.round(ms / 3_600_000) + 'h ago';
    return Math.round(ms / 86_400_000) + 'd ago';
  } catch { return '—'; }
}

export function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export function randHash() {
  return '#' + Math.random().toString(36).slice(2, 8);
}
