'use client';

import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { profile, socials } from '@/data/profile';
import { EASE_OUT } from '@/lib/animations';
import { scrollToTarget } from '@/lib/scroll';
import { externalProps } from '@/lib/utils';
import { Magnetic } from '../ui/MagneticButton';
import { SocialIcon } from '../ui/SocialIcon';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line pt-16">
      <div className="container-x">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-3">
            <span className="label-mono text-muted">Based in</span>
            <span className="text-2xl font-medium tracking-[-0.02em]">{profile.locationShort}</span>
          </div>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  {...(s.icon === 'mail' ? {} : externalProps)}
                  className="link-underline inline-flex items-center gap-2 text-fg/80 hover:text-fg"
                >
                  <SocialIcon name={s.icon} className="size-4" />
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={profile.aisynx.url}
                {...externalProps}
                className="link-underline inline-flex items-center gap-2 text-fg/80 hover:text-fg"
              >
                <SocialIcon name="globe" className="size-4" />
                AISYNX
              </a>
            </li>
          </ul>
          <Magnetic strength={0.45}>
            <button
              type="button"
              onClick={() => scrollToTarget(0)}
              aria-label="Back to top"
              className="group grid size-16 place-items-center rounded-full border border-line-strong transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-ink"
            >
              <ArrowUp aria-hidden className="size-5 transition-transform duration-500 ease-out-expo group-act:-translate-y-1" />
            </button>
          </Magnetic>
        </div>
      </div>

      <div aria-hidden className="mt-12 flex justify-center overflow-hidden px-2 select-none">
        {'NABEEL'.split('').map((c, i) => (
          <motion.span
            key={i}
            className="inline-block text-[25.5vw] leading-[0.78] font-bold tracking-[-0.06em] text-fg"
            initial={{ y: '60%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px -5% 0px' }}
            transition={{ duration: 1, ease: EASE_OUT, delay: i * 0.06 }}
          >
            {c}
          </motion.span>
        ))}
      </div>

      <div className="container-x flex flex-col gap-2 border-t border-line py-6 label-mono text-muted sm:flex-row sm:justify-between">
        <span>
          Designed &amp; built by {profile.name} © {year}
        </span>
        <span>{profile.location}</span>
      </div>
    </footer>
  );
}
