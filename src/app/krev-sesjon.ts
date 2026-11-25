/**
 * AR-8: delt hjelpefunksjon for server-side sesjonssjekk. Brukes av
 * `(app)/layout.tsx` (Hjem, Før kjøp, Kjøp, Meg) og `oppsett/page.tsx` —
 * de to stedene som ellers ville dupliserte samme sjekk. Next.js 16 har
 * erstattet `middleware.ts` med `proxy.ts`, men denne historien bruker
 * ikke middleware/proxy til sesjonssjekk — dette er eneste beskyttelse.
 */
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from './auth';

export async function krevSesjon() {
  let sesjon: Awaited<ReturnType<typeof auth.api.getSession>>;

  try {
    sesjon = await auth.api.getSession({ headers: await headers() });
  } catch {
    // Fail closed: en feil under sesjonssjekken skal aldri vise beskyttet
    // innhold eller Next sin generiske feilside — behandles som «ingen
    // sesjon».
    redirect('/logg-inn');
  }

  if (!sesjon) {
    redirect('/logg-inn');
  }

  return sesjon;
}
