'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Tells whether a horizontal rail still has content to the right of the fold.
 *
 * The chip rails scroll sideways, but nothing on screen said so: on a phone the
 * row simply looked cut off, and an audit of the public site flagged the
 * affordance as unclear. A right-edge fade fixes that — but only while the rail
 * really overflows. Painting the fade unconditionally would dim the last chip on
 * desktop, where all the chips fit and there is nothing to scroll to.
 *
 * The flag flips back to false as soon as the visitor reaches the end, so the
 * fade never sits on top of the final chip.
 */
export function useRailOverflow<T extends HTMLElement = HTMLDivElement>(deps: unknown[] = []) {
  const ref = useRef<T>(null);
  const [more, setMore] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const remaining = el.scrollWidth - el.clientWidth - el.scrollLeft;
      setMore(remaining > 2);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    el.addEventListener('scroll', measure, { passive: true });

    return () => {
      observer.disconnect();
      el.removeEventListener('scroll', measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ref, more };
}
