import { redirect } from 'next/navigation';
import { krevSesjon } from '../../krev-sesjon';
import { db } from '../../db';
import MalForm from './mal-form';

// FR-2 / FR-3 / FR-4: andre halvdel av oppsettet — mål og startverdier.
// Boundaries: besøker brukeren denne siden uten å ha fullført Story 1.4s
// steg (ingen BrukerProfil-rad), omdirigeres hun til /oppsett — AC-ens
// "Given jeg har valgt kort og bonusreisetype" er en forutsetning, ikke
// noe denne siden selv kan garantere.
export default async function OppsettMalSide() {
  const sesjon = await krevSesjon();
  const brukerId = sesjon.user.id;

  const [brukerProfil, brukerKort] = await Promise.all([
    db.brukerProfil.findUnique({ where: { brukerId } }),
    db.brukerKort.findMany({ where: { brukerId }, include: { kort: true } }),
  ]);

  if (!brukerProfil) {
    redirect('/oppsett');
  }

  const kortKoder = new Set(brukerKort.map((bk) => bk.kort.kode));

  return (
    <main className="skall-innhold skall-innhold--med-knapp-fast">
      <h1>Mål og startverdier</h1>
      <MalForm
        harAmexElite={kortKoder.has('amex-elite')}
        harMastercardPremium={kortKoder.has('mastercard-premium')}
        poengmal={brukerProfil.poengmal}
        harCompanionTicket={brukerProfil.harCompanionTicket}
        harFlyPremium={brukerProfil.harFlyPremium}
        bonuspoengIDag={brukerProfil.bonuspoengIDag}
        bonuspoengSiste12Mnd={brukerProfil.bonuspoengSiste12Mnd}
        amexForbrukOre={brukerProfil.amexForbrukOre}
        trumfKronerOre={brukerProfil.trumfKronerOre}
      />
    </main>
  );
}
