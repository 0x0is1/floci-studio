'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { LuSlidersHorizontal } from 'react-icons/lu';

interface Props {
  config: Record<string, any>;
  serviceType: string;
  onChange: (key: string, val: any) => void;
}

export function GenericServiceConfigForm({ config, serviceType, onChange }: Props) {
  const { tokens } = useTheme();

  const entries = Object.entries(config).filter(([k]) => k !== 'uuid' && k !== 'iamRole' && k !== 'iamPolicies');

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border p-3 space-y-1.5" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
        <div className="flex items-center gap-1.5 font-semibold text-[11px]" style={{ color: tokens.textPrimary }}>
          <LuSlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
          <span className="uppercase font-mono">{serviceType} Parameters</span>
        </div>
        <p className="text-[11px]" style={{ color: tokens.textMuted }}>
          Default Floci local emulator configuration applied.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-3 space-y-2.5" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
      <div className="flex items-center gap-1.5 font-semibold text-[11px]" style={{ color: tokens.textPrimary }}>
        <LuSlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
        <span className="uppercase font-mono">{serviceType} Configuration</span>
      </div>

      <div className="space-y-2">
        {entries.map(([key, val]) => (
          <div key={key} className="space-y-1">
            <label className="text-[10px] uppercase font-mono tracking-wider" style={{ color: tokens.textMuted }}>
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type="text"
              value={typeof val === 'object' ? JSON.stringify(val) : String(val)}
              onChange={(e) => onChange(key, e.target.value)}
              style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textPrimary }}
              className="w-full rounded border px-2 py-1 text-xs font-mono focus:outline-none focus:border-sky-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}