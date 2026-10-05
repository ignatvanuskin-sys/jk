import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { PRIVACY_SECTIONS, PRIVACY_UPDATED_AT } from '@/content/privacy';
import { PROJECT, CONTACTS } from '@/data/project';
import { getSeoCopy } from '@/content/seo';
import { breadcrumbSchema, buildMetadata, fillSeoTokens } from '@/lib/seo';

import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { DemoNotice } from '@/components/ui/DemoNotice';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const copy = getSeoCopy('privacy', raw);
  return buildMetadata({
    locale: raw,
    title: fillSeoTokens(copy.title, raw),
    description: fillSeoTokens(copy.description, raw),
    path: 'privacy',
    noindex: false,
  });
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const trail = [
    { name: dict.nav.home, path: '' },
    { name: dict.footer.privacy, path: 'privacy' },
  ];

  return (
    <>
      <JsonLd id="ld-breadcrumb" data={breadcrumbSchema(locale, trail)} />

      <PageHero
        locale={locale}
        eyebrow={dict.footer.legalTitle}
        title={dict.footer.privacy}
        lead={dict.documents.types.privacy}
        breadcrumbLabel={dict.nav.breadcrumb}
        trail={trail}
        meta={[{ label: dict.common.updated, value: PRIVACY_UPDATED_AT }]}
      />

      <section className="section bg-paper">
        <div className="shell-narrow">
          <DemoNotice label={dict.common.demoData} tone="clay">
            {PRIVACY_SECTIONS[PRIVACY_SECTIONS.length - 1].body[locale][1]}
          </DemoNotice>

          <div className="mt-12 space-y-10">
            {PRIVACY_SECTIONS.map((section, index) => (
              <article key={section.title[locale]} className="border-t border-line pt-8">
                <h2 className="font-display text-2xl text-ink">
                  <span className="num mr-3 text-clay">{String(index + 1).padStart(2, '0')}</span>
                  {section.title[locale]}
                </h2>
                {section.body[locale].map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="mt-4 max-w-[72ch] text-[0.9375rem] leading-relaxed text-ink-soft"
                  >
                    {paragraph}
                  </p>
                ))}
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-sm border border-line bg-bone p-6">
            <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
              {dict.contacts.requisitesTitle}
            </h2>
            <p className="num mt-3 text-sm text-ink-soft">
              {PROJECT.developerLegalName} · БИН {PROJECT.developerBin}
            </p>
            <p className="mt-2 text-sm">
              <a
                href={CONTACTS.emailHref}
                className="text-ink underline decoration-line underline-offset-4 transition-colors hover:text-clay"
              >
                {CONTACTS.email}
              </a>
            </p>
            <p className="num mt-2 text-sm text-ink-soft">{CONTACTS.phoneDisplay}</p>
          </div>
        </div>
      </section>
    </>
  );
}
