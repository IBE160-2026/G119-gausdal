'use server';

/**
 * FR-3 / FR-4 / AR-5: server-handling for oppsettets mål-/startverdi-skjema.
 * `bruker_id` kommer alltid fra `krevSesjon()` (AD-8) — aldri fra
 * klientdata. `update` (ikke `upsert`) på `BrukerProfil` — raden må
 * allerede finnes fra Story 1.4s steg (se spec-1-5 Boundaries). Feil
 * returneres som `{ ok: false, feil }`, aldri kastet til UI (samme mønster
 * som ../handlinger.ts etter Story 1.4s review-retting). Validerer ett felt
 * om gangen og returnerer ved første feil — samme fail-fast-rekkefølge som
 * ../handlinger.ts.
 */
import { db } from '../../db';
import { krevSesjon } from '../../krev-sesjon';
import { parserHeltall, parserKronerTilOre } from '../tall';

export type LagreMalFeil = {
  poengmal?: string;
  harCompanionTicket?: string;
  harFlyPremium?: string;
  bonuspoengIDag?: string;
  bonuspoengSiste12Mnd?: string;
  amexForbrukOre?: string;
  trumfKronerOre?: string;
  generell?: string;
};

export type LagreMalResultat = { ok: true } | { ok: false; feil: LagreMalFeil };

export type LagreMalInput = {
  poengmal: string;
  harCompanionTicket: boolean;
  harFlyPremium: boolean;
  bonuspoengIDag: string;
  bonuspoengSiste12Mnd: string;
  // Rå kroner-tekst (norsk format) — parses til øre med parserKronerTilOre.
  amexForbruk: string;
  trumfKroner: string;
};

const AMEX_ELITE_KODE = 'amex-elite';
const MASTERCARD_PREMIUM_KODE = 'mastercard-premium';
const GYLDIG_POENG_FEIL = 'Oppgi et gyldig antall poeng (0 eller mer).';
const GYLDIG_BELOP_FEIL = 'Oppgi et gyldig beløp (0 eller mer).';

export async function lagreMal(input: LagreMalInput): Promise<LagreMalResultat> {
  const sesjon = await krevSesjon();
  const brukerId = sesjon.user.id;

  const poengmal = parserHeltall(input.poengmal);
  if (poengmal === null || poengmal < 1) {
    return { ok: false, feil: { poengmal: 'Oppgi et poengmål på minst 1.' } };
  }

  const bonuspoengIDag = parserHeltall(input.bonuspoengIDag);
  if (bonuspoengIDag === null || bonuspoengIDag < 0) {
    return { ok: false, feil: { bonuspoengIDag: GYLDIG_POENG_FEIL } };
  }

  // FR-20 / UX-DR14: bare relevant (og bare vist i skjemaet) når Fly Premium
  // er valgt — lagres som `null` ellers, ikke et tvunget tall ingen bruker
  // faktisk ser eller mener noe med.
  let bonuspoengSiste12Mnd: number | null = null;
  if (input.harFlyPremium) {
    bonuspoengSiste12Mnd = parserHeltall(input.bonuspoengSiste12Mnd);
    if (bonuspoengSiste12Mnd === null || bonuspoengSiste12Mnd < 0) {
      return { ok: false, feil: { bonuspoengSiste12Mnd: GYLDIG_POENG_FEIL } };
    }
  }

  const amexForbrukOre = parserKronerTilOre(input.amexForbruk);
  if (amexForbrukOre === null || amexForbrukOre < 0) {
    return { ok: false, feil: { amexForbrukOre: GYLDIG_BELOP_FEIL } };
  }

  const trumfKronerOre = parserKronerTilOre(input.trumfKroner);
  if (trumfKronerOre === null || trumfKronerOre < 0) {
    return { ok: false, feil: { trumfKronerOre: GYLDIG_BELOP_FEIL } };
  }

  try {
    // Server stoler aldri på at klienten skjulte avkrysningsboksen riktig
    // (Boundaries) — slå opp brukerens faktiske BrukerKort på nytt.
    const brukerKort = await db.brukerKort.findMany({
      where: { brukerId },
      include: { kort: true },
    });
    const kortKoder = new Set(brukerKort.map((bk) => bk.kort.kode));

    if (input.harCompanionTicket && !kortKoder.has(AMEX_ELITE_KODE)) {
      return {
        ok: false,
        feil: { harCompanionTicket: 'Companion Ticket krever Amex Elite.' },
      };
    }

    if (input.harFlyPremium && !kortKoder.has(MASTERCARD_PREMIUM_KODE)) {
      return {
        ok: false,
        feil: { harFlyPremium: 'Fly Premium krever Mastercard Premium.' },
      };
    }

    await db.brukerProfil.update({
      where: { brukerId },
      data: {
        poengmal,
        harCompanionTicket: input.harCompanionTicket,
        harFlyPremium: input.harFlyPremium,
        bonuspoengIDag,
        bonuspoengSiste12Mnd,
        amexForbrukOre,
        trumfKronerOre,
      },
    });

    return { ok: true };
  } catch {
    // Uventet feil (f.eks. databasefeil, eller raden finnes ikke — skal
    // ikke skje siden page.tsx redirecter uten BrukerProfil) returneres som
    // { ok: false, feil }, aldri kastet til UI-et.
    return { ok: false, feil: { generell: 'Noe gikk feil. Prøv igjen.' } };
  }
}
