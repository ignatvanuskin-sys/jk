/**
 * Public document pack.
 *
 * SOURCE OF TRUTH: `docs/real-data-dossier.md`, §6. The dossier confirms no
 * specific document for this project (permits, guarantees, contracts), so the
 * project rule applies verbatim: no data → the block is absent. The list below
 * is intentionally EMPTY, and every document surface is hidden while it stays
 * empty — the site does not fabricate legal instruments.
 *
 * When NAK supplies the real pack, add entries here and the existing UI
 * (`DocumentsPreview`, `/documents`, the developer page) will render them again.
 */

export type DocumentStatus = 'published' | 'on-request';

export interface ProjectDocument {
  id: string;
  typeKey:
    | 'permit'
    | 'guarantee'
    | 'akimat'
    | 'contract'
    | 'conditions'
    | 'privacy'
    | 'developer';
  status: DocumentStatus;
  updatedAt: string;
  summary: { ru: string; kz: string; en: string };
  verifiable: { ru: string; kz: string; en: string }[];
}

/** No document is confirmed by the dossier, so none is published. */
export const PROJECT_DOCUMENTS: ProjectDocument[] = [];

export const DOCUMENTS_UPDATED_AT = '2026-08-21';

/** True while the published pack is empty — document surfaces stay hidden. */
export const DOCUMENTS_HIDDEN = PROJECT_DOCUMENTS.length === 0;
