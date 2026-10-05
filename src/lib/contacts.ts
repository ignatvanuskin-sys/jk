import { CONTACTS } from '@/data/project';
import type { Locale } from '@/i18n/config';

/**
 * WhatsApp link with a pre-filled message.
 *
 * The research is unambiguous that WhatsApp is the primary conversion channel
 * in Kazakhstan, so every entry point builds a message that already contains
 * the context — the unit number, the floor plan, the section the visitor was
 * reading. A manager receives a qualified message instead of "Здравствуйте".
 */
export function buildWhatsAppHref(locale: Locale, context?: string): string {
  const base = CONTACTS.whatsappMessage[locale];
  const message = context ? `${base}\n\n${context}` : base;
  return `https://wa.me/${CONTACTS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Context string for a specific apartment, localised. */
export function apartmentContext(
  locale: Locale,
  unit: { number: string; blockLetter: string; rooms: number; area: number; price: number },
): string {
  const area = unit.area.toLocaleString(locale === 'en' ? 'en-US' : 'ru-RU');
  const price = unit.price.toLocaleString(locale === 'en' ? 'en-US' : 'ru-RU');
  const priceLabel = `₸ ${price}`;

  if (locale === 'kz') {
    return `Пәтер №${unit.number}, ${unit.blockLetter} корпусы, ${unit.rooms} бөлмелі, ${area} м², бағасы ${priceLabel}.`;
  }
  if (locale === 'en') {
    return `Apartment ${unit.number}, Block ${unit.blockLetter}, ${unit.rooms}-room, ${area} m², ${priceLabel}.`;
  }
  return `Квартира №${unit.number}, корпус ${unit.blockLetter}, ${unit.rooms}-комнатная, ${area} м², цена ${priceLabel}.`;
}

/** Context string for a floor plan enquiry. */
export function planContext(locale: Locale, planId: string, area: number): string {
  if (locale === 'kz') return `Жоспар ${planId}, ауданы ${area} м².`;
  if (locale === 'en') return `Floor plan ${planId}, ${area} m².`;
  return `Планировка ${planId}, площадь ${area} м².`;
}

/**
 * Map link.
 *
 * This build has no real coordinates, so it does NOT fabricate a pin. If
 * NEXT_PUBLIC_MAP_URL is configured (a 2GIS / Yandex Maps / Google Maps link to
 * the actual office), that link is used. Otherwise the UI falls back to the
 * on-page schematic map with an honest note about the placeholder address.
 */
export function getMapHref(): string | null {
  const url = process.env.NEXT_PUBLIC_MAP_URL;
  return url && url.startsWith('http') ? url : null;
}
