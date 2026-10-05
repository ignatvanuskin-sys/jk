import { cn } from '@/lib/cn';

/**
 * Visible marker for placeholder data.
 *
 * The brief is explicit that placeholder content must never be presented as
 * fact. Rather than hiding that in a code comment, every section that contains
 * placeholder data renders this notice in the page, with the same visual weight
 * as the content around it. It disappears together with the demo data.
 */
export function DemoNotice({
  label,
  children,
  className,
  tone = 'sand',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  tone?: 'sand' | 'clay';
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-sm border p-4 sm:flex-row sm:items-start sm:gap-4',
        tone === 'clay' ? 'border-clay/45 bg-clay/8' : 'border-line bg-bone/70',
        className,
      )}
    >
      <span
        className={cn(
          'inline-flex flex-none items-center rounded-[2px] px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.14em]',
          tone === 'clay' ? 'bg-clay text-white' : 'bg-ink text-paper',
        )}
      >
        {label}
      </span>
      <p className="text-xs leading-relaxed text-ink-soft sm:text-[0.8125rem]">{children}</p>
    </div>
  );
}
