import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ru';
import { PROJECT } from '@/data/project';
import { AWARDS_PLACEHOLDER, COMPLETED_PROJECTS, DEVELOPER_FACTS } from '@/data/developer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { DemoNotice } from '@/components/ui/DemoNotice';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Developer block — the trust section.
 *
 * Two deliberate choices:
 *   • completed projects are shown as facts (year, city, units, m²) with
 *     neutral labels, because inventing project names would be a fake claim;
 *   • the awards slot is an HONEST EMPTY STATE telling the visitor that only
 *     document-backed awards will be published. On a real launch it is replaced
 *     by the developer's certificates.
 */
export function DeveloperSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
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

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-10 sm:grid-cols-3 lg:grid-cols-6">
          {DEVELOPER_FACTS.map((fact) => (
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
          <div>
            <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
              {dict.developer.projectsTitle}
            </h3>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {COMPLETED_PROJECTS.map((project) => (
                <li
                  key={project.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
                >
                  <span className="text-[0.9375rem] text-ink">{project.label[locale]}</span>
                  <span className="text-sm text-ink-soft">
                    {project.city[locale]}, {project.year}
                  </span>
                  <span className="num text-sm text-muted">
                    {project.units} · {project.area.toLocaleString('ru-RU')} м²
                  </span>
                </li>
              ))}
            </ul>
          </div>

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

            <div className="mt-8 rounded-sm border border-line bg-paper p-5">
              <h4 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                {AWARDS_PLACEHOLDER.title[locale]}
              </h4>
              <p className="mt-3 text-xs leading-relaxed text-ink-soft">
                {AWARDS_PLACEHOLDER.text[locale]}
              </p>
              <Link
                href={`/${locale}/documents`}
                className="mt-4 inline-flex items-center gap-2 border-b border-line pb-0.5 text-xs text-ink transition-colors hover:border-clay hover:text-clay"
              >
                {AWARDS_PLACEHOLDER.action[locale]}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        <DemoNotice label={dict.common.demoData} className="mt-10" tone="clay">
          {dict.developer.placeholderNotice}
        </DemoNotice>
        <p className="mt-4 text-xs text-muted">
          {PROJECT.developerLegalName} · БИН {PROJECT.developerBin}
        </p>
      </div>
    </section>
  );
}
