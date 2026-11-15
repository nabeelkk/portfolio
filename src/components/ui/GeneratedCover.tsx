import { cn } from '@/lib/utils';

/**
 * Fallback visual used whenever a project has no image (or an image fails to load):
 * dark card, grid pattern, project name in large type, stack chips and an accent glow.
 */
export function GeneratedCover({
  name,
  stack = [],
  category,
  className,
}: {
  name: string;
  stack?: string[];
  category?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${name} cover`}
      className={cn('@container relative isolate flex h-full w-full overflow-hidden bg-card', className)}
    >
      <div aria-hidden className="absolute inset-0 dot-grid opacity-60" />
      <div
        aria-hidden
        className="absolute -right-1/4 -bottom-1/2 size-[90%] rounded-full bg-accent/25 blur-[90px]"
      />
      <div
        aria-hidden
        className="absolute -top-1/3 -left-1/4 size-[70%] rounded-full bg-accent-2/20 blur-[100px]"
      />
      <div className="relative z-10 flex w-full min-w-0 flex-col justify-between p-[6%]">
        {category && <span className="self-end label-mono text-accent">{category}</span>}
        <div>
          <p className="break-words text-[clamp(1.25rem,8.5cqw,4.5rem)] leading-[0.92] font-semibold tracking-[-0.04em] text-fg">
            {name}
          </p>
          {stack.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {stack.slice(0, 5).map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-line-strong px-2 py-0.5 font-mono text-[10px] tracking-wide text-fg/70 uppercase"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
