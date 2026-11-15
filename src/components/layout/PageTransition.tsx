'use client';

import { MotionConfig, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { EASE_IN_OUT } from '@/lib/animations';
import { useReducedMotion } from '@/lib/hooks';

type Phase = 'idle' | 'cover' | 'reveal';
const NavigateCtx = createContext<(href: string) => void>(() => {});

/**
 * Route transitions for a static-export App Router site: a panel wipes up to cover the
 * page, the route changes underneath, then the panel continues up to reveal the new page.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('idle');
  const [prevPath, setPrevPath] = useState(pathname);
  const pending = useRef<string | null>(null);

  // Derived-state update during render: when the route changes mid-cover, reveal.
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    if (phase === 'cover') setPhase('reveal');
  }

  const navigate = useCallback(
    (href: string) => {
      const target = new URL(href, window.location.href);
      if (reduce || target.pathname === window.location.pathname) {
        router.push(href);
        return;
      }
      pending.current = href;
      setPhase('cover');
    },
    [reduce, router],
  );

  return (
    <NavigateCtx.Provider value={navigate}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-accent"
        initial={false}
        style={{ visibility: phase === 'idle' ? 'hidden' : 'visible' }}
        animate={{ y: phase === 'cover' ? '0%' : phase === 'reveal' ? '-100%' : '100%' }}
        transition={phase === 'idle' ? { duration: 0 } : { duration: 0.6, ease: EASE_IN_OUT }}
        onAnimationComplete={() => {
          if (phase === 'cover' && pending.current) {
            router.push(pending.current);
            pending.current = null;
          } else if (phase === 'reveal') {
            setPhase('idle');
          }
        }}
      >
        <span className="font-mono text-sm tracking-[0.3em] text-accent-ink">NK</span>
      </motion.div>
    </NavigateCtx.Provider>
  );
}

/** next/link that plays the page transition for internal route changes. */
export function TransitionLink({
  href,
  onClick,
  ...rest
}: React.ComponentProps<typeof Link> & { href: string }) {
  const navigate = useContext(NavigateCtx);
  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        const url = new URL(href, window.location.href);
        if (url.pathname === window.location.pathname) return; // same page: let anchors work
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    />
  );
}
