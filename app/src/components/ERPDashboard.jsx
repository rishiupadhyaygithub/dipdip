import { useState } from 'react';
import { ERP } from '../data/erpData.js';
import PowerBIDashboard from './PowerBIDashboard.jsx';

import SKUView from './ERPViews/SKUView.jsx';
import InventoryView from './ERPViews/InventoryView.jsx';
import PLView from './ERPViews/PLView.jsx';
import CRMView from './ERPViews/CRMView.jsx';

const TABS = ['SKU Performance', 'Inventory Health', 'P&L', 'CRM & Distributors', 'Power BI'];

export default function ERPDashboard() {
  const [tab, setTab] = useState(0);

  const highAlerts = ERP.alerts.filter(a => a.sev === 'high').length;

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

        {/* Header */}
        <div className="view-header" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div className="view-title">ERP & CRM — Live Data</div>
            <span style={{ fontSize: 10, fontFamily: 'var(--mono)', fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: 'rgba(78,204,163,.1)', color: 'var(--green)', border: '1px solid rgba(78,204,163,.2)' }}>
              ● Connected
            </span>
          </div>
          <div className="view-sub">Apex Retail India · FY 2025-26 · Read-only mirror from Tally + Sheets + Shopify</div>
        </div>

        {/* Connection bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', background: 'var(--bg1)', border: '1px solid var(--line)', borderRadius: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          {ERP.meta.sources.map(s => (
            <span key={s} style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--green)' }}>● {s}</span>
          ))}
          <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginLeft: 'auto' }}>Last sync: {ERP.meta.last_sync}</span>
          {highAlerts > 0 && (
            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--red)', fontWeight: 700 }}>
              ⚠ {highAlerts} high alerts surfaced to DecisionOS
            </span>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', marginBottom: 20, gap: 0 }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              padding: '10px 18px', fontSize: 13, fontWeight: 500,
              color: tab === i ? 'var(--gold)' : 'var(--text3)',
              border: 'none', borderBottom: tab === i ? '2px solid var(--gold)' : '2px solid transparent',
              background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all .15s',
            }}>{t}</button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ position: 'relative', minHeight: 400 }}>
          {tab === 0 && <SKUView />}
          {tab === 1 && <InventoryView />}
          {tab === 2 && <PLView />}
          {tab === 3 && <CRMView />}
          {tab === 4 && <PowerBIDashboard />}
        </div>

      </div>
    </div>
  );
}
