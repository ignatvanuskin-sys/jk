import type { MetadataRoute } from 'next';

import { locales, htmlLang, xDefaultLocale } from '@/i18n/config';
import { APARTMENTS } from '@/data/apartments';
import { absoluteUrl, localePath } from '@/lib/seo';

/**
 * XML sitemap.
 *
 * Every page exists once per language, and each entry carries reciprocal
 * `alternates.languages` so the hreflang graph in the sitemap matches the one
 * in each page's <head>. Individual apartment pages are listed with a lower
 * priority — they matter for long-tail search, not for the home page.
 */
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: 'apartments', priority: 0.9, changeFrequency: 'daily' },
  { path: 'floorplans', priority: 0.8, changeFrequency: 'weekly' },
  { path: 'complex', priority: 0.8, changeFrequency: 'monthly' },
  { path: 'infrastructure', priority: 0.7, changeFrequency: 'monthly' },
  { path: 'location', priority: 0.7, changeFrequency: 'monthly' },
  { path: 'construction', priority: 0.8, changeFrequency: 'weekly' },
  { path: 'developer', priority: 0.6, changeFrequency: 'monthly' },
  { path: 'mortgage', priority: 0.7, changeFrequency: 'monthly' },
  { path: 'commercial', priority: 0.5, changeFrequency: 'monthly' },
  { path: 'parking', priority: 0.5, changeFrequency: 'monthly' },
  { path: 'documents', priority: 0.6, changeFrequency: 'monthly' },
  { path: 'faq', priority: 0.6, changeFrequency: 'monthly' },
  { path: 'contacts', priority: 0.7, changeFrequency: 'monthly' },
  { path: 'privacy', priority: 0.2, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  function alternatesFor(path: string) {
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      languages[htmlLang[locale]] = absoluteUrl(localePath(locale, path));
    }
    languages['x-default'] = absoluteUrl(localePath(xDefaultLocale, path));
    return { languages };
  }

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    STATIC_ROUTES.map((route) => ({
      url: absoluteUrl(localePath(locale, route.path)),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: alternatesFor(route.path),
    })),
  );

  const unitEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    APARTMENTS.map((unit) => ({
      url: absoluteUrl(localePath(locale, `apartments/${unit.id}`)),
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: unit.status === 'available' ? 0.6 : 0.3,
      alternates: alternatesFor(`apartments/${unit.id}`),
    })),
  );

  return [...staticEntries, ...unitEntries];
}
