import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { buildWhatsAppHref } from '@/lib/contacts';
import { buildMetadata, faqSchema, fillSeoTokens } from '@/lib/seo';
import { getSeoCopy } from '@/content/seo';

import { JsonLd } from '@/components/seo/JsonLd';
import { Hero } from '@/components/home/Hero';
import { AboutComplex } from '@/components/home/AboutComplex';
import { Benefits } from '@/components/home/Benefits';
import { ApartmentsPreview } from '@/components/home/ApartmentsPreview';
import { FloorPlansPreview } from '@/components/home/FloorPlansPreview';
import { ArchitectureSection } from '@/components/home/ArchitectureSection';
import { CourtyardSection } from '@/components/home/CourtyardSection';
import { InfrastructurePreview } from '@/components/home/InfrastructurePreview';
import { LocationSection } from '@/components/home/LocationSection';
import { PurchaseSection } from '@/components/home/PurchaseSection';
import { MortgageSection } from '@/components/home/MortgageSection';
import { ConstructionPreview } from '@/components/home/ConstructionPreview';
import { DeveloperSection } from '@/components/home/DeveloperSection';
import { DocumentsPreview } from '@/components/home/DocumentsPreview';
import { FaqSection } from '@/components/home/FaqSection';
import { LeadSection } from '@/components/home/LeadSection';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const copy = getSeoCopy('home', raw);
  return buildMetadata({
    locale: raw,
    title: fillSeoTokens(copy.title, raw),
    description: fillSeoTokens(copy.description, raw),
    path: '',
  });
}

/**
 * Home page.
 *
 * The section order follows the conversion path rather than a list of features:
 * hook (hero) → substance (about, benefits) → product (apartments, plans,
 * architecture, courtyard) → place (infrastructure, location) → money
 * (purchase, calculator) → proof (construction, developer, documents) →
 * objections (FAQ) → ask (lead form).
 */
export default async function HomePage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const whatsappHref = buildWhatsAppHref(locale);

  return (
    <>
      <JsonLd id={`ld-faq-${locale}`} data={faqSchema(dict.faq.items)} />

      <Hero locale={locale} dict={dict} whatsappHref={whatsappHref} />
      <AboutComplex locale={locale} dict={dict} />
      <Benefits dict={dict} />
      <ApartmentsPreview locale={locale} dict={dict} />
      <FloorPlansPreview locale={locale} dict={dict} />
      <ArchitectureSection locale={locale} dict={dict} />
      <CourtyardSection locale={locale} dict={dict} />
      <InfrastructurePreview locale={locale} dict={dict} />
      <LocationSection locale={locale} dict={dict} />
      <PurchaseSection dict={dict} />
      <MortgageSection locale={locale} dict={dict} />
      <ConstructionPreview locale={locale} dict={dict} />
      <DeveloperSection locale={locale} dict={dict} />
      <DocumentsPreview locale={locale} dict={dict} />
      <FaqSection locale={locale} dict={dict} />
      <LeadSection locale={locale} dict={dict} />
    </>
  );
}
