import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { DOCUMENTS_UPDATED_AT, PROJECT_DOCUMENTS } from '@/data/documents';
import { CONTACTS } from '@/data/project';
import { getSeoCopy } from '@/content/seo';
import { formatIsoDate } from '@/lib/i18n/date';
import { breadcrumbSchema, buildMetadata, fillSeoTokens } from '@/lib/seo';

import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { LeadButton } from '@/components/forms/LeadButton';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const copy = getSeoCopy('documents', raw);
  return buildMetadata({
    locale: raw,
    title: fillSeoTokens(copy.title, raw),
    description: fillSeoTokens(copy.description, raw),
    path: 'documents',
  });
}

/**
 * Documents.
 *
 * The dossier confirms no document pack for this project, so nothing is
 * published and the list stays empty: no fabricated permit, guarantee or
 * contract. When NAK supplies the real pack, entries appear here and the list
 * renders again.
 */
export default async function DocumentsPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const trail = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.documents, path: 'documents' },
  ];

  const published = PROJECT_DOCUMENTS.filter((d) => d.status === 'published').length;

  return (
    <>
      <JsonLd id={`ld-breadcrumb-${locale}`} data={breadcrumbSchema(locale, trail)} />

      <PageHero
        locale={locale}
        eyebrow={dict.documents.eyebrow}
        title={dict.documents.title}
        lead={dict.documents.lead}
        breadcrumbLabel={dict.nav.breadcrumb}
        trail={trail}
        meta={[
          { label: dict.documents.status, value: `${published} / ${PROJECT_DOCUMENTS.length}` },
          { label: dict.common.updated, value: formatIsoDate(DOCUMENTS_UPDATED_AT, locale) },
        ]}
      />

      <section className="section bg-paper">
        <div className="shell">
          {PROJECT_DOCUMENTS.length === 0 ? (
            <div className="card p-8">
              <h2 className="font-display text-2xl text-ink">{dict.documents.emptyTitle}</h2>
              <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-ink-soft">
                {dict.documents.emptyText}
              </p>
              <LeadButton source="documents-empty" variant="primary" className="mt-6">
                {dict.cta.requestDocuments}
              </LeadButton>
            </div>
          ) : (
            <div className="divide-y divide-line border-y border-line">
              {PROJECT_DOCUMENTS.map((document) => (
                <article key={document.id} id={document.id} className="scroll-mt-28 py-6">
                  <h2 className="font-display text-2xl leading-tight text-ink">
                    {dict.documents.types[document.typeKey]}
                  </h2>
                  <p className="mt-1.5 text-xs text-muted">
                    {document.status === 'published'
                      ? dict.documents.statusProvided
                      : dict.documents.statusRequest}
                    {' · '}
                    {dict.common.updated}: {formatIsoDate(document.updatedAt, locale)}
                  </p>
                  <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-soft">
                    {document.summary[locale]}
                  </p>
                </article>
              ))}
            </div>
          )}

          <div className="mt-12 rounded-sm border border-line bg-bone p-6">
            <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
              {dict.contacts.requisitesTitle}
            </h2>
            <p className="mt-3 text-sm text-ink-soft">
              {dict.contacts.requisitesNote}{' '}
              <a href={CONTACTS.requestEmailHref} className="underline decoration-line underline-offset-4">
                {CONTACTS.requestEmail}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
