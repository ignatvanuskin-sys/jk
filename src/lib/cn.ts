/**
 * Tiny class-name joiner.
 * Deliberately not a dependency: the project only needs conditional joining,
 * not variant resolution, and this costs nothing in the client bundle.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
