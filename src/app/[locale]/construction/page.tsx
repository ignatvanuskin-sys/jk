import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { BLOCKS } from '@/data/project';
import { HANDOVER_YEAR } from '@/data/construction';
import { getSeoCopy } from '@/content/seo';
import { breadcrumbSchema, buildMetadata, fillSeoTokens } from '@/lib/seo';

import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { LeadButton } from '@/components/forms/LeadButton';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const copy = getSeoCopy('construction', raw);
  return buildMetadata({
    locale: raw,
    title: fillSeoTokens(copy.title, raw),
    description: fillSeoTokens(copy.description, raw),
    path: 'construction',
    ogImage: 'construction-frame',
  });
}

/**
 * Construction.
 *
 * The house is delivered (2024), so this page states the delivered status and
 * nothing else. No percentage, no photo log and no camera are invented — the
 * project rule is "no data → the block is absent", and there is simply no
 * in-progress construction to report.
 */
export default async function ConstructionPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const trail = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.construction, path: 'construction' },
  ];

  return (
    <>
      <JsonLd id="ld-breadcrumb" data={breadcrumbSchema(locale, trail)} />

      <PageHero
        locale={locale}
        eyebrow={dict.construction.eyebrow}
        title={dict.construction.title}
        lead={dict.construction.lead}
        breadcrumbLabel={dict.nav.breadcrumb}
        trail={trail}
        image="construction-frame"
        meta={[
          { label: dict.construction.status, value: dict.construction.delivered },
          { label: dict.construction.deliveredValue, value: String(HANDOVER_YEAR) },
        ]}
      />

      <section className="section bg-paper">
        <div className="shell">
          <SectionHeading
            eyebrow={dict.construction.status}
            title={dict.construction.title}
            lead={dict.construction.deliveredText}
          />

          <ul className="mt-10 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
            {BLOCKS.map((block) => (
              <li key={block.id} className="flex items-baseline justify-between gap-4 bg-paper p-6">
                <span className="font-display text-xl text-ink">{block.names[locale]}</span>
                <span className="num text-sm text-clay">{block.delivery[locale]}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-sm border border-line bg-bone p-6">
            <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
              {dict.construction.status}
            </h2>
            <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-ink-soft">
              {dict.construction.deliveredText}
            </p>
          </div>

          <div className="mt-10">
            <LeadButton source="construction" variant="primary" className="px-7 py-4">
              {dict.cta.getConsultation}
            </LeadButton>
          </div>
        </div>
      </section>
    </>
  );
}
