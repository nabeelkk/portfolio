import type { Transition, Variants } from 'framer-motion';

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

export const baseTransition: Transition = { duration: 0.8, ease: EASE_OUT };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: baseTransition },
};

export const stagger = (staggerChildren = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Masked line/word reveal: element slides up from below its overflow-hidden parent. */
export const maskReveal: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.9, ease: EASE_OUT } },
};

export const inViewOnce = { once: true, margin: '0px 0px -12% 0px' } as const;
