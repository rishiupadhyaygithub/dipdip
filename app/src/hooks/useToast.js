import { useState, useCallback } from 'react';

let toastTimer = null;

export function useToast() {
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);

  const toast = useCallback((m) => {
    setMsg(m);
    setVisible(true);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setVisible(false), 3200);
  }, []);

  return { msg, visible, toast };
}
