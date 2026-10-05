import type { Metadata } from 'next';
import { locales, htmlLang, xDefaultLocale, formatPriceCompact, type Locale } from '@/i18n/config';
import { PROJECT, CONTACTS } from '@/data/project';
import { INVENTORY_STATS } from '@/data/apartments';
import { getImage } from '@/data/media';

/**
 * Replaces `{price}` and `{available}` in SEO copy with live inventory figures,
 * so a description can never advertise a price the catalogue no longer offers.
 */
export function fillSeoTokens(text: string, locale: Locale): string {
  return text
    .replace('{price}', formatPriceCompact(INVENTORY_STATS.minAvailablePrice, locale))
    .replace('{available}', String(INVENTORY_STATS.available));
}

/**
 * Canonical origin, resolved in three steps.
 *
 * 1. `NEXT_PUBLIC_SITE_URL` — the explicit setting, used whenever it is present.
 * 2. Vercel's own build-time variables. Vercel injects the deployment's domain,
 *    so a deployment is self-describing even when nobody remembered to set the
 *    variable. Without this step a live deployment advertised
 *    `https://example.com` as the canonical of every page, put that domain in
 *    `robots.txt` and in all 690 sitemap URLs, and pointed Open Graph previews
 *    at an image that does not exist — the site was effectively unindexable.
 * 3. `example.com`, which IANA reserves permanently for documentation. It stays
 *    the last resort so a bare clone never points search engines at a real
 *    domain the developer does not own.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/+$/, '')}`;

  return 'https://example.com';
}

export function localePath(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+/, '');
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

interface PageMetadataInput {
  locale: Locale;
  /** Full page title. The layout template appends nothing — titles are authored whole. */
  title: string;
  description: string;
  /** Path *without* the locale prefix, e.g. `apartments` or `apartments/a-03-2`. */
  path?: string;
  /** Media key for the share image. */
  ogImage?: Parameters<typeof getImage>[0];
  /** Set for pages that should stay out of the index (e.g. filtered catalogue slices). */
  noindex?: boolean;
}

/**
 * Builds page metadata with:
 *   • a canonical URL,
 *   • reciprocal hreflang for ru / kz / en plus x-default,
 *   • Open Graph and Twitter cards with an absolute image URL.
 *
 * WhatsApp and Telegram are the main sharing channels in Kazakhstan, so the OG
 * block is treated as a first-class requirement rather than an afterthought.
 */
export function buildMetadata({
  locale,
  title,
  description,
  path = '',
  ogImage = 'og-cover',
  noindex = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(localePath(locale, path));
  const image = getImage(ogImage);

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[htmlLang[l]] = absoluteUrl(localePath(l, path));
  }
  languages['x-default'] = absoluteUrl(localePath(xDefaultLocale, path));

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: 'website',
      siteName: PROJECT.name,
      title,
      description,
      url,
      locale: htmlLang[locale].replace('-', '_'),
      images: [
        {
          url: absoluteUrl(image.src),
          width: image.width,
          height: image.height,
          alt: image.alt[locale],
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl(image.src)],
    },
  };
}

/* ── JSON-LD builders ─────────────────────────────────────────────────────── */

/**
 * Structured data. Types follow the recommendation from the research:
 * Organization (developer) + LocalBusiness (sales office) + ApartmentComplex
 * (the development) + RealEstateListing / Offer (units) + BreadcrumbList + FAQPage.
 *
 * NOTE: no `geo` coordinates and no `streetAddress` are published, because the
 * address in this template is a placeholder. Publishing invented
 * coordinates in structured data would be a factual claim we cannot support.
 */
export function organizationSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${getSiteUrl()}/#organization`,
    name: PROJECT.developerBrand,
    legalName: PROJECT.developerLegalName,
    url: absoluteUrl(localePath(locale)),
    logo: absoluteUrl('/icon.svg'),
    areaServed: { '@type': 'Country', name: 'Kazakhstan' },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: CONTACTS.phoneDisplay,
        email: CONTACTS.email,
        availableLanguage: ['ru', 'kk', 'en'],
      },
    ],
  };
}

export function apartmentComplexSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ApartmentComplex',
    '@id': `${getSiteUrl()}/#complex`,
    name: PROJECT.name,
    url: absoluteUrl(localePath(locale)),
    description: `${PROJECT.name} — ${PROJECT.totalUnits} apartments in ${PROJECT.city}. Handover ${PROJECT.delivery.en}.`,
    numberOfAccommodationUnits: PROJECT.totalUnits,
    numberOfAvailableAccommodationUnits: undefined,
    petsAllowed: true,
    address: {
      '@type': 'PostalAddress',
      addressLocality: PROJECT.city,
      addressRegion: PROJECT.district,
      addressCountry: 'KZ',
    },
    amenityFeature: [
      'Car-free courtyard',
      'Underground heated parking',
      'Playgrounds',
      'Outdoor sports zone',
      '24/7 CCTV and security',
      'Ground-floor commercial units',
    ].map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
    provider: { '@id': `${getSiteUrl()}/#organization` },
  };
}

export function localBusinessSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${getSiteUrl()}/#sales-office`,
    name: `${PROJECT.name} — sales office`,
    parentOrganization: { '@id': `${getSiteUrl()}/#organization` },
    url: absoluteUrl(localePath(locale, 'contacts')),
    telephone: CONTACTS.phoneDisplay,
    email: CONTACTS.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: PROJECT.city,
      addressRegion: PROJECT.district,
      addressCountry: 'KZ',
    },
    openingHours: 'Mo-Sa 09:00-19:00, Su 10:00-17:00',
    areaServed: { '@type': 'City', name: PROJECT.city },
  };
}

export function breadcrumbSchema(
  locale: Locale,
  trail: { name: string; path: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localePath(locale, item.path)),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/** Offer for a single unit — status maps to schema availability. */
export function offerSchema(
  locale: Locale,
  unit: { number: string; price: number; status: 'available' | 'reserved' | 'sold'; id: string },
) {
  const availability =
    unit.status === 'available'
      ? 'https://schema.org/InStock'
      : unit.status === 'reserved'
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/SoldOut';

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: `${PROJECT.name} — apartment ${unit.number}`,
    url: absoluteUrl(localePath(locale, `apartments/${unit.id}`)),
    mainEntity: {
      '@type': 'Offer',
      price: unit.price,
      priceCurrency: 'KZT',
      availability,
      seller: { '@id': `${getSiteUrl()}/#organization` },
    },
  };
}
