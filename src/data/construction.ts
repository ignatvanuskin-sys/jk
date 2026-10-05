/**
 * Construction progress reports.
 *
 * ⚠️  DEMONSTRATION BUILD
 * Percentages, dates and photographs are placeholders. The on-page section
 * carries a visible notice. Replace `MONTHLY_REPORTS` with real monthly reports
 * (photo + % + works) before launch.
 *
 * Design decision: reports reference CONSTRUCTION PHASES rather than free-text
 * lists, so "what is done" and "what is next" are always consistent with the
 * reported percentage and translate cleanly into three languages.
 */

import type { Block } from './project';

export interface ConstructionPhase {
  id: number;
  name: { ru: string; kz: string; en: string };
  /** Completion percentage at which this phase is considered finished. */
  doneAt: number;
}

export const CONSTRUCTION_PHASES: ConstructionPhase[] = [
  {
    id: 1,
    name: {
      ru: 'Свайное поле и фундаментная плита',
      kz: 'Қадақ алаңы және іргетас плитасы',
      en: 'Piles and foundation slab',
    },
    doneAt: 9,
  },
  {
    id: 2,
    name: {
      ru: 'Монолитный каркас, этажи 1–5',
      kz: 'Монолитті каркас, 1–5 қабаттар',
      en: 'Monolithic frame, floors 1–5',
    },
    doneAt: 24,
  },
  {
    id: 3,
    name: {
      ru: 'Монолитный каркас, этажи 6–12',
      kz: 'Монолитті каркас, 6–12 қабаттар',
      en: 'Monolithic frame, floors 6–12',
    },
    doneAt: 40,
  },
  {
    id: 4,
    name: { ru: 'Кровля и парапеты', kz: 'Шатыр және парапеттер', en: 'Roof and parapets' },
    doneAt: 47,
  },
  {
    id: 5,
    name: {
      ru: 'Кладка наружных стен и перегородок',
      kz: 'Сыртқы қабырғалар мен қалқаларды қалау',
      en: 'External walls and partitions',
    },
    doneAt: 56,
  },
  {
    id: 6,
    name: {
      ru: 'Вентилируемый фасад и утепление',
      kz: 'Желдетілетін қасбет және оқшаулау',
      en: 'Ventilated facade and insulation',
    },
    doneAt: 68,
  },
  {
    id: 7,
    name: {
      ru: 'Остекление, балконы и входные группы',
      kz: 'Әйнектеу, балкондар және кіреберіс топтары',
      en: 'Glazing, balconies and entrance groups',
    },
    doneAt: 76,
  },
  {
    id: 8,
    name: {
      ru: 'Внутренние инженерные сети',
      kz: 'Ішкі инженерлік желілер',
      en: 'Internal building services',
    },
    doneAt: 86,
  },
  {
    id: 9,
    name: {
      ru: 'Отделка мест общего пользования',
      kz: 'Ортақ пайдалану орындарын әрлеу',
      en: 'Common-area finishing',
    },
    doneAt: 93,
  },
  {
    id: 10,
    name: {
      ru: 'Благоустройство двора и озеленение',
      kz: 'Ауланы абаттандыру және көгалдандыру',
      en: 'Courtyard landscaping',
    },
    doneAt: 98,
  },
];

export type ProgressImageKey = 'construction-frame' | 'construction-facade' | 'construction-yard';

export interface MonthlyReport {
  id: string;
  blockId: Block['id'];
  /** ISO month, e.g. `2026-09`. */
  month: string;
  /** Percentage of the block completed as at this report. */
  progress: number;
  image: ProgressImageKey;
}

/**
 * Nine monthly reports per block, most recent last.
 * Progress is monotonic per block — verified by an assertion further down.
 */
const PROGRESS: Record<Block['id'], number[]> = {
  a: [38, 41, 44, 48, 51, 54, 57, 60, 62],
  b: [28, 31, 34, 38, 41, 45, 48, 51, 54],
  c: [6, 8, 11, 13, 16, 18, 21, 23, 26],
};

/** Oldest month in the dataset; reports run monthly up to `LATEST_MONTH`. */
const FIRST_MONTH = '2026-01';
const LATEST_MONTH = '2026-09';

function monthSequence(first: string, last: string): string[] {
  const [fy, fm] = first.split('-').map(Number);
  const [ly, lm] = last.split('-').map(Number);
  const out: string[] = [];
  let y = fy;
  let m = fm;
  while (y < ly || (y === ly && m <= lm)) {
    out.push(`${y}-${String(m).padStart(2, '0')}`);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
}

export const REPORT_MONTHS = monthSequence(FIRST_MONTH, LATEST_MONTH);

/** Image assignment keeps the gallery from repeating the same photo. */
function pickImage(blockId: Block['id'], index: number): ProgressImageKey {
  const rotation: ProgressImageKey[] = ['construction-frame', 'construction-facade', 'construction-yard'];
  const blockOffset = blockId === 'a' ? 0 : blockId === 'b' ? 1 : 2;
  return rotation[(index + blockOffset) % rotation.length];
}

export const MONTHLY_REPORTS: MonthlyReport[] = (['a', 'b', 'c'] as const).flatMap((blockId) =>
  REPORT_MONTHS.map((month, index) => ({
    id: `${blockId}-${month}`,
    blockId,
    month,
    progress: PROGRESS[blockId][index] ?? PROGRESS[blockId][PROGRESS[blockId].length - 1],
    image: pickImage(blockId, index),
  })),
);

if (process.env.NODE_ENV !== 'production') {
  // Guard rail: progress must never go down in a monthly report series.
  for (const blockId of ['a', 'b', 'c'] as const) {
    const series = MONTHLY_REPORTS.filter((r) => r.blockId === blockId);
    for (let i = 1; i < series.length; i += 1) {
      if (series[i].progress < series[i - 1].progress) {
        throw new Error(`Construction progress decreased for block ${blockId} at ${series[i].month}`);
      }
    }
  }
}

export const getReportsForBlock = (blockId: Block['id'] | 'all'): MonthlyReport[] =>
  (blockId === 'all' ? MONTHLY_REPORTS : MONTHLY_REPORTS.filter((r) => r.blockId === blockId))
    .slice()
    .sort((a, b) => b.month.localeCompare(a.month));

export const getLatestReport = (blockId: Block['id']): MonthlyReport | undefined =>
  MONTHLY_REPORTS.filter((r) => r.blockId === blockId).at(-1);

export const LATEST_REPORT_MONTH = LATEST_MONTH;

/** Phases completed at a given completion percentage. */
export const phasesDone = (progress: number): ConstructionPhase[] =>
  CONSTRUCTION_PHASES.filter((p) => progress >= p.doneAt);

/** The phase underway at a given completion percentage. */
export const phaseInProgress = (progress: number): ConstructionPhase | undefined =>
  CONSTRUCTION_PHASES.find((p) => progress < p.doneAt);

/** Weighted overall completion across blocks, used on the home page. */
export const OVERALL_PROGRESS = Math.round(
  (['a', 'b', 'c'] as const).reduce((sum, id) => sum + (getLatestReport(id)?.progress ?? 0), 0) / 3,
);
