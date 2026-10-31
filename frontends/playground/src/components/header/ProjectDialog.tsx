'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useProjects } from '@/hooks/useSwrApi';
import { useTheme } from '@/theme/ThemeProvider';
import { ProjectDialogList } from './ProjectDialogList';
import { LuPlus, LuX } from 'react-icons/lu';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDialog({ isOpen, onClose }: Props) {
  const router = useRouter();
  const { projects: swrProjects, isLoading, invalidateProjects } = useProjects();
  const { projects: storeProjects, createNewProject, deleteProjectById, activeProjectId, projectName, loadProjects, switchProject } = usePlaygroundStore();
  const { tokens } = useTheme();
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadProjects();
      invalidateProjects();
    }
  }, [isOpen, loadProjects, invalidateProjects]);

  if (!isOpen) return null;

  const map = new Map<string, any>();
  (storeProjects || []).forEach((p: any) => map.set(p.id, p));
  (swrProjects || []).forEach((p: any) => map.set(p.id, p));
  if (activeProjectId && !map.has(activeProjectId)) {
    map.set(activeProjectId, { id: activeProjectId, name: projectName || 'Current Project', updatedAt: new Date().toISOString() });
  }
  const allProjects = Array.from(map.values()).sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    await createNewProject(newProjectName.trim());
    const currentId = usePlaygroundStore.getState().activeProjectId;
    if (currentId) router.push(`/projects/${currentId}/editor`);
    setNewProjectName('');
    onClose();
  };

  const handleSelect = async (id: string) => {
    if (id !== activeProjectId) {
      await switchProject(id);
      router.push(`/projects/${id}/editor`);
    }
    onClose();
  };

  const handleDelete = async (id: string, name: string) => {
    if (typeof window !== 'undefined' && !window.confirm(`Delete project "${name}"?`)) return;
    await deleteProjectById(id);
    invalidateProjects();
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="rounded-xl w-full max-w-md p-5 shadow-2xl space-y-4 border" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textPrimary }}>
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: tokens.border }}>
          <h3 className="text-sm font-semibold" style={{ color: tokens.textPrimary }}>Switch or Create Project</h3>
          <button onClick={onClose} style={{ color: tokens.textMuted }} className="hover:opacity-85 cursor-pointer">
            <LuX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-2">
          <label className="text-[11px] font-medium" style={{ color: tokens.textMuted }}>Create New Project</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Bedrock GenAI Pipeline"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary }}
              className="flex-1 rounded border px-3 py-1.5 text-xs focus:outline-none focus:border-sky-500"
            />
            <button type="submit" className="px-3 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors cursor-pointer">
              <LuPlus className="w-3.5 h-3.5" />
              <span>Create</span>
            </button>
          </div>
        </form>

        <div className="space-y-2 pt-2 border-t" style={{ borderColor: tokens.border }}>
          <label className="text-[11px] font-medium" style={{ color: tokens.textMuted }}>Existing Projects ({allProjects.length})</label>
          <ProjectDialogList projects={allProjects} activeProjectId={activeProjectId} isLoading={isLoading} onSelect={handleSelect} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
