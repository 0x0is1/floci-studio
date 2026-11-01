'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function KinesisConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Stream Name</label>
        <input
          type="text"
          value={config.streamName || ''}
          onChange={(e) => onChange('streamName', e.target.value)}
          placeholder="analytics-stream"
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Shard Count</label>
          <input
            type="number"
            min={1}
            value={config.shardCount ?? 1}
            onChange={(e) => onChange('shardCount', Number(e.target.value))}
            style={inputStyle}
            className="w-full rounded border px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-sky-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Retention (Hours)</label>
          <select
            value={config.retentionHours ?? 24}
            onChange={(e) => onChange('retentionHours', Number(e.target.value))}
            style={inputStyle}
            className="w-full rounded border px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-sky-500"
          >
            <option value={24}>24 Hours (Default)</option>
            <option value={168}>168 Hours (7 Days)</option>
            <option value={8760}>8760 Hours (1 Year)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
