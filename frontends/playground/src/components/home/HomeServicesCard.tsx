'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { useFlociHealth } from '@/hooks/useSwrApi';
import { LuServer, LuCircleCheck, LuRadio } from 'react-icons/lu';

const LOCAL_SERVICES = [
  { name: 'Amazon EC2', code: 'ec2', port: '4566' },
  { name: 'Amazon S3', code: 's3', port: '4566' },
  { name: 'Amazon SQS', code: 'sqs', port: '4566' },
  { name: 'Amazon RDS', code: 'rds', port: '4566' },
  { name: 'Amazon DynamoDB', code: 'dynamodb', port: '4566' },
  { name: 'AWS IAM', code: 'iam', port: '4566' },
];

export function HomeServicesCard() {
  const { tokens } = useTheme();
  const { data: health } = useFlociHealth();
  const online = health?.floci?.status === 'connected';

  return (
    <div className="rounded-xl border p-4 space-y-3 shadow-xs" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
      <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: tokens.border }}>
        <div className="flex items-center gap-2">
          <LuServer className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold tracking-wide">Floci Local Cloud</h3>
        </div>
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border"
          style={{
            backgroundColor: online ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            borderColor: online ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)',
            color: online ? '#10b981' : '#ef4444',
          }}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-emerald-400' : 'bg-red-400'}`} />
          <span>{online ? 'Port 4566' : 'Offline'}</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: tokens.textMuted }}>
          Simulated Services
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {LOCAL_SERVICES.map((srv) => (
            <div
              key={srv.code}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-md border text-[11px]"
              style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}
            >
              <span className="font-medium text-[11px] truncate" style={{ color: tokens.textPrimary }}>
                {srv.name}
              </span>
              <LuCircleCheck className={`w-3 h-3 shrink-0 ${online ? 'text-emerald-400' : 'text-slate-500'}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-1 flex items-center justify-between text-[10px] border-t" style={{ borderColor: tokens.border, color: tokens.textMuted }}>
        <span className="flex items-center gap-1">
          <LuRadio className="w-3 h-3 text-sky-400" />
          <span>Host: localhost</span>
        </span>
        <span className="font-mono">v0.4.0-compat</span>
      </div>
    </div>
  );
}