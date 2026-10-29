'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { CliCommandSnippet } from './CliCommandSnippet';

export function LiveDatabaseSpecs({ serviceType, config, isRunning }: { serviceType: string; config: Record<string, any>; isRunning: boolean }) {
  const { tokens } = useTheme();
  const isRds = serviceType === 'rds';
  const isPublic = config.networkAccess === 'public_external';
  const port = isRds ? 5432 : 4566;
  const dbName = config.dbName || config.tableName || 'app_production';
  const region = 'us-east-1';

  const rdsUri = `postgresql://postgres:postgres@localhost:${port}/${dbName}`;
  const rdsPsql = `psql -h localhost -p ${port} -U postgres -d ${dbName}`;
  const ddbPut = `aws --endpoint-url=http://localhost:4566 --region ${region} dynamodb put-item --table-name ${dbName} --item '{"id": {"S": "item-1"}}'`;
  const ddbScan = `aws --endpoint-url=http://localhost:4566 --region ${region} dynamodb scan --table-name ${dbName}`;

  return (
    <div className="space-y-3 text-xs">
      <div className="p-3 rounded-lg border space-y-2 select-text" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, userSelect: 'text' }}>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Database Engine</span>
          <span className="font-mono font-medium select-all" style={{ color: tokens.textPrimary }}>{config.engine || (isRds ? 'PostgreSQL 16' : 'DynamoDB')}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Region Scoping</span>
          <span className="font-mono font-semibold text-sky-400 select-all">{region}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Host / Port</span>
          <span className="font-mono font-medium select-all" style={{ color: tokens.textPrimary }}>localhost:{port}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Target Identifier</span>
          <span className="font-mono truncate max-w-[150px] select-all" style={{ color: tokens.accent }}>{dbName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Network Boundary</span>
          <span className="font-mono font-semibold" style={{ color: isPublic ? '#38bdf8' : '#f59e0b' }}>
            {isPublic ? 'Public External' : 'Private VPC Only'}
          </span>
        </div>
      </div>

      {isRunning && isRds && (
        <>
          <CliCommandSnippet label="PostgreSQL Connect URI" command={rdsUri} />
          <CliCommandSnippet label="PSQL Client Command" command={rdsPsql} />
        </>
      )}

      {isRunning && !isRds && (
        <>
          <CliCommandSnippet label="DynamoDB Put Item CLI" command={ddbPut} />
          <CliCommandSnippet label="DynamoDB Scan Table CLI" command={ddbScan} />
        </>
      )}
    </div>
  );
}
