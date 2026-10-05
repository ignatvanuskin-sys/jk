import { notFound } from 'next/navigation';

/**
 * Catch-all for a path that does not exist inside a locale.
 *
 * Why this file has to exist: without it `/ru/anything` matches no route at all,
 * so Next falls back to its built-in 404 — an unstyled black page, in English,
 * with no header, no footer and no way back. Meanwhile `/ru/apartments/unknown`
 * DID show the localised 404, because that page calls `notFound()` itself. Two
 * different 404s for the same mistake is worse than either one alone.
 *
 * Routing the miss through the locale segment means the not-found boundary in
 * `[locale]/not-found.tsx` handles every miss: correct language, real
 * navigation, links to the catalogue and to the other two locales.
 */
export default function CatchAll() {
  notFound();
}
