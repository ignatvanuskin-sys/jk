import type { Dictionary } from '@/i18n/dictionaries/ru';

/**
 * Form labels = the localised `form` block plus the contact details and the
 * few shared strings the form needs. Kept as an explicit type so the server
 * layout and the client components agree on the contract without the client
 * ever importing a dictionary (which would ship all three locales).
 */
export type LeadLabels = Dictionary['form'] & {
  phoneDisplay: string;
  phoneHref: string;
  whatsappHref: string;
  close: string;
  externalLink: string;
  /** Reused from the CTA block rather than duplicated inside `form`. */
  whatsapp: string;
};
