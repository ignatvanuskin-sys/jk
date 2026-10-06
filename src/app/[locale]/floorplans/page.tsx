import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { PLAN_SUMMARIES } from '@/data/plan-summaries';
import { INVENTORY_STATS } from '@/data/apartments';
import { getSeoCopy } from '@/content/seo';
import { breadcrumbSchema, buildMetadata, fillSeoTokens } from '@/lib/seo';

import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FloorPlansExplorer } from '@/components/floorplans/FloorPlansExplorer';
import { buildFloorPlansLabels } from '@/components/apartments/labels';
import { LeadButton } from '@/components/forms/LeadButton';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const copy = getSeoCopy('floorplans', raw);
  return buildMetadata({
    locale: raw,
    title: fillSeoTokens(copy.title, raw),
    description: fillSeoTokens(copy.description, raw),
    path: 'floorplans',
    ogImage: 'interior-living',
  });
}

export default async function FloorPlansPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const trail = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.floorplans, path: 'floorplans' },
  ];

  return (
    <>
      <JsonLd id={`ld-breadcrumb-${locale}`} data={breadcrumbSchema(locale, trail)} />

      <PageHero
        locale={locale}
        eyebrow={dict.floorplans.eyebrow}
        title={dict.floorplans.title}
        lead={dict.floorplans.lead}
        breadcrumbLabel={dict.nav.breadcrumb}
        trail={trail}
        image="interior-living"
        meta={[
          { label: dict.plan.type, value: String(PLAN_SUMMARIES.length) },
          {
            label: dict.stats.items.area,
            value: `${INVENTORY_STATS.minArea}–${INVENTORY_STATS.maxArea} м²`,
          },
          { label: dict.common.inProgress, value: String(INVENTORY_STATS.available) },
        ]}
      />

      <section className="section bg-paper">
        <div className="shell">
          <FloorPlansExplorer
            plans={PLAN_SUMMARIES}
            locale={locale}
            labels={buildFloorPlansLabels(locale, dict)}
          />
        </div>
      </section>

      <section className="section bg-bone">
        <div className="shell grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <SectionHeading
            eyebrow={dict.architecture.eyebrow}
            title={dict.architecture.title}
            lead={dict.architecture.lead}
            aside={
              <LeadButton source="floorplans-page" variant="primary">
                {dict.cta.getPlanPdf}
              </LeadButton>
            }
          />
          <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
            {dict.architecture.items.slice(0, 4).map((item) => (
              <div key={item.title} className="bg-paper p-6">
                <h3 className="font-display text-lg text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
