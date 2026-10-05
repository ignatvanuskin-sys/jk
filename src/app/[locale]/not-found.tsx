import Link from 'next/link';
import { cookies } from 'next/headers';

import { locales, defaultLocale, isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';

/**
 * 404 inside the locale segment.
 *
 * The locale comes from the cookie the middleware sets, because Next does not
 * pass route params to a not-found boundary. That keeps the page in the
 * visitor's own language instead of dropping them into Russian.
 */
export default async function NotFound() {
  const store = await cookies();
  const cookieLocale = store.get('zhk_locale')?.value;
  const locale: Locale =
    cookieLocale && isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  const dict = getDictionary(locale);

  return (
    <section className="flex min-h-[80svh] items-center bg-bone">
      <div className="shell py-24">
        <p className="num font-display text-[5rem] leading-none text-clay sm:text-[7rem]">
          {dict.notFound.code}
        </p>
        <h1 className="mt-4 max-w-[22ch] text-[2.25rem] leading-[1.08] text-ink sm:text-[3rem]">
          {dict.notFound.title}
        </h1>
        <p className="mt-5 max-w-[56ch] text-[0.9375rem] leading-relaxed text-ink-soft">
          {dict.notFound.text}
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link href={`/${locale}/apartments`} className="btn btn-primary px-6 py-3.5">
            {dict.notFound.toApartments}
          </Link>
          <Link href={`/${locale}`} className="btn btn-outline px-6 py-3.5">
            {dict.notFound.toHome}
          </Link>
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {locales.map((target) => (
            <li key={target}>
              <Link
                href={`/${target}`}
                lang={target}
                className="text-ink-soft underline decoration-line underline-offset-4 transition-colors hover:text-clay"
              >
                {target.toUpperCase()}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
