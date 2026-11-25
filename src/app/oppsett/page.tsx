import { krevSesjon } from '../krev-sesjon';
import { db } from '../db';
import OppsettForm from './oppsett-form';

// FR-1: Oppsett er en egen flyt UTENFOR (app)-rutegruppen — ingen
// fanelinje her (den erstattes av en fast primærknapp, se tema.css
// `.knapp-fast`). Sesjonssjekken gjenbrukes via krevSesjon() siden denne
// siden ikke ligger under (app)/layout.tsx.
//
// Story 1.4: henter brukerens eksisterende BrukerKort/BrukerProfil (hvis
// noen) slik at skjemaet kan forhåndsutfylles ved gjenbesøk (Edge-Case
// Matrix: "Besøker på nytt etter lagring").
export default async function OppsettSide() {
  const sesjon = await krevSesjon();
  const brukerId = sesjon.user.id;

  const [korttyper, brukerKort, brukerProfil] = await Promise.all([
    db.kort.findMany({ orderBy: { navn: 'asc' } }),
    db.brukerKort.findMany({ where: { brukerId }, include: { kort: true } }),
    db.brukerProfil.findUnique({ where: { brukerId } }),
  ]);

  return (
    <main className="skall-innhold skall-innhold--med-knapp-fast">
      <h1>Oppsett</h1>
      <OppsettForm
        korttyper={korttyper.map((kort) => ({ kode: kort.kode, navn: kort.navn }))}
        valgteKortKoder={brukerKort.map((bk) => bk.kort.kode)}
        trumfKoblet={brukerProfil?.trumfKoblet ?? null}
        kunSas={brukerProfil?.kunSas ?? null}
      />
    </main>
  );
}
