import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { CONTACTS, PROJECT } from '@/data/project';
import { getMapHref } from '@/lib/contacts';
import { getSeoCopy } from '@/content/seo';
import { breadcrumbSchema, buildMetadata, fillSeoTokens } from '@/lib/seo';

import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { RouteAction } from '@/components/ui/RouteAction';
import { LeadForm } from '@/components/forms/LeadForm';
import { buildLeadLabels } from '@/components/forms/labels';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const copy = getSeoCopy('contacts', raw);
  return buildMetadata({
    locale: raw,
    title: fillSeoTokens(copy.title, raw),
    description: fillSeoTokens(copy.description, raw),
    path: 'contacts',
  });
}

export default async function ContactsPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const labels = buildLeadLabels(locale, dict);

  const trail = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.contacts, path: 'contacts' },
  ];

  return (
    <>
      <JsonLd id="ld-breadcrumb" data={breadcrumbSchema(locale, trail)} />

      <PageHero
        locale={locale}
        eyebrow={dict.contacts.eyebrow}
        title={dict.contacts.title}
        lead={dict.contacts.lead}
        breadcrumbLabel={dict.nav.breadcrumb}
        trail={trail}
      />

      <section className="section bg-paper">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <dl className="divide-y divide-line border-y border-line">
              <div className="py-5">
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {dict.contacts.phoneLabel}
                </dt>
                <dd className="mt-2 flex flex-wrap items-baseline gap-5">
                  <a
                    href={CONTACTS.phoneHref}
                    className="num font-display text-3xl text-ink transition-colors hover:text-clay"
                  >
                    {CONTACTS.phoneDisplay}
                  </a>
                  <a
                    href={labels.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink underline decoration-line underline-offset-4 transition-colors hover:text-clay"
                  >
                    {dict.cta.whatsapp}
                    <span className="sr-only"> ({dict.a11y.externalLink})</span>
                  </a>
                </dd>
              </div>

              <div className="py-5">
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {dict.contacts.emailLabel}
                </dt>
                <dd className="mt-2">
                  <a
                    href={CONTACTS.emailHref}
                    className="text-[0.9375rem] text-ink transition-colors hover:text-clay"
                  >
                    {CONTACTS.email}
                  </a>
                </dd>
              </div>

              <div className="py-5">
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {dict.contacts.addressLabel}
                </dt>
                <dd className="mt-2">
                  <p className="text-[0.9375rem] text-ink">{dict.location.addressValue}</p>
                  <p className="mt-1 text-xs text-muted">{dict.contacts.addressPlaceholder}</p>
                  <RouteAction
                    mapHref={getMapHref()}
                    address={dict.location.addressValue}
                    labels={{
                      route: dict.cta.buildRoute,
                      copy: dict.common.copy,
                      copied: dict.common.copied,
                      hint: dict.location.mapPlaceholder,
                      external: dict.a11y.externalLink,
                    }}
                    className="mt-4"
                  />
                </dd>
              </div>

              <div className="py-5">
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {dict.contacts.hoursLabel}
                </dt>
                <dd className="mt-2 num text-[0.9375rem] text-ink">
                  {CONTACTS.office.hours[locale]}
                </dd>
              </div>

              <div className="py-5">
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {dict.contacts.transportLabel}
                </dt>
                <dd className="mt-2 text-[0.9375rem] text-ink-soft">
                  {dict.contacts.transportText}
                </dd>
              </div>
            </dl>

            <div className="mt-8 rounded-sm border border-line bg-bone p-5">
              <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
                {dict.contacts.requisitesTitle}
              </h2>
              <p className="mt-3 text-sm text-ink-soft">{PROJECT.developerLegalName}</p>
              <p className="mt-2 text-xs text-muted">
                {dict.contacts.requisitesNote}{' '}
                <a href={CONTACTS.requestEmailHref} className="underline decoration-line underline-offset-4">
                  {CONTACTS.requestEmail}
                </a>
              </p>
            </div>

          </div>

          <div>
            <SectionHeading
              eyebrow={dict.contacts.visitTitle}
              title={dict.form.title}
              lead={dict.contacts.visitText}
            />
            <div className="card mt-8 overflow-hidden">
              <LeadForm
                locale={locale}
                labels={labels}
                source="contacts-page"
                showHeading={false}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
