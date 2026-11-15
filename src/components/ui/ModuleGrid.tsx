import { cn } from '@/lib/utils';

/** ERP scope visual: module chips that light up in sequence (pure CSS). */
export function ModuleGrid({ modules, className }: { modules: string[]; className?: string }) {
  const step = 0.22;
  const total = modules.length * step;
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <span className="label-mono text-muted">System scope · {modules.length} modules</span>
      <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-4" aria-label="Modules">
        {modules.map((m, i) => (
          <li
            key={m}
            className="relative truncate rounded-md border border-line px-2 py-1.5 text-center font-mono text-[10px] tracking-wide text-fg/70 uppercase"
          >
            <span
              aria-hidden
              className="module-glow absolute inset-0 rounded-md border border-accent/60 bg-accent/15"
              style={{ animationDelay: `${i * step}s`, animationDuration: `${total}s` }}
            />
            <span className="relative">{m}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
