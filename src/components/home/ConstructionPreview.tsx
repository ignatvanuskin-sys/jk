import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ru';
import { BLOCKS } from '@/data/project';
import { getLatestReport, OVERALL_PROGRESS } from '@/data/construction';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { DemoNotice } from '@/components/ui/DemoNotice';

/**
 * Construction progress teaser.
 *
 * Only the three current percentages and the overall figure — the monthly photo
 * history lives on its own page. Showing the number without the evidence would
 * be a claim, so the block links straight to the reports.
 */
export function ConstructionPreview({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="section bg-paper" id="construction">
      <div className="shell">
        <SectionHeading
          eyebrow={dict.construction.eyebrow}
          title={dict.construction.title}
          lead={dict.construction.lead}
          aside={
            <Link href={`/${locale}/construction`} className="btn btn-outline">
              {dict.common.openSection}
            </Link>
          }
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_2fr] lg:items-start">
          <div className="rounded-sm border border-line bg-pine-deep p-7 text-paper">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-paper/60">
              {dict.construction.totalProgress}
            </p>
            <p className="num mt-4 font-display text-6xl leading-none text-paper">
              {OVERALL_PROGRESS}%
            </p>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-paper/20">
              <span
                className="block h-full rounded-full bg-clay-soft"
                style={{ width: `${OVERALL_PROGRESS}%` }}
              />
            </div>
            <p className="mt-5 text-xs leading-relaxed text-paper/70">
              {dict.construction.cameraText}
            </p>
          </div>

          <ul className="grid gap-6 sm:grid-cols-3">
            {BLOCKS.map((block) => {
              const report = getLatestReport(block.id);
              return (
                <li key={block.id} className="card p-6">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    {block.names[locale]}
                  </p>
                  <p className="num mt-3 font-display text-4xl leading-none text-ink">
                    {report ? `${report.progress}%` : '—'}
                  </p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-bone">
                    <span
                      className="block h-full rounded-full bg-pine"
                      style={{ width: `${report?.progress ?? 0}%` }}
                    />
                  </div>
                  <p className="num mt-4 text-xs text-muted">
                    {dict.construction.reportDate}: {report?.month}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        <DemoNotice label={dict.common.demoData} className="mt-8">
          {dict.construction.placeholderNotice}
        </DemoNotice>
      </div>
    </section>
  );
}
