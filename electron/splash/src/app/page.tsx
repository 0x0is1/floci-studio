'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { SplashHeader } from '@/components/SplashHeader';
import { CheckStepItem } from '@/components/CheckStepItem';
import { ProgressBar } from '@/components/ProgressBar';
import { ActionControls } from '@/components/ActionControls';
import type { CheckStep } from '@/types/splash';
import { INITIAL_STEPS } from '@/types/splash';

export default function SplashPage() {
  const [steps, setSteps] = useState<Record<string, CheckStep>>(INITIAL_STEPS);
  const [isComplete, setIsComplete] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const completedCount = useMemo(
    () => Object.values(steps).filter((s) => s.status === 'ready').length,
    [steps]
  );

  const startPreflight = useCallback(async () => {
    setSteps(INITIAL_STEPS);
    setHasErrors(false);
    setIsComplete(false);
    setCountdown(null);
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
        setCountdown(3);
        let count = 3;
        const timer = setInterval(() => {
          count -= 1;
          setCountdown(count);
          if (count <= 0) {
            clearInterval(timer);
            window.electronAPI?.launchStudio();
          }
        }, 1000);
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
          countdown={countdown}
          onLaunch={() => window.electronAPI?.launchStudio()}
          onRetry={startPreflight}
        />
      </div>
    </main>
  );
}
