import { krevSesjon } from '../krev-sesjon';

// FR-1: Oppsett er en egen flyt UTENFOR (app)-rutegruppen — ingen
// fanelinje her (den erstattes av en fast primærknapp i Story 1.4–1.5).
// Sesjonssjekken gjenbrukes via krevSesjon() siden denne siden ikke ligger
// under (app)/layout.tsx.
export default async function OppsettSide() {
  await krevSesjon();

  return (
    <main className="skall-innhold">
      <h1>Oppsett</h1>
      <p>Kommer snart.</p>
    </main>
  );
}
