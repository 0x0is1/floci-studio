import { DedicatedProjectEditorClient } from './DedicatedProjectEditorClient';

export function generateStaticParams() {
  return [{ id: 'default' }];
}

export default function DedicatedProjectEditorPage() {
  return <DedicatedProjectEditorClient />;
}
