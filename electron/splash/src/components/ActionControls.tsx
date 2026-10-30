'use client';

import React from 'react';
import { Play, RotateCw } from 'lucide-react';

interface ActionControlsProps {
  isComplete: boolean;
  hasErrors: boolean;
  onLaunch: () => void;
  onRetry: () => void;
}

export function ActionControls({ isComplete, hasErrors, onLaunch, onRetry }: ActionControlsProps) {
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
      <div className="pt-2">
        <button
          onClick={onLaunch}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Enter Floci Studio
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

