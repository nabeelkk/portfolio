import type { MetadataRoute } from 'next';
import { caseStudyProjects } from '@/data/projects';
import { SITE_URL } from '@/lib/utils';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...caseStudyProjects.map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
