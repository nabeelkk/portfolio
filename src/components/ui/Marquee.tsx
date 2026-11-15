import { cn } from '@/lib/utils';

/** Infinite CSS marquee. Pauses on hover; content is duplicated once for a seamless loop. */
export function Marquee({
  children,
  reverse = false,
  duration = 40,
  className,
  label,
}: {
  children: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        'group/marquee flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]',
        className,
      )}
      aria-label={label}
      role={label ? 'region' : undefined}
    >
      <div
        className={cn(
          'flex w-max shrink-0 group-hover/marquee:[animation-play-state:paused]',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
        )}
        style={{ ['--marquee-duration' as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
