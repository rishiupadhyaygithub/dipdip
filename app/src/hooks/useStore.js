import { useState, useCallback } from 'react';
import { SEED } from '../data/seed.js';

const STORAGE_KEY = 'dos_v3';

function loadDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(SEED));
  } catch {
    return JSON.parse(JSON.stringify(SEED));
  }
}

function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function useStore() {
  const [db, setDbRaw] = useState(loadDB);

  const setDb = useCallback((updater) => {
    setDbRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveDB(next);
      return next;
    });
  }, []);

  // ── Decisions ──
  const addDecision = useCallback((dec) => {
    setDb(prev => ({ ...prev, decisions: [dec, ...prev.decisions] }));
  }, [setDb]);

  const updateDecision = useCallback((id, patch) => {
    setDb(prev => ({
      ...prev,
      decisions: prev.decisions.map(d => d.id === id ? { ...d, ...patch } : d)
    }));
  }, [setDb]);

  const addAuditEntry = useCallback((id, entry) => {
    setDb(prev => ({
      ...prev,
      decisions: prev.decisions.map(d =>
        d.id === id ? { ...d, audit: [entry, ...d.audit] } : d
      )
    }));
  }, [setDb]);

  // ── Memory ──
  const addMemory = useCallback((mem) => {
    setDb(prev => ({ ...prev, memory: [mem, ...prev.memory] }));
  }, [setDb]);

  // ── Reset ──
  const resetToSeed = useCallback(() => {
    const fresh = JSON.parse(JSON.stringify(SEED));
    saveDB(fresh);
    setDbRaw(fresh);
  }, []);

  return { db, setDb, addDecision, updateDecision, addAuditEntry, addMemory, resetToSeed };
}
