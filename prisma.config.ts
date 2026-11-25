import { defineConfig, env } from 'prisma/config';

// AD-3 / AD-10: Prisma 7 leser tilkoblingsstrengen fra config, ikke fra
// schema.prisma. Selve navnet (DATABASE_URL) leses fortsatt ett sted i
// appen via src/app/config.ts — denne filen styrer bare Prisma CLI
// (migrate/generate), ikke kjøretiden til Next.js-appen.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // Story 1.3: Prisma 7-mønster for seed-kommando (ikke
    // package.json#prisma.seed, det er Prisma 5/6). Krever tsx som
    // devDependency siden prisma/seed.ts er TypeScript.
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
