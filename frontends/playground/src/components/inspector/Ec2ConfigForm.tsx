'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { Ec2HardwareSection } from './Ec2HardwareSection';
import { Ec2KeyManager } from './Ec2KeyManager';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function Ec2ConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  return (
    <div className="space-y-3.5">
      <Ec2HardwareSection config={config} onChange={onChange} />

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Web Workload Stack</label>
        <select
          value={config.template || 'nginx'}
          onChange={(e) => onChange('template', e.target.value)}
          style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary }}
          className="w-full rounded border px-2 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="nginx">Nginx High-Performance Web Server</option>
          <option value="nodejs">Node.js Express / Elysia REST Server</option>
          <option value="fastapi">Python FastAPI Microservice</option>
          <option value="static">Static HTML5 Documentation App</option>
        </select>
      </div>

      <Ec2KeyManager config={config} onChange={onChange} />
    </div>
  );
}
