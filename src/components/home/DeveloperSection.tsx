import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import { formatPrice } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ru';
import { DEVELOPER, PUBLISHED_DEVELOPER_PROJECTS, getDeveloperFacts } from '@/data/developer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Developer block — the trust section.
 *
 * The portfolio below is the developer's real project list (NAK). Each entry
 * carries only the fields the dossier confirms and links to a real public page.
 * No invented BIN, licence or awards are shown.
 */
export function DeveloperSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const developerFacts = getDeveloperFacts();

  return (
    <section className="section bg-bone" id="developer">
      <div className="shell">
        <SectionHeading
          eyebrow={dict.developer.eyebrow}
          title={dict.developer.title}
          lead={dict.developer.lead}
          aside={
            <Link href={`/${locale}/developer`} className="btn btn-outline">
              {dict.common.openSection}
            </Link>
          }
        />

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-10 sm:grid-cols-3 lg:grid-cols-5">
          {developerFacts.map((fact) => (
            <div key={fact.label[locale]}>
              <dd className="num font-display text-4xl leading-none text-ink">
                {fact.value}
              </dd>
              {fact.unit && (
                <dd className="num mt-1 text-xs text-clay">{fact.unit[locale]}</dd>
              )}
              <dt className="mt-2 text-xs leading-snug text-muted">{fact.label[locale]}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          {PUBLISHED_DEVELOPER_PROJECTS.length > 0 && (
            <div>
              <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
                {dict.developer.projectsTitle}
              </h3>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {PUBLISHED_DEVELOPER_PROJECTS.map((project) => (
                  <li
                    key={project.id}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
                  >
                    <a
                      href={project.url ?? DEVELOPER.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.9375rem] text-ink underline decoration-line underline-offset-4"
                    >
                      {project.name[locale]}
                    </a>
                    <span className="text-sm text-ink-soft">
                      {project.location[locale]}
                      {project.year ? `, ${project.year}` : ''}
                    </span>
                    <span className="num text-sm text-muted">
                      {[
                        project.houses ? `${project.houses} ${dict.developer.housesUnit}` : null,
                        project.units ? `${project.units} ${dict.developer.unitsUnit}` : null,
                        project.areaFrom && project.areaTo
                          ? `${project.areaFrom.toLocaleString('ru-RU')}–${project.areaTo.toLocaleString('ru-RU')} м²`
                          : null,
                        project.pricePerSqmFrom
                          ? `${dict.common.from} ${formatPrice(project.pricePerSqmFrom, locale)}`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
              {dict.developer.guaranteesTitle}
            </h3>
            <ul className="mt-5 space-y-5">
              {dict.developer.guarantees.map((item, index) => (
                <li key={item.title}>
                  <Reveal delay={index * 60}>
                    <h4 className="text-[0.9375rem] font-medium text-ink">{item.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{item.text}</p>
                  </Reveal>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-xs text-muted">
              <a
                href={DEVELOPER.site}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line underline-offset-4"
              >
                nak.kz
              </a>
              {' · '}
              <a
                href={DEVELOPER.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line underline-offset-4"
              >
                Instagram
              </a>
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted">{DEVELOPER.legalName}</p>
      </div>
    </section>
  );
}
