import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  /** `h1` on page heroes, `h2` for in-page sections. */
  level?: 'h1' | 'h2';
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  className?: string;
  /** Rendered on the right at desktop width — usually a CTA. */
  aside?: ReactNode;
}

/**
 * One heading pattern for the whole site.
 *
 * Typography rules applied here rather than per page: the eyebrow carries the
 * label, the display serif carries the headline, the lead is capped at a
 * readable measure (≈62ch) and never exceeds three lines.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  level = 'h2',
  align = 'left',
  tone = 'dark',
  className,
  aside,
}: SectionHeadingProps) {
  const Tag = level;

  return (
    <div
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'md:flex-col md:items-center md:text-center',
        className,
      )}
    >
      <div className={cn('max-w-3xl', align === 'center' && 'mx-auto')}>
        {eyebrow && (
          <p className={cn(tone === 'light' ? 'eyebrow text-clay-soft' : 'eyebrow')}>{eyebrow}</p>
        )}
        <Tag
          className={cn(
            'mt-4 leading-[1.06] tracking-[-0.015em]',
            level === 'h1'
              ? 'text-[2.5rem] sm:text-[3.25rem] lg:text-[4.25rem]'
              : 'text-[2rem] sm:text-[2.75rem] lg:text-[3.25rem]',
            tone === 'light' ? 'text-paper' : 'text-ink',
          )}
        >
          {title}
        </Tag>
        {lead && (
          <p
            className={cn(
              'mt-5 max-w-[62ch] text-[0.9375rem] leading-relaxed sm:text-base',
              tone === 'light' ? 'text-paper/75' : 'text-ink-soft',
            )}
          >
            {lead}
          </p>
        )}
      </div>
      {aside && <div className="flex-none">{aside}</div>}
    </div>
  );
}
