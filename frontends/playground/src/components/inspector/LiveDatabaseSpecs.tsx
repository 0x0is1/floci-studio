'use client';

import React, { useState } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { toast } from 'sonner';
import { LuCopy, LuCheck, LuDatabase } from 'react-icons/lu';

export function LiveDatabaseSpecs({ serviceType, config, isRunning }: { serviceType: string; config: Record<string, any>; isRunning: boolean }) {
  const { tokens } = useTheme();
  const [copied, setCopied] = useState(false);

  const isRds = serviceType === 'rds';
  const isPublic = config.networkAccess === 'public_external';
  const port = isRds ? 5432 : 8000;
  const dbName = config.dbName || config.tableName || 'app_production';
  const connStr = isRds
    ? `postgresql://postgres:postgres@localhost:${port}/${dbName}`
    : `http://localhost:4566 (DynamoDB Table: ${dbName})`;

  const copyConn = () => {
    navigator.clipboard.writeText(connStr);
    setCopied(true);
    toast.success('Connection string copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 text-xs">
      <div className="p-3 rounded-lg border space-y-2" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Database Engine</span>
          <span className="font-mono font-medium" style={{ color: tokens.textPrimary }}>{config.engine || (isRds ? 'PostgreSQL 16' : 'DynamoDB')}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Host / Port</span>
          <span className="font-mono font-medium" style={{ color: tokens.textPrimary }}>localhost:{port}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Network Boundary</span>
          <span className="font-mono font-semibold" style={{ color: isPublic ? '#38bdf8' : '#f59e0b' }}>
            {isPublic ? 'Public External' : 'Private VPC Only'}
          </span>
        </div>
        {!isPublic && (
          <div className="pt-2 border-t space-y-1" style={{ borderColor: tokens.border }}>
            <span className="text-xs font-medium block" style={{ color: tokens.textSecondary }}>DB Subnet Group:</span>
            <span className="font-mono block truncate" style={{ color: tokens.textMuted }}>dbsubnet-vpc-{dbName.slice(0, 6)}</span>
          </div>
        )}
      </div>

      {isRunning && (
        <div className="p-3 rounded-lg border space-y-2" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: tokens.textPrimary }}>
              <LuDatabase className="w-3.5 h-3.5 text-sky-400" />
              <span>{isRds ? 'Database URI' : 'Table Connection'}</span>
            </span>
            <button type="button" onClick={copyConn} style={{ color: tokens.textMuted }} className="p-1 hover:opacity-85 cursor-pointer">
              {copied ? <LuCheck className="w-3.5 h-3.5 text-emerald-400" /> : <LuCopy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="p-2 rounded font-mono text-[11px] break-all select-all border" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textSecondary }}>
            {connStr}
          </p>
        </div>
      )}
    </div>
  );
}

