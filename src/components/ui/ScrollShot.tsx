'use client';

import type { ProjectImage } from '@/data/types';
import { cn } from '@/lib/utils';
import { SmartImage } from './SmartImage';

/**
 * A tall full-page screenshot that scrolls inside its frame on hover/focus.
 * Falls back to a regular cover image when no tall screenshot exists.
 * The nearest ancestor with the `group` class triggers the scroll.
 */
export function ScrollShot({
  full,
  cover,
  name,
  className,
  aspect = 10 / 16,
  duration = 5,
}: {
  full: ProjectImage | null;
  cover: ProjectImage | null;
  name: string;
  className?: string;
  /** Frame height / width. */
  aspect?: number;
  duration?: number;
}) {
  const frame = { aspectRatio: `${1 / aspect}` };
  if (!full) {
    return (
      <div className={cn('relative overflow-hidden', className)} style={frame}>
        <SmartImage
          image={cover}
          fallback={{ name }}
          className="object-top transition-transform duration-[1.2s] ease-out-expo group-act:scale-[1.04]"
        />
      </div>
    );
  }
  // translateY(%) is relative to the image's own height: travel = (imgH - frameH) / imgH.
  const ratio = full.height / full.width;
  const travel = Math.max(0, (1 - aspect / ratio) * 100);
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ ...frame, ['--travel' as string]: `-${travel.toFixed(2)}%`, ['--dur' as string]: `${duration}s` }}
    >
      <SmartImage
        image={full}
        fallback={{ name }}
        className="!h-auto object-top transition-transform ease-in-out [transition-duration:var(--dur)] group-focus-within:[transform:translateY(var(--travel))] group-act:[transform:translateY(var(--travel))] motion-reduce:transition-none"
      />
    </div>
  );
}
