import { describe, expect, it } from 'vitest';

import {
  DEVELOPER,
  DEVELOPER_FOUNDED_YEAR,
  DEVELOPER_PROJECTS,
  PUBLISHED_DEVELOPER_PROJECTS,
  getDeveloperFacts,
} from './developer';

/**
 * The developer block is now the real NAK record. The dossiers marks the BIN,
 * licence, awards and review counts as UNCONFIRMED, so they must not appear
 * anywhere — this suite guards against a fabricated identity creeping back.
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

    expect(facts[2].value).toBe(String(PUBLISHED_DEVELOPER_PROJECTS.length));
    expect(Number(facts[2].value)).toBeGreaterThan(0);
    expect(Number(facts[2].value)).toBeLessThanOrEqual(DEVELOPER_PROJECTS.length);
  });
});

describe('developer identity', () => {
  it('founded in 2006', () => {
    expect(DEVELOPER_FOUNDED_YEAR).toBe(2006);
    expect(DEVELOPER.foundedYear).toBe(2006);
  });

  it('publishes no invented BIN, licence or awards', () => {
    for (const forbidden of ['bin', 'licence', 'license', 'awards']) {
      expect(Object.keys(DEVELOPER)).not.toContain(forbidden);
    }
  });
});

describe('developer portfolio', () => {
  it('carries the confirmed card contract', () => {
    for (const project of PUBLISHED_DEVELOPER_PROJECTS) {
      for (const field of ['ru', 'kz', 'en'] as const) {
        expect(project.name[field].trim(), `${project.id} name.${field}`).not.toBe('');
        expect(project.location[field].trim(), `${project.id} location.${field}`).not.toBe('');
      }

      if (project.url) expect(project.url).toMatch(/^https:\/\/(2gis\.kz|korter\.kz|nak\.kz)(\/|$)/);
      if (project.year) expect(project.year).toBeGreaterThan(2000);
      if (project.units) expect(project.units).toBeGreaterThan(0);
      if (project.houses) expect(project.houses).toBeGreaterThan(0);
    }
  });

  it('marks every record as real, never demo', () => {
    expect(DEVELOPER_PROJECTS.every((project) => project.is_demo === false)).toBe(true);
  });

  it('includes the real project and developer figures', () => {
    const park = DEVELOPER_PROJECTS.find((project) => project.id === 'asylym-park-1');

    expect(park?.units).toBe(346);
    expect(park?.year).toBe(2024);
    expect(park?.areaFrom).toBe(37.17);
    expect(park?.areaTo).toBe(184.64);
  });

  it('never ships an unnamed placeholder', () => {
    for (const project of DEVELOPER_PROJECTS) {
      expect(project.name.ru).not.toMatch(/^Объект\s*\d+$/);
      expect(project.name.en).not.toMatch(/^Project\s*\d+$/);
    }
  });
});
