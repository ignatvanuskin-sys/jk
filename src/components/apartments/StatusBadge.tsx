import type { Dictionary } from '@/i18n/dictionaries/ru';
import type { UnitStatus } from '@/data/apartments';
import { cn } from '@/lib/cn';

const STYLES: Record<UnitStatus, string> = {
  available: 'bg-ok/12 text-ok border-ok/30',
  reserved: 'bg-warn/14 text-warn border-warn/35',
  sold: 'bg-muted/12 text-muted border-muted/30',
};

/**
 * Unit status pill.
 *
 * Status is conveyed by the label *and* a colour, never by colour alone — the
 * unit grid and the catalogue both have to stay readable for colour-blind users
 * and in greyscale print.
 */
export function StatusBadge({
  status,
  dict,
  className,
}: {
  status: UnitStatus;
  dict: Dictionary;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-xs border bg-paper/95 px-2 py-1 text-[0.6875rem] font-medium backdrop-blur-sm',
        STYLES[status],
        className,
      )}
    >
      <span className="status-dot bg-current" aria-hidden="true" />
      {dict.apartments.statuses[status]}
    </span>
  );
}
