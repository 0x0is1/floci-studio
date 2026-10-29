'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function RdsConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Database Engine</label>
        <select
          value={config.engine || 'postgres-16'}
          onChange={(e) => onChange('engine', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="postgres-16">PostgreSQL 16.3 (Latest standard)</option>
          <option value="postgres-15">PostgreSQL 15.6</option>
          <option value="mysql-8">MySQL 8.0.35</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Network Accessibility</label>
        <select
          value={config.networkAccess || 'vpc_only'}
          onChange={(e) => onChange('networkAccess', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2 py-1.5 text-xs text-sky-400 font-medium focus:outline-none focus:border-sky-500"
        >
          <option value="vpc_only">Private VPC Only (DB Subnet Group - Recommended)</option>
          <option value="public_external">Public / External Internet Accessible</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>DB Instance Class</label>
        <select
          value={config.instanceClass || 'db.t3.micro'}
          onChange={(e) => onChange('instanceClass', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="db.t3.micro">db.t3.micro (2 vCPU, 1 GiB RAM - Free Tier)</option>
          <option value="db.t3.small">db.t3.small (2 vCPU, 2 GiB RAM)</option>
          <option value="db.r6g.large">db.r6g.large (2 vCPU, 16 GiB RAM - Memory Optimized)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Multi-AZ High Availability</label>
        <select
          value={config.multiAz ? 'yes' : 'no'}
          onChange={(e) => onChange('multiAz', e.target.value === 'yes')}
          style={inputStyle}
          className="w-full rounded border px-2 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="no">Single-AZ (Cost effective development)</option>
          <option value="yes">Multi-AZ (Synchronous standby for HA & Failover)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Allocated Storage (gp3 SSD)</label>
        <select
          value={config.allocatedStorage || 20}
          onChange={(e) => onChange('allocatedStorage', Number(e.target.value))}
          style={inputStyle}
          className="w-full rounded border px-2 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value={20}>20 GiB (Standard Dev Size)</option>
          <option value={50}>50 GiB</option>
          <option value={100}>100 GiB</option>
        </select>
      </div>
    </div>
  );
}
