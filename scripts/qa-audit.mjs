/**
 * Automated QA audit against a running server.
 *
 *   node scripts/qa-audit.mjs [baseUrl]
 *
 * What it does, for every URL in /sitemap.xml:
 *   • status code,
 *   • <html lang>, single <h1>, title / description length,
 *   • canonical URL, hreflang alternates (ru / kk / en / x-default),
 *   • Open Graph and Twitter Card completeness,
 *   • JSON-LD parses as JSON and declares @type,
 *   • <img> elements missing an alt attribute,
 *   • heading-level jumps (a11y),
 *   • form controls without an accessible name (a11y),
 *   • key landmarks: skip link, <main>, <header>, <footer>.
 * Then it crawls every unique internal link once and reports broken targets.
 *
 * Writes qa-report.md and qa-report.json next to the project root.
 */

import { writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

/**
 * Origin under test. Precedence:
 *   1. an explicit `QA_BASE_URL` environment variable,
 *   2. the first CLI argument (`npm run qa -- http://localhost:3100`),
 *   3. the development default `http://localhost:3000`.
 * Printing it makes it obvious which server a run actually hit.
 */
const BASE = (process.env.QA_BASE_URL ?? process.argv[2] ?? 'http://localhost:3000').replace(
  /\/+$/,
  '',
);

const CONCURRENCY = 6;

async function fetchText(url) {
  const response = await fetch(url, { redirect: 'manual' });
  const body = response.status >= 200 && response.status < 400 ? await response.text() : '';
  return { status: response.status, body, location: response.headers.get('location') };
}

/**
 * `String.prototype.matchAll` throws unless the regex is global. Rather than
 * remembering `g` at every call site (and crashing the whole audit on one
 * omission), the flag is forced here.
 */
function matchAll(html, regex) {
  const flags = regex.flags.includes('g') ? regex.flags : `${regex.flags}g`;
  return [...html.matchAll(new RegExp(regex.source, flags))];
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function parseSitemap(xml) {
  return matchAll(xml, /<loc>([^<]+)<\/loc>/g).map((m) => m[1]);
}

/**
 * The sitemap publishes absolute URLs on the canonical origin (by default the
 * IANA-reserved example.com in a template build). For auditing we keep the
 * pathname and hit the locally running server instead, so the crawl never
 * leaves the machine or depends on a domain the project does not own.
 */
function normaliseToBase(url) {
  try {
    const parsed = new URL(url, BASE);
    return `${BASE}${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}

async function pool(items, worker, concurrency = CONCURRENCY) {
  const results = [];
  let index = 0;
  async function run() {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
}

function auditPage(url, html) {
  const issues = [];

  const lang = matchAll(html, /<html[^>]*\blang="([^"]*)"/i)[0]?.[1] ?? null;
  if (!lang) issues.push('missing <html lang>');

  const h1s = matchAll(html, /<h1[\s>]/gi).length;
  if (h1s === 0) issues.push('no <h1>');
  if (h1s > 1) issues.push(`${h1s} <h1> elements (expected 1)`);

  const title = matchAll(html, /<title[^>]*>([\s\S]*?)<\/title>/i)[0]?.[1];
  const titleText = title ? stripTags(title) : '';
  if (!titleText) issues.push('missing <title>');
  else if (titleText.length > 75) issues.push(`title too long (${titleText.length})`);

  const description = matchAll(
    html,
    /<meta[^>]+name="description"[^>]+content="([^"]*)"/i,
  )[0]?.[1];
  if (!description) issues.push('missing meta description');
  else if (description.length < 50) issues.push(`description short (${description.length})`);
  else if (description.length > 175) issues.push(`description long (${description.length})`);

  const canonical = matchAll(html, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i)[0]?.[1];
  if (!canonical) issues.push('missing canonical');
  else if (!/^https?:\/\//.test(canonical)) issues.push('canonical is not absolute');
  else {
    // A canonical that points at a different path is the classic i18n bug:
    // every language version claiming to be the same document.
    try {
      const expected = new URL(url, BASE).pathname.replace(/\/$/, '');
      const actual = new URL(canonical).pathname.replace(/\/$/, '');
      if (expected !== actual) issues.push(`canonical path mismatch (${actual} vs ${expected})`);
    } catch {
      issues.push('canonical is not a valid URL');
    }
  }

  const hreflangs = matchAll(html, /<link[^>]+rel="alternate"[^>]+hreflang="([^"]+)"/gi).map(
    (m) => m[1],
  );
  for (const required of ['ru-KZ', 'kk-KZ', 'en', 'x-default']) {
    if (!hreflangs.includes(required)) issues.push(`missing hreflang ${required}`);
  }

  const og = (property) =>
    matchAll(html, new RegExp(`<meta[^>]+property="og:${property}"[^>]+content="([^"]*)"`, 'i'))[0]?.[1];
  for (const tag of ['title', 'description', 'image', 'url', 'type']) {
    if (!og(tag)) issues.push(`missing og:${tag}`);
  }
  if (!matchAll(html, /<meta[^>]+name="twitter:card"/i).length) issues.push('missing twitter:card');

  const ldBlocks = matchAll(
    html,
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  ).map((m) => m[1]);
  const ldTypes = [];
  if (ldBlocks.length === 0) issues.push('no JSON-LD');
  for (const block of ldBlocks) {
    try {
      const parsed = JSON.parse(block.replace(/\\u003c/g, '<'));
      const nodes = Array.isArray(parsed) ? parsed : [parsed];
      for (const node of nodes) if (node?.['@type']) ldTypes.push(node['@type']);
    } catch {
      issues.push('JSON-LD does not parse');
    }
  }

  const images = matchAll(html, /<img[^>]*>/gi).map((m) => m[0]);
  const imagesWithoutAlt = images.filter((tag) => !/\balt="/i.test(tag));
  if (imagesWithoutAlt.length > 0) {
    issues.push(`${imagesWithoutAlt.length} <img> without alt`);
  }

  // Heading level jumps
  const levels = matchAll(html, /<h([1-6])[\s>]/gi).map((m) => Number(m[1]));
  let previous = 0;
  for (const level of levels) {
    if (previous && level > previous + 1) {
      issues.push(`heading jump h${previous} → h${level}`);
      break;
    }
    previous = level;
  }

  // Form controls without an accessible name
  const controlMatches = matchAll(html, /<(input|select|textarea)\b[^>]*>/gi);
  const unlabelled = controlMatches.filter((match) => {
    const tag = match[0];

    if (/type="hidden"/i.test(tag)) return false;
    if (/aria-label|aria-labelledby|title=/i.test(tag)) return false;

    const id = tag.match(/\bid="([^"]+)"/i)?.[1];
    if (id && html.includes(`for="${id}"`)) return false;

    // Implicit labelling: the control is nested inside a <label>. Compare the
    // positions of the nearest opening and closing label tags before it.
    const before = html.slice(0, match.index);
    const lastOpen = before.lastIndexOf('<label');
    const lastClose = before.lastIndexOf('</label>');
    if (lastOpen > lastClose) return false;

    return true;
  });
  if (unlabelled.length > 0) issues.push(`${unlabelled.length} unlabelled form control(s)`);

  if (!/id="content"/.test(html)) issues.push('missing skip-link target (#content)');
  if (!/<main[\s>]/i.test(html)) issues.push('missing <main>');
  if (!/<header[^>]*data-site-header/i.test(html)) issues.push('missing site header');
  if (!/<footer[^>]*data-site-footer/i.test(html)) issues.push('missing site footer');

  return { issues, ldTypes, title: titleText, description };
}

function internalLinks(html) {
  const hrefs = matchAll(html, /<a[^>]+href="([^"]+)"/gi).map((m) => m[1]);
  return hrefs
    .filter((href) => href.startsWith('/') && !href.startsWith('//'))
    .map((href) => href.split('#')[0])
    .filter((href) => href && !href.startsWith('/_next') && !/\.(jpe?g|png|svg|webp|avif|pdf|ico)$/i.test(href));
}

async function main() {
  console.log('QA audit');
  console.log(`  Origin tested: ${BASE}`);
  console.log(
    `  (override with QA_BASE_URL or: npm run qa -- <origin>)\n`,
  );

  let sitemapResponse;
  try {
    sitemapResponse = await fetch(`${BASE}/sitemap.xml`);
  } catch (error) {
    // A refusal here is an environment problem, not a site failure — say so
    // instead of letting a bare ECONNREFUSED look like a broken page.
    const code = error?.cause?.code ?? error?.code ?? '';
    console.error(
      `✗ Cannot reach a server at ${BASE}${code ? ` (${code})` : ''}.`,
    );
    console.error(
      '  Start the site first, e.g. `npm run build && npm start`, then point the',
    );
    console.error(
      '  audit at it: `npm run qa -- http://localhost:3000` or set QA_BASE_URL.',
    );
    process.exit(1);
  }
  if (!sitemapResponse.ok) {
    console.error(`✗ /sitemap.xml returned ${sitemapResponse.status}`);
    process.exit(1);
  }
  const sitemapXml = await sitemapResponse.text();
  const urls = parseSitemap(sitemapXml);
  console.log(`Sitemap: ${urls.length} URLs`);

  const allLinks = new Set();
  const pageResults = await pool(urls, async (url) => {
    const { status, body } = await fetchText(normaliseToBase(url));
    if (status !== 200) return { url, status, issues: [`HTTP ${status}`], ldTypes: [] };
    for (const link of internalLinks(body)) allLinks.add(link);
    return { url, status, ...auditPage(url, body) };
  });

  const failedPages = pageResults.filter((page) => page.status !== 200);
  const pagesWithIssues = pageResults.filter((page) => (page.issues ?? []).length > 0);

  console.log(`Pages with issues: ${pagesWithIssues.length} / ${pageResults.length}`);
  console.log(`Unique internal links: ${allLinks.size}`);

  // Crawl every internal link once.
  const links = [...allLinks].sort();
  const linkResults = await pool(links, async (link) => {
    try {
      const { status } = await fetchText(normaliseToBase(link));
      return { link, status };
    } catch (error) {
      return { link, status: 'error', error: String(error) };
    }
  });
  const brokenLinks = linkResults.filter((r) => r.status !== 200);
  console.log(`Broken internal links: ${brokenLinks.length} / ${linkResults.length}`);

  const ldTypes = new Set(pageResults.flatMap((page) => page.ldTypes ?? []));

  const report = {
    base: BASE,
    generatedAt: new Date().toISOString(),
    urlsInSitemap: urls.length,
    pagesChecked: pageResults.length,
    pagesWithIssues: pagesWithIssues.length,
    brokenLinks,
    ldTypes: [...ldTypes].sort(),
    pages: pageResults.map((page) => ({
      url: page.url,
      status: page.status,
      title: page.title,
      descriptionLength: page.description?.length ?? 0,
      issues: page.issues ?? [],
    })),
  };

  const md = [
    '# QA audit report',
    '',
    `- Base URL: ${BASE}`,
    `- Generated: ${report.generatedAt}`,
    `- URLs in sitemap: ${report.urlsInSitemap}`,
    `- Pages checked: ${report.pagesChecked}`,
    `- Pages with issues: ${report.pagesWithIssues}`,
    `- Broken internal links: ${brokenLinks.length} of ${linkResults.length}`,
    `- JSON-LD types found: ${report.ldTypes.join(', ') || '—'}`,
    '',
    '## Pages with issues',
    '',
    ...(pagesWithIssues.length === 0
      ? ['None.']
      : pagesWithIssues
          .slice(0, 120)
          .map((page) => `- \`${page.url}\` — ${page.issues.join('; ')}`)),
    ...(pagesWithIssues.length > 120 ? [`- …and ${pagesWithIssues.length - 120} more`] : []),
    '',
    '## Broken internal links',
    '',
    ...(brokenLinks.length === 0
      ? ['None.']
      : brokenLinks.map((link) => `- \`${link.link}\` → ${link.status}`)),
    '',
    '## Failed pages',
    '',
    ...(failedPages.length === 0 ? ['None.'] : failedPages.map((page) => `- ${page.url} → ${page.status}`)),
    '',
  ].join('\n');

  await writeFile(path.join(root, 'qa-report.json'), JSON.stringify(report, null, 2), 'utf8');
  await writeFile(path.join(root, 'qa-report.md'), md, 'utf8');

  console.log('\n✓ wrote qa-report.md and qa-report.json');
  if (failedPages.length || brokenLinks.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error('✗ QA audit failed:', error);
  process.exit(1);
});
