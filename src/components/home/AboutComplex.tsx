import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ru';
import { PROJECT, BLOCKS, PARKING } from '@/data/project';
import { INVENTORY_STATS } from '@/data/apartments';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MediaImage } from '@/components/ui/MediaImage';

/**
 * "About the complex" — the block that turns the hero's promise into numbers.
 *
 * Note the copy rule applied here: every highlight is a checkable statement
 * ("3.0 m ceilings", "parking only underground"), never an adjective.
 */
export function AboutComplex({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const stats = [
    { label: dict.stats.items.units, value: String(INVENTORY_STATS.total) },
    { label: dict.stats.items.floors, value: `${PROJECT.storeys.min}–${PROJECT.storeys.max}` },
    { label: dict.stats.items.area, value: `${INVENTORY_STATS.minArea}–${INVENTORY_STATS.maxArea} м²` },
    { label: dict.stats.items.parking, value: String(PARKING.undergroundSpaces) },
  ];

  return (
    <section className="section bg-paper">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:items-start lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={dict.about.eyebrow}
              title={dict.about.title}
              lead={dict.about.lead}
            />

            <p className="mt-6 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-soft">
              {dict.about.body}
            </p>

            <ul className="mt-8 space-y-3">
              {dict.about.highlights.map((item) => (
                <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink">
                  <span
                    className="mt-2 size-1.5 flex-none rounded-full bg-clay"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-8 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    {stat.label}
                  </dt>
                  <dd className="num mt-2 font-display text-3xl leading-none text-ink">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-9 flex flex-wrap gap-3">
              {[
                { href: '/complex', label: dict.about.links.architecture },
                { href: '/complex#courtyard', label: dict.about.links.courtyard },
                { href: '/parking', label: dict.about.links.parking },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className="inline-flex items-center gap-2 border-b border-line pb-1 text-sm text-ink transition-colors hover:border-clay hover:text-clay"
                >
                  {link.label}
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>

          <Reveal className="lg:sticky lg:top-28">
            <figure className="overflow-hidden rounded-md">
              <div className="relative aspect-[3/2]">
                <MediaImage
                  media="aerial"
                  locale={locale}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-xs text-muted">
                {BLOCKS.map((block) => block.names[locale]).join(' · ')}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
