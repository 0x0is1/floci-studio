'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function DynamoDbKeySection({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Partition Key</label>
          <input
            type="text"
            value={config.partitionKey || 'id'}
            onChange={(e) => onChange('partitionKey', e.target.value)}
            style={inputStyle}
            className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Sort Key (Optional)</label>
          <input
            type="text"
            value={config.sortKey || ''}
            onChange={(e) => onChange('sortKey', e.target.value)}
            placeholder="createdAt"
            style={inputStyle}
            className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>TTL Attribute (Optional)</label>
        <input
          type="text"
          value={config.ttlAttribute || ''}
          onChange={(e) => onChange('ttlAttribute', e.target.value)}
          placeholder="expiresAt"
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        />
      </div>

      <div className="flex items-center justify-between p-2.5 rounded border" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>DynamoDB Streams</label>
        <input
          type="checkbox"
          checked={config.streamsEnabled ?? false}
          onChange={(e) => onChange('streamsEnabled', e.target.checked)}
          className="w-4 h-4 cursor-pointer accent-sky-500"
        />
      </div>
    </>
  );
}
