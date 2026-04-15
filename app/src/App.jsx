import { useState, useCallback, lazy, Suspense, useTransition } from 'react';
import Login               from './components/Login.jsx';
import TopNav              from './components/TopNav.jsx';
import NewDecisionModal    from './components/NewDecisionModal.jsx';
import Toast               from './components/Toast.jsx';
import { useToast }        from './hooks/useToast.js';
import { useStore }        from './hooks/useStore.js';

const Dashboard = lazy(() => import('./components/Dashboard.jsx'));
const Decisions = lazy(() => import('./components/Decisions/index.jsx'));
const StandaloneSimulator = lazy(() => import('./components/StandaloneSimulator.jsx'));
const Signals = lazy(() => import('./components/Signals.jsx'));
const Memory = lazy(() => import('./components/Memory.jsx'));
const Attribution = lazy(() => import('./components/Attribution.jsx'));
const Connectors = lazy(() => import('./components/Connectors.jsx'));

export default function App() {
  const { db, addDecision, updateDecision, addAuditEntry, addMemory, resetToSeed } = useStore();
  const { msg, visible, toast } = useToast();

  const [user, setUser]             = useState(null);
  const [aiLive, setAiLive]         = useState(false);
  const [apiKey, setApiKey]         = useState('');
  const [view, setView]             = useState('dashboard');
  const [activeDec, setActiveDec]   = useState(null);
  const [showModal, setShowModal]   = useState(false);
  const [modalDefaults, setModalDefaults] = useState({});
  const [mountedViews, setMountedViews] = useState(() => new Set(['dashboard']));
  const [isPending, startTransition] = useTransition();

  const setViewSmooth = useCallback((nextView) => {
    setMountedViews(prev => {
      if (prev.has(nextView)) return prev;
      const next = new Set(prev);
      next.add(nextView);
      return next;
    });
    startTransition(() => setView(nextView));
  }, []);

  // ── Boot ──────────────────────────────────────
  function onBoot(u, demo) {
    if (demo) {
      resetToSeed();
      setUser({ name: 'Demo User', org: 'DecisionOS', role: 'Head of Strategy', key: '' });
      setAiLive(false);
      setApiKey('');
      return;
    }
    const live = !!u.key && u.key.startsWith('sk-ant');
    setUser(u);
    setAiLive(live);
    setApiKey(u.key);
  }

  // ── New decision from signal ───────────────────
  function onCreateDecisionFromSignal(sig) {
    setModalDefaults({
      title: `Respond to: ${sig.cat} signal`,
      problem: sig.body,
      whynow: `Signal detected ${sig.time} — ${sig.impact} impact.`
    });
    setShowModal(true);
    setViewSmooth('decisions');
  }

  // ── Submit new decision ────────────────────────
  function onSubmitDecision(dec, isEnrichUpdate = false) {
    if (isEnrichUpdate) {
      updateDecision(dec.id, { confidence: dec.confidence, risk: dec.risk, exp: dec.exp });
    } else {
      addDecision(dec);
      toast('Submitted — AI enrichment running...');
      setViewSmooth('decisions');
      setTimeout(() => setActiveDec(dec.id), 80);
    }
  }

  // ── Open decision from dashboard ──────────────
  const openDec = useCallback((id) => setActiveDec(id), []);

  if (!user) {
    return <Login onBoot={onBoot} />;
  }

  return (
    <div className="app-shell">
      <TopNav
        view={view} setView={setViewSmooth}
        user={user} aiLive={aiLive} db={db}
        onNewDecision={() => { setModalDefaults({}); setShowModal(true); }}
      />

      <Suspense fallback={
        <div className="view-wrap active">
          <div className="view-loading">{isPending ? 'Switching view...' : 'Loading view...'}</div>
        </div>
      }>
        {mountedViews.has('dashboard') && (
          <div className={`view-wrap${view === 'dashboard' ? ' active fu' : ''}`}>
            <Dashboard db={db} user={user} apiKey={apiKey} setView={setViewSmooth} openDec={openDec} />
          </div>
        )}

        {mountedViews.has('decisions') && (
          <div className={`view-wrap${view === 'decisions' ? ' active fu' : ''}`} id="view-decisions">
            <Decisions
              db={db} user={user} apiKey={apiKey}
              activeDec={activeDec} setActiveDec={setActiveDec}
              updateDecision={updateDecision}
              addAuditEntry={addAuditEntry}
              addMemory={addMemory}
              toast={toast}
            />
          </div>
        )}

        {mountedViews.has('simulator') && (
          <div className={`view-wrap${view === 'simulator' ? ' active fu' : ''}`}>
            <StandaloneSimulator toast={toast} />
          </div>
        )}

        {mountedViews.has('signals') && (
          <div className={`view-wrap${view === 'signals' ? ' active fu' : ''}`}>
            <Signals db={db} onCreateDecision={onCreateDecisionFromSignal} />
          </div>
        )}

        {mountedViews.has('memory') && (
          <div className={`view-wrap${view === 'memory' ? ' active fu' : ''}`}>
            <Memory db={db} apiKey={apiKey} />
          </div>
        )}

        {mountedViews.has('attribution') && (
          <div className={`view-wrap${view === 'attribution' ? ' active fu' : ''}`}>
            <Attribution />
          </div>
        )}

        {mountedViews.has('connectors') && (
          <div className={`view-wrap${view === 'connectors' ? ' active fu' : ''}`}>
            <Connectors />
          </div>
        )}
      </Suspense>

      {/* Modal */}
      {showModal && (
        <NewDecisionModal
          user={user} apiKey={apiKey}
          defaults={modalDefaults}
          onClose={() => setShowModal(false)}
          onSubmit={onSubmitDecision}
        />
      )}

      <Toast msg={msg} visible={visible} />
    </div>
  );
}
