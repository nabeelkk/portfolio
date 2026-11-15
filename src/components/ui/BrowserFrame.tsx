import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Minimal browser chrome around a screenshot or visual. */
export function BrowserFrame({
  url,
  children,
  className,
  bodyClassName,
}: {
  url?: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-line-strong bg-bg-elev shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]',
        className,
      )}
    >
      <div className="flex h-8 items-center gap-3 border-b border-line px-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-fg/15" />
          <span className="size-2.5 rounded-full bg-fg/15" />
          <span className="size-2.5 rounded-full bg-fg/15" />
        </div>
        {url && (
          <div className="mx-auto flex h-5 max-w-[60%] min-w-0 items-center gap-1.5 rounded-md bg-fg/[0.05] px-2.5 font-mono text-[10px] text-fg/65">
            <Lock aria-hidden className="size-2.5 shrink-0" />
            <span className="truncate">{url}</span>
          </div>
        )}
        {url && <span className="w-[42px]" aria-hidden />}
      </div>
      <div className={cn('relative overflow-hidden', bodyClassName)}>{children}</div>
    </div>
  );
}
