'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export function SearchParamsWatcher() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const proj = searchParams.get('project');
    if (proj) {
      router.replace(`/projects/${proj}/editor`);
    }
  }, [searchParams, router]);

  return null;
}
