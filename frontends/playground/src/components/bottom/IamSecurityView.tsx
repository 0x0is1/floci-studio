'use client';

import React from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { LuShieldCheck, LuVariable, LuKey, LuCheck } from 'react-icons/lu';

export function IamSecurityView() {
  const { nodes, edges } = usePlaygroundStore();
  const { tokens } = useTheme();

  const iamEdges = edges.filter((e) => e.data?.iamPolicy);
  const envEdges = edges.filter((e) => e.data?.envVarName);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono transition-colors" style={{ backgroundColor: tokens.trayBg }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* IAM Policies */}
        <div className="p-3 rounded-lg border space-y-2.5" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
          <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: tokens.border }}>
            <LuShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold" style={{ color: tokens.textPrimary }}>Auto-Generated IAM Roles</span>
          </div>
          {iamEdges.length === 0 ? (
            <p className="text-[11px]" style={{ color: tokens.textMuted }}>No IAM policies bound. Connect EC2 to S3/SQS to auto-generate least-privilege roles.</p>
          ) : (
            <div className="space-y-2">
              {iamEdges.map((e) => {
                const src = nodes.find((n) => n.id === e.source);
                const tgt = nodes.find((n) => n.id === e.target);
                return (
                  <div key={e.id} className="p-2 rounded border space-y-1" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-sky-400 font-semibold">{src?.data.label} &rarr; {tgt?.data.label}</span>
                      <span className="text-emerald-400 text-[10px] flex items-center gap-1"><LuCheck className="w-3 h-3" /> Attached</span>
                    </div>
                    <p className="text-[10px] truncate" style={{ color: tokens.textSecondary }}>Action: {e.data?.iamPolicy}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Environment Variables Catalog */}
        <div className="p-3 rounded-lg border space-y-2.5" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
          <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: tokens.border }}>
            <LuVariable className="w-4 h-4 text-sky-400" />
            <span className="font-semibold" style={{ color: tokens.textPrimary }}>Injected Application Envs</span>
          </div>
          {envEdges.length === 0 ? (
            <p className="text-[11px]" style={{ color: tokens.textMuted }}>No environment variables injected yet.</p>
          ) : (
            <div className="space-y-2">
              {envEdges.map((e) => {
                const tgt = nodes.find((n) => n.id === e.target);
                const val = tgt?.data.config?.bucketName || tgt?.data.config?.queueName || tgt?.data.config?.tableName || 'configured';
                return (
                  <div key={e.id} className="p-2 rounded border font-mono text-[11px]" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
                    <span className="text-sky-400 font-semibold">{e.data?.envVarName}=</span>
                    <span style={{ color: tokens.textSecondary }}>&quot;{val}&quot;</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Keypairs & Remote Credentials */}
        <div className="p-3 rounded-lg border space-y-2.5" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
          <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: tokens.border }}>
            <LuKey className="w-4 h-4 text-amber-400" />
            <span className="font-semibold" style={{ color: tokens.textPrimary }}>Security &amp; Key Pairs</span>
          </div>
          <div className="p-2 rounded border space-y-1 text-[11px]" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
            <div className="flex items-center justify-between">
              <span className="font-medium" style={{ color: tokens.textPrimary }}>default-key.pem</span>
              <span className="text-[10px] text-emerald-400">RSA 2048</span>
            </div>
            <p className="text-[10px]" style={{ color: tokens.textMuted }}>Automatic instance access token allocated for EC2.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
