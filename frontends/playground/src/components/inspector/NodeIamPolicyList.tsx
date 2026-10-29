'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { LuTrash2 } from 'react-icons/lu';

interface Props {
  edgePolicies: string[];
  customPolicies: string[];
  onDeletePolicy: (index: number) => void;
}

export function NodeIamPolicyList({ edgePolicies, customPolicies, onDeletePolicy }: Props) {
  const { tokens } = useTheme();

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase font-mono tracking-wider" style={{ color: tokens.textMuted }}>Granted Permissions</label>
      <div className="space-y-1 max-h-36 overflow-y-auto">
        {edgePolicies.map((p, idx) => (
          <div key={`edge-${idx}`} className="flex items-center justify-between p-1.5 rounded border text-[11px] font-mono" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
            <span className="text-emerald-400 truncate">{p}</span>
            <span className="text-[9px] text-sky-400 font-sans">Edge Auto</span>
          </div>
        ))}
        {customPolicies.map((p, idx) => (
          <div key={`custom-${idx}`} className="flex items-center justify-between p-1.5 rounded border text-[11px] font-mono" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
            <span className="text-purple-400 truncate">{p}</span>
            <button type="button" onClick={() => onDeletePolicy(idx)} className="p-0.5 text-red-400 hover:opacity-85 cursor-pointer">
              <LuTrash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
