'use client';

import React from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { LuShieldCheck, LuVariable, LuKey, LuCheck, LuX } from 'react-icons/lu';

export function IamSecurityDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { nodes, edges } = usePlaygroundStore();
  const { tokens } = useTheme();

  if (!isOpen) return null;
  const iamEdges = edges.filter((e) => e.data?.iamPolicy);
  const envEdges = edges.filter((e) => e.data?.envVarName);

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl rounded-xl border p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textPrimary }}>
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: tokens.border }}>
          <div className="flex items-center gap-2">
            <LuShieldCheck className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="font-semibold text-sm">IAM &amp; Security Manager (All Projects)</h2>
              <p className="text-[11px]" style={{ color: tokens.textMuted }}>Global IAM roles, least-privilege security policies, and credential catalog.</p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: tokens.textMuted }} className="p-1 rounded hover:opacity-85 cursor-pointer"><LuX className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono pr-1">
          <div className="p-3 rounded-lg border space-y-2.5" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
            <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: tokens.border }}>
              <LuShieldCheck className="w-4 h-4 text-emerald-400" /><span className="font-semibold" style={{ color: tokens.textPrimary }}>Generated IAM Policies</span>
            </div>
            {iamEdges.length === 0 ? <p className="text-[11px]" style={{ color: tokens.textMuted }}>No IAM policies bound. Connect EC2 to S3/SQS to auto-generate least-privilege roles.</p> : (
              <div className="space-y-2 max-h-64 overflow-y-auto">{iamEdges.map((e) => {
                const src = nodes.find((n) => n.id === e.source), tgt = nodes.find((n) => n.id === e.target);
                return (
                  <div key={e.id} className="p-2 rounded border space-y-1" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-sky-400 font-semibold">{src?.data.label} &rarr; {tgt?.data.label}</span>
                      <span className="text-emerald-400 text-[10px] flex items-center gap-1"><LuCheck className="w-3 h-3" /> Attached</span>
                    </div>
                    <p className="text-[10px] truncate" style={{ color: tokens.textSecondary }}>Action: {e.data?.iamPolicy}</p>
                  </div>
                );
              })}</div>
            )}
          </div>

          <div className="p-3 rounded-lg border space-y-2.5" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
            <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: tokens.border }}>
              <LuVariable className="w-4 h-4 text-sky-400" /><span className="font-semibold" style={{ color: tokens.textPrimary }}>Injected Application Envs</span>
            </div>
            {envEdges.length === 0 ? <p className="text-[11px]" style={{ color: tokens.textMuted }}>No environment variables injected.</p> : (
              <div className="space-y-2 max-h-64 overflow-y-auto">{envEdges.map((e) => {
                const tgt = nodes.find((n) => n.id === e.target);
                const val = tgt?.data.config?.bucketName || tgt?.data.config?.queueName || tgt?.data.config?.tableName || 'configured';
                return (
                  <div key={e.id} className="p-2 rounded border font-mono text-[11px]" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
                    <span className="text-sky-400 font-semibold">{e.data?.envVarName}=</span>
                    <span style={{ color: tokens.textSecondary }}>&quot;{val}&quot;</span>
                  </div>
                );
              })}</div>
            )}
          </div>

          <div className="p-3 rounded-lg border space-y-2.5" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
            <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: tokens.border }}>
              <LuKey className="w-4 h-4 text-amber-400" /><span className="font-semibold" style={{ color: tokens.textPrimary }}>Security &amp; Key Pairs</span>
            </div>
            <div className="p-2 rounded border space-y-1 text-[11px]" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
              <div className="flex items-center justify-between"><span className="font-medium" style={{ color: tokens.textPrimary }}>default-key.pem</span><span className="text-[10px] text-emerald-400">RSA 2048</span></div>
              <p className="text-[10px]" style={{ color: tokens.textMuted }}>Project access key pair provisioned for SSH container access.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
