/**
 * Shared key for the request header the middleware sets on every locale-prefixed
 * request: the locale derived from the pathname.
 *
 * The 404 boundary (`app/[locale]/not-found.tsx`) is rendered without route
 * params, so this header is how it learns whether the visitor is on `/ru`, `/kz`
 * or `/en` and localises itself from the actual path instead of falling back to
 * Russian. It lives in its own module so the header name is defined once and the
 * page does not have to import the middleware itself.
 */
export const LOCALE_HEADER = 'x-zhk-locale';
