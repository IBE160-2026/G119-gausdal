/**
 * AD-3: Prisma-klient-singleton. Standard Next.js-mønster — cacher
 * instansen på `global` i utvikling slik at hot-reload ikke åpner en ny
 * tilkobling per reload. Story 1.1s triage markerte dette som Story 1.3s
 * ansvar (Better Auth trenger klienten); se spec-1-1-prosjektoppsett.md.
 *
 * Prisma 7 har fjernet den innebygde (Rust-baserte) spørringsmotoren —
 * en driver-adapter er påkrevd for å koble til databasen, se
 * https://pris.ly/d/driver-adapters. `@prisma/adapter-pg` er valgt siden
 * AD-3 krever PostgreSQL.
 */
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from './config';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({ connectionString: config.databaseUrl });

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
