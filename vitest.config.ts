import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

/**
 * Test runner setup.
 *
 * The application code imports through the `@/` alias, so the same alias has to
 * exist here — without it only relative-import modules would be testable.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
