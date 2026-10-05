import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { PROJECT } from '@/data/project';
import { INFRASTRUCTURE } from '@/data/infrastructure';
import { getSeoCopy } from '@/content/seo';
import { breadcrumbSchema, buildMetadata, fillSeoTokens } from '@/lib/seo';

import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { LocationSection } from '@/components/home/LocationSection';
import { LeadButton } from '@/components/forms/LeadButton';
import { DemoNotice } from '@/components/ui/DemoNotice';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const copy = getSeoCopy('location', raw);
  return buildMetadata({
    locale: raw,
    title: fillSeoTokens(copy.title, raw),
    description: fillSeoTokens(copy.description, raw),
    path: 'location',
    ogImage: 'aerial',
  });
}

export default async function LocationPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const trail = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.location, path: 'location' },
  ];

  const walking = INFRASTRUCTURE.filter((object) => object.mode === 'walk').length;

  return (
    <>
      <JsonLd id="ld-breadcrumb" data={breadcrumbSchema(locale, trail)} />

      <PageHero
        locale={locale}
        eyebrow={dict.location.eyebrow}
        title={dict.location.title}
        lead={dict.location.lead}
        breadcrumbLabel={dict.nav.breadcrumb}
        trail={trail}
        image="aerial"
        meta={[
          { label: dict.location.address, value: PROJECT.city },
          { label: dict.nav.infrastructure, value: String(INFRASTRUCTURE.length) },
          { label: dict.stats.items.toCenter, value: dict.location.routes[0].time },
          { label: dict.stats.items.toSchool, value: dict.location.routes[2].time },
        ]}
        actions={
          <LeadButton source="location-hero" variant="light" className="px-6 py-3.5">
            {dict.cta.getConsultation}
          </LeadButton>
        }
      />

      <LocationSection locale={locale} dict={dict} />

      <section className="section bg-paper">
        <div className="shell grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <SectionHeading
            eyebrow={dict.infrastructure.eyebrow}
            title={dict.infrastructure.byWalkTime}
            lead={`${walking} ${dict.infrastructure.objectsCount} — ${dict.infrastructure.lead}`}
            aside={
              <LeadButton source="location-neighbourhood" variant="outline">
                {dict.cta.buildRoute}
              </LeadButton>
            }
          />
          <ul className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
            {INFRASTRUCTURE.filter((object) => object.mode === 'walk')
              .slice()
              .sort((a, b) => a.minutes - b.minutes)
              .map((object) => (
                <li
                  key={object.id}
                  className="flex items-baseline justify-between gap-4 bg-paper px-5 py-4"
                >
                  <span className="text-sm text-ink">{object.label[locale]}</span>
                  <span className="num flex-none text-xs text-muted">
                    {object.minutes} {dict.common.minutes}
                  </span>
                </li>
              ))}
          </ul>
        </div>
        <div className="shell mt-10">
          <DemoNotice label={dict.common.demoData}>{dict.location.mapPlaceholder}</DemoNotice>
        </div>
      </section>
    </>
  );
}
