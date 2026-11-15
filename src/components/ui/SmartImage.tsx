'use client';

import { useState } from 'react';
import type { ProjectImage } from '@/data/types';
import { asset, cn } from '@/lib/utils';
import { GeneratedCover } from './GeneratedCover';

/** Plain <img> with explicit size, lazy loading and a generated-cover fallback on error. */
export function SmartImage({
  image,
  fallback,
  className,
  priority = false,
  sizes,
}: {
  image: ProjectImage | null | undefined;
  fallback: { name: string; stack?: string[]; category?: string };
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!image || failed) return <GeneratedCover {...fallback} className={className} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export; images are pre-optimised WebP
    <img
      src={asset(image.src)}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => setFailed(true)}
      className={cn('h-full w-full object-cover', className)}
    />
  );
}
