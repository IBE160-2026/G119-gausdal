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

export const config = {
  /** AD-3: tilkoblingsstreng til PostgreSQL. Brukes av Prisma. */
  databaseUrl: lesPakrevd('DATABASE_URL'),
  /** AD-9: lokal mappe er standard lagringssted i v1. */
  storageDir: lesValgfri('STORAGE_DIR', './storage'),
} as const;
