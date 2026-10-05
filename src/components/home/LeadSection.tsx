import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ru';
import { CONTACTS, PROJECT } from '@/data/project';
import { LeadForm } from '@/components/forms/LeadForm';
import { buildLeadLabels } from '@/components/forms/labels';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Final conversion block.
 *
 * Form on the left, contacts on the right — the two ways a Kazakhstani buyer
 * actually gets in touch. The form is the same component used in the modal, so
 * validation, consent and success handling can never diverge between the two.
 */
export function LeadSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const labels = buildLeadLabels(locale, dict);

  return (
    <section className="section bg-paper" id="lead">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <div className="card overflow-hidden">
              <LeadForm
                locale={locale}
                labels={labels}
                source="home-lead-section"
                showHeading
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow={dict.contacts.eyebrow}
              title={dict.contacts.title}
              lead={dict.contacts.lead}
            />

            <dl className="mt-8 divide-y divide-line border-y border-line">
              <div className="py-4">
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {dict.contacts.phoneLabel}
                </dt>
                <dd className="mt-2">
                  <a
                    href={CONTACTS.phoneHref}
                    className="num font-display text-2xl text-ink transition-colors hover:text-clay"
                  >
                    {CONTACTS.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div className="py-4">
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  WhatsApp
                </dt>
                <dd className="mt-2">
                  <a
                    href={labels.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.9375rem] text-ink transition-colors hover:text-clay"
                  >
                    {dict.cta.whatsapp}
                    <span className="sr-only"> ({dict.a11y.externalLink})</span>
                  </a>
                </dd>
              </div>
              <div className="py-4">
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {dict.contacts.addressLabel}
                </dt>
                <dd className="mt-2 text-[0.9375rem] text-ink">{dict.location.addressValue}</dd>
              </div>
              <div className="py-4">
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {dict.contacts.hoursLabel}
                </dt>
                <dd className="mt-2 text-[0.9375rem] text-ink">{CONTACTS.office.hours[locale]}</dd>
              </div>
            </dl>

            <p className="mt-6 text-xs leading-relaxed text-muted">
              {PROJECT.name} · {PROJECT.developerLegalName}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
