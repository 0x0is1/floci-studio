'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { SplashHeader } from '@/components/SplashHeader';
import { CheckStepItem } from '@/components/CheckStepItem';
import { ProgressBar } from '@/components/ProgressBar';
import { ActionControls } from '@/components/ActionControls';
import type { CheckStep } from '@/types/splash';

const INITIAL_STEPS: Record<string, CheckStep> = {
  bun: { id: 'bun', label: 'Bun Runtime', status: 'pending', detail: 'Waiting' },
  docker_cli: { id: 'docker_cli', label: 'Docker CLI', status: 'pending', detail: 'Waiting' },
  docker_run: { id: 'docker_run', label: 'Docker Engine', status: 'pending', detail: 'Waiting' },
  modules: { id: 'modules', label: 'Dependencies', status: 'pending', detail: 'Waiting' },
  network: { id: 'network', label: 'Network Mode', status: 'pending', detail: 'Checking' },
  backend: { id: 'backend', label: 'Backend Services', status: 'pending', detail: 'Waiting' },
  frontend: { id: 'frontend', label: 'Studio Frontend', status: 'pending', detail: 'Waiting' },
};

export default function SplashPage() {
  const [steps, setSteps] = useState<Record<string, CheckStep>>(INITIAL_STEPS);
  const [isComplete, setIsComplete] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const completedCount = useMemo(
    () => Object.values(steps).filter((s) => s.status === 'ready').length,
    [steps]
  );

  const startPreflight = useCallback(async () => {
    setSteps(INITIAL_STEPS);
    setHasErrors(false);
    setIsComplete(false);
    if (typeof window === 'undefined') return;

    if (window.electronAPI) {
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
    if (typeof window !== 'undefined' && window.electronAPI) {
      startPreflight();
    } else {
      const interval = setInterval(() => {
        if (typeof window !== 'undefined' && window.electronAPI) {
          clearInterval(interval);
          startPreflight();
        }
      }, 50);
      return () => clearInterval(interval);
    }
    return () => window.electronAPI?.offCheckProgress();
  }, [startPreflight]);

  return (
    <main className="h-screen w-screen bg-zinc-950 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 select-none overflow-hidden">
      <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between max-h-[92vh] overflow-y-auto">
        <SplashHeader isOffline={isOffline} />
        <ProgressBar completed={completedCount} total={Object.keys(steps).length} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 mb-6">
          {Object.values(steps).map((step) => (
            <CheckStepItem key={step.id} step={step} />
          ))}
        </div>
        <ActionControls
          isComplete={isComplete}
          hasErrors={hasErrors}
          onLaunch={() => window.electronAPI?.launchStudio()}
          onRetry={startPreflight}
        />
      </div>
    </main>
  );
}
