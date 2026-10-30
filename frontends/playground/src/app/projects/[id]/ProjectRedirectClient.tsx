'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePlaygroundStore } from '@/store/playgroundStore';

export function ProjectRedirectClient() {
  const params = useParams();
  const router = useRouter();
  const paramId = params?.id as string | undefined;
  const pathId = typeof window !== 'undefined' ? window.location.pathname.match(/\/projects\/([^/]+)/)?.[1] : undefined;
  const id = (paramId && paramId !== 'default' ? paramId : pathId) || usePlaygroundStore.getState().activeProjectId;

  useEffect(() => {
    if (id && id !== 'default') {
      router.replace(`/projects/${id}/editor`);
    } else {
      router.replace('/projects');
    }
  }, [id, router]);

  return null;
}
