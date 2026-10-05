'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

/**
 * Segment error boundary.
 *
 * Before this file existed the app had no error boundary at all, so a render
 * error on any of the 690 pages replaced the site with Next's built-in
 * unstyled error screen — outside the site layout, no header, no footer, and
 * the only way out was the browser's back button.
 *
 * The copy is inline rather than pulled from the dictionaries on purpose: this
 * boundary has to render even when whatever broke is the thing that reads
 * content, so it stays dependency-free apart from the pathname it needs to pick
 * the language.
 */
const COPY = {
  ru: {
    title: 'Что-то пошло не так',
    text: 'Страница не открылась. Попробуйте обновить — обычно это помогает.',
    retry: 'Попробовать снова',
    home: 'На главную',
  },
  kz: {
    title: 'Бірдеңе дұрыс болмады',
    text: 'Бет ашылмады. Жаңартып көріңіз — әдетте бұл көмектеседі.',
    retry: 'Қайта көру',
    home: 'Басты бетке',
  },
  en: {
    title: 'Something went wrong',
    text: 'This page failed to load. Reloading usually fixes it.',
    retry: 'Try again',
    home: 'Go to home page',
  },
} as const;

type CopyKey = keyof typeof COPY;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname() ?? '';
  const raw = pathname.split('/')[1];
  const locale: CopyKey = raw === 'kz' || raw === 'en' ? raw : 'ru';
  const copy = COPY[locale];

  useEffect(() => {
    console.error('[ui] unhandled error', error);
  }, [error]);

  return (
    <section className="flex min-h-[70svh] items-center bg-bone">
      <div className="shell py-24">
        <p className="eyebrow text-clay">Error</p>
        <h1 className="mt-4 max-w-[24ch] font-display text-[2.25rem] leading-[1.08] text-ink sm:text-[3rem]">
          {copy.title}
        </h1>
        <p className="mt-5 max-w-[56ch] text-[0.9375rem] leading-relaxed text-ink-soft">{copy.text}</p>

        {error.digest && <p className="num mt-3 text-xs text-muted">ID: {error.digest}</p>}

        <div className="mt-9 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="btn btn-primary px-6 py-3.5">
            {copy.retry}
          </button>
          <Link href={`/${locale}`} className="btn btn-outline px-6 py-3.5">
            {copy.home}
          </Link>
        </div>
      </div>
    </section>
  );
}
