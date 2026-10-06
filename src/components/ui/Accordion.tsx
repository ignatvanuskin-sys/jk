import { cn } from '@/lib/cn';

/**
 * FAQ accordion built on native <details>/<summary>.
 *
 * Chosen deliberately over a JavaScript accordion:
 *   • it works before hydration and without JS at all,
 *   • keyboard and screen-reader behaviour is correct by default,
 *   • there is nothing to keep in sync, so nothing can break,
 *   • it costs zero bytes of client JavaScript.
 */
export function Accordion({
  items,
  className,
}: {
  items: { q: string; a: string }[];
  className?: string;
}) {
  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((item, index) => (
        <details key={item.q} className="group" name="faq" open={index === 0}>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left marker:hidden [&::-webkit-details-marker]:hidden">
            {/* The accordion always sits under a section <h2> (its own
                SectionHeading), so the questions are <h3>: that keeps the
                outline h1 → h2 → h3 without skipping a level, instead of
                promoting every question to an <h2> that competes with the
                section title. */}
            <h3 className="font-display text-xl leading-snug text-ink sm:text-2xl">{item.q}</h3>
            <span
              className="mt-1 flex size-7 flex-none items-center justify-center rounded-full border border-line text-ink transition-transform duration-300 group-open:rotate-45"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" focusable="false">
                <path
                  d="M12 5v14M5 12h14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </summary>
          <p className="max-w-[68ch] pb-6 pr-10 text-[0.9375rem] leading-relaxed text-ink-soft">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
