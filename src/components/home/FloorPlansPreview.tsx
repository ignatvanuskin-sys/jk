import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ru';
import { formatArea, formatPrice } from '@/i18n/config';
import { PLAN_SUMMARIES } from '@/data/plan-summaries';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FloorPlanSvg } from '@/components/floorplans/FloorPlanSvg';
import { LeadButton } from '@/components/forms/LeadButton';

/**
 * Floor-plan preview.
 *
 * One plan per room count, so the section answers "what does a 2-room look
 * like here" immediately instead of making the visitor hunt through a gallery.
 */
export function FloorPlansPreview({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const picks = [1, 2, 3, 4]
    .map((rooms) => PLAN_SUMMARIES.find((plan) => plan.rooms === rooms))
    .filter((plan): plan is NonNullable<typeof plan> => Boolean(plan));

  return (
    <section className="section bg-bone" id="floorplans">
      <div className="shell">
        <SectionHeading
          eyebrow={dict.floorplans.eyebrow}
          title={dict.floorplans.title}
          lead={dict.floorplans.lead}
          aside={
            <Link href={`/${locale}/floorplans`} className="btn btn-outline">
              {dict.cta.viewFloorplans}
            </Link>
          }
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {picks.map((plan) => (
            <li key={plan.id}>
              <Link
                href={`/${locale}/floorplans#${plan.id}`}
                className="card card-hover flex h-full flex-col overflow-hidden"
              >
                <div className="relative aspect-[4/3] border-b border-line-soft bg-paper/70">
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <FloorPlanSvg
                      plan={plan}
                      roomLabels={dict.floorplans.roomLabels}
                      variant="thumb"
                      className="max-h-full"
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl leading-tight text-ink">
                    {plan.rooms}-{dict.floorplans.room}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted">{plan.name[locale]}</p>
                  <p className="num mt-4 font-display text-xl leading-none text-ink">
                    {formatArea(plan.totalArea, locale)}
                  </p>
                  <p className="num mt-2 text-xs text-ink-soft">
                    {dict.floorplans.priceFrom} {formatPrice(plan.priceFrom, locale)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <LeadButton source="floorplans-preview" variant="primary" className="px-7 py-4">
            {dict.cta.getPlanPdf}
          </LeadButton>
          <p className="text-xs text-muted">{dict.floorplans.modal.hint}</p>
        </div>
      </div>
    </section>
  );
}
