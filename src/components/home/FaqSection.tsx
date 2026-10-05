import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ru';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion } from '@/components/ui/Accordion';
import { LeadButton } from '@/components/forms/LeadButton';

/**
 * FAQ — objection handling, in the buyer's own words.
 *
 * Six questions on the home page (the rest live on /faq) and a direct route to
 * a human underneath, because the visitor who reaches the end of an FAQ is the
 * one who still has a question and needs to ask it.
 */
export function FaqSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const items = dict.faq.items.slice(0, 6);

  return (
    <section className="section bg-bone" id="faq">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow={dict.faq.eyebrow} title={dict.faq.title} lead={dict.faq.lead} />

            <div className="mt-8 flex flex-wrap gap-4">
              <LeadButton source="faq" variant="primary">
                {dict.cta.askAboutComplex}
              </LeadButton>
              <Link
                href={`/${locale}/faq`}
                className="inline-flex items-center gap-2 border-b border-line pb-1 text-sm text-ink transition-colors hover:border-clay hover:text-clay"
              >
                {dict.common.viewAll}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}
