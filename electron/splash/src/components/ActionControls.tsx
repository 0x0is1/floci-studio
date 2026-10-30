'use client';

import React from 'react';
import { Play, RotateCw, CheckCircle2 } from 'lucide-react';

interface ActionControlsProps {
  isComplete: boolean;
  hasErrors: boolean;
  countdown?: number | null;
  onLaunch: () => void;
  onRetry: () => void;
}

export function ActionControls({
  isComplete,
  hasErrors,
  countdown,
  onLaunch,
  onRetry,
}: ActionControlsProps) {
  if (hasErrors) {
    return (
      <div className="pt-2">
        <button
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          Retry Preflight Checks
        </button>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="pt-2 space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>All checks passed. Opening Studio in {countdown ?? 3}s...</span>
        </div>
        <button
          onClick={onLaunch}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Enter Floci Studio Now
        </button>
      </div>
    );
  }

  return (
    <div className="pt-2 text-center">
      <span className="text-[11px] text-zinc-500 font-mono">
        Configuring local cloud infrastructure runtime...
      </span>
    </div>
  );
}
