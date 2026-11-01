'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function LogsConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Log Group Name</label>
        <input
          type="text"
          value={config.logGroupName || ''}
          onChange={(e) => onChange('logGroupName', e.target.value)}
          placeholder="/floci/app"
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Retention Period</label>
        <select
          value={config.retentionDays ?? 14}
          onChange={(e) => onChange('retentionDays', Number(e.target.value))}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        >
          <option value={1}>1 Day</option>
          <option value={7}>7 Days</option>
          <option value={14}>14 Days (Default)</option>
          <option value={30}>30 Days</option>
          <option value={90}>90 Days</option>
          <option value={0}>Never Expire</option>
        </select>
      </div>
    </div>
  );
}
