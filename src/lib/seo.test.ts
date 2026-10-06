import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * `getSiteUrl` decides the origin that every canonical, hreflang, og:url,
 * og:image, robots.txt host and sitemap URL is built from, so a wrong fallback
 * silently points search engines at the wrong domain.
 *
 * The module is re-imported for every case (`vi.resetModules`) because the
 * fallback warning is emitted once per module instance — a fresh import makes
 * both the returned value and the warning deterministic.
 */
async function loadSeo() {
  vi.resetModules();
  return import('./seo');
}

describe('getSiteUrl', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', undefined);
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', undefined);
    vi.stubEnv('VERCEL_URL', undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('falls back to localhost (not a foreign domain) when nothing is configured', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { getSiteUrl } = await loadSeo();

    expect(getSiteUrl()).toBe('http://localhost:3000');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('NEXT_PUBLIC_SITE_URL');
  });

  it('warns only once even when called repeatedly', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { getSiteUrl } = await loadSeo();

    getSiteUrl();
    getSiteUrl();
    getSiteUrl();

    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('prefers NEXT_PUBLIC_SITE_URL over the Vercel variables and trims trailing slashes', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://asylym.example.kz///');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'prod.vercel.app');
    vi.stubEnv('VERCEL_URL', 'deploy.vercel.app');
    const { getSiteUrl } = await loadSeo();

    expect(getSiteUrl()).toBe('https://asylym.example.kz');
  });

  it('uses VERCEL_PROJECT_PRODUCTION_URL alone as an https origin', async () => {
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'asylym-park.vercel.app');
    const { getSiteUrl } = await loadSeo();

    expect(getSiteUrl()).toBe('https://asylym-park.vercel.app');
  });

  it('falls back to VERCEL_URL when the production variable is absent', async () => {
    vi.stubEnv('VERCEL_URL', 'asylym-preview-abc123.vercel.app');
    const { getSiteUrl } = await loadSeo();

    expect(getSiteUrl()).toBe('https://asylym-preview-abc123.vercel.app');
  });
});
