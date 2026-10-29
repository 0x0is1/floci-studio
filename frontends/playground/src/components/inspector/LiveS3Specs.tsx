'use client';

import React, { useState } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { toast } from 'sonner';
import { LuExternalLink, LuCopy, LuUpload, LuCheck } from 'react-icons/lu';

import { usePlaygroundStore } from '@/store/playgroundStore';

export function LiveS3Specs({ config, isRunning, nodeId }: { config: Record<string, any>; isRunning: boolean; nodeId?: string }) {
  const { tokens } = useTheme();
  const { edges, nodes, selectedNodeId } = usePlaygroundStore();
  const [copied, setCopied] = useState(false);
  const activeId = nodeId || selectedNodeId;
  const bucketName = config.bucketName || 'my-app-storage-bucket';
  const isPublic = config.networkAccess === 'public_external';
  const bucketUrl = `http://localhost:4566/${bucketName}`;
  const cliCmd = `aws --endpoint-url=http://localhost:4566 s3 cp myfile.txt s3://${bucketName}/`;

  const incoming = edges.filter((e) => e.target === activeId).map((e) => nodes.find((n) => n.id === e.source)).filter(Boolean);
  const sourceLabel = incoming.length > 0 ? incoming.map((n) => `${n?.data.label} (${n?.data.serviceType.toUpperCase()})`).join(', ') : null;

  const copyCmd = () => {
    navigator.clipboard.writeText(cliCmd);
    setCopied(true);
    toast.success('Copied S3 CLI command');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 text-xs">
      <div className="p-3 rounded-lg border space-y-2" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Bucket Target</span>
          <span className="font-mono font-medium truncate max-w-[150px]" style={{ color: tokens.textPrimary }}>{bucketName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Connected Compute</span>
          <span className="font-mono text-emerald-400 font-semibold truncate max-w-[150px]">
            {sourceLabel || 'No linked compute'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Access Boundary</span>
          <span className="font-mono font-semibold" style={{ color: isPublic ? '#38bdf8' : '#f59e0b' }}>
            {isPublic ? 'Public External' : 'Private VPC Only'}
          </span>
        </div>
        {isPublic ? (
          <div className="pt-2 border-t space-y-2" style={{ borderColor: tokens.border }}>
            <span className="text-xs font-medium block" style={{ color: tokens.textSecondary }}>Public Endpoint URL:</span>
            <a
              href={bucketUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: tokens.accent, borderColor: tokens.border }}
              className="flex items-center gap-1.5 p-2 rounded bg-sky-500/10 border font-mono truncate hover:underline"
            >
              <LuExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{bucketUrl}</span>
            </a>
          </div>
        ) : (
          <div className="pt-2 border-t space-y-1" style={{ borderColor: tokens.border }}>
            <span className="text-xs font-medium block" style={{ color: tokens.textSecondary }}>VPC Gateway Endpoint:</span>
            <span className="font-mono block truncate" style={{ color: tokens.textMuted }}>vpce-s3-{bucketName.slice(0, 8)}</span>
          </div>
        )}
      </div>

      {isRunning && (
        <div className="p-3 rounded-lg border space-y-2" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: tokens.textPrimary }}>
              <LuUpload className="w-3.5 h-3.5 text-sky-400" />
              <span>Upload via AWS CLI</span>
            </span>
            <button type="button" onClick={copyCmd} style={{ color: tokens.textMuted }} className="p-1 hover:opacity-85 cursor-pointer">
              {copied ? <LuCheck className="w-3.5 h-3.5 text-emerald-400" /> : <LuCopy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="p-2 rounded font-mono text-[11px] break-all select-all border" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textSecondary }}>
            {cliCmd}
          </p>
        </div>
      )}
    </div>
  );
}

