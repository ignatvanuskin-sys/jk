import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, formatPrice, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { MORTGAGE_PROGRAMS, MORTGAGE_SOURCES, getSources } from '@/data/mortgage-programs';
import { getSeoCopy } from '@/content/seo';
import { formatIsoDate } from '@/lib/i18n/date';
import { breadcrumbSchema, buildMetadata, fillSeoTokens } from '@/lib/seo';

import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { MortgageCalculator } from '@/components/mortgage/MortgageCalculator';
import { buildCalcPrograms, CALCULATOR_DEFAULTS } from '@/components/mortgage/programs';
import { buildMortgageLabels } from '@/components/apartments/labels';
import { LeadButton } from '@/components/forms/LeadButton';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const copy = getSeoCopy('mortgage', raw);
  return buildMetadata({
    locale: raw,
    title: fillSeoTokens(copy.title, raw),
    description: fillSeoTokens(copy.description, raw),
    path: 'mortgage',
    ogImage: 'interior-living',
  });
}

export default async function MortgagePage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const trail = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.mortgage, path: 'mortgage' },
  ];

  return (
    <>
      <JsonLd id="ld-breadcrumb" data={breadcrumbSchema(locale, trail)} />

      <PageHero
        locale={locale}
        eyebrow={dict.mortgage.eyebrow}
        title={dict.mortgage.title}
        lead={dict.mortgage.lead}
        breadcrumbLabel={dict.nav.breadcrumb}
        trail={trail}
      />

      <section className="section bg-paper">
        <div className="shell">
          <MortgageCalculator
            programs={buildCalcPrograms(locale)}
            labels={buildMortgageLabels(dict)}
            locale={locale}
            defaults={CALCULATOR_DEFAULTS}
          />
        </div>
      </section>

      <section className="section bg-bone">
        <div className="shell">
          <SectionHeading
            eyebrow={dict.mortgage.tableTitle}
            title={dict.documents.title}
            lead={dict.mortgage.tableNote}
          />

          <ul className="mt-12 space-y-6">
            {MORTGAGE_PROGRAMS.map((program, index) => (
              <li key={program.id} className="card p-6 sm:p-8">
                <Reveal delay={Math.min(index, 3) * 50}>
                  <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
                    <div className="max-w-2xl">
                      <h3 className="font-display text-2xl leading-tight text-ink">
                        {program.name[locale]}
                      </h3>
                      <p className="mt-1.5 text-xs text-muted">{program.provider}</p>
                    </div>
                    <div className="flex flex-wrap gap-x-8 gap-y-4">
                      <div>
                        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                          {program.rateIsDiscount ? dict.mortgage.discount : dict.mortgage.calculator.rate}
                        </p>
                        <p className="num mt-1.5 font-display text-2xl leading-none text-clay">
                          {program.rate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                          {dict.mortgage.calculator.down}
                        </p>
                        <p className="num mt-1.5 font-display text-2xl leading-none text-ink">
                          {program.minDownPercentAlt !== undefined
                            ? `${program.minDownPercent}–${program.minDownPercentAlt}%`
                            : `${program.minDownPercent}%`}
                        </p>
                      </div>
                      <div>
                        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                          {dict.mortgage.calculator.term}
                        </p>
                        <p className="num mt-1.5 font-display text-2xl leading-none text-ink">
                          {program.maxTermYears
                            ? `${program.maxTermYears} ${dict.mortgage.calculator.termUnit}`
                            : '—'}
                        </p>
                      </div>
                      {program.priceCap !== undefined && (
                        <div>
                          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                            {dict.common.price}
                          </p>
                          <p className="num mt-1.5 font-display text-xl leading-none text-ink">
                            ≤ {formatPrice(program.priceCap, locale)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <ul className="mt-5 grid gap-2.5 border-t border-line-soft pt-5 sm:grid-cols-2">
                    {program.highlights.map((highlight) => (
                      <li key={highlight[locale]} className="flex gap-2.5 text-sm text-ink-soft">
                        <span
                          className="mt-1.5 size-1.5 flex-none rounded-full bg-pine"
                          aria-hidden="true"
                        />
                        {highlight[locale]}
                      </li>
                    ))}
                  </ul>

                  {program.caveat && (
                    <p className="mt-5 rounded-sm border border-warn/40 bg-warn/8 p-3 text-xs leading-relaxed text-warn">
                      {program.caveat[locale]}
                    </p>
                  )}

                  <p className="num mt-4 text-[0.6875rem] text-muted">
                    {dict.common.updated}: {formatIsoDate(program.verified_at, locale)}
                  </p>

                  {program.sourceIds.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-line-soft pt-4">
                      {getSources(program.sourceIds).map((source) => (
                        <li key={source.id} className="text-[0.6875rem] text-muted">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="underline decoration-line underline-offset-2 transition-colors hover:text-clay"
                          >
                            {source.label}
                          </a>
                          <span className="num ml-1.5 text-muted/70">{source.date.length === 4 ? source.date : formatIsoDate(source.date, locale, source.date.length === 7 ? 'month' : 'date')}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Reveal>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-xs leading-relaxed text-muted">
            {dict.mortgage.tableNote} {dict.mortgage.disclaimer}
          </p>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="shell">
          <SectionHeading
            eyebrow={dict.purchase.eyebrow}
            title={dict.purchase.title}
            lead={dict.purchase.lead}
          />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dict.purchase.methods.map((method) => (
              <li key={method.title} className="card flex flex-col p-6">
                <h3 className="font-display text-xl leading-tight text-ink">{method.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{method.text}</p>
                <p className="mt-4 rounded-xs bg-bone px-3 py-2 text-[0.6875rem] text-ink-soft">
                  {method.meta}
                </p>
                <div className="mt-auto pt-5">
                  <LeadButton
                    source={`mortgage-method:${method.title}`}
                    subject={method.title}
                    variant="outline"
                    fullWidth
                  >
                    {method.cta}
                  </LeadButton>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-xs text-muted">
            {MORTGAGE_SOURCES.length} · {dict.mortgage.tableTitle}
          </p>
        </div>
      </section>
    </>
  );
}
