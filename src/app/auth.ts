/**
 * FR-1 / AR-8: Better Auth-serverinstans. E-post+passord er eneste
 * innloggingsmetode — ingen sosiale leverandører, e-postbekreftelse eller
 * passordtilbakestilling (arkitekturens Deferred-liste). Passord hashes av
 * Better Auth selv (scrypt, innebygd) — ingen egen hashing-kode her.
 */
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { db } from './db';
import { config } from './config';

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: 'postgresql' }),
  secret: config.betterAuthSecret,
  baseURL: config.betterAuthUrl,
  emailAndPassword: {
    enabled: true,
  },
});
