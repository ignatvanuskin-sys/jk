import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { getSeoCopy } from '@/content/seo';
import { breadcrumbSchema, buildMetadata, faqSchema, fillSeoTokens } from '@/lib/seo';

import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { Accordion } from '@/components/ui/Accordion';
import { LeadButton } from '@/components/forms/LeadButton';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const copy = getSeoCopy('faq', raw);
  return buildMetadata({
    locale: raw,
    title: fillSeoTokens(copy.title, raw),
    description: fillSeoTokens(copy.description, raw),
    path: 'faq',
  });
}

/**
 * FAQ page.
 *
 * The FAQPage structured data is emitted ONLY here and on the home page, where
 * the questions are actually visible — marking up questions a visitor cannot
 * see is a structured-data violation, not an SEO win.
 */
export default async function FaqPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const trail = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.faq, path: 'faq' },
  ];

  return (
    <>
      <JsonLd id="ld-breadcrumb" data={breadcrumbSchema(locale, trail)} />
      <JsonLd id="ld-faq" data={faqSchema(dict.faq.items)} />

      <PageHero
        locale={locale}
        eyebrow={dict.faq.eyebrow}
        title={dict.faq.title}
        lead={dict.faq.lead}
        breadcrumbLabel={dict.nav.breadcrumb}
        trail={trail}
        meta={[{ label: dict.faq.eyebrow, value: String(dict.faq.items.length) }]}
      />

      <section className="section bg-paper">
        <div className="shell grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <Accordion items={dict.faq.items} />

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-sm border border-line bg-bone p-6">
              <h2 className="font-display text-2xl text-ink">{dict.form.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{dict.form.lead}</p>
              <LeadButton source="faq-page" variant="primary" className="mt-6 w-full">
                {dict.cta.getConsultation}
              </LeadButton>
              <p className="mt-4 text-xs text-muted">{dict.form.guaranteed}</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
