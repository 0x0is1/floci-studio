import { ProjectRedirectClient } from './ProjectRedirectClient';
import { getProjectStaticParams } from '@/lib/projectParams';

export const dynamicParams = true;

export function generateStaticParams() {
  return getProjectStaticParams();
}

export default function ProjectRedirectPage() {
  return <ProjectRedirectClient />;
}
