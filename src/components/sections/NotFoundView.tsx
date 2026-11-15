'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { EASE_OUT } from '@/lib/animations';
import { TransitionLink } from '../layout/PageTransition';
import { Magnetic } from '../ui/MagneticButton';

export function NotFoundView() {
  return (
    <main id="main" tabIndex={-1} className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16 outline-none">
      <div aria-hidden className="absolute inset-0 -z-10 grid-lines opacity-40" />
      <div aria-hidden className="absolute top-1/2 left-1/2 -z-10 size-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(198,244,50,0.12),transparent_60%)]" />
      <div className="container-x">
        <p className="label-mono text-accent">Error 404 — Route not found</p>
        <h1 className="mt-6 flex text-[clamp(7rem,30vw,22rem)] leading-[0.8] font-bold tracking-[-0.07em]">
          {['4', '0', '4'].map((c, i) => (
            <span key={i} className="inline-block overflow-hidden">
              <motion.span
                className={i === 1 ? 'inline-block serif-i font-normal text-accent' : 'inline-block'}
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, ease: EASE_OUT, delay: 0.1 + i * 0.08 }}
              >
                {c}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div
          className="mt-8 flex max-w-xl flex-col gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.5 }}
        >
          <p className="font-mono text-sm leading-relaxed text-muted">
            <span className="text-fg">$</span> GET {'{this page}'}
            <br />
            <span className="text-[#ff8a7a]">✗</span> 404: this route was never deployed. Even well-architected systems have
            dead ends.
          </p>
          <Magnetic>
            <TransitionLink
              href="/"
              className="group inline-flex h-14 items-center gap-2 rounded-full bg-accent px-8 font-medium text-accent-ink"
            >
              <ArrowLeft aria-hidden className="size-4 transition-transform duration-500 group-act:-translate-x-1" />
              Back home
            </TransitionLink>
          </Magnetic>
        </motion.div>
      </div>
    </main>
  );
}
