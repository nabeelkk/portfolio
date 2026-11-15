import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudy } from '@/components/sections/CaseStudy';
import { caseStudyProjects, getProject } from '@/data/projects';
import { getProjectMedia } from '@/lib/media.server';

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudyProjects.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const media = getProjectMedia(p);
  const title = `${p.name} — Case study`;
  return {
    title,
    description: p.tagline,
    alternates: { canonical: `/projects/${p.slug}/` },
    openGraph: {
      title,
      description: p.tagline,
      url: `/projects/${p.slug}/`,
      type: 'article',
      ...(media.cover ? { images: [{ url: media.cover.src, width: media.cover.width, height: media.cover.height }] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.caseStudy) notFound();

  const i = caseStudyProjects.findIndex((p) => p.slug === slug);
  const len = caseStudyProjects.length;
  const prevP = caseStudyProjects[(i - 1 + len) % len]!;
  const nextP = caseStudyProjects[(i + 1) % len]!;

  return (
    <CaseStudy
      project={project}
      media={getProjectMedia(project)}
      prev={{ project: prevP, media: getProjectMedia(prevP) }}
      next={{ project: nextP, media: getProjectMedia(nextP) }}
    />
  );
}
