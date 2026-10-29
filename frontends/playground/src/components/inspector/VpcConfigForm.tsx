'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function VpcConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>IPv4 CIDR Block</label>
        <select
          value={config.cidrBlock || '10.0.0.0/16'}
          onChange={(e) => onChange('cidrBlock', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        >
          <option value="10.0.0.0/16">10.0.0.0/16 (65,536 private IPs)</option>
          <option value="172.31.0.0/16">172.31.0.0/16 (Default AWS Range)</option>
          <option value="192.168.0.0/16">192.168.0.0/16 (Enterprise Corporate)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Enable DNS Hostnames</label>
        <select
          value={config.enableDnsHostnames !== false ? 'yes' : 'no'}
          onChange={(e) => onChange('enableDnsHostnames', e.target.value === 'yes')}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="yes">Enabled (Instances receive public DNS)</option>
          <option value="no">Disabled</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>DNS Resolution Support</label>
        <select
          value={config.enableDnsSupport !== false ? 'yes' : 'no'}
          onChange={(e) => onChange('enableDnsSupport', e.target.value === 'yes')}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="yes">Enabled (AWS Route 53 Resolver .2)</option>
          <option value="no">Disabled</option>
        </select>
      </div>
    </div>
  );
}
