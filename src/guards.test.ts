import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const SRC_ROOT = fileURLToPath(new URL('.', import.meta.url));
const EXTENSIONS = ['.ts', '.tsx'];

/**
 * Audit 1.3 / 1.4 / 1.7 — a repo-wide grep guard.
 *
 * Every phrase below was visible on the site and has been fixed. The test walks
 * the source tree so the copy cannot quietly return in a component that no
 * dictionary test looks at. Test files are skipped, which is what keeps this
 * list from matching itself.
 */
const BANNED_PHRASES = [
  // 1.3 — the hero promised "потолки-витражи" (ceilings that are glazing).
  'потолки-витраж',
  // 1.7 — the floor-plan page counted four layouts while the catalogue sold six.
  'Четыре типа планировок',
  'Төрт түрлі жоспар',
  'Four layout types',
  // 1.4 — "Объект 01…05" placeholder labels instead of real project names.
  'Объект 0',
  // The fictional demo identity and its placeholder contacts must never return.
  'QONYS',
  'qonys',
  '123-45-67',
  '77001234567',
  'sales@qonys',
  '210340018927',
  // The complex does not use the state "7-20-25" programme.
  '7-20-25',
];

function walk(dir: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(path));
      continue;
    }

    if (!EXTENSIONS.includes(entry.name.slice(entry.name.lastIndexOf('.')))) continue;
    if (entry.name.includes('.test.')) continue;

    files.push(path);
  }

  return files;
}

describe('legacy copy', () => {
  it('is gone from every source file', () => {
    const offenders: string[] = [];

    for (const file of walk(SRC_ROOT)) {
      const content = readFileSync(file, 'utf8');

      for (const phrase of BANNED_PHRASES) {
        if (content.includes(phrase)) offenders.push(`${relative(SRC_ROOT, file)} → ${phrase}`);
      }
    }

    expect(offenders).toEqual([]);
  });
});
