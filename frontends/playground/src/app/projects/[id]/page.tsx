'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePlaygroundStore } from '@/store/playgroundStore';

export default function ProjectRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { switchProject, activeProjectId } = usePlaygroundStore();

  useEffect(() => {
    if (id) {
      if (activeProjectId !== id) switchProject(id);
      router.replace(`/projects/${id}/editor`);
    }
  }, [id, activeProjectId, switchProject, router]);

  return null;
}
