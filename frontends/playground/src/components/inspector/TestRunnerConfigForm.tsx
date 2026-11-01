'use client';

import React, { useState, useEffect } from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { listTestFiles, deleteTestFile, runTestRunner } from '@/lib/api/testRunnerClient';
import { TestRunnerUploadSection } from './TestRunnerUploadSection';
import { TestRunnerResultPanel } from './TestRunnerResultPanel';
import { LuPlay, LuLoader } from 'react-icons/lu';
import { toast } from 'sonner';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function TestRunnerConfigForm({ config, onChange }: Props) {
  const { activeProjectId, selectedNodeId } = usePlaygroundStore();
  const { tokens } = useTheme();
  const projectId = activeProjectId || 'default';
  const nodeId = selectedNodeId || 'unknown';
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  const [files, setFiles] = useState<Array<{ name: string; size: number }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const refreshFiles = () => {
    listTestFiles(projectId, nodeId).then((res) => res?.files && setFiles(res.files));
  };

  useEffect(() => { refreshFiles(); }, [projectId, nodeId]);

  const handleDelete = async (name: string) => {
    await deleteTestFile(projectId, nodeId, name);
    refreshFiles();
  };

  const handleRun = async () => {
    setIsRunning(true);
    setResult(null);
    const res = await runTestRunner(projectId, nodeId, config.networkAccess || 'vpc_only');
    setIsRunning(false);
    if (res?.success) {
      setResult(res.result);
      toast[res.result.success ? 'success' : 'error']('Test Run Complete', { description: `Exit code ${res.result.exitCode}` });
    } else {
      toast.error('Test run failed', { description: res?.error });
    }
  };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Network Accessibility</label>
        <select
          value={config.networkAccess || 'vpc_only'}
          onChange={(e) => onChange('networkAccess', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs text-sky-400 font-medium focus:outline-none focus:border-sky-500"
        >
          <option value="vpc_only">Private VPC Only (reaches internal resources)</option>
          <option value="external">External / Bridge Network (host-exposed ports only)</option>
        </select>
      </div>

      <TestRunnerUploadSection projectId={projectId} nodeId={nodeId} files={files} onDelete={handleDelete} onUploaded={refreshFiles} />

      <button
        type="button"
        onClick={handleRun}
        disabled={isRunning || files.length === 0}
        style={{ backgroundColor: tokens.btnBg, borderColor: tokens.border, color: '#34d399' }}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded border hover:opacity-85 disabled:opacity-40 font-medium cursor-pointer"
      >
        {isRunning ? <LuLoader className="w-3.5 h-3.5 animate-spin" /> : <LuPlay className="w-3.5 h-3.5" />}
        <span>{isRunning ? 'Running...' : 'Run Tests'}</span>
      </button>

      <TestRunnerResultPanel result={result} />
    </div>
  );
}
