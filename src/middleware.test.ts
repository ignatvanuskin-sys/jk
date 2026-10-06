import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { middleware } from './middleware';
import { LOCALE_HEADER } from './lib/route-locale';

function request(pathname: string, acceptLanguage?: string) {
  const init = acceptLanguage ? { headers: { 'accept-language': acceptLanguage } } : undefined;
  return new NextRequest(new URL(`http://localhost:3000${pathname}`), init);
}

describe('middleware — Kazakh alias', () => {
  it('permanently redirects /kk to /kz', () => {
    const response = middleware(request('/kk'));
    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('http://localhost:3000/kz');
  });

  it('permanently redirects /kk/* to the equivalent /kz/* path', () => {
    const response = middleware(request('/kk/apartments/a-03-2'));
    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('http://localhost:3000/kz/apartments/a-03-2');
  });

  it('leaves /kz untouched', () => {
    const response = middleware(request('/kz'));
    expect(response.status).toBe(200);
  });
});

describe('middleware — locale routing', () => {
  it('forwards the path locale as a request header for prefixed paths', () => {
    const response = middleware(request('/kz/floorplans'));

    expect(response.status).toBe(200);
    expect(response.headers.get('x-middleware-override-headers')).toContain(LOCALE_HEADER);
    expect(response.headers.get(`x-middleware-request-${LOCALE_HEADER}`)).toBe('kz');
  });

  it('redirects an un-prefixed path, picking the locale from Accept-Language', () => {
    const response = middleware(request('/apartments', 'kk-KZ,kk;q=0.9,ru;q=0.8'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/kz/apartments');
  });

  it('defaults an un-prefixed path to Russian with no language preference', () => {
    const response = middleware(request('/contact'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/ru/contact');
  });
});
