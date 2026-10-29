'use client';

import React from 'react';
import { LuArrowDownLeft, LuArrowUpRight } from 'react-icons/lu';

interface Props {
  isIncoming: boolean;
  isOutgoing: boolean;
}

export function NodeDirectionBadge({ isIncoming, isOutgoing }: Props) {
  if (!isIncoming && !isOutgoing) return null;

  return (
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-30 pointer-events-none animate-bounce">
      {isIncoming && (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-cyan-950/90 text-cyan-300 border border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.5)]">
          <LuArrowDownLeft className="w-3 h-3 stroke-[2.5]" />
          Incoming
        </span>
      )}
      {isOutgoing && (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-950/90 text-emerald-300 border border-emerald-400/80 shadow-[0_0_12px_rgba(16,185,129,0.5)]">
          Outgoing
          <LuArrowUpRight className="w-3 h-3 stroke-[2.5]" />
        </span>
      )}
    </div>
  );
}
