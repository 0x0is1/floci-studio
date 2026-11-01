import { DedicatedProjectRuntimeClient } from './DedicatedProjectRuntimeClient';
import { getProjectStaticParams } from '@/lib/projectParams';

export const dynamicParams = true;

export function generateStaticParams() {
  return getProjectStaticParams();
}

export default function DedicatedProjectRuntimePage() {
  return <DedicatedProjectRuntimeClient />;
}
