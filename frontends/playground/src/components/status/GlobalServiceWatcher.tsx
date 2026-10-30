'use client';

import React from 'react';
import { useServiceHealth } from '@/context/ServiceHealthContext';
import { BackendUnresponsiveScreen } from './BackendUnresponsiveScreen';
import { DockerServicesNotRunningScreen } from './DockerServicesNotRunningScreen';
import { PersistentServiceBanner } from './PersistentServiceBanner';

export function GlobalServiceWatcher() {
  const { healthState, isDismissed } = useServiceHealth();

  return (
    <>
      <PersistentServiceBanner />
      {!isDismissed && healthState === 'backend_unresponsive' && <BackendUnresponsiveScreen />}
      {!isDismissed && healthState === 'docker_not_running' && <DockerServicesNotRunningScreen />}
    </>
  );
}

