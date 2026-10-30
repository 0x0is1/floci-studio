'use client';

import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400 mb-1.5">
        <span>Preflight Checks</span>
        <span>{completed} of {total} Ready ({percent}%)</span>
      </div>
      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
