import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, formatPriceCompact, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { APARTMENTS, INVENTORY_STATS, UNIT_SUMMARIES } from '@/data/apartments';
import { BLOCKS, PROJECT } from '@/data/project';
import { getSeoCopy } from '@/content/seo';
import { breadcrumbSchema, buildMetadata, faqSchema, fillSeoTokens } from '@/lib/seo';

import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion } from '@/components/ui/Accordion';
import { ApartmentsExplorer } from '@/components/apartments/ApartmentsExplorer';
import { buildExplorerLabels, buildUnitGridLabels } from '@/components/apartments/labels';
import { UnitGrid } from '@/components/apartments/UnitGrid';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const copy = getSeoCopy('apartments', raw);
  return buildMetadata({
    locale: raw,
    title: fillSeoTokens(copy.title, raw),
    description: fillSeoTokens(copy.description, raw),
    path: 'apartments',
    ogImage: 'interior-living',
  });
}

export default async function ApartmentsPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const trail = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.apartments, path: 'apartments' },
  ];

  return (
    <>
      <JsonLd id="ld-breadcrumb" data={breadcrumbSchema(locale, trail)} />
      <JsonLd id="ld-faq" data={faqSchema(dict.faq.items.slice(0, 4))} />

      <PageHero
        locale={locale}
        eyebrow={dict.apartments.eyebrow}
        title={dict.apartments.title}
        lead={dict.apartments.lead}
        breadcrumbLabel={dict.nav.breadcrumb}
        trail={trail}
        image="interior-living"
        meta={[
          { label: dict.stats.items.units, value: String(PROJECT.totalUnits) },
          { label: dict.common.inProgress, value: String(INVENTORY_STATS.available) },
          { label: dict.hero.priceLabel, value: formatPriceCompact(INVENTORY_STATS.minAvailablePrice, locale) },
          {
            label: dict.stats.items.area,
            value: `${INVENTORY_STATS.minArea}–${INVENTORY_STATS.maxArea} м²`,
          },
        ]}
      />

      <section className="section bg-paper">
        <div className="shell">
          <ApartmentsExplorer
            units={UNIT_SUMMARIES}
            locale={locale}
            labels={buildExplorerLabels(locale, dict)}
            floorLabels={dict.floorplans.roomLabels}
            bounds={{
              areaMin: Math.floor(INVENTORY_STATS.minArea),
              areaMax: Math.ceil(INVENTORY_STATS.maxArea),
              priceMin: 0,
              priceMax: Math.ceil(INVENTORY_STATS.maxPrice / 1_000_000) * 1_000_000,
              floorMin: 1,
              floorMax: Math.max(...BLOCKS.map((block) => block.floors)),
            }}
          />
        </div>
      </section>

      <section className="section bg-bone" id="unit-grid">
        <div className="shell">
          <SectionHeading
            eyebrow={dict.selector.eyebrow}
            title={dict.selector.title}
            lead={dict.selector.lead}
          />
          <div className="mt-10">
            <UnitGrid
              units={UNIT_SUMMARIES}
              blocks={BLOCKS.map((block) => ({
                id: block.id,
                floors: block.floors,
                unitsPerFloor: block.unitsPerFloor,
              }))}
              locale={locale}
              labels={buildUnitGridLabels(locale, dict)}
            />
          </div>
          <p className="sr-only">
            {APARTMENTS.length} {dict.apartments.resultsUnit}
          </p>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="shell grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <SectionHeading eyebrow={dict.faq.eyebrow} title={dict.faq.title} lead={dict.faq.lead} />
          <Accordion items={dict.faq.items.slice(0, 4)} />
        </div>
      </section>
    </>
  );
}
