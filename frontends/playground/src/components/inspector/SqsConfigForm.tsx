'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { SqsDlqSection } from './SqsDlqSection';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function SqsConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Queue Name</label>
        <input
          type="text"
          value={config.queueName || ''}
          onChange={(e) => onChange('queueName', e.target.value)}
          placeholder="order-processing-queue"
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Queue Delivery Model</label>
        <select
          value={config.queueType || 'standard'}
          onChange={(e) => onChange('queueType', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="standard">Standard Queue (At-least-once, unlimited throughput)</option>
          <option value="fifo">FIFO Queue (Strict order, exactly-once processing)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Network Accessibility</label>
        <select
          value={config.networkAccess || 'vpc_only'}
          onChange={(e) => onChange('networkAccess', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs text-sky-400 font-medium focus:outline-none focus:border-sky-500"
        >
          <option value="vpc_only">Private VPC Only (PrivateLink Endpoint - Recommended)</option>
          <option value="public_external">Public / External Internet Accessible</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Visibility Timeout</label>
        <select
          value={config.visibilityTimeout ?? 30}
          onChange={(e) => onChange('visibilityTimeout', Number(e.target.value))}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        >
          <option value={30}>30 Seconds (Default)</option>
          <option value={60}>60 Seconds (1 Minute)</option>
          <option value={300}>300 Seconds (5 Minutes)</option>
          <option value={900}>900 Seconds (15 Minutes)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Message Retention Period</label>
        <select
          value={config.messageRetentionDays ?? 4}
          onChange={(e) => onChange('messageRetentionDays', Number(e.target.value))}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        >
          <option value={1}>1 Day</option>
          <option value={4}>4 Days (Default)</option>
          <option value={7}>7 Days</option>
          <option value={14}>14 Days (Maximum)</option>
        </select>
      </div>

      <SqsDlqSection config={config} onChange={onChange} />
    </div>
  );
}
