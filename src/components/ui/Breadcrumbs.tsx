import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { cn } from '@/lib/cn';

/**
 * Breadcrumb trail. Rendered as an ordered list inside a <nav> with an
 * accessible name, and mirrored in JSON-LD (BreadcrumbList) by each page.
 */
export function Breadcrumbs({
  locale,
  label,
  trail,
  tone = 'dark',
  className,
}: {
  locale: Locale;
  label: string;
  trail: { name: string; path: string }[];
  tone?: 'dark' | 'light';
  className?: string;
}) {
  if (trail.length === 0) return null;

  return (
    <nav aria-label={label} className={className}>
      <ol
        className={cn(
          'flex flex-wrap items-center gap-x-2 gap-y-1 text-xs',
          tone === 'light' ? 'text-paper/70' : 'text-muted',
        )}
      >
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className={tone === 'light' ? 'text-paper' : 'text-ink'}>
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={`/${locale}${item.path ? `/${item.path}` : ''}`}
                    className={cn(
                      'transition-colors',
                      tone === 'light' ? 'hover:text-paper' : 'hover:text-ink',
                    )}
                  >
                    {item.name}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
