import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Cormorant, Inter } from 'next/font/google';

import '../globals.css';

import { locales, isLocale, htmlLang, defaultLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { CONTACTS, PROJECT } from '@/data/project';
import { buildWhatsAppHref } from '@/lib/contacts';
import {
  absoluteUrl,
  apartmentComplexSchema,
  getSiteUrl,
  localBusinessSchema,
  localePath,
  organizationSchema,
} from '@/lib/seo';

import { JsonLd } from '@/components/seo/JsonLd';
import { LeadProvider } from '@/components/forms/LeadProvider';
import { buildLeadLabels } from '@/components/forms/labels';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileActionBar } from '@/components/layout/MobileActionBar';

/**
 * Typography: two families, both with Cyrillic + Cyrillic-extended subsets,
 * because Kazakh uses ә, ғ, қ, ң, ө, ұ, ү, һ, і — a font without the extended
 * Cyrillic range would render those as tofu on every KZ page.
 *
 * Inter carries the interface and every number (tabular figures).
 * Cormorant carries headlines and large numerals only, never body copy.
 * Both are self-hosted by next/font — no third-party font request at runtime.
 */
const inter = Inter({
  subsets: ['cyrillic', 'cyrillic-ext', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant({
  subsets: ['cyrillic', 'cyrillic-ext', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fbfaf7',
  colorScheme: 'light',
  // Let the layout extend under the notch / home indicator so the mobile
  // action bar can sit flush against the bottom with its own safe-area padding.
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: PROJECT.name,
  authors: [{ name: PROJECT.developerBrand }],
  creator: PROJECT.developerBrand,
  publisher: PROJECT.developerBrand,
  formatDetection: { telephone: true, address: false, email: true },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon.svg' }],
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  // The top row carries the five sections a buyer actually shops by. Everything
  // else — including "About the complex" — lives behind the "More" menu: at six
  // top-level items the row no longer fits the fixed 82rem shell, and the phone
  // number and CTA were being pushed past the right edge.
  const navItems = [
    { href: '/apartments', label: dict.nav.apartments },
    { href: '/floorplans', label: dict.nav.floorplans },
    { href: '/infrastructure', label: dict.nav.infrastructure },
    { href: '/location', label: dict.nav.location },
    { href: '/construction', label: dict.nav.construction },
  ];

  const moreItems = [
    { href: '/complex', label: dict.nav.complex },
    { href: '/mortgage', label: dict.nav.mortgage },
    { href: '/commercial', label: dict.nav.commercial },
    { href: '/parking', label: dict.nav.parking },
    { href: '/documents', label: dict.nav.documents },
    { href: '/faq', label: dict.nav.faq },
    { href: '/contacts', label: dict.nav.contacts },
  ];

  const whatsappHref = buildWhatsAppHref(locale);

  return (
    <html lang={htmlLang[locale]} className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-dvh bg-paper text-ink antialiased">
        {/* JSON-LD block ids are locale-qualified so no document can ever carry
            the same id twice (the audit found `ld-organization` repeated). */}
        <JsonLd id={`ld-organization-${locale}`} data={organizationSchema(locale)} />
        <JsonLd id={`ld-complex-${locale}`} data={apartmentComplexSchema(locale)} />
        <JsonLd id={`ld-office-${locale}`} data={localBusinessSchema(locale)} />

        <a
          href="#content"
          className="sr-only-focusable absolute left-4 top-4 z-[100] rounded-xs bg-ink px-4 py-2 text-sm text-paper focus:static focus:inline-block"
        >
          {dict.a11y.skipToContent}
        </a>

        <LeadProvider locale={locale} labels={buildLeadLabels(locale, dict)}>
          <Header
            locale={locale}
            labels={{
              brand: PROJECT.name,
              brandShort: PROJECT.shortName,
              navItems,
              moreItems,
              moreLabel: dict.nav.more,
              consult: dict.cta.getConsultation,
              phoneDisplay: CONTACTS.phoneDisplay,
              phoneHref: CONTACTS.phoneHref,
              whatsappHref,
              whatsappLabel: dict.cta.whatsapp,
              menu: dict.nav.mainMenu,
              openMenu: dict.nav.openMenu,
              closeMenu: dict.nav.closeMenu,
              switchLanguage: dict.nav.switchLanguage,
              allSections: dict.footer.navTitle,
              homeLabel: dict.nav.home,
            }}
          />

          {/* On phones the fixed bottom action bar is 59px tall. `main` carries
              the matching bottom padding (plus the safe-area inset) so the bar
              can never cover the last block of a page; it is dropped from `md`
              up, where the bar is hidden. */}
          <main
            id="content"
            className="pb-[calc(59px+env(safe-area-inset-bottom))] md:pb-0"
          >
            {children}
          </main>

          <Footer
            locale={locale}
            dict={dict}
            whatsappHref={whatsappHref}
            navItems={[...navItems, ...moreItems]}
          />

          <MobileActionBar
            labels={{
              call: dict.cta.call,
              whatsapp: dict.cta.whatsapp,
              choose: dict.cta.chooseApartment,
              select: dict.cta.selectFloor,
              navLabel: dict.nav.mobileMenu,
            }}
            phoneHref={CONTACTS.phoneHref}
            whatsappHref={whatsappHref}
            locale={locale}
          />
        </LeadProvider>
      </body>
    </html>
  );
}
