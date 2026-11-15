import { ArrowUpRight } from 'lucide-react';
import { cn, externalProps } from '@/lib/utils';
import { Magnetic } from './MagneticButton';

type Variant = 'primary' | 'ghost' | 'outline';

const base =
  'group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-tight transition-[color,background-color,border-color,box-shadow] duration-500 ease-out-expo select-none';
const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-12 px-6 text-[0.95rem]',
  lg: 'h-14 px-8 text-base',
};
const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-ink hover:shadow-[0_0_0_6px_rgba(198,244,50,0.15),0_10px_40px_-10px_rgba(198,244,50,0.6)]',
  ghost: 'border border-line-strong text-fg hover:border-fg/60',
  outline: 'border border-accent/60 text-accent hover:bg-accent hover:text-accent-ink',
};

export interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: keyof typeof sizes;
  magnetic?: boolean;
  external?: boolean;
  icon?: React.ReactNode | false;
}

/** Anchor styled as a button. Primary has a fill-sweep; external links open in a new tab. */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  magnetic = false,
  external,
  icon,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const el = (
    <a
      {...(external ? externalProps : {})}
      {...rest}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {variant === 'ghost' && (
        <span
          aria-hidden
          className="absolute inset-0 -z-0 origin-bottom scale-y-0 rounded-full bg-fg transition-transform duration-500 ease-out-expo group-hover/btn:scale-y-100"
        />
      )}
      <span
        className={cn(
          'relative z-10 inline-flex items-center gap-2',
          variant === 'ghost' && 'transition-colors duration-500 group-hover/btn:text-bg',
        )}
      >
        {children}
        {icon === false
          ? null
          : (icon ?? (
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform duration-500 ease-out-expo group-hover/btn:rotate-45"
              />
            ))}
      </span>
    </a>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

/** Small round icon link (socials etc). Requires an aria-label. */
export function IconLink({
  label,
  className,
  children,
  external = true,
  magnetic = true,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  label: string;
  external?: boolean;
  magnetic?: boolean;
}) {
  const el = (
    <a
      aria-label={label}
      title={label}
      {...(external ? externalProps : {})}
      {...rest}
      className={cn(
        'grid size-11 place-items-center rounded-full border border-line-strong text-fg/80 transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-ink',
        className,
      )}
    >
      {children}
    </a>
  );
  return magnetic ? <Magnetic strength={0.4}>{el}</Magnetic> : el;
}
