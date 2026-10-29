'use client';

import React from 'react';
import { AwsServiceType } from '@/types/aws';
import { useTheme } from '@/theme/ThemeProvider';
import { CloudFrontConfigForm } from './CloudFrontConfigForm';
import { DynamoDbConfigForm } from './DynamoDbConfigForm';

interface Props {
  serviceType: AwsServiceType;
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function NetworkConfigForm({ serviceType, config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  if (serviceType === 'cloudfront') return <CloudFrontConfigForm config={config} onChange={onChange} />;
  if (serviceType === 'dynamodb') return <DynamoDbConfigForm config={config} onChange={onChange} />;

  if (serviceType === 'vpc') {
    return (
      <div className="space-y-1">
        <label className="text-[10px]" style={{ color: tokens.textMuted }}>IPv4 CIDR Block</label>
        <select
          value={config.cidrBlock || '10.0.0.0/16'}
          onChange={(e) => onChange('cidrBlock', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2 py-1.5 text-xs focus:outline-none"
        >
          <option value="10.0.0.0/16">10.0.0.0/16 (65,536 private IP addresses)</option>
          <option value="172.31.0.0/16">172.31.0.0/16 (Default AWS Range)</option>
        </select>
      </div>
    );
  }

  if (serviceType === 'sqs') {
    return (
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[10px]" style={{ color: tokens.textMuted }}>Network Accessibility</label>
          <select
            value={config.networkAccess || 'vpc_only'}
            onChange={(e) => onChange('networkAccess', e.target.value)}
            style={inputStyle}
            className="w-full rounded border px-2 py-1.5 text-xs text-sky-400 font-medium focus:outline-none"
          >
            <option value="vpc_only">Private VPC Only (PrivateLink)</option>
            <option value="public_external">Public / External Internet Accessible</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px]" style={{ color: tokens.textMuted }}>Queue Delivery Model</label>
          <select
            value={config.queueType || 'standard'}
            onChange={(e) => onChange('queueType', e.target.value)}
            style={inputStyle}
            className="w-full rounded border px-2 py-1.5 text-xs focus:outline-none"
          >
            <option value="standard">Standard Queue (Unlimited TPS)</option>
            <option value="fifo">FIFO Queue (Strict ordering)</option>
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-[10px]" style={{ color: tokens.textMuted }}>Network Accessibility</label>
        <select
          value={config.networkAccess || 'public_external'}
          onChange={(e) => onChange('networkAccess', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2 py-1.5 text-xs text-sky-400 font-medium focus:outline-none"
        >
          <option value="public_external">Public / External Internet</option>
          <option value="vpc_only">Private VPC Only</option>
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-[10px]" style={{ color: tokens.textMuted }}>Resource Name</label>
        <input
          type="text"
          value={config.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none"
        />
      </div>
    </div>
  );
}
