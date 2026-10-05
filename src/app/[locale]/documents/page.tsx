import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { DOCUMENTS_UPDATED_AT, PROJECT_DOCUMENTS } from '@/data/documents';
import { PROJECT } from '@/data/project';
import { getSeoCopy } from '@/content/seo';
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
      <JsonLd id="ld-breadcrumb" data={breadcrumbSchema(locale, trail)} />

      <PageHero
        locale={locale}
        eyebrow={dict.documents.eyebrow}
        title={dict.documents.title}
        lead={dict.documents.lead}
        breadcrumbLabel={dict.nav.breadcrumb}
        trail={trail}
        meta={[
          { label: dict.documents.status, value: `${published} / ${PROJECT_DOCUMENTS.length}` },
          { label: dict.common.updated, value: DOCUMENTS_UPDATED_AT },
          { label: dict.contacts.requisitesTitle, value: PROJECT.developerBin },
        ]}
      />

      <section className="section bg-paper">
        <div className="shell">
          <div className="divide-y divide-line border-y border-line">
            {PROJECT_DOCUMENTS.map((document) => (
              <details key={document.id} id={document.id} className="group scroll-mt-28">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 marker:hidden [&::-webkit-details-marker]:hidden">
                  <div className="flex items-start gap-4">
                    <span
                      className="mt-0.5 flex size-10 flex-none items-center justify-center rounded-xs border border-line text-ink-soft"
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
                        <path
                          d="M6 3h7l5 5v13H6z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <path d="M13 3v5h5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </span>
                    <div>
                      <h2 className="font-display text-2xl leading-tight text-ink">
                        {dict.documents.types[document.typeKey]}
                      </h2>
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                        <span
                          className={
                            document.status === 'published' ? 'text-ok' : 'text-warn'
                          }
                        >
                          {document.status === 'published'
                            ? dict.documents.statusProvided
                            : dict.documents.statusRequest}
                        </span>
                        <span className="num">
                          {dict.common.updated}: {document.updatedAt}
                        </span>
                      </p>
                    </div>
                  </div>
                  <span
                    className="mt-2 flex size-8 flex-none items-center justify-center rounded-full border border-line text-ink transition-transform duration-300 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" focusable="false">
                      <path
                        d="M12 5v14M5 12h14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </summary>

                <div className="grid gap-8 pb-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
                  <div>
                    <p className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-soft">
                      {document.summary[locale]}
                    </p>
                    <p className="mt-5 text-xs leading-relaxed text-muted">
                      {dict.documents.previewWarning}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
                      {dict.mortgage.disclaimerTitle}
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {document.verifiable.map((item) => (
                        <li
                          key={item[locale]}
                          className="flex gap-2.5 text-sm leading-relaxed text-ink-soft"
                        >
                          <span
                            className="mt-1.5 size-1.5 flex-none rounded-full bg-clay"
                            aria-hidden="true"
                          />
                          {item[locale]}
                        </li>
                      ))}
                    </ul>
                    <LeadButton
                      source={`document:${document.id}`}
                      subject={dict.documents.types[document.typeKey]}
                      variant="outline"
                      className="mt-6"
                    >
                      {dict.cta.requestDocuments}
                    </LeadButton>
                  </div>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 rounded-sm border border-line bg-bone p-6">
            <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
              {dict.footer.disclaimerTitle}
            </h2>
            <p className="mt-3 max-w-[80ch] text-sm leading-relaxed text-ink-soft">
              {dict.footer.disclaimer}
            </p>
            <p className="mt-4 text-xs text-muted">
              {PROJECT.developerLegalName} · БИН {PROJECT.developerBin}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
