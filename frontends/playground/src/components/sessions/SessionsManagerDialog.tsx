'use client';

import React from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { teardownInfrastructure } from '@/lib/api/flociClient';
import { LuServer, LuX, LuSquare } from 'react-icons/lu';
import { toast } from 'sonner';

export function SessionsManagerDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { projects, activeProjectId, switchProject, loadProjects } = usePlaygroundStore();
  const { tokens } = useTheme();

  if (!isOpen) return null;

  const handleStopSession = async (projId: string) => {
    await teardownInfrastructure([8080]).catch(() => {});
    toast.info('Session Stopped', { description: `Terminated active containers for ${projId}` });
    await loadProjects();
  };

  const handleOpen = async (projId: string) => {
    await switchProject(projId);
    toast.success('Project Loaded', { description: 'Switched active project.' });
    onClose();
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-xl border p-5 shadow-2xl space-y-4" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textPrimary }}>
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: tokens.border }}>
          <div className="flex items-center gap-2">
            <LuServer className="w-5 h-5 text-sky-400" />
            <h2 className="font-semibold text-sm">Active Infrastructure Sessions</h2>
          </div>
          <button onClick={onClose} style={{ color: tokens.textMuted }} className="p-1 rounded hover:opacity-85 cursor-pointer"><LuX className="w-4 h-4" /></button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {projects.length === 0 ? (
            <p className="text-xs text-center py-6" style={{ color: tokens.textMuted }}>No saved projects found.</p>
          ) : (
            projects.map((p) => {
              const isCurrent = p.id === activeProjectId;
              const isLive = p.status === 'running';

              return (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border text-xs" style={{ backgroundColor: tokens.cardBgAlt, borderColor: isCurrent ? tokens.borderFocus : tokens.border }}>
                  <div className="space-y-1 min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold truncate">{p.name}</span>
                      {isCurrent && <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 font-mono">ACTIVE</span>}
                    </div>
                    <p className="text-[11px] font-mono truncate" style={{ color: tokens.textMuted }}>ID: {p.id}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${isLive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : ''}`} style={!isLive ? { backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textMuted } : undefined}>
                      {isLive ? 'RUNNING' : 'DRAFT'}
                    </span>
                    {!isCurrent && (
                      <button type="button" onClick={() => handleOpen(p.id)} style={{ backgroundColor: tokens.btnBg, borderColor: tokens.border, color: tokens.textPrimary }} className="px-2.5 py-1 rounded border hover:opacity-85 cursor-pointer">
                        Open
                      </button>
                    )}
                    {isLive && (
                      <button type="button" onClick={() => handleStopSession(p.id)} className="px-2 py-1 rounded border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer" title="Stop Session">
                        <LuSquare className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
