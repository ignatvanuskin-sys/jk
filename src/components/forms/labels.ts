import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ru';
import { CONTACTS } from '@/data/project';
import { buildWhatsAppHref } from '@/lib/contacts';
import type { LeadLabels } from './types';

/**
 * Builds the label bundle for the lead form from the dictionary plus live
 * contact details. Used by the layout (for the global modal) and by inline
 * forms, so both always render identical copy.
 */
export function buildLeadLabels(locale: Locale, dict: Dictionary): LeadLabels {
  return {
    ...dict.form,
    phoneDisplay: CONTACTS.phoneDisplay,
    phoneHref: CONTACTS.phoneHref,
    whatsappHref: buildWhatsAppHref(locale),
    close: dict.common.close,
    externalLink: dict.a11y.externalLink,
    whatsapp: dict.cta.whatsapp,
  };
}
