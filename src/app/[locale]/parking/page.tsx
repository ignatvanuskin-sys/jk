import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, formatPrice, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { PARKING } from '@/data/project';
import { getSeoCopy } from '@/content/seo';
import { breadcrumbSchema, buildMetadata, fillSeoTokens } from '@/lib/seo';

import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MediaImage } from '@/components/ui/MediaImage';
import { LeadButton } from '@/components/forms/LeadButton';
import { Reveal } from '@/components/ui/Reveal';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const copy = getSeoCopy('parking', raw);
  return buildMetadata({
    locale: raw,
    title: fillSeoTokens(copy.title, raw),
    description: fillSeoTokens(copy.description, raw),
    path: 'parking',
    ogImage: 'parking',
  });
}

export default async function ParkingPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const trail = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.parking, path: 'parking' },
  ];

  return (
    <>
      <JsonLd id={`ld-breadcrumb-${locale}`} data={breadcrumbSchema(locale, trail)} />

      <PageHero
        locale={locale}
        eyebrow={dict.parking.eyebrow}
        title={dict.parking.title}
        lead={dict.parking.lead}
        breadcrumbLabel={dict.nav.breadcrumb}
        trail={trail}
        image="parking"
        meta={[
          { label: dict.parking.facts.spaces, value: String(PARKING.spaces) },
          { label: dict.parking.facts.storage, value: String(PARKING.storageRooms) },
          { label: dict.parking.facts.priceFrom, value: formatPrice(PARKING.spacePriceFrom, locale) },
          { label: dict.parking.facts.instalment, value: `${PARKING.instalmentMonths} ${dict.parking.facts.monthsUnit}` },
        ]}
      />

      <section className="section bg-paper">
        <div className="shell grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start lg:gap-16">
          <div>
            <SectionHeading title={dict.parking.title} lead={dict.parking.lead} />
            <ul className="mt-10 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
              {dict.parking.points.map((point, index) => (
                <li key={point.title} className="bg-paper p-6">
                  <Reveal delay={index * 50}>
                    <h3 className="font-display text-xl text-ink">{point.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{point.text}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:sticky lg:top-28">
            <figure className="overflow-hidden rounded-md">
              <div className="relative aspect-[3/2]">
                <MediaImage
                  media="parking"
                  locale={locale}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </figure>

            <dl className="mt-6 divide-y divide-line border-y border-line">
              <div className="flex items-baseline justify-between gap-4 py-4">
                <dt className="text-sm text-ink-soft">{dict.parking.facts.priceFrom}</dt>
                <dd className="num font-display text-2xl text-ink">
                  {formatPrice(PARKING.spacePriceFrom, locale)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-4">
                <dt className="text-sm text-ink-soft">{dict.parking.facts.storageFrom}</dt>
                <dd className="num font-display text-2xl text-ink">
                  {formatPrice(PARKING.storagePriceFrom, locale)}
                </dd>
              </div>
            </dl>

            <p className="mt-5 text-xs leading-relaxed text-muted">{dict.parking.disclaimer}</p>

            <LeadButton source="parking" variant="primary" className="mt-6 w-full">
              {dict.cta.getConditions}
            </LeadButton>
          </aside>
        </div>

      </section>
    </>
  );
}
