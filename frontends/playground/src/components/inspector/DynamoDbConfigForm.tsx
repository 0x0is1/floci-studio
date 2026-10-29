'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function DynamoDbConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Table Name</label>
        <input
          type="text"
          value={config.tableName || ''}
          onChange={(e) => onChange('tableName', e.target.value)}
          placeholder="users-table"
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Network Accessibility</label>
        <select
          value={config.networkAccess || 'public_external'}
          onChange={(e) => onChange('networkAccess', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs text-sky-400 font-medium focus:outline-none focus:border-sky-500"
        >
          <option value="public_external">Public / External Internet Accessible</option>
          <option value="vpc_only">Private VPC Only (Gateway Endpoint)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Capacity Mode</label>
        <select
          value={config.billingMode || 'PAY_PER_REQUEST'}
          onChange={(e) => onChange('billingMode', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="PAY_PER_REQUEST">On-Demand (Pay-per-request autoscaling)</option>
          <option value="PROVISIONED">Provisioned (Fixed RCU/WCU limits)</option>
        </select>
      </div>
    </div>
  );
}
