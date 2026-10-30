import { DedicatedProjectEditorClient } from './DedicatedProjectEditorClient';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: 'default' }];
}

export default function DedicatedProjectEditorPage() {
  return <DedicatedProjectEditorClient />;
}
