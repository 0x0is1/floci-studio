'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { LuPlus, LuX, LuFolderPlus } from 'react-icons/lu';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const { createNewProject } = usePlaygroundStore();
  const { tokens } = useTheme();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setIsSubmitting(true);
    try {
      await createNewProject(trimmed);
      const currentId = usePlaygroundStore.getState().activeProjectId;
      if (currentId) router.push(`/projects/${currentId}/editor`);
      toast.success('Project Created', { description: `Launched ${trimmed} with starter boilerplate.` });
      onClose();
    } catch {
      toast.error('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border p-5 shadow-2xl space-y-4"
        style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textPrimary }}
      >
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: tokens.border }}>
          <div className="flex items-center gap-2">
            <LuFolderPlus className="w-5 h-5 text-sky-400" />
            <h2 className="font-semibold text-sm">Create New Architecture Project</h2>
          </div>
          <button type="button" onClick={onClose} style={{ color: tokens.textMuted }} className="p-1 rounded hover:opacity-85 cursor-pointer">
            <LuX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: tokens.textMuted }}>Project Name</label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Serverless Order Pipeline"
              style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary }}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-sky-500 font-medium"
            />
            <p className="text-[11px]" style={{ color: tokens.textMuted }}>
              Projects initialize with pre-connected starter nodes (EC2, S3, SQS).
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              style={{ backgroundColor: tokens.btnBg, borderColor: tokens.border, color: tokens.textPrimary }}
              className="px-3.5 py-1.5 rounded-lg border text-xs font-medium hover:opacity-85 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-slate-950 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            >
              <LuPlus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Creating...' : 'Create & Launch'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
