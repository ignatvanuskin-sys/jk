'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import type { Locale } from '@/i18n/config';
import { cn } from '@/lib/cn';

interface MobileActionBarProps {
  labels: {
    call: string;
    whatsapp: string;
    choose: string;
    select: string;
    navLabel: string;
  };
  phoneHref: string;
  whatsappHref: string;
  locale: Locale;
}

/**
 * Sticky bottom bar on small screens.
 *
 * Phone / WhatsApp / catalogue — the three actions that actually convert on a
 * phone in Kazakhstan. It is hidden while the hero is on screen (so the first
 * impression stays clean) and appears once the visitor starts reading, which is
 * also when a thumb-reachable CTA becomes useful.
 *
 * The footer carries matching bottom padding, so the bar never covers content.
 */
export function MobileActionBar({
  labels,
  phoneHref,
  whatsappHref,
  locale,
}: MobileActionBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      data-mobile-bar
      aria-label={labels.navLabel}
      className={cn(
        'fixed inset-x-0 bottom-0 z-[65] border-t border-line bg-paper/95 backdrop-blur-md transition-transform duration-[400ms] md:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-3">
        <a
          href={phoneHref}
          className="flex min-h-[56px] flex-col items-center justify-center gap-1 border-r border-line-soft px-2 text-[0.6875rem] font-medium text-ink"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <path
              d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          {labels.call}
        </a>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[56px] flex-col items-center justify-center gap-1 border-r border-line-soft px-2 text-[0.6875rem] font-medium text-pine"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M12.04 2.5c-5.23 0-9.48 4.25-9.48 9.48 0 1.67.44 3.29 1.27 4.72L2.5 21.5l4.94-1.29a9.45 9.45 0 0 0 4.6 1.18h.01c5.22 0 9.47-4.25 9.47-9.48 0-2.53-.99-4.91-2.78-6.7a9.4 9.4 0 0 0-6.7-2.71Zm4.32 11.41c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.18-1.39-1.32-1.63-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28Z"
            />
          </svg>
          WhatsApp
          <span className="sr-only"> , {labels.whatsapp}</span>
        </a>

        <Link
          href={`/${locale}/apartments`}
          className="flex min-h-[56px] flex-col items-center justify-center gap-1 bg-ink px-2 text-[0.6875rem] font-medium text-paper"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <path
              d="M4 20V9.5L12 4l8 5.5V20h-6v-5h-4v5H4Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          {labels.choose}
        </Link>
      </div>
    </div>
  );
}
