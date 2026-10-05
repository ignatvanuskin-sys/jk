import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/config';
import type { MediaKey } from '@/data/media';
import { cn } from '@/lib/cn';
import { MediaImage } from './MediaImage';
import { Breadcrumbs } from './Breadcrumbs';

interface PageHeroProps {
  locale: Locale;
  eyebrow?: string;
  title: string;
  lead?: string;
  breadcrumbLabel: string;
  trail: { name: string; path: string }[];
  image?: MediaKey;
  /** Small facts rendered as a row under the headline. */
  meta?: { label: string; value: string }[];
  actions?: ReactNode;
  children?: ReactNode;
}

/**
 * Header band for every inner page.
 *
 * Two variants from one component:
 *   • with an image — a full-bleed visual with a dark scrim, used on the pages
 *     that sell an idea (complex, architecture, location);
 *   • without — a quiet sand band, used on utility pages (documents, privacy)
 *     so they do not compete visually with the pages that must persuade.
 *
 * The top padding always clears the fixed header.
 */
export function PageHero({
  locale,
  eyebrow,
  title,
  lead,
  breadcrumbLabel,
  trail,
  image,
  meta,
  actions,
  children,
}: PageHeroProps) {
  return (
    <section className={cn('relative overflow-hidden', !image && 'bg-bone')}>
      {image && (
        <>
          <div className="absolute inset-0">
            <MediaImage
              media={image}
              locale={locale}
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/60 to-ink/45"
            aria-hidden="true"
          />
        </>
      )}

      <div
        className={cn(
          'shell relative pt-28 pb-12 md:pt-36 md:pb-16',
          !image && 'lg:pt-40',
        )}
      >
        <Breadcrumbs
          locale={locale}
          label={breadcrumbLabel}
          trail={trail}
          tone={image ? 'light' : 'dark'}
        />

        <div className="mt-6 max-w-4xl">
          {eyebrow && (
            <p className={cn('eyebrow', image && 'text-clay-soft')}>{eyebrow}</p>
          )}
          <h1
            className={cn(
              'mt-4 text-[2.25rem] leading-[1.05] tracking-[-0.02em] sm:text-[3rem] lg:text-[3.75rem]',
              image ? 'text-paper' : 'text-ink',
            )}
          >
            {title}
          </h1>
          {lead && (
            <p
              className={cn(
                'mt-5 max-w-[64ch] text-[0.9375rem] leading-relaxed sm:text-base',
                image ? 'text-paper/80' : 'text-ink-soft',
              )}
            >
              {lead}
            </p>
          )}
        </div>

        {meta && meta.length > 0 && (
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {meta.map((item) => (
              <div
                key={item.label}
                className={cn('border-t pt-3', image ? 'border-paper/25' : 'border-line')}
              >
                <dt
                  className={cn(
                    'text-[0.6875rem] font-semibold uppercase tracking-[0.14em]',
                    image ? 'text-paper/60' : 'text-muted',
                  )}
                >
                  {item.label}
                </dt>
                <dd
                  className={cn(
                    'num mt-1.5 font-display text-2xl leading-none',
                    image ? 'text-paper' : 'text-ink',
                  )}
                >
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}

        {children}
      </div>
    </section>
  );
}
