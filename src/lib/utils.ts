import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Class-name joiner for the shadcn/ui primitives in `src/components/shadcn`.
 *
 * Unlike `@/lib/cn` (which only joins), this resolves Tailwind conflicts, so
 * a caller's `className` reliably overrides a component's default utility
 * classes instead of depending on stylesheet order.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
