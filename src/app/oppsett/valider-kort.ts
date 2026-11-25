/**
 * FR-2: liten, ren funksjon — ingen database/nettverk, samme mønster som
 * `krevSesjon()`-testen (Story 1.3). Regelen er AC-en ordrett: brukeren må
 * velge minst ett kort for å lagre oppsettet.
 */
export type ValiderKortvalgResultat = { ok: true } | { ok: false; feil: string };

export function validerKortvalg(koder: string[]): ValiderKortvalgResultat {
  if (koder.length === 0) {
    return { ok: false, feil: 'Velg minst ett kort.' };
  }

  return { ok: true };
}
