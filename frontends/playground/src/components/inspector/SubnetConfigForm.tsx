'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function SubnetConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Subnet IPv4 CIDR</label>
        <select
          value={config.cidrBlock || '10.0.1.0/24'}
          onChange={(e) => onChange('cidrBlock', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        >
          <option value="10.0.1.0/24">10.0.1.0/24 (256 IP addresses - Public)</option>
          <option value="10.0.2.0/24">10.0.2.0/24 (256 IP addresses - Private)</option>
          <option value="10.0.3.0/24">10.0.3.0/24 (Database Subnet)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Availability Zone</label>
        <select
          value={config.availabilityZone || 'us-east-1a'}
          onChange={(e) => onChange('availabilityZone', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        >
          <option value="us-east-1a">us-east-1a (Zone A)</option>
          <option value="us-east-1b">us-east-1b (Zone B)</option>
          <option value="us-east-1c">us-east-1c (Zone C)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Auto-Assign Public IPv4</label>
        <select
          value={config.mapPublicIpOnLaunch ? 'yes' : 'no'}
          onChange={(e) => onChange('mapPublicIpOnLaunch', e.target.value === 'yes')}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="no">Disabled (Private isolated subnet)</option>
          <option value="yes">Enabled (Instances receive public IPs on launch)</option>
        </select>
      </div>
    </div>
  );
}
