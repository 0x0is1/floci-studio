'use client';

import React, { useEffect } from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { FlociStudioHome } from './FlociStudioHome';

export function ClientHomePage() {
  const { loadProjects } = usePlaygroundStore();

  useEffect(() => {
    document.title = 'Floci Studio | Home';
    loadProjects();
  }, [loadProjects]);

  return <FlociStudioHome />;
}

