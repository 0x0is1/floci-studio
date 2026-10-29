'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function AlbConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Load Balancer Scheme</label>
        <select
          value={config.scheme || 'internet-facing'}
          onChange={(e) => onChange('scheme', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs text-sky-400 font-medium focus:outline-none focus:border-sky-500"
        >
          <option value="internet-facing">Internet-Facing (Public Web Ingress)</option>
          <option value="internal">Internal (VPC Private Subnets Only)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Listener Port</label>
        <select
          value={config.port ?? 80}
          onChange={(e) => onChange('port', Number(e.target.value))}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        >
          <option value={80}>Port 80 (HTTP Default)</option>
          <option value={443}>Port 443 (HTTPS TLS)</option>
          <option value={8080}>Port 8080 (Custom Web App)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Listener Protocol</label>
        <select
          value={config.protocol || 'HTTP'}
          onChange={(e) => onChange('protocol', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="HTTP">HTTP/1.1 (Standard Web Traffic)</option>
          <option value="HTTPS">HTTPS (TLS Encrypted Ingress)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>IP Address Type</label>
        <select
          value={config.ipAddressType || 'ipv4'}
          onChange={(e) => onChange('ipAddressType', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        >
          <option value="ipv4">IPv4 Only (Standard)</option>
          <option value="dualstack">Dualstack (IPv4 &amp; IPv6)</option>
        </select>
      </div>
    </div>
  );
}
