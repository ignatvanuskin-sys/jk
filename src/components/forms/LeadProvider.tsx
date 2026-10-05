'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { Locale } from '@/i18n/config';
import type { LeadLabels } from './types';
import { LeadForm } from './LeadForm';
import { Modal } from '@/components/ui/Modal';

export interface LeadIntent {
  /** Shown to the visitor and sent with the lead, e.g. "Квартира №42, 2-комнатная". */
  subject?: string;
  /** Where the click came from — used in the lead payload, not shown in the UI. */
  source: string;
}

interface LeadContextValue {
  open: (intent: LeadIntent) => void;
  close: () => void;
  isOpen: boolean;
}

const LeadContext = createContext<LeadContextValue | null>(null);

export function useLead(): LeadContextValue {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLead() must be used inside <LeadProvider>');
  }
  return context;
}

/**
 * One lead modal for the whole site.
 *
 * Every CTA — hero, apartment card, floor plan, payment method, sticky mobile
 * bar — opens this dialog with its own context already filled in, so a manager
 * receives "Квартира №42, корпус B, 2-комнатная, 59,5 м²" instead of a blank
 * lead. Using one instance (rather than a form per section) keeps the DOM small
 * and guarantees identical behaviour everywhere.
 */
export function LeadProvider({
  children,
  labels,
  locale = 'ru',
}: {
  children: ReactNode;
  labels: LeadLabels;
  locale?: Locale;
}) {
  const [intent, setIntent] = useState<LeadIntent | null>(null);

  const open = useCallback((next: LeadIntent) => setIntent(next), []);
  const close = useCallback(() => setIntent(null), []);

  const value = useMemo<LeadContextValue>(
    () => ({ open, close, isOpen: intent !== null }),
    [open, close, intent],
  );

  return (
    <LeadContext.Provider value={value}>
      {children}
      <Modal
        open={intent !== null}
        onClose={close}
        labelledBy="lead-dialog-title"
        closeLabel={labels.close}
        size="md"
      >
        <h2 id="lead-dialog-title" className="sr-only">
          {labels.title}
        </h2>
        <LeadForm
          locale={locale}
          labels={labels}
          source={intent?.source ?? 'unknown'}
          subject={intent?.subject}
          showHeading
        />
      </Modal>
    </LeadContext.Provider>
  );
}
