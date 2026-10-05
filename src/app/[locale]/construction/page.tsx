import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { BLOCKS } from '@/data/project';
import {
  MONTHLY_REPORTS,
  OVERALL_PROGRESS,
  phaseInProgress,
  phasesDone,
} from '@/data/construction';
import { getImage } from '@/data/media';
import { getSeoCopy } from '@/content/seo';
import { breadcrumbSchema, buildMetadata, fillSeoTokens } from '@/lib/seo';

import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { DemoNotice } from '@/components/ui/DemoNotice';
import {
  ConstructionTimeline,
  type TimelineReport,
} from '@/components/construction/ConstructionTimeline';
import { buildConstructionLabels } from '@/components/apartments/labels';

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

export default async function ConstructionPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const trail = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.construction, path: 'construction' },
  ];

  // Localised, serialisable report list for the client timeline.
  const reports: TimelineReport[] = MONTHLY_REPORTS.map((report) => {
    const image = getImage(report.image);
    return {
      id: report.id,
      blockId: report.blockId,
      month: report.month,
      progress: report.progress,
      done: phasesDone(report.progress).map((phase) => phase.name[locale]),
      current: phaseInProgress(report.progress)?.name[locale] ?? '',
      image: {
        src: image.src,
        alt: image.alt[locale],
        width: image.width,
        height: image.height,
        blurDataURL: image.blurDataURL,
      },
    };
  }).sort((a, b) => b.month.localeCompare(a.month));

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
          { label: dict.construction.totalProgress, value: `${OVERALL_PROGRESS}%` },
          ...BLOCKS.map((block) => ({
            label: block.names[locale],
            value: block.delivery[locale],
          })),
        ]}
      />

      <section className="section bg-paper">
        <div className="shell">
          <ConstructionTimeline
            reports={reports}
            blocks={BLOCKS.map((block) => ({ id: block.id, floors: block.floors }))}
            labels={buildConstructionLabels(locale, dict)}
            locale={locale}
          />

          <div className="mt-12 rounded-sm border border-line bg-bone p-6">
            <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
              {dict.construction.cameraTitle}
            </h2>
            <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-ink-soft">
              {dict.construction.cameraText}
            </p>
          </div>

          <DemoNotice label={dict.common.demoData} className="mt-6" tone="clay">
            {dict.construction.placeholderNotice}
          </DemoNotice>
        </div>
      </section>
    </>
  );
}
