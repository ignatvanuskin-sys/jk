/**
 * Construction status.
 *
 * The house is DELIVERED — Asylym Park 1 was completed in 2024 (see
 * `docs/real-data-dossier.md`, §2). There is therefore no "progress" to report,
 * no monthly photo log and no live camera: inventing any of those would be a
 * factual claim the dossier cannot support. This module exposes exactly one
 * confirmed fact — the delivered status — and the project follows its own rule:
 * no data → the block carries only what is known.
 *
 * Stage-1 date formatting still runs through `src/lib/i18n/date.ts`.
 */

import type { Block } from './project';

/** Year the complex was completed and handed over. */
export const HANDOVER_YEAR = 2024;

export interface DeliveredBlock {
  id: Block['id'];
  floors: number;
  deliveredYear: number;
}

export const DELIVERED_BLOCKS: DeliveredBlock[] = [
  { id: '10', floors: 9, deliveredYear: HANDOVER_YEAR },
  { id: '11', floors: 9, deliveredYear: HANDOVER_YEAR },
];

/** The complex is delivered — no construction progress is modelled. */
export const CONSTRUCTION_DELIVERED = true;
