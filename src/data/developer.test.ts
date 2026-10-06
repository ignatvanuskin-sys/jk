import { describe, expect, it } from 'vitest';

import {
  COMPLETED_PROJECTS,
  DEVELOPER_FOUNDED_YEAR,
  PUBLISHED_COMPLETED_PROJECTS,
  getDeveloperFacts,
} from './developer';

/**
 * Audit 1.4 — the developer's own statistics.
 *
 * "14 years on the market" was hard-coded while the founding year said 2011, and
 * "9 completed projects" contradicted a list of five. Both numbers are now
 * derived, so they cannot drift again.
 */

describe('developer facts', () => {
  it('derives the years on the market from the founding year', () => {
    const facts = getDeveloperFacts(2026);

    expect(facts[0].value).toBe(String(DEVELOPER_FOUNDED_YEAR));
    expect(facts[1].value).toBe(String(2026 - DEVELOPER_FOUNDED_YEAR));
  });

  it('moves with the current year', () => {
    expect(getDeveloperFacts(2031)[1].value).toBe(String(2031 - DEVELOPER_FOUNDED_YEAR));
    expect(getDeveloperFacts(DEVELOPER_FOUNDED_YEAR)[1].value).toBe('0');
  });

  it('counts the published projects, not a hard-coded figure', () => {
    const facts = getDeveloperFacts(2026);

    expect(facts[2].value).toBe(String(PUBLISHED_COMPLETED_PROJECTS.length));
    expect(Number(facts[2].value)).toBeGreaterThan(0);
    expect(Number(facts[2].value)).toBeLessThanOrEqual(COMPLETED_PROJECTS.length);
  });

  it('totals area and units from the published projects', () => {
    const facts = getDeveloperFacts(2026);
    const area = PUBLISHED_COMPLETED_PROJECTS.reduce((sum, project) => sum + project.area, 0);
    const units = PUBLISHED_COMPLETED_PROJECTS.reduce((sum, project) => sum + project.units, 0);

    expect(facts[3].value).toBe(area.toLocaleString('ru-RU'));
    expect(facts[4].value).toBe(units.toLocaleString('ru-RU'));
  });
});

describe('completed projects', () => {
  it('carries the full card contract', () => {
    for (const project of PUBLISHED_COMPLETED_PROJECTS) {
      for (const field of ['ru', 'kz', 'en'] as const) {
        expect(project.name[field].trim(), `${project.id} name.${field}`).not.toBe('');
        expect(project.city[field].trim(), `${project.id} city.${field}`).not.toBe('');
      }

      expect(project.year).toBeGreaterThan(2000);
      expect(project.units).toBeGreaterThan(0);
      expect(project.area).toBeGreaterThan(0);
      expect(project.photo.startsWith('/')).toBe(true);
      expect(project.mapUrl).toMatch(/^https:\/\/2gis\.kz\//);
    }
  });

  it('marks every demo record as demo', () => {
    expect(COMPLETED_PROJECTS.every((project) => project.is_demo === true)).toBe(true);
  });

  it('never ships an unnamed placeholder', () => {
    for (const project of COMPLETED_PROJECTS) {
      expect(project.name.ru).not.toMatch(/^Объект\s*\d+$/);
      expect(project.name.en).not.toMatch(/^Project\s*\d+$/);
    }
  });
});
