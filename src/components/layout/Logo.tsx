import { cn } from '@/lib/cn';

/**
 * Brand mark — "Steppe Modern" identity for QONYS RESIDENCE.
 *
 * Concept: a portal (the arched entrance groups of the complex) cut with three
 * vertical slots that read as the three blocks of stepped height, standing on a
 * burnt-clay plinth. The slots are real holes (evenodd), so the mark is correct
 * on the limestone paper, on photography and on the deep-pine footer without a
 * second asset — the arch paints with `currentColor`, only the plinth is fixed
 * to the accent.
 *
 * Legibility: the silhouette stays readable down to 16px because there are no
 * strokes — everything is filled area.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={cn('size-8', className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        className="fill-current"
        d="M4 29V15.5C4 9.15 9.37 4 16 4s12 5.15 12 11.5V29H4Zm5-2V16h3v11H9Zm5.5 0V16h3v11h-3Zm5.5 0V16h3v11h-3Z"
      />
      <rect className="fill-clay" x="4" y="29" width="24" height="2.4" rx="0.4" />
    </svg>
  );
}

/**
 * Full lockup: mark + wordmark.
 *
 * `tone` switches the mark and both lines of type together, because the header
 * sits over a photograph while the footer sits on deep pine.
 */
export function Logo({
  brand,
  shortName,
  tone = 'ink',
  className,
  compact = false,
}: {
  /** Full project name, e.g. "QONYS RESIDENCE". */
  brand: string;
  /** First word, used as the small second line. */
  shortName: string;
  tone?: 'ink' | 'paper';
  className?: string;
  /** Mark only — for tight spots such as the mobile header. */
  compact?: boolean;
}) {
  const [first, ...rest] = brand.split(' ');

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark
        className={cn(
          'size-9 flex-none transition-colors duration-200',
          tone === 'paper' ? 'text-paper' : 'text-ink',
        )}
      />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'font-display text-[1.0625rem] font-semibold uppercase leading-[1.05] tracking-[0.14em]',
              tone === 'paper' ? 'text-paper' : 'text-ink',
            )}
          >
            {first}
          </span>
          <span
            className={cn(
              'mt-0.5 text-[0.5rem] font-medium uppercase leading-none tracking-[0.34em]',
              tone === 'paper' ? 'text-paper/70' : 'text-muted',
            )}
          >
            {rest.length > 0 ? rest.join(' ') : shortName}
          </span>
        </span>
      )}
    </span>
  );
}
