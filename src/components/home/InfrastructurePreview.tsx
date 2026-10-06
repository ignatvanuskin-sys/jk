import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ru';
import {
  INFRA_CAPTION,
  INFRA_CATEGORIES,
  INFRASTRUCTURE,
  formatInfraDistance,
  type InfraCategory,
} from '@/data/infrastructure';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InfraMap, type MapObject } from '@/components/infrastructure/InfraMap';

/**
 * Neighbourhood.
 *
 * The map is the interactive piece; the list next to it is the accessible
 * content. Category chips let a buyer filter to what they actually care about
 * (schools, or clinics, or grocery) instead of reading 25 rows.
 */
export function InfrastructurePreview({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const objects: MapObject[] = INFRASTRUCTURE.map((object) => ({
    id: object.id,
    category: object.category,
    label: object.label[locale],
    value: formatInfraDistance(object, locale),
    minutes: object.minutes,
    mode: object.mode,
  }));

  return (
    <section className="section bg-paper" id="infrastructure">
      <div className="shell">
        <SectionHeading
          eyebrow={dict.infrastructure.eyebrow}
          title={dict.infrastructure.title}
          lead={dict.infrastructure.lead}
          aside={
            <Link href={`/${locale}/infrastructure`} className="btn btn-outline">
              {dict.common.openSection}
            </Link>
          }
        />

        <div className="mt-12">
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

        <p className="mt-4 text-xs text-muted">{INFRA_CAPTION[locale]}</p>
      </div>
    </section>
  );
}
