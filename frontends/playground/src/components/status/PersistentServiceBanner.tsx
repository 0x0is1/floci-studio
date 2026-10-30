'use client';

import React from 'react';
import { LuTriangleAlert, LuRotateCw } from 'react-icons/lu';
import { useServiceHealth } from '@/context/ServiceHealthContext';

export function PersistentServiceBanner() {
  const { healthState, isDismissed, recheck } = useServiceHealth();

  if (!isDismissed || healthState === 'healthy' || healthState === 'checking') {
    return null;
  }

  const isBackend = healthState === 'backend_unresponsive';
  const label = isBackend
    ? 'Backend server unreachable. Cloud deployment and project operations disabled.'
    : 'Docker services paused or inactive. Deployments disabled.';

  return (
    <div className="w-full bg-rose-950/90 border-b border-rose-800/80 px-4 py-2 flex items-center justify-between text-xs text-rose-200 z-40 shrink-0 backdrop-blur-xs select-none">
      <div className="flex items-center gap-2">
        <LuTriangleAlert className="w-4 h-4 text-rose-400 shrink-0" />
        <span className="font-medium font-mono">{label}</span>
      </div>
      <button
        type="button"
        onClick={recheck}
        className="flex items-center gap-1.5 px-3 py-1 rounded bg-rose-800 hover:bg-rose-700 text-white text-[11px] font-semibold transition-colors cursor-pointer"
      >
        <LuRotateCw className="w-3 h-3" />
        <span>Reconnect</span>
      </button>
    </div>
  );
}

