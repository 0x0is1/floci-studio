'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchHealth } from '@/lib/api/flociClient';
import { onApiFailure, API_BASE, ApiFailureDetails } from '@/lib/api/flociFetch';

export type HealthState = 'healthy' | 'backend_unresponsive' | 'docker_not_running' | 'checking';

interface HealthContextValue {
  healthState: HealthState;
  details: string;
  isDismissed: boolean;
  setDismissed: (val: boolean) => void;
  recheck: () => Promise<void>;
}

const ServiceHealthContext = createContext<HealthContextValue | null>(null);

function evaluateHealth(data: any): { state: HealthState; msg: string } {
  if (!data || data.status === 'unreachable') {
    return { state: 'backend_unresponsive', msg: data?.error || `Cannot connect to API at ${API_BASE}` };
  }
  const dockerDown = data.docker?.status && data.docker.status !== 'running';
  const flociDown = data.floci?.status && data.floci.status !== 'connected';
  if (dockerDown || flociDown) {
    return { state: 'docker_not_running', msg: data.docker?.error || data.floci?.error || 'Docker services paused or inactive' };
  }
  return { state: 'healthy', msg: '' };
}

export function ServiceHealthProvider({ children }: { children: React.ReactNode }) {
  const [healthState, setHealthState] = useState<HealthState>('checking');
  const [details, setDetails] = useState('');
  const [isDismissed, setIsDismissed] = useState(false);

  const checkHealthState = useCallback(async () => {
    try {
      const { state, msg } = evaluateHealth(await fetchHealth());
      setHealthState(state);
      setDetails(msg);
    } catch {
      setHealthState('backend_unresponsive');
      setDetails(`Connection to ${API_BASE} failed`);
    }
  }, []);

  const handleFailure = useCallback(async (info: ApiFailureDetails) => {
    if (info.path.includes('/api/health') || info.status === 404 || info.status === 400) return;
    try {
      const { state, msg } = evaluateHealth(await fetchHealth());
      if (state !== 'healthy') {
        setHealthState(state);
        setDetails(msg || info.message);
        setIsDismissed(false);
      }
    } catch {
      setHealthState('backend_unresponsive');
      setDetails(`Connection to ${API_BASE} failed`);
      setIsDismissed(false);
    }
  }, []);

  useEffect(() => {
    checkHealthState();
    const interval = setInterval(checkHealthState, 3500);
    const unbind = onApiFailure(handleFailure);
    const onOnline = () => checkHealthState();
    const onOffline = () => {
      setHealthState('backend_unresponsive');
      setDetails('Browser network is offline');
      setIsDismissed(false);
    };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      clearInterval(interval);
      unbind();
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [checkHealthState, handleFailure]);

  return (
    <ServiceHealthContext.Provider value={{ healthState, details, isDismissed, setDismissed: setIsDismissed, recheck: checkHealthState }}>
      {children}
    </ServiceHealthContext.Provider>
  );
}

export function useServiceHealth() {
  const ctx = useContext(ServiceHealthContext);
  if (!ctx) throw new Error('useServiceHealth must be used within ServiceHealthProvider');
  return ctx;
}
