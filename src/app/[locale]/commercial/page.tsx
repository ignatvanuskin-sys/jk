import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, formatPrice, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { COMMERCIAL } from '@/data/project';
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
  const copy = getSeoCopy('commercial', raw);
  return buildMetadata({
    locale: raw,
    title: fillSeoTokens(copy.title, raw),
    description: fillSeoTokens(copy.description, raw),
    path: 'commercial',
    ogImage: 'commercial',
  });
}

export default async function CommercialPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const trail = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.commercial, path: 'commercial' },
  ];

  return (
    <>
      <JsonLd id="ld-breadcrumb" data={breadcrumbSchema(locale, trail)} />

      <PageHero
        locale={locale}
        eyebrow={dict.commercial.eyebrow}
        title={dict.commercial.title}
        lead={dict.commercial.lead}
        breadcrumbLabel={dict.nav.breadcrumb}
        trail={trail}
        image="commercial"
        meta={[
          { label: dict.commercial.unitsLabel, value: String(COMMERCIAL.units) },
          { label: dict.commercial.areaLabel, value: `${COMMERCIAL.areaFrom}–${COMMERCIAL.areaTo} м²` },
          { label: dict.commercial.ceilingLabel, value: `${COMMERCIAL.ceiling} м` },
          { label: dict.commercial.priceLabel, value: formatPrice(COMMERCIAL.pricePerSqmFrom, locale) },
        ]}
      />

      <section className="section bg-paper">
        <div className="shell">
          <SectionHeading
            eyebrow={dict.commercial.featuresTitle}
            title={dict.commercial.title}
            lead={dict.commercial.lead}
          />

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <ul className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
              {COMMERCIAL.features.map((feature, index) => (
                <li key={feature[locale]} className="bg-paper p-5">
                  <Reveal delay={index * 40}>
                    <p className="flex gap-2.5 text-sm leading-relaxed text-ink">
                      <span
                        className="mt-1.5 size-1.5 flex-none rounded-full bg-clay"
                        aria-hidden="true"
                      />
                      {feature[locale]}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>

            <aside>
              <figure className="overflow-hidden rounded-md">
                <div className="relative aspect-[3/2]">
                  <MediaImage
                    media="commercial"
                    locale={locale}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </figure>
              <p className="mt-5 text-xs leading-relaxed text-muted">{dict.commercial.disclaimer}</p>
              <LeadButton source="commercial" variant="primary" className="mt-6 w-full">
                {dict.cta.getConditions}
              </LeadButton>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
