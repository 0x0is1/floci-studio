'use client';

import React from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { LuTrash2 } from 'react-icons/lu';
import { toast } from 'sonner';

const PROTOCOL_OPTIONS = ['HTTP', 'HTTPS', 'TCP', 'AWS SDK / SigV4', 'SQS Event Source', 'PostgreSQL (5432)', 'MySQL (3306)'];

export function EdgeConfigPanel() {
  const { selectedEdgeId, edges, updateEdgeData, deleteEdge } = usePlaygroundStore();
  const { tokens } = useTheme();
  const edge = edges.find((e) => e.id === selectedEdgeId);

  if (!edge) {
    return (
      <div className="p-4 text-xs text-center" style={{ color: tokens.textMuted }}>
        Select a connection link on the canvas to configure parameters.
      </div>
    );
  }

  const data = (edge.data || {}) as any;
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  const handleDelete = () => {
    deleteEdge(edge.id);
    toast.info('Link Deleted', { description: 'Connection link removed.' });
  };

  return (
    <div className="p-4 space-y-4 text-xs">
      <div className="space-y-1">
        <label className="text-[10px] font-medium uppercase tracking-wider" style={{ color: tokens.textMuted }}>Protocol</label>
        <select
          value={data.protocol || 'HTTP'}
          onChange={(e) => updateEdgeData(edge.id, { protocol: e.target.value })}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
        >
          {PROTOCOL_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium uppercase tracking-wider" style={{ color: tokens.textMuted }}>Target Port</label>
        <input
          type="number"
          value={data.port ?? ''}
          placeholder="e.g. 8080 or 443"
          onChange={(e) => updateEdgeData(edge.id, { port: e.target.value ? Number(e.target.value) : undefined })}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 focus:outline-none focus:border-sky-500 font-mono"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium uppercase tracking-wider" style={{ color: tokens.textMuted }}>Granted IAM Actions</label>
        <input
          type="text"
          value={data.iamPolicy || ''}
          placeholder="e.g. s3:GetObject, s3:PutObject"
          onChange={(e) => updateEdgeData(edge.id, { iamPolicy: e.target.value })}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 focus:outline-none focus:border-sky-500 font-mono text-[11px]"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium uppercase tracking-wider" style={{ color: tokens.textMuted }}>Injected Env Variable</label>
        <input
          type="text"
          value={data.envVarName || ''}
          placeholder="e.g. S3_BUCKET_NAME"
          onChange={(e) => updateEdgeData(edge.id, { envVarName: e.target.value })}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 focus:outline-none focus:border-sky-500 font-mono text-[11px]"
        />
      </div>

      <div className="pt-3 border-t" style={{ borderColor: tokens.border }}>
        <button
          type="button"
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium transition-colors cursor-pointer"
        >
          <LuTrash2 className="w-3.5 h-3.5" />
          <span>Delete Connection Link</span>
        </button>
      </div>
    </div>
  );
}
