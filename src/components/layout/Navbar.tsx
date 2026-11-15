'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { navLinks, profile, socials } from '@/data/profile';
import { EASE_OUT } from '@/lib/animations';
import { getLenis } from '@/lib/scroll';
import { asset, cn, externalProps } from '@/lib/utils';
import { ButtonLink } from '../ui/Button';
import { SocialIcon } from '../ui/SocialIcon';
import { TransitionLink } from './PageTransition';

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // The navbar is always visible; it only gains a glass background once scrolled.
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  // Active section indicator.
  useEffect(() => {
    if (!isHome) return;
    const els = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el);
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        let best: string | null = null;
        let max = 0;
        visible.forEach((r, id) => {
          if (r > max) {
            max = r;
            best = id;
          }
        });
        setActive(best);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.01, 0.25, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isHome]);

  // Lock scroll while the mobile menu is open; close on Escape.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const href = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70] flex justify-center px-3 pt-3 md:pt-4">
        <nav
          aria-label="Primary"
          className={cn(
            'flex w-full max-w-[calc(var(--container)+2rem)] items-center justify-between gap-3 rounded-full border py-2 pr-2 pl-4 transition-[background-color,border-color,backdrop-filter] duration-500',
            scrolled || open
              ? 'border-line-strong bg-bg/70 backdrop-blur-xl backdrop-saturate-150'
              : 'border-transparent bg-transparent',
          )}
        >
          <TransitionLink
            href="/"
            aria-label="Muhammed Nabeel KK, home"
            className="group flex items-center gap-2.5"
            onClick={() => setOpen(false)}
          >
            <span className="grid size-9 place-items-center rounded-full border border-line-strong font-mono text-[0.8rem] font-semibold tracking-tight transition-colors duration-300 group-act:border-accent group-act:bg-accent group-act:text-accent-ink">
              NK
            </span>
            <span className="hidden label-mono text-fg/70 sm:inline">Nabeel</span>
          </TransitionLink>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => {
              const isActive = active === l.id;
              return (
                <li key={l.id} className="relative">
                  <TransitionLink
                    href={href(l.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative z-10 block rounded-full px-4 py-2 text-sm transition-colors duration-300',
                      isActive ? 'text-accent-ink' : 'text-fg/75 hover:text-fg',
                    )}
                  >
                    {l.label}
                  </TransitionLink>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            {/* Hidden only on the narrowest phones (<360px); it's also in the menu. */}
            <div className="hidden min-[360px]:block">
              <ButtonLink
                href={asset(profile.resume)}
                download
                size="sm"
                magnetic
                icon={<Download aria-hidden className="size-4" />}
              >
                Download CV
              </ButtonLink>
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid size-10 place-items-center rounded-full border border-line-strong text-fg lg:hidden"
            >
              {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[65] flex flex-col bg-bg px-[var(--gutter)] pt-28 pb-10 lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div aria-hidden className="absolute inset-0 grid-lines opacity-50" />
            <ul className="relative flex flex-col gap-1">
              {navLinks.map((l, i) => (
                <li key={l.id} className="overflow-hidden">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.15 + i * 0.05 }}
                  >
                    <TransitionLink
                      href={href(l.id)}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 py-1 text-[clamp(2.5rem,11vw,4rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-fg active:text-accent"
                    >
                      <span className="font-mono text-xs text-accent">0{i + 1}</span>
                      {l.label}
                    </TransitionLink>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.div
              className="relative mt-auto flex flex-col gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <ButtonLink href={asset(profile.resume)} download size="lg" icon={<Download aria-hidden className="size-4" />}>
                Download CV
              </ButtonLink>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      {...(s.icon === 'mail' ? {} : externalProps)}
                      className="grid size-11 place-items-center rounded-full border border-line-strong"
                    >
                      <SocialIcon name={s.icon} />
                    </a>
                  ))}
                </div>
                <span className="label-mono text-muted">{profile.locationShort}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
