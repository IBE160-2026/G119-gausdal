import { defineConfig, env } from 'prisma/config';

// AD-3 / AD-10: Prisma 7 leser tilkoblingsstrengen fra config, ikke fra
// schema.prisma. Selve navnet (DATABASE_URL) leses fortsatt ett sted i
// appen via src/app/config.ts — denne filen styrer bare Prisma CLI
// (migrate/generate), ikke kjøretiden til Next.js-appen.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
