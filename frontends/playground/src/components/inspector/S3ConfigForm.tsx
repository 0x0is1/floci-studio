'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function S3ConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Bucket Name (DNS compliant)</label>
        <input
          type="text"
          value={config.bucketName || ''}
          onChange={(e) => onChange('bucketName', e.target.value.toLowerCase())}
          placeholder="my-app-storage-bucket"
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
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Bucket Access Policy</label>
        <select
          value={config.accessControl || 'private'}
          onChange={(e) => onChange('accessControl', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="private">Private (Block all public access - Recommended)</option>
          <option value="public-read">Public Read (Static Website Hosting)</option>
          <option value="authenticated-read">Authenticated Read (AWS Account Users)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Object Versioning</label>
        <select
          value={config.versioning ? 'enabled' : 'disabled'}
          onChange={(e) => onChange('versioning', e.target.value === 'enabled')}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="disabled">Disabled (Single active object state)</option>
          <option value="enabled">Enabled (Keep historical object versions)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Server-Side Encryption</label>
        <select
          value={config.encryption || 'AES256'}
          onChange={(e) => onChange('encryption', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="AES256">SSE-S3 (Amazon S3-Managed 256-bit Keys)</option>
          <option value="aws:kms">SSE-KMS (AWS Key Management Service)</option>
        </select>
      </div>
    </div>
  );
}
