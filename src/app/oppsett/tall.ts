/**
 * FR-4 / UX-DR15: to rene funksjoner for tallparsing i oppsettets
 * mål-/startverdi-skjema — ingen database/nettverk, samme mønster som
 * `valider-kort.ts` (Story 1.4). Begge returnerer `null` for ugyldig input
 * i stedet for å kaste, slik at kallerne (`handlinger.ts`) kan bygge
 * `{ ok: false, feil }`-svar uten try/catch rundt parsingen selv.
 */

// Postgres' `INTEGER`-kolonnetype (brukt for alle feltene disse funksjonene
// fyller ut på BrukerProfil) har denne øvre grensen. Uten denne sjekken
// ville en for stor verdi (f.eks. en ekstra siffer-skrivefeil) passert
// parsing her og i stedet feilet i databasen med en generisk "Noe gikk
// feil"-melding, ikke en feltspesifikk valideringsfeil.
const POSTGRES_INTEGER_MAKS = 2147483647;

// FR-4: poeng-felt (poengmål, bonuspoeng i dag/siste 12 mnd) er heltall —
// ingen desimaler, ingen tusenskille-mellomrom, ingen fortegn. Avviser
// tomt/ugyldig og negative tall (minustegn finnes ikke i sifferet under).
export function parserHeltall(input: string): number | null {
  const trimmet = input.trim();

  if (!/^\d+$/.test(trimmet)) {
    return null;
  }

  const tall = Number.parseInt(trimmet, 10);
  return Number.isSafeInteger(tall) && tall <= POSTGRES_INTEGER_MAKS ? tall : null;
}

// FR-4 / UX-DR15 / AD-5: beløp-felt (Amex-forbruk, Trumf-kroner) godtar
// norsk tallformat — komma som desimaltegn, mellomrom som tusenskille — og
// returnerer beløpet i øre, rundet NED til nærmeste øre (samme
// "alltid nedover"-filosofi som AD-5). Avviser negative tall, tomt/ugyldig,
// etterhengende komma uten desimaler, og mer enn ett komma.
export function parserKronerTilOre(input: string): number | null {
  const utenMellomrom = input.replace(/\s/g, '');

  const match = /^(\d+)(?:,(\d+))?$/.exec(utenMellomrom);
  if (!match) {
    return null;
  }

  const [, heltallsdel, desimaldel = ''] = match;
  // Trunkering til to sifre ETTER komma er det samme som å runde ned for
  // et ikke-negativt tall (regexen over avviser minustegn) — et tredje
  // siffer (eller flere) forkastes aldri opprundet.
  const desimalsifre = (desimaldel + '00').slice(0, 2);

  const kroner = Number.parseInt(heltallsdel, 10);
  const ore = Number.parseInt(desimalsifre, 10);

  if (!Number.isSafeInteger(kroner) || !Number.isSafeInteger(ore)) {
    return null;
  }

  const totalOre = kroner * 100 + ore;
  return totalOre <= POSTGRES_INTEGER_MAKS ? totalOre : null;
}
