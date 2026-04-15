import { useState } from 'react';
import DecisionList from './DecisionList.jsx';
import DecisionDetail from './DecisionDetail.jsx';

export default function Decisions({ db, user, apiKey, activeDec, setActiveDec, updateDecision, addAuditEntry, addMemory, toast }) {
  const [filter, setFilter] = useState('all');

  return (
    <div className="decisions-shell">
      <DecisionList
        db={db}
        filter={filter}
        setFilter={setFilter}
        activeDec={activeDec}
        setActiveDec={setActiveDec}
      />
      <DecisionDetail
        db={db}
        user={user}
        apiKey={apiKey}
        activeDec={activeDec}
        updateDecision={updateDecision}
        addAuditEntry={addAuditEntry}
        addMemory={addMemory}
        toast={toast}
      />
    </div>
  );
}
