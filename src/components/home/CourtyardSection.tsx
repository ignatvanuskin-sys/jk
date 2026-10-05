import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ru';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MediaImage } from '@/components/ui/MediaImage';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Courtyard and landscaping.
 *
 * This is the "I could live here" block, so imagery leads and type stays out of
 * the way: one wide establishing shot, three supporting frames, then the six
 * zones in plain language.
 */
export function CourtyardSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="section bg-pine-deep text-paper" id="courtyard">
      <div className="shell">
        <SectionHeading
          eyebrow={dict.courtyard.eyebrow}
          title={dict.courtyard.title}
          lead={dict.courtyard.lead}
          tone="light"
        />

        <figure className="mt-12">
          <div className="relative aspect-[16/9] overflow-hidden rounded-md">
            <MediaImage
              media="courtyard"
              locale={locale}
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-xs text-paper/60">
            {dict.courtyard.captions.courtyard}
          </figcaption>
        </figure>

        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {(
            [
              ['playground', dict.courtyard.captions.playground],
              ['sport', dict.courtyard.captions.sport],
              ['landscape', dict.courtyard.captions.landscape],
            ] as const
          ).map(([media, caption]) => (
            <li key={media}>
              <figure>
                <div className="relative aspect-[3/2] overflow-hidden rounded-md">
                  <MediaImage
                    media={media}
                    locale={locale}
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-xs text-paper/60">{caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-md border border-paper/15 bg-paper/15 sm:grid-cols-2 lg:grid-cols-3">
          {dict.courtyard.zones.map((zone, index) => (
            <li key={zone.title} className="bg-pine-deep p-6">
              <Reveal delay={Math.min(index, 4) * 50}>
                <h3 className="font-display text-xl text-paper">{zone.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-paper/70">{zone.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
