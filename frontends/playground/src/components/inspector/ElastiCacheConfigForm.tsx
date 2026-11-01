'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function ElastiCacheConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Cache Engine</label>
        <select
          value={config.engine || 'redis'}
          onChange={(e) => onChange('engine', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="redis">Redis (RESP Protocol)</option>
          <option value="memcached">Memcached</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Node Type</label>
        <select
          value={config.nodeType || 'cache.t3.micro'}
          onChange={(e) => onChange('nodeType', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        >
          <option value="cache.t3.micro">cache.t3.micro</option>
          <option value="cache.t3.small">cache.t3.small</option>
          <option value="cache.m6g.large">cache.m6g.large</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Port</label>
          <input
            type="number"
            value={config.port ?? (config.engine === 'memcached' ? 11211 : 6379)}
            onChange={(e) => onChange('port', Number(e.target.value))}
            style={inputStyle}
            className="w-full rounded border px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-sky-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Node Count</label>
          <input
            type="number"
            min={1}
            value={config.numCacheNodes ?? 1}
            onChange={(e) => onChange('numCacheNodes', Number(e.target.value))}
            style={inputStyle}
            className="w-full rounded border px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>
    </div>
  );
}
