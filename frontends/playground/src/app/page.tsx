import { Suspense } from 'react';
import { Metadata } from 'next';
import { ClientHomePage } from '@/components/home/ClientHomePage';
import { SearchParamsWatcher } from './SearchParamsWatcher';

export const metadata: Metadata = {
  title: 'Floci Studio | Home',
};

export default function HomePage() {
  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsWatcher />
      </Suspense>
      <ClientHomePage />
    </>
  );
}
