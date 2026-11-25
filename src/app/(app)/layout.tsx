import type { ReactNode } from 'react';
import { krevSesjon } from '../krev-sesjon';
import NedreNavigasjon from '../components/nedre-navigasjon';

// AR-8 / UX-DR3: beskyttet rutegruppe for Hjem, Før kjøp, Kjøp og Meg.
// Sesjonen sjekkes server-side her — uinnlogget bruker omdirigeres til
// /logg-inn før noe av innholdet rendres. Fanelinjen hører bare til denne
// gruppen (Oppsett har ingen fanelinje, se src/app/oppsett/page.tsx).
export default async function AppLayout({ children }: { children: ReactNode }) {
  await krevSesjon();

  return (
    <>
      <div className="skall-innhold skall-innhold--med-navigasjon">{children}</div>
      <NedreNavigasjon />
    </>
  );
}
