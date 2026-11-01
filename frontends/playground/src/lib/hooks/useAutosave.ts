'use client';

import { useEffect, useRef } from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';

const AUTOSAVE_DELAY_MS = 1500;

/** Debounced autosave so canvas edits survive a crash, tab close, or refresh without Ctrl+S. */
export function useAutosave() {
  const { nodes, edges, isDirty, isExecuting, activeProjectId } = usePlaygroundStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!activeProjectId || isExecuting || !isDirty) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      usePlaygroundStore.getState().saveCurrentProject();
    }, AUTOSAVE_DELAY_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [nodes, edges, isDirty, isExecuting, activeProjectId]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!usePlaygroundStore.getState().isDirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
}
