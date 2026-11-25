'use server';

/**
 * FR-2 / FR-5 / FR-6: server-handling for oppsettets samlede skjema (kort,
 * Trumf, SkyTeam). `bruker_id` kommer alltid fra `krevSesjon()` (AD-8) —
 * aldri fra klientdata. Skrivingen skjer i én Prisma-transaksjon
 * (ARCHITECTURE-SPINE: "Skriving skjer i serverfunksjoner, i én
 * databasetransaksjon"), og feil returneres som `{ ok: false, feil }`,
 * aldri kastet til UI.
 *
 * Erstatter (ikke slår sammen) brukerens BrukerKort-rader ved ny lagring —
 * se spec-1-4 Edge-Case Matrix ("Lagrer på nytt").
 */
import { db } from '../db';
import { krevSesjon } from '../krev-sesjon';
import { validerKortvalg } from './valider-kort';

export type LagreOppsettFeil = {
  kort?: string;
  trumfKoblet?: string;
  kunSas?: string;
  generell?: string;
};

export type LagreOppsettResultat = { ok: true } | { ok: false; feil: LagreOppsettFeil };

export type LagreOppsettInput = {
  kortKoder: string[];
  // `undefined` betyr «ikke sendt inn» — skilt fra `false`, siden begge er
  // gyldige svar som må lagres forskjellig fra «mangler» (se Boundaries).
  trumfKoblet: boolean | undefined;
  kunSas: boolean | undefined;
};

export async function lagreOppsett(input: LagreOppsettInput): Promise<LagreOppsettResultat> {
  const sesjon = await krevSesjon();
  const brukerId = sesjon.user.id;

  // Dedupliser før validering/oppslag/transaksjon — en duplikatkode (mulig
  // ved et direkte kall til denne eksporterte handlingen, ikke bare via
  // UI-et) ville ellers møtt `@@unique([brukerId, kortId])` og kastet inne
  // i `createMany`.
  const kortKoder = [...new Set(input.kortKoder)];

  const kortvalgResultat = validerKortvalg(kortKoder);
  if (!kortvalgResultat.ok) {
    return { ok: false, feil: { kort: kortvalgResultat.feil } };
  }

  if (input.trumfKoblet === undefined) {
    return {
      ok: false,
      feil: { trumfKoblet: 'Svar om Trumf er koblet til EuroBonus.' },
    };
  }

  if (input.kunSas === undefined) {
    return {
      ok: false,
      feil: { kunSas: 'Velg om du reiser bare med SAS eller også andre SkyTeam-selskaper.' },
    };
  }

  const trumfKoblet = input.trumfKoblet;
  const kunSas = input.kunSas;

  try {
    // Slå opp de innsendte kortkodene mot Kort-tabellen — en kode uten treff
    // er en valideringsfeil, ikke en stille ignorering (se Boundaries).
    const funnedeKort = await db.kort.findMany({
      where: { kode: { in: kortKoder } },
    });
    const funnedeKoder = new Set(funnedeKort.map((kort) => kort.kode));
    const ukjentKode = kortKoder.find((kode) => !funnedeKoder.has(kode));

    if (ukjentKode !== undefined) {
      return { ok: false, feil: { kort: `Ukjent kortkode: ${ukjentKode}.` } };
    }

    await db.$transaction(async (tx) => {
      await tx.brukerProfil.upsert({
        where: { brukerId },
        update: { trumfKoblet, kunSas },
        create: { brukerId, trumfKoblet, kunSas },
      });

      // Erstatt hele settet — ikke merge — slik at fjernede kort faktisk
      // forsvinner ved ny lagring (Edge-Case Matrix: "Lagrer på nytt").
      await tx.brukerKort.deleteMany({ where: { brukerId } });

      if (funnedeKort.length > 0) {
        await tx.brukerKort.createMany({
          data: funnedeKort.map((kort) => ({ brukerId, kortId: kort.id })),
        });
      }
    });

    return { ok: true };
  } catch {
    // Uventet feil (f.eks. databasefeil) returneres som { ok: false, feil },
    // aldri kastet til UI-et (ARCHITECTURE-SPINE-konvensjonen, se filkommentaren).
    return { ok: false, feil: { generell: 'Noe gikk feil. Prøv igjen.' } };
  }
}
