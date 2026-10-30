'use client';

import React, { useState } from 'react';
import { LuBoxes, LuRotateCw, LuEye, LuTerminal } from 'react-icons/lu';
import { useServiceHealth } from '@/context/ServiceHealthContext';
import { useTheme } from '@/theme/ThemeProvider';

export function DockerServicesNotRunningScreen() {
  const { details, recheck, setDismissed } = useServiceHealth();
  const { tokens } = useTheme();
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    await recheck();
    setRetrying(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-zinc-950/95 backdrop-blur-md select-none">
      <div
        className="w-full max-w-lg rounded-2xl border p-6 md:p-8 shadow-2xl flex flex-col items-center text-center space-y-5"
        style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <LuBoxes className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-bold tracking-tight" style={{ color: tokens.textPrimary }}>
            Docker Cloud Services Inactive
          </h2>
          <p className="text-xs leading-relaxed max-w-md" style={{ color: tokens.textSecondary }}>
            Docker daemon is paused or the Floci emulator container is stopped on port 4566.
            Cloud resource provisioning and live deployments cannot proceed.
          </p>
        </div>

        <div className="w-full rounded-lg border p-3 text-left bg-zinc-900/80 border-zinc-800 space-y-1.5 text-[11px] font-mono text-zinc-300">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <LuTerminal className="w-3.5 h-3.5" />
            <span>Resolution steps:</span>
          </div>
          <div className="pl-5 text-zinc-400 space-y-0.5">
            <div>1. Resume or unpause Docker Desktop.</div>
            <div>2. Ensure container oss-floci is running.</div>
          </div>
          {details && <div className="text-rose-400 border-t border-zinc-800 pt-1 mt-1 truncate">Status: {details}</div>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <button
            type="button"
            onClick={handleRetry}
            disabled={retrying}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <LuRotateCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
            <span>{retrying ? 'Probing...' : 'Re-check Docker Status'}</span>
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-xs font-medium transition-colors hover:bg-zinc-800/50 cursor-pointer"
            style={{ borderColor: tokens.border, color: tokens.textPrimary }}
          >
            <LuEye className="w-3.5 h-3.5" />
            <span>Inspect Canvas (Read-Only)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
