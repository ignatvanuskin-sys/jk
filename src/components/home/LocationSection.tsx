import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ru';
import { getMapHref } from '@/lib/contacts';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MediaImage } from '@/components/ui/MediaImage';
import { RouteAction } from '@/components/ui/RouteAction';
import { DemoNotice } from '@/components/ui/DemoNotice';

/**
 * Location.
 *
 * Presented as "time to a landmark", which is how the strongest KZ developer
 * sites do it and how buyers actually think — nobody evaluates a district in
 * kilometres. The address sits next to the map action so copying it is one tap.
 */
export function LocationSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const address = dict.location.addressValue;

  return (
    <section className="section bg-bone" id="location">
      <div className="shell">
        <SectionHeading
          eyebrow={dict.location.eyebrow}
          title={dict.location.title}
          lead={dict.location.lead}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div>
            <div className="rounded-sm border border-line bg-white p-6">
              <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
                {dict.location.address}
              </h3>
              <p className="mt-3 font-display text-2xl leading-tight text-ink">{address}</p>

              <div className="mt-6">
                <RouteAction
                  mapHref={getMapHref()}
                  address={address}
                  labels={{
                    route: dict.cta.buildRoute,
                    copy: dict.common.copy,
                    copied: dict.common.copied,
                    hint: dict.location.mapPlaceholder,
                    external: dict.a11y.externalLink,
                  }}
                />
              </div>
            </div>

            <div className="mt-6 rounded-sm border border-line bg-white p-6">
              <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
                {dict.location.transportTitle}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {dict.location.transportText}
              </p>
            </div>

            <figure className="mt-6 overflow-hidden rounded-sm">
              <div className="relative aspect-[16/10]">
                <MediaImage
                  media="landscape"
                  locale={locale}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            </figure>
          </div>

          <div>
            <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
              {dict.common.onTransport} / {dict.common.walking}
            </h3>
            <dl className="mt-4 divide-y divide-line border-y border-line">
              {dict.location.routes.map((route) => (
                <div key={route.label} className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="text-[0.9375rem] text-ink">{route.label}</dt>
                  <dd className="num flex-none font-display text-xl text-clay">{route.time}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-muted">{dict.location.routeHint}</p>
            <DemoNotice label={dict.common.demoData} className="mt-6">
              {dict.location.mapPlaceholder}
            </DemoNotice>
          </div>
        </div>
      </div>
    </section>
  );
}
