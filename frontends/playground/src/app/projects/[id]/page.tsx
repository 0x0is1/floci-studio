import { ProjectRedirectClient } from './ProjectRedirectClient';

export function generateStaticParams() {
  return [{ id: 'default' }];
}

export default function ProjectRedirectPage() {
  return <ProjectRedirectClient />;
}
