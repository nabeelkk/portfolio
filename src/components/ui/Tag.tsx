import { cn } from '@/lib/utils';
import type { ProjectKind, ProjectStatus } from '@/data/types';

export function Tag({
  children,
  className,
  tone = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  tone?: 'default' | 'accent' | 'solid';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.68rem] tracking-[0.06em] whitespace-nowrap uppercase transition-colors duration-300',
        tone === 'default' && 'border-line-strong text-fg/80 hover:border-accent hover:text-accent',
        tone === 'accent' && 'border-accent/40 bg-accent/10 text-accent',
        tone === 'solid' && 'border-transparent bg-fg/[0.06] text-fg/85',
        className,
      )}
    >
      {children}
    </span>
  );
}

const STATUS: Record<ProjectStatus, { label: string; dot: string; text: string; glyph: string }> = {
  live: { label: 'Live', dot: 'bg-live', text: 'text-live', glyph: '●' },
  'in-development': { label: 'In development', dot: 'bg-dev', text: 'text-dev', glyph: '◐' },
  completed: { label: 'Completed', dot: 'bg-muted', text: 'text-fg/70', glyph: '●' },
};

export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const s = STATUS[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-line-strong bg-bg/70 px-2.5 py-1 font-mono text-[0.68rem] tracking-[0.06em] uppercase backdrop-blur-md',
        s.text,
        className,
      )}
    >
      {status === 'in-development' ? (
        <span aria-hidden className="text-[0.8rem] leading-none">
          {s.glyph}
        </span>
      ) : (
        <span aria-hidden className="relative flex size-1.5">
          {status === 'live' && (
            <span className={cn('absolute inset-0 animate-ping-slow rounded-full', s.dot)} />
          )}
          <span className={cn('relative size-1.5 rounded-full', s.dot)} />
        </span>
      )}
      {s.label}
    </span>
  );
}

const KIND: Record<ProjectKind, string> = {
  'own-company': 'Own company',
  'aisynx-product': 'AISYNX product',
  client: 'Client project',
  personal: 'Personal project',
};

export function KindBadge({ kind, className }: { kind: ProjectKind; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-line-strong bg-bg/70 px-2.5 py-1 font-mono text-[0.68rem] tracking-[0.06em] text-fg/80 uppercase backdrop-blur-md',
        className,
      )}
    >
      {KIND[kind]}
    </span>
  );
}
