import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ru';
import { PROJECT_DOCUMENTS } from '@/data/documents';
import { formatIsoDate } from '@/lib/i18n/date';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Documents.
 *
 * For Kazakhstan this is a conversion block, not a legal formality: "нет
 * документов на ЖК" is the single most common red flag on aggregator listings,
 * so publishing the pack (and the Single Operator guarantee in particular) is
 * the strongest trust signal a developer site can carry.
 */
export function DocumentsPreview({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="section bg-paper" id="documents">
      <div className="shell">
        <SectionHeading
          eyebrow={dict.documents.eyebrow}
          title={dict.documents.title}
          lead={dict.documents.lead}
          aside={
            <Link href={`/${locale}/documents`} className="btn btn-outline">
              {dict.common.openSection}
            </Link>
          }
        />

        <ul className="mt-12 divide-y divide-line border-y border-line">
          {PROJECT_DOCUMENTS.map((document) => (
            <li key={document.id}>
              <Link
                href={`/${locale}/documents#${document.id}`}
                className="group flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5 transition-colors hover:bg-bone/60"
              >
                <span className="flex items-center gap-3">
                  <span
                    className="flex size-9 flex-none items-center justify-center rounded-xs border border-line text-ink-soft"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" focusable="false">
                      <path
                        d="M6 3h7l5 5v13H6z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path d="M13 3v5h5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </span>
                  <span className="text-[0.9375rem] text-ink">
                    {dict.documents.types[document.typeKey]}
                  </span>
                </span>

                <span className="flex items-center gap-4">
                  <span
                    className={
                      document.status === 'published'
                        ? 'rounded-xs bg-ok/12 px-2 py-1 text-[0.6875rem] text-ok'
                        : 'rounded-xs bg-warn/14 px-2 py-1 text-[0.6875rem] text-warn'
                    }
                  >
                    {document.status === 'published'
                      ? dict.documents.statusProvided
                      : dict.documents.statusRequest}
                  </span>
                  <span className="num text-xs text-muted">{formatIsoDate(document.updatedAt, locale)}</span>
                  <span
                    className="text-ink-soft transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
