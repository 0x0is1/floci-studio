'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { LuExternalLink } from 'react-icons/lu';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { CliCommandSnippet } from './CliCommandSnippet';

export function LiveS3Specs({ config, isRunning, nodeId }: { config: Record<string, any>; isRunning: boolean; nodeId?: string }) {
  const { tokens } = useTheme();
  const { edges, nodes, selectedNodeId } = usePlaygroundStore();
  const activeId = nodeId || selectedNodeId;
  const bucketName = config.bucketName || 'my-app-storage-bucket';
  const isPublic = config.networkAccess === 'public_external';
  const bucketUrl = `http://localhost:4566/${bucketName}`;
  const region = 'us-east-1';

  const cpCmd = `aws --endpoint-url=http://localhost:4566 --region ${region} s3 cp myfile.txt s3://${bucketName}/`;
  const lsCmd = `aws --endpoint-url=http://localhost:4566 --region ${region} s3 ls s3://${bucketName}/`;

  const incoming = edges.filter((e) => e.target === activeId).map((e) => nodes.find((n) => n.id === e.source)).filter(Boolean);
  const sourceLabel = incoming.length > 0 ? incoming.map((n) => `${n?.data.label} (${n?.data.serviceType.toUpperCase()})`).join(', ') : null;

  return (
    <div className="space-y-3 text-xs">
      <div className="p-3 rounded-lg border space-y-2 select-text" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, userSelect: 'text' }}>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Bucket Target</span>
          <span className="font-mono font-medium truncate max-w-[150px] select-all" style={{ color: tokens.textPrimary }}>{bucketName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Region Scoping</span>
          <span className="font-mono font-semibold text-sky-400 select-all">{region}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Connected Compute</span>
          <span className="font-mono text-emerald-400 font-semibold truncate max-w-[150px] select-all">
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
              className="flex items-center gap-1.5 p-2 rounded bg-sky-500/10 border font-mono truncate hover:underline select-all"
            >
              <LuExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{bucketUrl}</span>
            </a>
          </div>
        ) : (
          <div className="pt-2 border-t space-y-1" style={{ borderColor: tokens.border }}>
            <span className="text-xs font-medium block" style={{ color: tokens.textSecondary }}>VPC Gateway Endpoint:</span>
            <span className="font-mono block truncate select-all" style={{ color: tokens.textMuted }}>vpce-s3-{bucketName.slice(0, 8)}</span>
          </div>
        )}
      </div>

      {isRunning && (
        <>
          <CliCommandSnippet label="Upload File CLI" command={cpCmd} />
          <CliCommandSnippet label="List Objects CLI" command={lsCmd} />
        </>
      )}
    </div>
  );
}
