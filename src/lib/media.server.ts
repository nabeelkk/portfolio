import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import type { ClientSite, Project, ProjectImage, ProjectMedia } from '@/data/types';

export type { ProjectMedia };

const PUBLIC_DIR = path.join(process.cwd(), 'public');

/** Reads width/height from a WebP/PNG/JPEG header without extra dependencies. */
function imageSize(file: string): { width: number; height: number } | null {
  try {
    const b = readFileSync(file);
    // WebP
    if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
      const chunk = b.toString('ascii', 12, 16);
      if (chunk === 'VP8X')
        return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
      if (chunk === 'VP8 ')
        return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
      if (chunk === 'VP8L') {
        const bits = b.readUInt32LE(21);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
    }
    // PNG
    if (b.readUInt32BE(0) === 0x89504e47)
      return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
    // JPEG
    if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length) {
        if (b[i] !== 0xff) return null;
        const marker = b[i + 1]!;
        const len = b.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xc3)
          return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
        i += 2 + len;
      }
    }
  } catch {
    /* fall through */
  }
  return null;
}

const exists = (src: string) => existsSync(path.join(PUBLIC_DIR, src));

function auto(slug: string, file: string, alt: string, extra: Partial<ProjectImage> = {}) {
  const src = `/projects/${slug}/${file}`;
  const full = path.join(PUBLIC_DIR, src);
  if (!existsSync(full)) return null;
  const size = imageSize(full);
  if (!size) return null;
  return { src, alt, ...size, ...extra } satisfies ProjectImage;
}


/** Resolves a project's images at build time; missing files are dropped. */
export function getProjectMedia(project: Project): ProjectMedia {
  const listed = project.images.filter((i) => exists(i.src));
  const shotCover = auto(project.slug, 'cover.webp', `${project.name} homepage screenshot`);
  const shotMobile = auto(project.slug, 'mobile.webp', `${project.name} on mobile`, {
    variant: 'mobile',
  });
  const full = auto(project.slug, 'full.webp', `${project.name} full-page screenshot`);

  const numbered: ProjectImage[] = [];
  const dir = path.join(PUBLIC_DIR, 'projects', project.slug);
  if (existsSync(dir)) {
    readdirSync(dir)
      .filter((f) => /^\d+\.(webp|avif|png|jpe?g)$/i.test(f))
      .sort((a, b) => parseInt(a) - parseInt(b))
      .forEach((f, i) => {
        const im = auto(project.slug, f, `${project.name} screenshot ${i + 1}`);
        if (im) numbered.push(im);
      });
  }

  const desktopListed = listed.find((i) => i.variant !== 'mobile') ?? null;
  const mobileListed = listed.find((i) => i.variant === 'mobile') ?? null;
  // Real screenshots win over non-concept illustrations; concepts win otherwise.
  const cover =
    (shotCover && !desktopListed?.concept ? shotCover : desktopListed) ??
    shotCover ??
    listed[0] ??
    numbered[0] ??
    null;
  const alt =
    mobileListed && mobileListed !== cover
      ? mobileListed
      : listed.find((i) => i !== cover) ?? (shotMobile && cover ? shotMobile : null);

  const gallery = [...listed, shotCover, shotMobile, ...numbered].filter(
    (i, idx, arr): i is ProjectImage => !!i && arr.findIndex((x) => x?.src === i.src) === idx,
  );

  return { cover, alt, full, gallery };
}

export function getClientSiteMedia(site: ClientSite) {
  const full = auto(site.slug, 'full.webp', `${site.name} website, full page`);
  const cover =
    (site.image && exists(site.image.src) ? site.image : null) ??
    auto(site.slug, 'cover.webp', `${site.name} website homepage`);
  return { cover, full };
}

export function getStudioShot() {
  return {
    full: auto('aisynx', 'full.webp', 'aisynx.in full-page screenshot'),
    cover: auto('aisynx', 'cover.webp', 'aisynx.in homepage screenshot'),
  };
}
