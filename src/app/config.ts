/**
 * AD-10: All konfigurasjon leses ett sted. Resten av `src/app/` importerer
 * `config` herfra i stedet for å lese `process.env` direkte.
 *
 * Påkrevde navn kaster en tydelig feil ved oppstart hvis de mangler.
 * Valgfrie navn får en standardverdi og slår aldri appen ned — bare av
 * funksjonen de styrer (jf. AD-10 og I/O-matrisen i spec-1-1).
 */

function lesPakrevd(navn: string): string {
  const verdi = process.env[navn];
  if (verdi === undefined || verdi.trim() === '') {
    throw new Error(
      `Mangler miljøvariabel ${navn}. Se .env.example og sett den i .env eller docker-compose.yml.`,
    );
  }
  return verdi.trim();
}

function lesValgfri(navn: string, standardverdi: string): string {
  const verdi = process.env[navn];
  return verdi !== undefined && verdi.trim() !== '' ? verdi.trim() : standardverdi;
}

const BETTER_AUTH_SECRET_MIN_LENGDE = 32;

function lesBetterAuthSecret(): string {
  const verdi = lesPakrevd('BETTER_AUTH_SECRET');
  if (verdi.length < BETTER_AUTH_SECRET_MIN_LENGDE) {
    throw new Error(
      `BETTER_AUTH_SECRET må være minst ${BETTER_AUTH_SECRET_MIN_LENGDE} tegn (Better Auths` +
        ' dokumenterte minimum). Se .env.example og sett en lengre verdi i .env eller' +
        ' docker-compose.yml.',
    );
  }
  return verdi;
}

export const config = {
  /** AD-3: tilkoblingsstreng til PostgreSQL. Brukes av Prisma. */
  databaseUrl: lesPakrevd('DATABASE_URL'),
  /** AD-9: lokal mappe er standard lagringssted i v1. */
  storageDir: lesValgfri('STORAGE_DIR', './storage'),
  /** AR-8: hemmelighet Better Auth bruker til signering/kryptering. Påkrevd, ≥32 tegn. */
  betterAuthSecret: lesBetterAuthSecret(),
  /** AR-8: appens egen URL. Valgfri — standard er lokal utvikling. */
  betterAuthUrl: lesValgfri('BETTER_AUTH_URL', 'http://localhost:3000'),
} as const;
