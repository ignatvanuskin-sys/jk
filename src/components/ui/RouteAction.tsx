'use client';

import { useState } from 'react';

/**
 * "Build a route" action.
 *
 * This build has no verified coordinates, and plotting an invented pin on a
 * real map would be a factual claim the template cannot support. So the button
 * is honest about what it can do:
 *   • if NEXT_PUBLIC_MAP_URL is configured, it opens the real map link;
 *   • otherwise it copies the address, which is exactly what a buyer needs to
 *     paste into 2GIS or Yandex Maps and route from there.
 */
export function RouteAction({
  mapHref,
  address,
  labels,
  variant = 'outline',
  className = '',
}: {
  mapHref: string | null;
  address: string;
  labels: { route: string; copy: string; copied: string; hint: string; external: string };
  variant?: 'outline' | 'light' | 'primary';
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  if (mapHref) {
    return (
      <a
        href={mapHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn btn-${variant} ${className}`}
      >
        {labels.route}
        <span className="sr-only"> ({labels.external})</span>
      </a>
    );
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 4000);
    } catch {
      // Clipboard API needs a secure context; fall back to a selection copy.
      const field = document.createElement('textarea');
      field.value = address;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        window.setTimeout(() => setCopied(false), 4000);
      } finally {
        document.body.removeChild(field);
      }
    }
  }

  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      <button type="button" onClick={copy} className={`btn btn-${variant}`}>
        {copied ? labels.copied : labels.copy}
      </button>
      <p className="max-w-sm text-xs leading-relaxed text-muted" aria-live="polite">
        {copied ? labels.hint : labels.route}
      </p>
    </div>
  );
}
