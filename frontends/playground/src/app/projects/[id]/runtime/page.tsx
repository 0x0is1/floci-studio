import { DedicatedProjectRuntimeClient } from './DedicatedProjectRuntimeClient';

export function generateStaticParams() {
  return [{ id: 'default' }];
}

export default function DedicatedProjectRuntimePage() {
  return <DedicatedProjectRuntimeClient />;
}
