import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ru';
import { formatPriceCompact } from '@/i18n/config';
import { PROJECT } from '@/data/project';
import { INVENTORY_STATS, INVENTORY_UPDATED_AT } from '@/data/apartments';
import { MediaImage } from '@/components/ui/MediaImage';
import { formatIsoDate } from '@/lib/i18n/date';
import { LeadButton } from '@/components/forms/LeadButton';

/**
 * Hero.
 *
 * Answers the five questions a buyer asks in the first five seconds — what,
 * where, what class, when, and why — and nothing else. One primary action
 * (choose an apartment) and one secondary (talk to sales), because five equally
 * weighted buttons convert worse than two ranked ones.
 */
export function Hero({
  locale,
  dict,
  whatsappHref,
}: {
  locale: Locale;
  dict: Dictionary;
  whatsappHref: string;
}) {
  const facts = [
    { label: dict.hero.priceLabel, value: formatPriceCompact(INVENTORY_STATS.minAvailablePrice, locale) },
    { label: dict.hero.deliveryLabel, value: PROJECT.delivery[locale === 'en' ? 'en' : locale === 'kz' ? 'kz' : 'ru'] },
    { label: dict.hero.addressLabel, value: dict.location.addressValue },
  ];

  return (
    <section className="relative flex min-h-[92svh] flex-col justify-end overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <MediaImage
          media="hero-exterior"
          locale={locale}
          priority
          quality={84}
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink/94 via-ink/58 to-ink/40"
        aria-hidden="true"
      />

      <div className="shell relative pb-16 pt-36 md:pb-24 md:pt-44">
        <p className="inline-flex items-center gap-2.5 rounded-xs border border-paper/25 bg-paper/10 px-3 py-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-paper backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-clay-soft" aria-hidden="true" />
          {dict.hero.badge}
        </p>

        <h1 className="mt-6 max-w-[18ch] text-[2.75rem] leading-[1.02] tracking-[-0.025em] text-paper sm:text-[3.75rem] lg:text-[5rem]">
          {dict.hero.title}{' '}
          <span className="text-clay-soft">{dict.hero.titleAccent}</span>
        </h1>

        <p className="mt-6 max-w-[58ch] text-[0.9375rem] leading-relaxed text-paper/80 sm:text-base">
          {dict.hero.subtitle}
        </p>

        <dl className="mt-9 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="border-t border-paper/25 pt-3">
              <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-paper/60">
                {fact.label}
              </dt>
              <dd className="num mt-1.5 font-display text-[1.375rem] leading-tight text-paper sm:text-2xl">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* The availability count also rides on the catalogue button below. The
            date is what keeps it from reading as a permanent guarantee. */}
        <p className="mt-4 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-paper/55">
          {dict.common.updated} {formatIsoDate(INVENTORY_UPDATED_AT, locale)}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link href={`/${locale}/apartments`} className="btn btn-light px-7 py-4 text-[0.9375rem]">
            {dict.cta.chooseApartment}
            <span className="num ml-1 rounded-xs bg-ink/10 px-1.5 py-0.5 text-xs">
              {INVENTORY_STATS.available}
            </span>
          </Link>
          <LeadButton
            source="hero"
            variant="ghost-light"
            className="px-7 py-4 text-[0.9375rem]"
          >
            {dict.cta.getConsultation}
          </LeadButton>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-sm text-paper/75 underline decoration-paper/30 underline-offset-4 transition-colors hover:text-paper hover:decoration-paper"
          >
            {dict.cta.whatsapp}
            <span className="sr-only"> ({dict.a11y.externalLink})</span>
          </a>
        </div>
      </div>

      <div
        className="absolute bottom-6 right-5 hidden items-center gap-3 text-[0.625rem] uppercase tracking-[0.2em] text-paper/45 lg:flex"
        aria-hidden="true"
      >
        {dict.hero.scrollHint}
        <span className="h-px w-10 bg-paper/35" />
      </div>
    </section>
  );
}
