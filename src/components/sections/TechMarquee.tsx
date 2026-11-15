import { marqueeRows } from '@/data/skills';
import { Marquee } from '../ui/Marquee';
import { TechIcon } from '../ui/TechIcon';

export function TechMarquee() {
  return (
    <section aria-label="Technologies I work with" className="relative border-y border-line py-8 md:py-10">
      <div className="flex flex-col gap-5 md:gap-6">
        {marqueeRows.map((row, r) => (
          <Marquee key={r} reverse={r % 2 === 1} duration={r % 2 ? 46 : 38}>
            {row.map((t) => (
              <span
                key={t}
                className="group/item mx-5 inline-flex items-center gap-3 text-[clamp(1.25rem,2.6vw,2rem)] font-semibold tracking-[-0.03em] text-fg/55 transition-colors duration-300 hover:text-accent md:mx-8"
              >
                <TechIcon name={t} className="size-[0.9em] transition-transform duration-500 group-hover/item:-rotate-12" />
                {t}
                <span aria-hidden className="ml-5 text-[0.5em] text-fg/20 md:ml-8">
                  ✦
                </span>
              </span>
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
