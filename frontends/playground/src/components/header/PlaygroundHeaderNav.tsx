'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { ProjectDialog } from './ProjectDialog';
import { SessionsManagerDialog } from '@/components/sessions/SessionsManagerDialog';
import { IamSecurityDialog } from '@/components/iam/IamSecurityDialog';
import { FlociCloudDialog } from '@/components/floci/FlociCloudDialog';
import { LuChevronDown, LuServer, LuShieldCheck, LuCloud } from 'react-icons/lu';
import { FaAws } from 'react-icons/fa6';

export function PlaygroundHeaderNav() {
  const router = useRouter();
  const { projectName, isDirty, closeProject } = usePlaygroundStore();
  const [projectOpen, setProjectOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [iamOpen, setIamOpen] = useState(false);
  const [flociOpen, setFlociOpen] = useState(false);
  const { tokens } = useTheme();

  const handleReturnHome = () => {
    closeProject();
    router.push('/');
  };

  const btnStyle = { backgroundColor: tokens.btnBg, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleReturnHome}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer text-left"
        title="Return to Projects List"
      >
        <img src="/floci-logo.png" alt="Floci" className="w-5 h-5 object-contain shrink-0" />
        <span className="text-xs font-bold tracking-wider uppercase" style={{ color: tokens.textPrimary }}>Floci Studio</span>
      </button>
      <div className="h-4 w-px" style={{ backgroundColor: tokens.border }} />

      <button onClick={() => setProjectOpen(true)} style={btnStyle} className="flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium hover:opacity-85 cursor-pointer">
        <span>{projectName || 'Select Project'}</span>
        <LuChevronDown className="w-3 h-3" style={{ color: tokens.textMuted }} />
      </button>
      {isDirty && <span className="w-2 h-2 rounded-full bg-amber-400" title="Unsaved changes" />}

      <button onClick={() => setSessionsOpen(true)} style={btnStyle} className="flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium hover:opacity-85 cursor-pointer" title="Sessions Manager">
        <LuServer className="w-3.5 h-3.5 text-sky-400" />
        <span>Sessions</span>
      </button>

      <button onClick={() => setIamOpen(true)} style={btnStyle} className="flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium hover:opacity-85 cursor-pointer" title="IAM & Security (All Projects)">
        <LuShieldCheck className="w-3.5 h-3.5 text-purple-400" />
        <span>IAM &amp; Security</span>
      </button>

      <button onClick={() => setFlociOpen(true)} style={btnStyle} className="flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium hover:opacity-85 cursor-pointer" title="Floci Cloud Resources (All Projects)">
        <LuCloud className="w-3.5 h-3.5 text-sky-400" />
        <span>Floci Cloud</span>
      </button>

      <ProjectDialog isOpen={projectOpen} onClose={() => setProjectOpen(false)} />
      <SessionsManagerDialog isOpen={sessionsOpen} onClose={() => setSessionsOpen(false)} />
      <IamSecurityDialog isOpen={iamOpen} onClose={() => setIamOpen(false)} />
      <FlociCloudDialog isOpen={flociOpen} onClose={() => setFlociOpen(false)} />
    </div>
  );
}