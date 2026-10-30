'use client';

import React from 'react';
import { StepStatusIcon } from '@/components/StepStatusIcon';
import type { CheckStep } from '@/types/splash';

interface CheckStepItemProps {
  step: CheckStep;
}

export function CheckStepItem({ step }: CheckStepItemProps) {
  const isError = step.status === 'error';
  return (
    <div className={`p-2.5 rounded-lg border transition-colors ${
      isError 
        ? 'bg-rose-950/20 border-rose-900/40 text-rose-200' 
        : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300'
    }`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <StepStatusIcon status={step.status} />
          <span className="text-xs font-medium text-zinc-200 truncate">{step.label}</span>
        </div>
        <span className="text-[11px] text-zinc-400 truncate max-w-[220px] text-right font-mono">
          {step.detail}
        </span>
      </div>
      {step.error && (
        <div className="mt-1.5 pl-6 text-[11px] text-rose-400 font-mono break-all">
          {step.error}
        </div>
      )}
    </div>
  );
}

