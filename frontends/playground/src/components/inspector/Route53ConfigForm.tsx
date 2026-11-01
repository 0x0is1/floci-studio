'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function Route53ConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Hosted Zone / Domain Name</label>
        <input
          type="text"
          value={config.domainName || ''}
          onChange={(e) => onChange('domainName', e.target.value)}
          placeholder="example.com"
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Record Type</label>
          <select
            value={config.recordType || 'A'}
            onChange={(e) => onChange('recordType', e.target.value)}
            style={inputStyle}
            className="w-full rounded border px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-sky-500"
          >
            <option value="A">A</option>
            <option value="CNAME">CNAME</option>
            <option value="ALIAS">ALIAS</option>
            <option value="TXT">TXT</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>TTL (Seconds)</label>
          <input
            type="number"
            value={config.ttl ?? 300}
            onChange={(e) => onChange('ttl', Number(e.target.value))}
            style={inputStyle}
            className="w-full rounded border px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Routing Policy</label>
        <select
          value={config.routingPolicy || 'simple'}
          onChange={(e) => onChange('routingPolicy', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="simple">Simple Routing</option>
          <option value="weighted">Weighted Routing</option>
          <option value="latency">Latency-Based Routing</option>
          <option value="failover">Failover Routing</option>
        </select>
      </div>
    </div>
  );
}
