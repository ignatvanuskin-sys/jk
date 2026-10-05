import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ru';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MortgageCalculator } from '@/components/mortgage/MortgageCalculator';
import { buildCalcPrograms, CALCULATOR_DEFAULTS } from '@/components/mortgage/programs';
import { buildMortgageLabels } from '@/components/apartments/labels';

/**
 * Financing block.
 *
 * The calculator is the highest-intent tool on the page: someone who moves the
 * sliders is already modelling their own purchase. It sits after "ways to buy"
 * so the programme context is already established, and the disclaimer is inside
 * the result panel rather than buried in the footer.
 */
export function MortgageSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="section bg-bone" id="mortgage">
      <div className="shell">
        <SectionHeading
          eyebrow={dict.mortgage.eyebrow}
          title={dict.mortgage.title}
          lead={dict.mortgage.lead}
          aside={
            <Link href={`/${locale}/mortgage`} className="btn btn-outline">
              {dict.common.openSection}
            </Link>
          }
        />

        <div className="mt-12">
          <MortgageCalculator
            programs={buildCalcPrograms(locale)}
            labels={buildMortgageLabels(dict)}
            locale={locale}
            defaults={CALCULATOR_DEFAULTS}
          />
        </div>
      </div>
    </section>
  );
}
