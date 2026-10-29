import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { ClientHomePage } from '@/components/home/ClientHomePage';

export const metadata: Metadata = {
  title: 'Home',
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const params = await searchParams;
  if (params?.project) {
    redirect(`/projects/${params.project}/editor`);
  }

  return <ClientHomePage />;
}
