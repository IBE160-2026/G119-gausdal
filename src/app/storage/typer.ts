/**
 * AD-9: Fillagring bak grensesnitt, ikke i databasen. Databasen lagrer bare
 * referansen (sti, type, eier) — selve filen går gjennom dette grensesnittet.
 *
 * V1 lagrer ingen filer (jf. spec-1-1 «Never»). Grensesnittet finnes slik at
 * senere historier kan ta det i bruk uten å endre resten av appen.
 */
export interface LagretFil {
  sti: string;
  type: string;
}

export interface Lagringsgrensesnitt {
  lagre(data: Uint8Array, filnavn: string, type: string): Promise<LagretFil>;
  hent(sti: string): Promise<Uint8Array>;
  slett(sti: string): Promise<void>;
}
