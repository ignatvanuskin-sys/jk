import type { MetadataRoute } from 'next';
import { absoluteUrl, getSiteUrl } from '@/lib/seo';

/**
 * robots.txt.
 *
 * The API is closed to crawlers (it only accepts POST and always answers GET
 * with 405). Filter query strings are NOT blocked: the catalogue mirrors its
 * filters into the URL, and those slices are legitimate, shareable landing
 * pages for long-tail search.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: getSiteUrl(),
  };
}
