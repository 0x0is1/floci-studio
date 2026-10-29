'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function ApiGatewayConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>API Gateway Name</label>
        <input
          type="text"
          value={config.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="main-rest-gateway"
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Protocol Type</label>
        <select
          value={config.protocolType || 'HTTP'}
          onChange={(e) => onChange('protocolType', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="HTTP">HTTP API (Low-latency, cost-effective REST)</option>
          <option value="REST">REST API (Full-featured with API keys &amp; WAF)</option>
          <option value="WEBSOCKET">WebSocket API (Realtime two-way communication)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Deployment Stage</label>
        <select
          value={config.stage || '$default'}
          onChange={(e) => onChange('stage', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        >
          <option value="$default">$default (Auto-deployed root stage)</option>
          <option value="prod">prod (Production)</option>
          <option value="dev">dev (Development)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Access Authorization</label>
        <select
          value={config.authType || 'NONE'}
          onChange={(e) => onChange('authType', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="NONE">None (Public API Ingress)</option>
          <option value="AWS_IAM">AWS IAM SigV4 Authentication</option>
          <option value="JWT">JWT / Cognito User Pool Authorizer</option>
        </select>
      </div>
    </div>
  );
}
