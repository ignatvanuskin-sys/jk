import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { CONTACTS } from '@/data/project';
import { DEVELOPER } from '@/data/developer';
import { PROJECT_DOCUMENTS } from '@/data/documents';
import { getSeoCopy } from '@/content/seo';
import { formatIsoDate } from '@/lib/i18n/date';
import { breadcrumbSchema, buildMetadata, fillSeoTokens } from '@/lib/seo';

import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { DeveloperSection } from '@/components/home/DeveloperSection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { LeadButton } from '@/components/forms/LeadButton';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const copy = getSeoCopy('developer', raw);
  return buildMetadata({
    locale: raw,
    title: fillSeoTokens(copy.title, raw),
    description: fillSeoTokens(copy.description, raw),
    path: 'developer',
    ogImage: 'lobby',
  });
}

export default async function DeveloperPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const trail = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.developer, path: 'developer' },
  ];

  return (
    <>
      <JsonLd id="ld-breadcrumb" data={breadcrumbSchema(locale, trail)} />

      <PageHero
        locale={locale}
        eyebrow={dict.developer.eyebrow}
        title={dict.developer.title}
        lead={dict.developer.lead}
        breadcrumbLabel={dict.nav.breadcrumb}
        trail={trail}
        image="lobby"
        meta={[
          { label: dict.developer.factsTitle, value: DEVELOPER.brand },
          { label: dict.contacts.emailLabel, value: CONTACTS.email },
        ]}
      />

      <DeveloperSection locale={locale} dict={dict} />

      {PROJECT_DOCUMENTS.length > 0 && (
      <section className="section bg-paper">
        <div className="shell grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <SectionHeading
            eyebrow={dict.documents.eyebrow}
            title={dict.documents.title}
            lead={dict.documents.lead}
            aside={
              <LeadButton source="developer-documents" variant="primary">
                {dict.cta.requestDocuments}
              </LeadButton>
            }
          />
          <ul className="divide-y divide-line border-y border-line">
            {PROJECT_DOCUMENTS.map((document) => (
              <li key={document.id} className="flex flex-wrap items-baseline justify-between gap-4 py-4">
                <span className="text-[0.9375rem] text-ink">
                  {dict.documents.types[document.typeKey]}
                </span>
                <span className="num text-xs text-muted">{formatIsoDate(document.updatedAt, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      )}
    </>
  );
}
