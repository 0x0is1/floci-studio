'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { SplashHeader } from '@/components/SplashHeader';
import { CheckStepItem } from '@/components/CheckStepItem';
import { ActionControls } from '@/components/ActionControls';
import type { CheckStep } from '@/types/splash';

const INITIAL_STEPS: Record<string, CheckStep> = {
  bun: { id: 'bun', label: 'Bun Runtime', status: 'pending', detail: 'Waiting' },
  docker_cli: { id: 'docker_cli', label: 'Docker CLI', status: 'pending', detail: 'Waiting' },
  docker_run: { id: 'docker_run', label: 'Docker Engine', status: 'pending', detail: 'Waiting' },
  modules: { id: 'modules', label: 'Dependencies', status: 'pending', detail: 'Waiting' },
  network: { id: 'network', label: 'Network Mode', status: 'pending', detail: 'Checking connectivity' },
  backend: { id: 'backend', label: 'Backend Services', status: 'pending', detail: 'Waiting' },
  frontend: { id: 'frontend', label: 'Studio Frontend', status: 'pending', detail: 'Waiting' },
};

export default function SplashPage() {
  const [steps, setSteps] = useState<Record<string, CheckStep>>(INITIAL_STEPS);
  const [isComplete, setIsComplete] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const startPreflight = useCallback(async () => {
    setSteps(INITIAL_STEPS);
    setHasErrors(false);
    setIsComplete(false);
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.onCheckProgress((updated: CheckStep) => {
        setSteps((prev) => ({ ...prev, [updated.id]: updated }));
        if (updated.id === 'network' && updated.status === 'warning') setIsOffline(true);
        if (updated.status === 'error') setHasErrors(true);
      });
      const ok = await window.electronAPI.startChecks();
      if (ok) {
        setIsComplete(true);
        setTimeout(() => window.electronAPI?.launchStudio(), 800);
      } else {
        setHasErrors(true);
      }
    }
  }, []);

  useEffect(() => {
    startPreflight();
    return () => {
      if (typeof window !== 'undefined' && window.electronAPI) {
        window.electronAPI.offCheckProgress();
      }
    };
  }, [startPreflight]);

  const handleLaunch = () => window.electronAPI?.launchStudio();

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-6 backdrop-blur-md shadow-2xl">
        <SplashHeader isOffline={isOffline} />
        <div className="space-y-2 mb-4">
          {Object.values(steps).map((step) => (
            <CheckStepItem key={step.id} step={step} />
          ))}
        </div>
        <ActionControls
          isComplete={isComplete}
          hasErrors={hasErrors}
          onLaunch={handleLaunch}
          onRetry={startPreflight}
        />
      </div>
    </main>
  );
}
