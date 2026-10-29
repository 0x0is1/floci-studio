'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

const AMIS = [
  { id: 'ami-ubuntu2404-amd64', label: 'Ubuntu 24.04 LTS (Noble Numbat)' },
  { id: 'ami-ubuntu2204', label: 'Ubuntu 22.04 LTS (Jammy Jellyfish)' },
  { id: 'ami-0abcdef1234567891', label: 'Amazon Linux 2023 (AL2023)' },
  { id: 'ami-0abcdef1234567890', label: 'Amazon Linux 2 (AL2)' },
  { id: 'ami-debian12', label: 'Debian 12 (Bookworm)' },
  { id: 'ami-alpine', label: 'Alpine Linux (Minimal Web)' },
  { id: 'ami-0abcdef1234567893', label: 'Windows Server 2022' },
];

const TYPES = [
  { id: 't3.micro', label: 't3.micro (2 vCPU, 1 GiB RAM - Free Tier)' },
  { id: 't3.small', label: 't3.small (2 vCPU, 2 GiB RAM)' },
  { id: 't3.medium', label: 't3.medium (2 vCPU, 4 GiB RAM)' },
  { id: 't3.large', label: 't3.large (2 vCPU, 8 GiB RAM)' },
  { id: 't2.nano', label: 't2.nano (1 vCPU, 512 MiB RAM)' },
  { id: 't2.micro', label: 't2.micro (1 vCPU, 1 GiB RAM)' },
  { id: 't2.small', label: 't2.small (1 vCPU, 2 GiB RAM)' },
  { id: 't4g.small', label: 't4g.small (2 vCPU, 2 GiB RAM - ARM)' },
  { id: 'c6i.large', label: 'c6i.large (2 vCPU, 4 GiB RAM - Compute)' },
  { id: 'm7gd.large', label: 'm7gd.large (2 vCPU, 8 GiB RAM - Memory)' },
];

export function Ec2HardwareSection({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };
  const currentAmi = config.ami === 'ami-ubuntu24' ? 'ami-ubuntu2404-amd64' : (config.ami === 'ami-al2023' ? 'ami-0abcdef1234567891' : (config.ami || 'ami-ubuntu2404-amd64'));

  return (
    <>
      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>AMI Operating System</label>
        <select
          value={currentAmi}
          onChange={(e) => onChange('ami', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          {AMIS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Instance Type (vCPU / Memory)</label>
        <select
          value={config.instanceType || 't3.micro'}
          onChange={(e) => onChange('instanceType', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          {TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Host Port</label>
          <input
            type="number"
            value={config.port || 8080}
            onChange={(e) => onChange('port', Number(e.target.value))}
            style={inputStyle}
            className="w-full rounded border px-2 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Public IP</label>
          <select
            value={config.publicIp ? 'yes' : 'no'}
            onChange={(e) => onChange('publicIp', e.target.value === 'yes')}
            style={inputStyle}
            className="w-full rounded border px-2 py-1.5 text-xs focus:outline-none focus:border-sky-500"
          >
            <option value="yes">Enabled (Web)</option>
            <option value="no">Disabled</option>
          </select>
        </div>
      </div>
    </>
  );
}
