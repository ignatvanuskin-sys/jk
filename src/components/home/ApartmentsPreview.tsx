import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ru';
import { APARTMENTS, INVENTORY_STATS } from '@/data/apartments';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ApartmentCard } from '@/components/apartments/ApartmentCard';
import { buildApartmentCardLabels } from '@/components/apartments/labels';

/**
 * Catalogue preview on the home page.
 *
 * Shows the three cheapest *available* units rather than a curated "hero
 * apartment" — the first screen of the catalogue should never show a sold unit,
 * and the lowest price is what pulls a hesitant buyer into the catalogue.
 */
export function ApartmentsPreview({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const labels = buildApartmentCardLabels(locale, dict);

  const cheapest = APARTMENTS.filter((unit) => unit.status === 'available')
    .sort((a, b) => a.price - b.price)
    .slice(0, 3);

  return (
    <section className="section bg-paper" id="apartments">
      <div className="shell">
        <SectionHeading
          eyebrow={dict.apartments.eyebrow}
          title={dict.apartments.title}
          lead={dict.apartments.lead}
          aside={
            <dl className="flex gap-8">
              <div>
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {dict.common.inProgress}
                </dt>
                <dd className="num mt-1.5 font-display text-3xl leading-none text-ink">
                  {INVENTORY_STATS.available}
                </dd>
              </div>
              <div>
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {dict.apartments.filters.stateProgram}
                </dt>
                <dd className="num mt-1.5 font-display text-3xl leading-none text-ink">
                  {INVENTORY_STATS.stateProgramUnits}
                </dd>
              </div>
            </dl>
          }
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cheapest.map((unit) => (
            <li key={unit.id}>
              <ApartmentCard
                unit={unit}
                locale={locale}
                labels={labels}
                floorLabels={dict.floorplans.roomLabels}
              />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link href={`/${locale}/apartments`} className="btn btn-primary px-7 py-4">
            {dict.cta.chooseApartment}
          </Link>
          <Link
            href={`/${locale}/floorplans`}
            className="inline-flex items-center gap-2 border-b border-line pb-1 text-sm text-ink transition-colors hover:border-clay hover:text-clay"
          >
            {dict.cta.viewFloorplans}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
