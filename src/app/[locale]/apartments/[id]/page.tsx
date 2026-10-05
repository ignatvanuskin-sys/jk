import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { isLocale, formatArea, formatNumber, formatPrice, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { APARTMENTS, getApartment, getSimilarApartments } from '@/data/apartments';
import { getFloorPlan } from '@/data/floorplans';
import { getBlock, PROJECT } from '@/data/project';
import { apartmentContext, buildWhatsAppHref } from '@/lib/contacts';
import { breadcrumbSchema, buildMetadata, offerSchema } from '@/lib/seo';

import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { FloorPlanSvg } from '@/components/floorplans/FloorPlanSvg';
import { ApartmentCard } from '@/components/apartments/ApartmentCard';
import { StatusBadge } from '@/components/apartments/StatusBadge';
import { LeadButton } from '@/components/forms/LeadButton';
import { MediaImage } from '@/components/ui/MediaImage';
import { DemoNotice } from '@/components/ui/DemoNotice';
import { buildApartmentCardLabels } from '@/components/apartments/labels';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export function generateStaticParams() {
  return APARTMENTS.map((unit) => ({ id: unit.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw, id } = await params;
  if (!isLocale(raw)) return {};
  const unit = getApartment(id);
  if (!unit) return {};

  const dict = getDictionary(raw);
  const block = getBlock(unit.blockId);

  const title = `${dict.apartments.detail.title} №${unit.number} — ${unit.rooms}-${dict.floorplans.room}, ${formatArea(unit.area, raw)} | ${PROJECT.name}`;
  const description =
    raw === 'kz'
      ? `${block?.names.kz}: ${unit.floor}-қабат, ${formatArea(unit.area, 'kz')}, бағасы ${formatPrice(unit.price, 'kz')}. ${dict.apartments.statuses[unit.status]}.`
      : raw === 'en'
        ? `${block?.names.en}: floor ${unit.floor}, ${formatArea(unit.area, 'en')}, ${formatPrice(unit.price, 'en')}. Status: ${dict.apartments.statuses[unit.status]}.`
        : `${block?.names.ru}: ${unit.floor} этаж, ${formatArea(unit.area, 'ru')}, цена ${formatPrice(unit.price, 'ru')}. Статус: ${dict.apartments.statuses[unit.status]}.`;

  return buildMetadata({
    locale: raw,
    title,
    description,
    path: `apartments/${unit.id}`,
    ogImage: 'interior-living',
  });
}

export default async function ApartmentPage({ params }: PageProps) {
  const { locale: raw, id } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const unit = getApartment(id);
  if (!unit) notFound();

  const dict = getDictionary(locale);
  const plan = getFloorPlan(unit.planId);
  const block = getBlock(unit.blockId);
  const similar = getSimilarApartments(unit);
  const labels = buildApartmentCardLabels(locale, dict);

  const trail = [
    { name: dict.nav.home, path: '' },
    { name: dict.nav.apartments, path: 'apartments' },
    { name: `№${unit.number}`, path: `apartments/${unit.id}` },
  ];

  const subject = apartmentContext(locale, {
    number: unit.number,
    blockLetter: unit.blockLetter,
    rooms: unit.rooms,
    area: unit.area,
    price: unit.price,
  });

  const characteristics: { label: string; value: string }[] = [
    { label: dict.common.apartmentNumber, value: `№${unit.number}` },
    { label: dict.apartments.detail.rooms, value: String(unit.rooms) },
    { label: dict.common.area, value: formatArea(unit.area, locale) },
    { label: dict.apartments.detail.livingArea, value: formatArea(unit.livingArea, locale) },
    ...(unit.kitchenArea > 0
      ? [{ label: dict.apartments.detail.kitchenArea, value: formatArea(unit.kitchenArea, locale) }]
      : []),
    { label: dict.apartments.detail.bathrooms, value: String(unit.bathrooms) },
    { label: dict.common.floor, value: `${unit.floor} / ${block?.floors ?? '—'}` },
    { label: dict.apartments.detail.ceilingHeight, value: `${unit.ceiling} м` },
    { label: dict.common.balcony, value: String(unit.balconies) },
    { label: dict.apartments.detail.view, value: dict.apartments.views[unit.view] },
    { label: dict.apartments.detail.finishing, value: dict.apartments.finishes[unit.finish] },
    {
      label: dict.apartments.detail.deliveryDate,
      value: block?.delivery[locale] ?? PROJECT.delivery[locale],
    },
    {
      label: dict.apartments.detail.location,
      value: `${block?.names[locale] ?? ''}, ${dict.common.section} ${unit.position}`,
    },
  ];

  const applicableMethods = dict.purchase.methods.filter((method, index) => {
    if (index === 0) return true; // full payment always applies
    if (index === 1) return true; // mortgage
    if (index === 2) return unit.installment; // developer plan
    return true; // trade-in
  });

  return (
    <>
      <JsonLd id="ld-breadcrumb" data={breadcrumbSchema(locale, trail)} />
      <JsonLd
        id="ld-offer"
        data={offerSchema(locale, {
          id: unit.id,
          number: unit.number,
          price: unit.price,
          status: unit.status,
        })}
      />

      <section className="border-b border-line bg-bone pt-28 pb-10 md:pt-36">
        <div className="shell">
          <Breadcrumbs
            locale={locale}
            label={dict.nav.breadcrumb}
            trail={trail}
          />
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">{dict.apartments.detail.title}</p>
              <h1 className="num mt-3 font-display text-[2.5rem] leading-none text-ink sm:text-[3.5rem]">
                №{unit.number}
              </h1>
              <p className="mt-3 text-[0.9375rem] text-ink-soft">
                {unit.rooms}-{dict.floorplans.room} · {formatArea(unit.area, locale)} ·{' '}
                {block?.names[locale]} · {dict.common.floor} {unit.floor}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={unit.status} dict={dict} />
              {unit.stateProgram && (
                <span className="rounded-xs bg-pine/10 px-2.5 py-1.5 text-xs text-pine">
                  {dict.apartments.filters.stateProgram}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-paper pt-12 md:pt-16">
        <div className="shell grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          {/* ── Plan ─────────────────────────────────────────────────────── */}
          <div>
            <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
              {dict.apartments.detail.plan} · {unit.planId}
            </h2>
            <div className="mt-5 rounded-md border border-line bg-bone/40 p-6">
              {plan && (
                <FloorPlanSvg
                  plan={plan}
                  roomLabels={dict.floorplans.roomLabels}
                  variant="detail"
                  title={`${dict.apartments.detail.plan} ${unit.planId}`}
                  description={`${unit.rooms}-${dict.floorplans.room}, ${unit.area} m²`}
                />
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <figure className="overflow-hidden rounded-md">
                <div className="relative aspect-[3/2]">
                  <MediaImage
                    media="interior-living"
                    locale={locale}
                    sizes="(min-width: 1024px) 35vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </figure>
              <figure className="overflow-hidden rounded-md">
                <div className="relative aspect-[3/2]">
                  <MediaImage
                    media="lobby"
                    locale={locale}
                    sizes="(min-width: 1024px) 35vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </figure>
            </div>
            <p className="mt-3 text-xs text-muted">{dict.architecture.imageCaptions.facade}</p>

            <h2 className="mt-12 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
              {dict.apartments.detail.characteristics}
            </h2>
            <dl className="mt-4 grid gap-x-8 gap-y-0 sm:grid-cols-2">
              {characteristics.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-4 border-b border-line-soft py-3"
                >
                  <dt className="text-sm text-muted">{row.label}</dt>
                  <dd className="num text-right text-sm font-medium text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ── Price and actions ────────────────────────────────────────── */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card p-6 sm:p-7">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
                {dict.apartments.detail.priceBlock}
              </p>
              <p className="num mt-4 font-display text-[2.5rem] leading-none text-ink">
                {formatPrice(unit.price, locale)}
              </p>
              <p className="num mt-2 text-sm text-muted">
                {formatNumber(unit.pricePerSqm, locale)} ₸ {dict.apartments.card.pricePerSqm}
              </p>

              <ul className="mt-5 space-y-2 border-t border-line-soft pt-5">
                <li className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted">{dict.apartments.filters.stateProgram}</span>
                  <span className={unit.stateProgram ? 'text-ok' : 'text-muted'}>
                    {unit.stateProgram ? dict.common.yes : dict.common.no}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted">{dict.apartments.filters.installment}</span>
                  <span className="text-ok">{dict.common.yes}</span>
                </li>
                <li className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted">{dict.apartments.card.bookNote}</span>
                </li>
              </ul>

              {unit.status !== 'sold' ? (
                <div className="mt-6 flex flex-col gap-3">
                  <LeadButton source={`apartment-page:${unit.id}`} subject={subject} variant="primary" fullWidth>
                    {dict.cta.getApartmentTerms}
                  </LeadButton>
                  <a
                    href={buildWhatsAppHref(locale, subject)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline w-full"
                  >
                    {dict.cta.whatsapp}
                    <span className="sr-only"> ({dict.a11y.externalLink})</span>
                  </a>
                </div>
              ) : (
                <div className="mt-6">
                  <p className="rounded-sm border border-line bg-bone p-4 text-sm text-ink-soft">
                    {dict.apartments.detail.notFoundText}
                  </p>
                  <Link href={`/${locale}/apartments`} className="btn btn-primary mt-3 w-full">
                    {dict.cta.seeAvailable}
                  </Link>
                </div>
              )}

              <p className="mt-4 text-xs text-muted">{dict.apartments.card.bookNote}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
                {dict.apartments.detail.paymentMethods}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {applicableMethods.map((method) => (
                  <li
                    key={method.title}
                    className="flex items-baseline justify-between gap-4 border-b border-line-soft pb-2.5 text-sm"
                  >
                    <span className="text-ink">{method.title}</span>
                    <span className="text-xs text-muted">{method.meta}</span>
                  </li>
                ))}
              </ul>
            </div>

            <DemoNotice label={dict.common.demoData} className="mt-6">
              {dict.developer.placeholderNotice}
            </DemoNotice>
          </aside>
        </div>

        {similar.length > 0 && (
          <div className="shell mt-20">
            <h2 className="font-display text-3xl text-ink">{dict.apartments.detail.similar}</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((item) => (
                <li key={item.id}>
                  <ApartmentCard
                    unit={item}
                    locale={locale}
                    labels={labels}
                    floorLabels={dict.floorplans.roomLabels}
                    variant="related"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
