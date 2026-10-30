import { DedicatedProjectRuntimeClient } from './DedicatedProjectRuntimeClient';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: 'default' }];
}

export default function DedicatedProjectRuntimePage() {
  return <DedicatedProjectRuntimeClient />;
}
