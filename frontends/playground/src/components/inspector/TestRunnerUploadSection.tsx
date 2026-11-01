'use client';

import React, { useRef } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { uploadTestFile } from '@/lib/api/testRunnerClient';
import { TestRunnerFileList } from './TestRunnerFileList';
import { LuUpload } from 'react-icons/lu';
import { toast } from 'sonner';

interface Props {
  projectId: string;
  nodeId: string;
  files: Array<{ name: string; size: number }>;
  onDelete: (name: string) => void;
  onUploaded: () => void;
}

export function TestRunnerUploadSection({ projectId, nodeId, files, onDelete, onUploaded }: Props) {
  const { tokens } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    for (const file of picked) {
      const res = await uploadTestFile(projectId, nodeId, file);
      if (!res?.success) toast.error(`Upload failed for ${file.name}`);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    onUploaded();
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Test Files (main.py, test_*.py, conftest.py, *.hurl)</label>
      <TestRunnerFileList files={files} onDelete={onDelete} />
      <input ref={fileInputRef} type="file" multiple onChange={handleUpload} className="hidden" id="testrunner-upload" />
      <label
        htmlFor="testrunner-upload"
        style={{ backgroundColor: tokens.btnBg, borderColor: tokens.border, color: tokens.textPrimary }}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded border hover:opacity-85 text-[11px] font-medium cursor-pointer"
      >
        <LuUpload className="w-3.5 h-3.5" />
        <span>Upload Files</span>
      </label>
    </div>
  );
}
