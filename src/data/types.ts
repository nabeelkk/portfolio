export type ProjectStatus = 'live' | 'in-development' | 'completed';
export type ProjectKind = 'own-company' | 'aisynx-product' | 'client' | 'personal';
export type ProjectFilter = 'fullstack' | 'frontend' | 'clones';

export interface ProjectImage {
  /** Path under /public, e.g. "/projects/remora/remora-mobile.webp" */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Design concept with sample data (not a production screenshot). */
  concept?: boolean;
  variant?: 'desktop' | 'mobile';
}

export interface CaseStudy {
  overview: string;
  challenge: string;
  features: string[];
  architecture: string[];
  deployment: string;
  outcome: string;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  status: ProjectStatus;
  kind: ProjectKind;
  /** Shown in the featured section, in this order (lower first). */
  featuredOrder?: number;
  filter?: ProjectFilter;
  stack: string[];
  links: { live?: string; github?: string };
  role: string;
  /** e.g. "2025 – Present". Use "TODO" to hide it in the UI. */
  timeline?: string;
  type: string;
  highlights: string[];
  builtSoFar?: string[];
  planned?: string[];
  statusNote?: string;
  /** ERP module names, animated as a grid on the card. */
  modules?: string[];
  images: ProjectImage[];
  caseStudy?: CaseStudy;
}

export interface ClientSite {
  slug: string;
  name: string;
  industry: string;
  description: string;
  url: string;
  image?: ProjectImage;
}

export interface Experience {
  company: string;
  role: string;
  location: string;
  /** "TODO" hides the period in the UI. */
  period: string;
  current?: boolean;
  bullets: string[];
  stack: string[];
  url?: string;
}

export interface Education {
  school: string;
  degree: string;
  location?: string;
  period: string;
  notes: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  blurb: string;
  items: string[];
  /** Bento sizing on desktop (12-col grid). */
  span: string;
}

export interface Service {
  title: string;
  description: string;
  tags: string[];
}

/** Images resolved at build time for a project (see src/lib/media.server.ts). */
export interface ProjectMedia {
  /** Primary image for cards (desktop). */
  cover: ProjectImage | null;
  /** Secondary image, crossfaded on hover (e.g. mobile concept). */
  alt: ProjectImage | null;
  /** Tall full-page screenshot for scroll-on-hover frames. */
  full: ProjectImage | null;
  gallery: ProjectImage[];
}
