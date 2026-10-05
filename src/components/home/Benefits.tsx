import type { Dictionary } from '@/i18n/dictionaries/ru';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Advantages.
 *
 * Seven items, each one a decision a buyer can verify in the project documents
 * or see standing in the courtyard. No "высокое качество", no "комфорт".
 * The grid is 12 columns so the first card can span two columns and break the
 * monotony of an even grid — the asymmetry is what keeps it from reading as a
 * template.
 */
export function Benefits({ dict }: { dict: Dictionary }) {
  return (
    <section className="section bg-bone" id="benefits">
      <div className="shell">
        <SectionHeading
          eyebrow={dict.benefits.eyebrow}
          title={dict.benefits.title}
          lead={dict.benefits.lead}
        />

        <ul className="mt-12 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {dict.benefits.items.map((item, index) => (
            <li
              key={item.title}
              className={index === 0 ? 'bg-paper p-7 sm:col-span-2 sm:p-9' : 'bg-paper p-7 sm:p-9'}
            >
              <Reveal delay={Math.min(index, 5) * 60}>
                <span className="num font-display text-sm text-clay">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-display text-2xl leading-tight text-ink">{item.title}</h3>
                <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-ink-soft">
                  {item.text}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
