'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProjectImage } from '@/data/types';
import { EASE_OUT } from '@/lib/animations';
import { getLenis } from '@/lib/scroll';
import { asset, cn } from '@/lib/utils';

/** Image gallery grid + accessible lightbox (Esc closes, ←/→ navigate, focus is restored). */
export function Gallery({ images, name }: { images: ProjectImage[]; name: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const current = index !== null ? images[index] : undefined;

  const close = useCallback(() => {
    setIndex(null);
    opener.current?.focus();
  }, []);
  const go = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'Tab') {
        // Keep focus inside the dialog.
        const nodes = document.querySelectorAll<HTMLElement>('#lightbox button');
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close, go]);

  if (!images.length) return null;

  return (
    <>
      <ul className="grid gap-4 md:grid-cols-2">
        {images.map((im, i) => (
          <li key={im.src} className={cn('min-w-0', i === 0 && images.length % 2 === 1 && 'md:col-span-2')}>
            <figure>
              <button
                type="button"
                data-cursor="VIEW"
                data-activate
                onClick={(e) => {
                  opener.current = e.currentTarget;
                  setIndex(i);
                }}
                aria-label={`Open image ${i + 1} of ${images.length}: ${im.alt}`}
                className="group relative block w-full overflow-hidden rounded-xl border border-line bg-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(im.src)}
                  alt=""
                  width={im.width}
                  height={im.height}
                  loading="lazy"
                  decoding="async"
                  className={cn(
                    'w-full transition-transform duration-[900ms] ease-out-expo group-act:scale-[1.03]',
                    im.height / im.width > 1.2 ? 'max-h-[70vh] object-contain' : 'object-cover',
                  )}
                />
                <span className="shine" aria-hidden />
              </button>
              <figcaption className="mt-2 flex items-center justify-between gap-4 label-mono text-muted">
                <span className="truncate normal-case [letter-spacing:0.02em]">{im.alt}</span>
                {im.concept && <span className="shrink-0 text-dev">Design concept</span>}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open && current && (
          <motion.div
            id="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${name} gallery`}
            className="fixed inset-0 z-[96] flex flex-col bg-bg/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            <div className="flex items-center justify-between p-4 md:p-6">
              <span className="label-mono text-muted">
                {(index ?? 0) + 1} / {images.length}
                {current.concept && <span className="ml-3 text-dev">Design concept · sample data</span>}
              </span>
              <button
                ref={closeBtn}
                type="button"
                onClick={close}
                aria-label="Close gallery"
                className="grid size-11 place-items-center rounded-full border border-line-strong hover:border-accent hover:text-accent"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 md:px-20 md:pb-10">
              <AnimatePresence mode="wait">
                <motion.figure
                  key={current.src}
                  className="flex max-h-full flex-col items-center"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(current.src)}
                    alt={current.alt}
                    width={current.width}
                    height={current.height}
                    className="max-h-[calc(100svh-9rem)] w-auto rounded-lg object-contain"
                  />
                  <figcaption className="mt-3 text-center text-sm text-muted">{current.alt}</figcaption>
                </motion.figure>
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous image"
                    className="absolute top-1/2 left-2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-bg/70 hover:border-accent hover:text-accent md:left-6"
                  >
                    <ChevronLeft aria-hidden className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next image"
                    className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-bg/70 hover:border-accent hover:text-accent md:right-6"
                  >
                    <ChevronRight aria-hidden className="size-5" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
