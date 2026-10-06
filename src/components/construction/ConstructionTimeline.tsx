'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

import type { Locale } from '@/i18n/config';
import { cn } from '@/lib/cn';
import { formatIsoDate } from '@/lib/i18n/date';
import { useRailOverflow } from '@/hooks/useRailOverflow';
import type { ConstructionLabels } from '@/components/apartments/labels';

export interface TimelineReport {
  id: string;
  blockId: 'a' | 'b' | 'c';
  month: string;
  progress: number;
  /** Localised phase names already completed at this point in time. */
  done: string[];
  /** The phase underway. */
  current: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    blurDataURL?: string;
  };
}

/**
 * Construction progress timeline.
 *
 * Monthly reports rather than a single "60% done" figure — the market research
 * is consistent that a photo history plus a percentage is what actually builds
 * trust. Each report shows what has already been built and what is next, so the
 * number is never an unsupported claim.
 */
export function ConstructionTimeline({
  reports,
  blocks,
  labels,
  locale,
}: {
  reports: TimelineReport[];
  blocks: { id: 'a' | 'b' | 'c'; floors: number }[];
  labels: ConstructionLabels;
  locale: Locale;
}) {
  const [blockId, setBlockId] = useState<'a' | 'b' | 'c' | 'all'>('all');
  // No deps: the rail always holds the same four chips, so there is nothing to
  // re-measure on.
  const { ref: railRef, more: railMore } = useRailOverflow();

  const visible = useMemo(
    () => (blockId === 'all' ? reports : reports.filter((r) => r.blockId === blockId)),
    [reports, blockId],
  );

  const latestByBlock = useMemo(() => {
    const map = new Map<'a' | 'b' | 'c', TimelineReport>();
    for (const report of reports) {
      const existing = map.get(report.blockId);
      if (!existing || report.month > existing.month) map.set(report.blockId, report);
    }
    return map;
  }, [reports]);

  const overall = useMemo(() => {
    const values = [...latestByBlock.values()].map((r) => r.progress);
    return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  }, [latestByBlock]);

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-4">
        <div className="rounded-sm border border-line bg-white p-5 sm:col-span-1">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
            {labels.overallLabel}
          </p>
          <p className="num mt-3 font-display text-5xl leading-none text-ink">{overall}%</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-bone">
            <span
              className="block h-full rounded-full bg-pine transition-[width] duration-700"
              style={{ width: `${overall}%` }}
            />
          </div>
        </div>

        {blocks.map((block) => {
          const report = latestByBlock.get(block.id);
          return (
            <div key={block.id} className="rounded-sm border border-line bg-white p-5">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                {labels.blockNames[block.id]}
              </p>
              <p className="num mt-3 font-display text-4xl leading-none text-ink">
                {report ? `${report.progress}%` : '—'}
              </p>
              <p className="num mt-2 text-[0.6875rem] text-muted">
                {report ? formatIsoDate(report.month, locale, 'month') : ''}
              </p>
            </div>
          );
        })}
      </div>

      <div
        ref={railRef}
        data-rail-more={railMore ? 'true' : undefined}
        className="scroll-x -mx-1 mt-8 flex gap-1.5 px-1"
      >
        {(['all', 'a', 'b', 'c'] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={blockId === value}
            onClick={() => setBlockId(value)}
            className={cn(
              'inline-flex min-h-11 flex-none items-center rounded-xs border px-4 text-sm transition-colors',
              blockId === value
                ? 'border-ink bg-ink text-paper'
                : 'border-line bg-white text-ink-soft hover:border-ink/40',
            )}
          >
            {value === 'all' ? labels.filterAll : labels.blockNames[value]}
          </button>
        ))}
      </div>

      <ol className="mt-8 space-y-8">
        {visible.map((report) => (
          <li
            key={report.id}
            className="card grid overflow-hidden md:grid-cols-[minmax(0,20rem)_1fr]"
          >
            <div className="relative aspect-[3/2] md:aspect-auto md:min-h-[15rem]">
              <Image
                src={report.image.src}
                alt={report.image.alt}
                fill
                sizes="(min-width: 768px) 20rem, 100vw"
                quality={78}
                placeholder={report.image.blurDataURL ? 'blur' : 'empty'}
                blurDataURL={report.image.blurDataURL}
                className="object-cover"
              />
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
                    {labels.blockNames[report.blockId]}
                  </p>
                  <h2 className="mt-1.5 font-display text-2xl leading-none text-ink">
                    {formatIsoDate(report.month, locale, 'month')}
                  </h2>
                </div>
                <p className="num font-display text-3xl leading-none text-ink">{report.progress}%</p>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-bone">
                <span
                  className="block h-full rounded-full bg-pine"
                  style={{ width: `${report.progress}%` }}
                />
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    {labels.worksDone}
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {report.done.length === 0 && (
                      <li className="text-xs text-muted">—</li>
                    )}
                    {report.done.map((item) => (
                      <li key={item} className="flex gap-2 text-xs leading-relaxed text-ink-soft">
                        <span className="mt-1.5 size-1.5 flex-none rounded-full bg-ok" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    {labels.nextWorks}
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    <li className="flex gap-2 text-xs leading-relaxed text-ink-soft">
                      <span className="mt-1.5 size-1.5 flex-none rounded-full bg-clay" aria-hidden="true" />
                      {report.current}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
