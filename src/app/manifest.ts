import type { MetadataRoute } from 'next';
import { PROJECT } from '@/data/project';

/**
 * Web app manifest.
 *
 * The site is a marketing and sales surface, not an app, so the manifest stays
 * minimal: correct name, brand colour and icons so an "Add to Home Screen"
 * action produces something that looks intentional.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${PROJECT.name} — ${PROJECT.city}`,
    short_name: PROJECT.shortName,
    // Kept language-neutral on purpose: a manifest is read by the OS, not by a
    // visitor, and there is no locale signal available in this route.
    description: `${PROJECT.name} — ${PROJECT.city}, ${PROJECT.district}`,
    start_url: '/',
    display: 'standalone',
    background_color: '#fbfaf7',
    theme_color: '#1f3d33',
    lang: 'ru',
    dir: 'ltr',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
