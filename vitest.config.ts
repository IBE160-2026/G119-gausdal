import { defineConfig } from 'vitest/config';

// AD-11 / AR-11: npm test skal kjøre uten nøkler og uten nettverk.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    passWithNoTests: false,
    restoreMocks: true,
  },
});
