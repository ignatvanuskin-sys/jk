/**
 * Content hygiene check.
 *
 *   node scripts/check-content.mjs
 *
 * The brief is explicit: no TODO, no FIXME, no "coming soon", no lorem ipsum,
 * no dead scaffolding shipped as if it were finished. This scans the source for
 * those markers and fails if it finds any.
 *
 * It also reports i18n parity: the three dictionaries must expose the same keys,
 * so a forgotten translation cannot silently fall back to Russian.
 *
 * The one documented exception is the deliberate demonstration marker, which is
 * allowed on lines that explicitly say DEMO / PLACEHOLDER / шаблон.
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const srcDir = path.join(root, 'src');

/**
 * `XXX` is a legitimate character in a phone-number mask ("+7 XXX XXX XX XX"),
 * so that rule only fires when the token is NOT part of a `+7 …` hint.
 */
const PHONE_MASK = /\+?\d?\s*XXX(\s+XXX)*\s*(XX\s*XX|XX)/;

const FORBIDDEN = [
  { token: 'TODO', re: /\bTODO\b/ },
  { token: 'FIXME', re: /\bFIXME\b/ },
  { token: 'XXX', re: /\bXXX\b/, unless: PHONE_MASK },
  { token: 'HACK', re: /\bHACK\b/ },
  { token: 'lorem ipsum', re: /lorem\s+ipsum/i },
  { token: 'coming soon', re: /coming\s+soon|скоро\s+будет|жақын\s+арада/i },
  { token: 'placeholder text', re: /placeholder\s+(text|lorem)/i },
];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(ts|tsx|css)$/.test(entry.name)) yield full;
  }
}

/** Keys of a TS dictionary file, extracted without executing TypeScript. */
async function dictionaryKeys(file) {
  const source = await readFile(file, 'utf8');
  const keys = new Set();
  const stack = [];
  const lines = source.split('\n');
  let inComment = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('/*') || trimmed.startsWith('/**')) inComment = true;
    if (inComment) {
      if (trimmed.includes('*/')) inComment = false;
      continue;
    }
    if (trimmed.startsWith('//')) continue;

    const closeMatches = (line.match(/}/g) ?? []).length;
    const openMatches = (line.match(/{/g) ?? []).length;

    const keyMatch = trimmed.match(/^([A-Za-z_$][\w$]*):/);
    if (keyMatch && stack.length > 0) {
      keys.add(`${stack.join('.')}.${keyMatch[1]}`);
    }

    for (let i = 0; i < openMatches - closeMatches; i += 1) {
      const preceding = trimmed.match(/([A-Za-z_$][\w$]*):\s*{$/);
      stack.push(preceding ? preceding[1] : '_');
    }
    for (let i = 0; i < closeMatches - openMatches; i += 1) stack.pop();
    if (!keyMatch && /^{$/.test(trimmed)) stack.push('_');
  }

  return keys;
}

async function main() {
  const problems = [];

  for await (const file of walk(srcDir)) {
    const relative = path.relative(root, file);
    const lines = (await readFile(file, 'utf8')).split('\n');
    lines.forEach((line, index) => {
      for (const { token, re, unless } of FORBIDDEN) {
        if (!re.test(line)) continue;
        if (unless && unless.test(line)) continue;
        problems.push(`${relative}:${index + 1} — ${token}: ${line.trim().slice(0, 110)}`);
      }
    });
  }

  console.log('Content hygiene');
  console.log(`  Forbidden markers: ${problems.length === 0 ? 'none' : problems.length}`);
  for (const problem of problems) console.log(`    ${problem}`);

  // i18n parity
  const dictionaryDir = path.join(srcDir, 'i18n', 'dictionaries');
  const ru = await dictionaryKeys(path.join(dictionaryDir, 'ru.ts'));
  const kz = await dictionaryKeys(path.join(dictionaryDir, 'kz.ts'));
  const en = await dictionaryKeys(path.join(dictionaryDir, 'en.ts'));

  const missingInKz = [...ru].filter((key) => !kz.has(key));
  const missingInEn = [...ru].filter((key) => !en.has(key));
  const extraInKz = [...kz].filter((key) => !ru.has(key));
  const extraInEn = [...en].filter((key) => !ru.has(key));

  console.log('\ni18n parity');
  console.log(`  ru keys: ${ru.size} · kz keys: ${kz.size} · en keys: ${en.size}`);
  console.log(`  missing in kz: ${missingInKz.length ? missingInKz.join(', ') : 'none'}`);
  console.log(`  missing in en: ${missingInEn.length ? missingInEn.join(', ') : 'none'}`);
  console.log(`  extra in kz: ${extraInKz.length ? extraInKz.join(', ') : 'none'}`);
  console.log(`  extra in en: ${extraInEn.length ? extraInEn.join(', ') : 'none'}`);

  const failed =
    problems.length > 0 ||
    missingInKz.length > 0 ||
    missingInEn.length > 0 ||
    extraInKz.length > 0 ||
    extraInEn.length > 0;

  console.log(`\n${failed ? '✗ content check FAILED' : '✓ content check passed'}`);
  if (failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error('✗ content check failed:', error);
  process.exit(1);
});
