'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function EfsConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>File System Name</label>
        <input
          type="text"
          value={config.fileSystemName || ''}
          onChange={(e) => onChange('fileSystemName', e.target.value)}
          placeholder="app-efs"
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Performance Mode</label>
        <select
          value={config.performanceMode || 'generalPurpose'}
          onChange={(e) => onChange('performanceMode', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="generalPurpose">General Purpose (Recommended)</option>
          <option value="maxIO">Max I/O (Higher Throughput/Latency)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Throughput Mode</label>
        <select
          value={config.throughputMode || 'bursting'}
          onChange={(e) => onChange('throughputMode', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="bursting">Bursting</option>
          <option value="elastic">Elastic</option>
          <option value="provisioned">Provisioned</option>
        </select>
      </div>

      <div className="flex items-center justify-between p-2.5 rounded border" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Encryption at Rest</label>
        <input
          type="checkbox"
          checked={config.encrypted ?? true}
          onChange={(e) => onChange('encrypted', e.target.checked)}
          className="w-4 h-4 cursor-pointer accent-sky-500"
        />
      </div>
    </div>
  );
}
