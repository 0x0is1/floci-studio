'use client';

import React from 'react';
import { CheckCircle2, Circle, AlertCircle, Loader2, Download } from 'lucide-react';
import type { StepStatus } from '@/types/splash';

interface StepStatusIconProps {
  status: StepStatus;
}

export function StepStatusIcon({ status }: StepStatusIconProps) {
  switch (status) {
    case 'ready':
      return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
    case 'checking':
      return <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />;
    case 'installing':
      return <Download className="w-4 h-4 text-amber-400 animate-bounce shrink-0" />;
    case 'warning':
      return <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />;
    case 'error':
      return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
    case 'pending':
    default:
      return <Circle className="w-4 h-4 text-zinc-600 shrink-0" />;
  }
}
