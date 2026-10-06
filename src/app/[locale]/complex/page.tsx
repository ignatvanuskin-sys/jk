import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { BLOCKS, PARKING, PROJECT } from '@/data/project';
import { INVENTORY_STATS } from '@/data/apartments';
import { getSeoCopy } from '@/content/seo';
import { breadcrumbSchema, buildMetadata, fillSeoTokens } from '@/lib/seo';

import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArchitectureSection } from '@/components/home/ArchitectureSection';
import { CourtyardSection } from '@/components/home/CourtyardSection';
import { LeadButton } from '@/components/forms/LeadButton';
import { MediaImage } from '@/components/ui/MediaImage';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const copy = getSeoCopy('complex', raw);
  return buildMetadata({
    locale: raw,
    title: fillSeoTokens(copy.title, raw),
    description: fillSeoTokens(copy.description, raw),
    path: 'complex',
    ogImage: 'night-facade',
  });
}

export default async function ComplexPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const trail = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.complex, path: 'complex' },
  ];

  return (
    <>
      <JsonLd id="ld-breadcrumb" data={breadcrumbSchema(locale, trail)} />

      <PageHero
        locale={locale}
        eyebrow={dict.about.eyebrow}
        title={dict.about.title}
        lead={dict.about.lead}
        breadcrumbLabel={dict.nav.breadcrumb}
        trail={trail}
        image="night-facade"
        meta={[
          { label: dict.stats.items.floors, value: `${PROJECT.storeys.min}–${PROJECT.storeys.max}` },
          { label: dict.stats.items.units, value: String(INVENTORY_STATS.total) },
          { label: dict.stats.items.parking, value: String(PARKING.spaces) },
          { label: dict.stats.items.delivery, value: PROJECT.delivery[locale] },
        ]}
        actions={
          <LeadButton source="complex-hero" variant="light" className="px-6 py-3.5">
            {dict.cta.getConsultation}
          </LeadButton>
        }
      />

      <section className="section bg-paper">
        <div className="shell grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading title={dict.about.title} lead={dict.about.body} />
            <ul className="mt-8 space-y-3">
              {dict.about.highlights.map((item) => (
                <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink">
                  <span className="mt-2 size-1.5 flex-none rounded-full bg-clay" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <figure className="overflow-hidden rounded-md">
            <div className="relative aspect-[3/2]">
              <MediaImage
                media="aerial"
                locale={locale}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs text-muted">
              {BLOCKS.map((block) => block.names[locale]).join(' · ')}
            </figcaption>
          </figure>
        </div>
      </section>

      <ArchitectureSection locale={locale} dict={dict} />
      <CourtyardSection locale={locale} dict={dict} />

      <section className="section bg-paper">
        <div className="shell">
          <SectionHeading
            eyebrow={dict.parking.eyebrow}
            title={dict.benefits.items[1].title}
            lead={dict.benefits.items[1].text}
          />
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <figure className="overflow-hidden rounded-md">
              <div className="relative aspect-[3/2]">
                <MediaImage
                  media="parking"
                  locale={locale}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
            </figure>
            <div>
              <dl className="grid grid-cols-2 gap-6">
                {[
                  { label: dict.parking.facts.spaces, value: PARKING.spaces },
                  { label: dict.parking.facts.storage, value: PARKING.storageRooms },
                ].map((item) => (
                  <div key={item.label}>
                    <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                      {item.label}
                    </dt>
                    <dd className="num mt-2 font-display text-4xl leading-none text-ink">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <LeadButton source="complex-parking" variant="primary" className="mt-8 w-full sm:w-auto">
                {dict.cta.getConditions}
              </LeadButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
