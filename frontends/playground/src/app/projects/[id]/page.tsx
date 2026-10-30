import { ProjectRedirectClient } from './ProjectRedirectClient';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: 'default' }];
}

export default function ProjectRedirectPage() {
  return <ProjectRedirectClient />;
}
