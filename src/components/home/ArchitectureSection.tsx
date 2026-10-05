import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ru';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MediaImage } from '@/components/ui/MediaImage';

/**
 * Architecture.
 *
 * Told in three large images and six short, technical notes — no walls of text.
 * The copy leans on verifiable specifics (70 mm profile, 1.6 m/s lifts, 3.6 m
 * lobby) because the research showed buyers read these and remember them.
 */
export function ArchitectureSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="section bg-paper" id="architecture">
      <div className="shell">
        <SectionHeading
          eyebrow={dict.architecture.eyebrow}
          title={dict.architecture.title}
          lead={dict.architecture.lead}
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <figure className="lg:col-span-7">
            <div className="relative aspect-[3/2] overflow-hidden rounded-md">
              <MediaImage
                media="facade-detail"
                locale={locale}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs text-muted">
              {dict.architecture.imageCaptions.facade}
            </figcaption>
          </figure>

          <div className="grid gap-4 lg:col-span-5">
            <figure>
              <div className="relative aspect-[3/2] overflow-hidden rounded-md">
                <MediaImage
                  media="lobby"
                  locale={locale}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-xs text-muted">
                {dict.architecture.imageCaptions.lobby}
              </figcaption>
            </figure>
            <figure>
              <div className="relative aspect-[3/2] overflow-hidden rounded-md">
                <MediaImage
                  media="night-facade"
                  locale={locale}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-xs text-muted">
                {dict.architecture.imageCaptions.night}
              </figcaption>
            </figure>
          </div>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {dict.architecture.items.map((item, index) => (
            <li key={item.title} className="bg-paper p-6">
              <Reveal delay={Math.min(index, 4) * 50}>
                <h3 className="font-display text-xl text-ink">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{item.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
