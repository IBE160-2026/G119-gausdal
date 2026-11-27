import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { krevSesjon } from '../krev-sesjon';
import { db } from '../db';
import NedreNavigasjon from '../components/nedre-navigasjon';

// AR-8 / UX-DR3: beskyttet rutegruppe for Hjem, Før kjøp, Kjøp og Meg.
// Sesjonen sjekkes server-side her — uinnlogget bruker omdirigeres til
// /logg-inn før noe av innholdet rendres. Fanelinjen hører bare til denne
// gruppen (Oppsett har ingen fanelinje, se src/app/oppsett/page.tsx).
//
// Story 1.5: tetter et reelt, allerede utløsbart hull — logg-inn/page.tsx
// sender alltid rett til "/" uansett oppsett-status. En bruker som gjør
// Story 1.4s steg, lukker appen, og logger inn igjen, landet før dette på
// Hjem med poengmal/startverdiene fortsatt null. Sjekker derfor BrukerProfil
// her og omdirigerer til riktig oppsett-steg hvis ufullført, før noe av
// innholdet (eller NedreNavigasjon) rendres.
export default async function AppLayout({ children }: { children: ReactNode }) {
  const sesjon = await krevSesjon();

  let brukerProfil: Awaited<ReturnType<typeof db.brukerProfil.findUnique>>;
  try {
    brukerProfil = await db.brukerProfil.findUnique({
      where: { brukerId: sesjon.user.id },
    });
  } catch {
    // Fail closed, samme filosofi som krevSesjon(): en forbigående DB-feil
    // her skal aldri rendre beskyttet innhold — /oppsett er et trygt,
    // idempotent fallback (ny lagring der er en vanlig upsert).
    redirect('/oppsett');
  }

  if (!brukerProfil) {
    redirect('/oppsett');
  }

  if (brukerProfil.poengmal === null) {
    redirect('/oppsett/mal');
  }

  return (
    <>
      <div className="skall-innhold skall-innhold--med-navigasjon">{children}</div>
      <NedreNavigasjon />
    </>
  );
}
