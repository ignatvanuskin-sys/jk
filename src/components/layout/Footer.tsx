import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ru';
import { CONTACTS, PROJECT } from '@/data/project';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
  whatsappHref: string;
  navItems: { href: string; label: string }[];
}

/**
 * Footer.
 *
 * Carries the three things a Kazakhstani buyer (and their lawyer) looks for at
 * the bottom of a developer site:
 *   1. the full navigation, including the document pack,
 *   2. contacts that are one tap away — phone, WhatsApp, e-mail,
 *   3. the legal disclaimer, including the mandatory reference to the Single
 *      Operator guarantee, plus the "not a public offer" wording.
 *
 * The demonstration notice sits alongside the legal disclaimer, in the same
 * visual weight, so it cannot be mistaken for decoration.
 */
export function Footer({ locale, dict, whatsappHref, navItems }: FooterProps) {
  const year = new Date().getFullYear();

  const buyerLinks = [
    { href: '/mortgage', label: dict.nav.mortgage },
    { href: '/parking', label: dict.nav.parking },
    { href: '/commercial', label: dict.nav.commercial },
    { href: '/documents', label: dict.nav.documents },
    { href: '/faq', label: dict.nav.faq },
  ];

  return (
    <footer data-site-footer className="bg-pine-deep text-paper">
      <div className="shell py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href={`/${locale}`} className="flex items-center gap-2.5">
              <span
                className="flex size-9 items-center justify-center rounded-xs bg-paper text-pine"
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
              <Logo brand={PROJECT.name} shortName={PROJECT.shortName} tone="paper" />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/70">{dict.footer.about}</p>

            <div className="mt-6">
              <LanguageSwitcher
                locale={locale}
                label={dict.nav.switchLanguage}
                tone="light"
              />
            </div>
          </div>

          <nav aria-label={dict.footer.navTitle} className="lg:col-span-2">
            <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-paper/55">
              {dict.footer.navTitle}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={`/${locale}${item.href}`}
                    className="text-sm text-paper/80 transition-colors hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={dict.footer.buyersTitle} className="lg:col-span-2">
            <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-paper/55">
              {dict.footer.buyersTitle}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {buyerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={`/${locale}${item.href}`}
                    className="text-sm text-paper/80 transition-colors hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-paper/55">
              {dict.footer.contactsTitle}
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <span className="block text-paper/55">{dict.contacts.addressLabel}</span>
                <span className="text-paper/90">{dict.location.addressValue}</span>
              </li>
              <li>
                <span className="block text-paper/55">{dict.contacts.phoneLabel}</span>
                <a href={CONTACTS.phoneHref} className="num text-paper underline-offset-4 hover:underline">
                  {CONTACTS.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-paper/90 underline-offset-4 hover:underline"
                >
                  WhatsApp
                  <span className="sr-only"> ({dict.a11y.externalLink})</span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACTS.emailHref}
                  className="text-paper/90 underline-offset-4 hover:underline"
                >
                  {CONTACTS.email}
                </a>
              </li>
              <li>
                <span className="block text-paper/55">{dict.contacts.hoursLabel}</span>
                <span className="text-paper/90">{CONTACTS.office.hours[locale]}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-paper/15 pt-8">
          <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-paper/55">
            {dict.footer.disclaimerTitle}
          </h2>
          <p className="mt-3 max-w-[80ch] text-xs leading-relaxed text-paper/60">
            {dict.footer.disclaimer}
          </p>
        </div>
      </div>

      <div className="border-t border-paper/12">
        {/* Bottom padding leaves room for the sticky mobile action bar. */}
        <div className="shell flex flex-col gap-3 py-6 pb-28 text-xs text-paper/55 md:flex-row md:items-center md:justify-between md:pb-6">
          <p>
            © {year} {PROJECT.developerLegalName}. {dict.footer.rights}
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="num">БИН {PROJECT.developerBin}</span>
            <Link
              href={`/${locale}/privacy`}
              className="underline-offset-4 transition-colors hover:text-paper hover:underline"
            >
              {dict.footer.privacy}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
