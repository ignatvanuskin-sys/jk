'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { locales, localeLabel, localeName, type Locale } from '@/i18n/config';
import { cn } from '@/lib/cn';

/**
 * RU | KZ | EN switcher.
 *
 * Each language lives on its own URL, so switching is a plain link to the same
 * page under another locale prefix — the visitor stays exactly where they were,
 * and crawlers see three real, mutually-linked documents.
 */
export function LanguageSwitcher({
  locale,
  label,
  className,
  tone = 'dark',
}: {
  locale: Locale;
  label: string;
  className?: string;
  tone?: 'dark' | 'light';
}) {
  const pathname = usePathname() ?? `/${locale}`;

  function hrefFor(target: Locale): string {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return `/${target}`;
    segments[0] = target;
    return `/${segments.join('/')}`;
  }

  return (
    <nav aria-label={label} className={cn('flex items-center', className)}>
      <ul className="flex items-center gap-1">
        {locales.map((target) => {
          const isCurrent = target === locale;
          return (
            <li key={target}>
              {isCurrent ? (
                <span
                  aria-current="true"
                  className={cn(
                    'inline-flex h-11 min-w-11 items-center justify-center rounded-xs px-2.5 text-xs font-semibold tracking-[0.08em]',
                    tone === 'dark' ? 'bg-ink text-paper' : 'bg-paper text-ink',
                  )}
                >
                  {localeLabel[target]}
                  <span className="sr-only"> — {localeName[target]}</span>
                </span>
              ) : (
                <Link
                  href={hrefFor(target)}
                  lang={target}
                  className={cn(
                    'inline-flex h-11 min-w-11 items-center justify-center rounded-xs px-2.5 text-xs font-semibold tracking-[0.08em] transition-colors',
                    tone === 'dark'
                      ? 'text-ink-soft hover:bg-bone hover:text-ink'
                      : 'text-paper/80 hover:bg-paper/15 hover:text-paper',
                  )}
                >
                  {localeLabel[target]}
                  <span className="sr-only">
                    {' '}
                    — {label}: {localeName[target]}
                  </span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
