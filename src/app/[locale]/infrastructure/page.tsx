import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import {
  INFRA_CATEGORIES,
  INFRA_BY_CATEGORY,
  INFRASTRUCTURE,
  type InfraCategory,
} from '@/data/infrastructure';
import { getSeoCopy } from '@/content/seo';
import { breadcrumbSchema, buildMetadata, fillSeoTokens } from '@/lib/seo';

import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InfraMap, type MapObject } from '@/components/infrastructure/InfraMap';
import { LeadButton } from '@/components/forms/LeadButton';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const copy = getSeoCopy('infrastructure', raw);
  return buildMetadata({
    locale: raw,
    title: fillSeoTokens(copy.title, raw),
    description: fillSeoTokens(copy.description, raw),
    path: 'infrastructure',
    ogImage: 'courtyard',
  });
}

export default async function InfrastructurePage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const trail = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.infrastructure, path: 'infrastructure' },
  ];

  const objects: MapObject[] = INFRASTRUCTURE.map((object) => ({
    id: object.id,
    category: object.category,
    label: object.label[locale],
    minutes: object.minutes,
    mode: object.mode,
  }));

  return (
    <>
      <JsonLd id="ld-breadcrumb" data={breadcrumbSchema(locale, trail)} />

      <PageHero
        locale={locale}
        eyebrow={dict.infrastructure.eyebrow}
        title={dict.infrastructure.title}
        lead={dict.infrastructure.lead}
        breadcrumbLabel={dict.nav.breadcrumb}
        trail={trail}
        image="courtyard"
        meta={INFRA_CATEGORIES.slice(0, 4).map((key) => ({
          label: dict.infrastructure.categories[key],
          value: String(INFRASTRUCTURE.filter((o) => o.category === key).length),
        }))}
      />

      <section className="section bg-paper">
        <div className="shell">
          <InfraMap
            objects={objects}
            categoryLabels={
              Object.fromEntries(
                INFRA_CATEGORIES.map((key) => [key, dict.infrastructure.categories[key]]),
              ) as Record<InfraCategory, string>
            }
            categoryOrder={INFRA_CATEGORIES}
            mapLabel={dict.infrastructure.mapLabel}
            listLabel={dict.infrastructure.listLabel}
            minutesLabel={dict.common.minutes}
            walkLabel={dict.common.walking}
            transportLabel={dict.common.onTransport}
            allLabel={dict.common.all}
            emptyLabel={dict.apartments.emptyText}
            objectsCountLabel={dict.infrastructure.objectsCount}
          />
        </div>
      </section>

      <section className="section bg-bone">
        <div className="shell">
          <SectionHeading
            eyebrow={dict.infrastructure.eyebrow}
            title={dict.infrastructure.byWalkTime}
            lead={dict.infrastructure.lead}
          />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {INFRA_BY_CATEGORY.map((group) => (
              <div key={group.category}>
                <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
                  {dict.infrastructure.categories[group.category]}
                </h3>
                <ul className="mt-4 space-y-2.5 border-t border-line pt-4">
                  {group.objects.map((object) => (
                    <li
                      key={object.id}
                      className="flex items-baseline justify-between gap-3 text-sm text-ink-soft"
                    >
                      <span>{object.label[locale]}</span>
                      <span className="num flex-none text-xs text-muted">
                        {object.minutes} {dict.common.minutes}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <LeadButton source="infrastructure" variant="primary" className="px-7 py-4">
              {dict.cta.getConsultation}
            </LeadButton>
          </div>
        </div>
      </section>
    </>
  );
}
