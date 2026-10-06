import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ru';
import { BLOCKS } from '@/data/project';
import { HANDOVER_YEAR } from '@/data/construction';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Construction teaser.
 *
 * The house is delivered, so there is no percentage to show and none is
 * invented. The block states the delivered status, lists the blocks it applies
 * to and links to the page that carries the full status.
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
              {dict.construction.status}
            </p>
            <p className="num mt-4 font-display text-4xl leading-none text-paper">
              {dict.construction.delivered}
            </p>
            <p className="num mt-3 text-sm text-paper/70">
              {dict.construction.deliveredValue}: {HANDOVER_YEAR}
            </p>
            <p className="mt-5 text-xs leading-relaxed text-paper/70">
              {dict.construction.deliveredText}
            </p>
          </div>

          <ul className="grid gap-6 sm:grid-cols-2">
            {BLOCKS.map((block) => (
              <li key={block.id} className="card p-6">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {block.names[locale]}
                </p>
                <p className="mt-3 font-display text-2xl leading-none text-ink">
                  {dict.construction.delivered}
                </p>
                <p className="num mt-4 text-xs text-muted">{block.delivery[locale]}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
