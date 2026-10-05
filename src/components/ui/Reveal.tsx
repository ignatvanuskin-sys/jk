'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger in milliseconds — used to sequence items inside one section. */
  delay?: number;
  /** `up` slides 18px, `fade` only changes opacity. */
  variant?: 'up' | 'fade';
}

/**
 * Scroll-reveal built on IntersectionObserver.
 *
 * Why not a motion library: the site needs exactly one effect (fade + rise),
 * and shipping 30–40 KB of animation runtime for it would hurt LCP and INP for
 * no visual gain. The observer disconnects after firing, so nothing keeps
 * running once an element has been revealed, and `prefers-reduced-motion` is
 * handled in CSS (globals.css) where the transforms are reverted entirely.
 */
export function Reveal({ children, className, delay = 0, variant = 'up' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // SSR/no-observer fallback: show the content rather than hide it forever.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-visible={visible ? 'true' : 'false'}
      className={cn(variant === 'up' ? 'reveal' : 'reveal-fade', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
