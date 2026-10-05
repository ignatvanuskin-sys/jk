'use client';

import type { ReactNode } from 'react';
import { useLead } from './LeadProvider';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'outline' | 'clay' | 'light' | 'ghost-light';

interface LeadButtonProps {
  children: ReactNode;
  /** Analytics/CRM tag, e.g. `hero`, `apartment-card`, `floorplan-modal`. */
  source: string;
  /** Pre-filled context shown in the form and sent with the lead. */
  subject?: string;
  variant?: Variant;
  className?: string;
  fullWidth?: boolean;
  ariaLabel?: string;
}

/**
 * Any CTA that should open the lead dialog. Keeping this in one component means
 * every button on the site behaves identically and no CTA can end up dead.
 */
export function LeadButton({
  children,
  source,
  subject,
  variant = 'primary',
  className,
  fullWidth,
  ariaLabel,
}: LeadButtonProps) {
  const { open } = useLead();

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => open({ subject, source })}
      className={cn('btn', `btn-${variant}`, fullWidth && 'w-full', className)}
    >
      {children}
    </button>
  );
}
