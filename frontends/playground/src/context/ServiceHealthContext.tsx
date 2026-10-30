'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchHealth } from '@/lib/api/flociClient';
import { onApiFailure, API_BASE } from '@/lib/api/flociFetch';

export type HealthState = 'healthy' | 'backend_unresponsive' | 'docker_not_running' | 'checking';

interface HealthContextValue {
  healthState: HealthState;
  details: string;
  isDismissed: boolean;
  setDismissed: (val: boolean) => void;
  recheck: () => Promise<void>;
}

const ServiceHealthContext = createContext<HealthContextValue | null>(null);

export function ServiceHealthProvider({ children }: { children: React.ReactNode }) {
  const [healthState, setHealthState] = useState<HealthState>('checking');
  const [details, setDetails] = useState('');
  const [isDismissed, setIsDismissed] = useState(false);

  const checkHealthState = useCallback(async () => {
    try {
      const data = await fetchHealth();
      if (!data || data.status === 'unreachable') {
        setHealthState('backend_unresponsive');
        setDetails(data?.error || `Cannot connect to API at ${API_BASE}`);
        return;
      }

      const dockerDown = data.docker?.status && data.docker.status !== 'running';
      const flociDown = data.floci?.status && data.floci.status !== 'connected';

      if (dockerDown || flociDown) {
        setHealthState('docker_not_running');
        setDetails(data.docker?.error || data.floci?.error || 'Docker services are paused or inactive on port 4566');
        return;
      }

      setHealthState('healthy');
      setDetails('');
    } catch {
      setHealthState('backend_unresponsive');
      setDetails(`Connection to ${API_BASE} failed`);
    }
  }, []);

  useEffect(() => {
    checkHealthState();
    const interval = setInterval(checkHealthState, 4000);
    const unbind = onApiFailure(({ type, message }) => {
      if (type === 'backend_down' || type === 'timeout') {
        setHealthState('backend_unresponsive');
        setDetails(message || 'Backend connection failed');
      }
    });
    return () => {
      clearInterval(interval);
      unbind();
    };
  }, [checkHealthState]);

  return (
    <ServiceHealthContext.Provider
      value={{
        healthState,
        details,
        isDismissed,
        setDismissed: setIsDismissed,
        recheck: checkHealthState,
      }}
    >
      {children}
    </ServiceHealthContext.Provider>
  );
}

export function useServiceHealth() {
  const ctx = useContext(ServiceHealthContext);
  if (!ctx) throw new Error('useServiceHealth must be used within ServiceHealthProvider');
  return ctx;
}

