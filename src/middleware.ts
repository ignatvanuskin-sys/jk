import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale, type Locale } from '@/i18n/config';

/**
 * Locale routing.
 *
 * Every page lives under /ru, /kz or /en so each language has its own URL —
 * required for hreflang, for indexability and for WhatsApp/Telegram previews
 * (a client-side language toggle would break all three).
 *
 * This middleware:
 *   • redirects `/` (and any un-prefixed path) to a locale-prefixed URL,
 *   • picks the locale from the visitor's Accept-Language,
 *   • remembers an explicit choice in a cookie.
 *
 * It never runs for static assets, the API route, or metadata files.
 */

const COOKIE = 'zhk_locale';

function pickLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(COOKIE)?.value;
  if (cookie && (locales as readonly string[]).includes(cookie)) return cookie as Locale;

  const header = request.headers.get('accept-language') ?? '';
  const preferred = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=');
      return { tag: tag.trim().toLowerCase(), q: q ? Number(q) : 1 };
    })
    .filter((entry) => entry.tag)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferred) {
    // Kazakh is `kk`; accept both `kk` and the informal `kz`.
    if (tag.startsWith('kk') || tag.startsWith('kz')) return 'kz';
    if (tag.startsWith('ru')) return 'ru';
    if (tag.startsWith('en')) return 'en';
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${pickLocale(request)}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: [
    // Everything except Next internals, the API, static files and metadata routes.
    '/((?!_next/|api/|images/|icon|apple-icon|favicon|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|.*\\.[a-zA-Z0-9]+$).*)',
  ],
};
