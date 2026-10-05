'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/i18n/config';
import { cn } from '@/lib/cn';
import { LeadButton } from '@/components/forms/LeadButton';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavItem {
  href: string;
  label: string;
}

export interface HeaderLabels {
  brand: string;
  brandShort: string;
  demoLabel: string;
  demoTitle: string;
  navItems: NavItem[];
  moreItems: NavItem[];
  moreLabel: string;
  consult: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappHref: string;
  whatsappLabel: string;
  menu: string;
  openMenu: string;
  closeMenu: string;
  switchLanguage: string;
  allSections: string;
  homeLabel: string;
}

/**
 * Site header.
 *
 * Two states:
 *   • on the home page it starts transparent over the hero and turns solid on
 *     scroll — the image gets the full first impression;
 *   • everywhere else it is solid from the start.
 *
 * `position: fixed` everywhere, so the hero can run edge to edge; inner pages
 * account for it with the padding inside <PageHero>.
 */
export function Header({ locale, labels }: { locale: Locale; labels: HeaderLabels }) {
  const pathname = usePathname() ?? `/${locale}`;
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  // Close the "more" dropdown on outside click and on Escape.
  useEffect(() => {
    if (!moreOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMoreOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [moreOpen]);

  // Lock body scroll while the full-screen menu is open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    if (menuOpen) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const overlay = isHome && !scrolled;
  const solid = !overlay;
  const allItems = [...labels.navItems, ...labels.moreItems];

  return (
    <>
      <header
        data-site-header
        data-state={solid ? 'solid' : 'overlay'}
        className={cn(
          'fixed inset-x-0 top-0 z-[60] transition-[background-color,border-color,backdrop-filter] duration-500',
          solid
            ? 'border-b border-line bg-paper/92 backdrop-blur-md'
            : 'border-b border-transparent bg-gradient-to-b from-ink/60 via-ink/25 to-transparent',
        )}
      >
        <div className="shell flex h-16 items-center justify-between gap-3 md:h-20">
          <Link
            href={`/${locale}`}
            className="group flex items-center gap-2.5"
            aria-label={`${labels.brand} — ${labels.allSections}`}
          >
            <span
              className={cn(
                'flex size-9 flex-none items-center justify-center rounded-xs transition-colors',
                solid ? 'bg-pine text-paper' : 'bg-paper/95 text-pine',
              )}
              aria-hidden="true"
            >
              <svg viewBox="0 0 64 64" width="20" height="20" focusable="false">
                <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="square">
                  <rect x="12" y="12" width="26" height="26" />
                  <path d="M26 26h26v26H26z" />
                </g>
                <path d="M36 36l16 16" stroke="#c07a4e" strokeWidth="6" strokeLinecap="square" />
              </svg>
            </span>
            <span className="flex flex-col leading-none">
              <span
                className={cn(
                  'font-display text-lg tracking-[0.02em] transition-colors sm:text-xl',
                  solid ? 'text-ink' : 'text-paper',
                )}
              >
                {labels.brandShort}
              </span>
              <span
                className={cn(
                  'mt-0.5 text-[0.5625rem] font-medium uppercase tracking-[0.22em] transition-colors',
                  solid ? 'text-muted' : 'text-paper/75',
                )}
              >
                residence
                <span
                  className="ml-1.5 rounded-[2px] bg-clay px-1 py-px text-[0.5rem] tracking-[0.12em] text-white"
                  title={labels.demoTitle}
                >
                  {labels.demoLabel}
                </span>
              </span>
            </span>
          </Link>

          <nav aria-label={labels.menu} className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {labels.navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={`/${locale}${item.href}`}
                    className={cn(
                      'inline-flex h-9 items-center rounded-xs px-3 text-[0.8125rem] font-medium transition-colors',
                      solid
                        ? 'text-ink-soft hover:bg-bone hover:text-ink'
                        : 'text-paper/90 hover:bg-paper/15 hover:text-paper',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li ref={moreRef} className="relative">
                <button
                  type="button"
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  onClick={() => setMoreOpen((v) => !v)}
                  className={cn(
                    'inline-flex h-9 items-center gap-1.5 rounded-xs px-3 text-[0.8125rem] font-medium transition-colors',
                    solid
                      ? 'text-ink-soft hover:bg-bone hover:text-ink'
                      : 'text-paper/90 hover:bg-paper/15 hover:text-paper',
                  )}
                >
                  {labels.moreLabel}
                  <svg
                    viewBox="0 0 12 8"
                    width="10"
                    height="7"
                    aria-hidden="true"
                    focusable="false"
                    className={cn('transition-transform', moreOpen && 'rotate-180')}
                  >
                    <path d="M1 1.5L6 6.5l5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
                {moreOpen && (
                  <ul className="absolute right-0 top-[calc(100%+0.5rem)] w-60 overflow-hidden rounded-sm border border-line bg-paper py-1.5 shadow-[0_24px_60px_-30px_rgba(25,26,23,0.45)]">
                    {labels.moreItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={`/${locale}${item.href}`}
                          className="block px-4 py-2.5 text-sm text-ink-soft transition-colors hover:bg-bone hover:text-ink"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <LanguageSwitcher
              locale={locale}
              label={labels.switchLanguage}
              tone={solid ? 'dark' : 'light'}
              className="hidden sm:flex"
            />
            <a
              href={labels.phoneHref}
              className={cn(
                'num hidden h-9 items-center rounded-xs px-3 text-[0.8125rem] font-medium transition-colors xl:inline-flex',
                solid ? 'text-ink hover:bg-bone' : 'text-paper hover:bg-paper/15',
              )}
            >
              {labels.phoneDisplay}
            </a>
            <LeadButton
              source="header"
              variant={solid ? 'primary' : 'light'}
              className="hidden h-9 px-4 text-[0.8125rem] md:inline-flex"
            >
              {labels.consult}
            </LeadButton>
            <a
              href={labels.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={labels.whatsappLabel}
              className={cn(
                'inline-flex size-9 items-center justify-center rounded-xs transition-colors md:hidden',
                solid ? 'bg-bone text-pine' : 'bg-paper/90 text-pine',
              )}
            >
              <WhatsAppGlyph />
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={labels.openMenu}
              aria-expanded={menuOpen}
              className={cn(
                'inline-flex size-9 items-center justify-center rounded-xs transition-colors lg:hidden',
                solid ? 'bg-bone text-ink' : 'bg-paper/90 text-ink',
              )}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                <path
                  d="M3 6h18M3 12h18M3 18h18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[70] flex flex-col bg-paper lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={labels.menu}
        >
          <div className="shell flex h-16 flex-none items-center justify-between">
            <span className="font-display text-lg">{labels.brandShort}</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={labels.closeMenu}
              className="inline-flex size-10 items-center justify-center rounded-xs bg-bone"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav aria-label={labels.menu} className="shell flex-1 overflow-y-auto pb-6">
            <ul className="divide-y divide-line-soft border-y border-line-soft">
              <li>
                <Link
                  href={`/${locale}`}
                  className="block py-4 font-display text-2xl text-ink"
                  onClick={() => setMenuOpen(false)}
                >
                  {labels.homeLabel}
                </Link>
              </li>
              {allItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={`/${locale}${item.href}`}
                    className="block py-4 text-lg text-ink"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3">
              <LeadButton source="mobile-menu" variant="primary" fullWidth>
                {labels.consult}
              </LeadButton>
              <a
                href={labels.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline w-full"
              >
                <WhatsAppGlyph />
                {labels.whatsappLabel}
              </a>
              <a href={labels.phoneHref} className="btn btn-outline num w-full">
                {labels.phoneDisplay}
              </a>
            </div>

            <div className="mt-6">
              <LanguageSwitcher locale={locale} label={labels.switchLanguage} tone="dark" />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12.04 2.5c-5.23 0-9.48 4.25-9.48 9.48 0 1.67.44 3.29 1.27 4.72L2.5 21.5l4.94-1.29a9.45 9.45 0 0 0 4.6 1.18h.01c5.22 0 9.47-4.25 9.47-9.48 0-2.53-.99-4.91-2.78-6.7a9.4 9.4 0 0 0-6.7-2.71Zm0 17.3h-.01a7.86 7.86 0 0 1-4-1.1l-.29-.17-2.93.77.78-2.86-.18-.3a7.83 7.83 0 0 1-1.2-4.16c0-4.34 3.53-7.87 7.88-7.87 2.1 0 4.07.82 5.56 2.31a7.82 7.82 0 0 1 2.3 5.57c0 4.34-3.53 7.86-7.87 7.86Zm4.32-5.89c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.18-1.39-1.32-1.63-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28Z"
      />
    </svg>
  );
}
