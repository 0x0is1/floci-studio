'use client';

import React from 'react';
import { LuPlay, LuSquare, LuSave, LuSunMedium, LuMoon, LuLoaderCircle } from 'react-icons/lu';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  flociOnline: boolean | null;
  isExecuting: boolean;
  isDeployed: boolean;
  isSaving?: boolean;
  isStopping?: boolean;
  isDirty?: boolean;
  hasProject: boolean;
  nodeCount: number;
  onSave: () => void;
  onDeploy: () => void;
  onStop: () => void;
}

export function PlaygroundHeaderControls({
  flociOnline, isExecuting, isDeployed, isSaving = false, isStopping = false,
  isDirty = false, hasProject, nodeCount, onSave, onDeploy, onStop,
}: Props) {
  const { theme, tokens, toggleTheme } = useTheme();
  const canDeploy = !isExecuting && !isDeployed && hasProject && nodeCount > 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-mono mr-2" style={{ borderColor: tokens.border }}>
        <span className={`w-1.5 h-1.5 rounded-full ${flociOnline ? 'bg-emerald-400' : 'bg-red-400'}`} />
        <span style={{ color: tokens.textMuted }}>Floci 4566:</span>
        <span className={flociOnline ? 'text-emerald-400' : 'text-red-400'}>{flociOnline ? 'ONLINE' : 'OFFLINE'}</span>
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        disabled={isExecuting}
        style={{ backgroundColor: tokens.btnBg, borderColor: tokens.border, color: tokens.textPrimary }}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-85 cursor-pointer"
        title="Toggle Theme"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? <LuMoon className="w-3.5 h-3.5" style={{ color: tokens.textPrimary }} /> : <LuSunMedium className="w-3.5 h-3.5" style={{ color: tokens.textPrimary }} />}
        <span className="text-[10px]">{theme === 'dark' ? 'DARK' : 'LIGHT'}</span>
      </button>

      <button
        onClick={onSave}
        disabled={!hasProject || isExecuting || isSaving}
        style={{ backgroundColor: tokens.btnBg, borderColor: tokens.border, color: tokens.textPrimary }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-85 cursor-pointer"
      >
        {isSaving ? <LuLoaderCircle className="w-3.5 h-3.5 animate-spin" /> : <LuSave className="w-3.5 h-3.5" />}
        <span>{isSaving ? 'Saving...' : 'Save'}</span>
        {!isSaving && isDirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
      </button>

      <button
        onClick={onDeploy}
        disabled={!canDeploy || isExecuting}
        title={!hasProject ? 'Select or create a project first' : nodeCount === 0 ? 'Add components to canvas before deploying' : 'Deploy to Floci'}
        className="flex items-center gap-1 px-3 py-1.5 rounded bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 text-xs font-semibold cursor-pointer"
      >
        {isExecuting ? <LuLoaderCircle className="w-3.5 h-3.5 animate-spin" /> : <LuPlay className="w-3.5 h-3.5 fill-current" />}
        <span>{isExecuting ? 'Deploying...' : 'Deploy'}</span>
      </button>

      <button
        onClick={onStop}
        disabled={(!isExecuting && !isDeployed) || isStopping}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded border border-red-600 bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
        title="Stop running deployment"
      >
        {isStopping ? <LuLoaderCircle className="w-3.5 h-3.5 animate-spin" /> : <LuSquare className="w-3 h-3 fill-current" />}
        <span>{isStopping ? 'Stopping...' : 'Stop'}</span>
      </button>
    </div>
  );
}
