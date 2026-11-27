'use client';

import { useId, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { lagreMal, type LagreMalFeil } from './handlinger';

type MalFormProps = {
  harAmexElite: boolean;
  harMastercardPremium: boolean;
  poengmal: number | null;
  harCompanionTicket: boolean;
  harFlyPremium: boolean;
  bonuspoengIDag: number | null;
  bonuspoengSiste12Mnd: number | null;
  amexForbrukOre: number | null;
  trumfKronerOre: number | null;
};

// Norsk tallformat ved forhåndsutfylling (DESIGN.md: komma som desimal) —
// motsatt retning av parserKronerTilOre i ../tall.ts. Viser ingen
// desimaldel når øre-delen er 0, slik at et rundt beløp ikke ser rart ut.
function oreTilKronerStreng(ore: number | null): string {
  if (ore === null) {
    return '';
  }

  const kroner = Math.floor(ore / 100);
  const oreDel = ore % 100;

  return oreDel === 0 ? String(kroner) : `${kroner},${String(oreDel).padStart(2, '0')}`;
}

function heltallStreng(verdi: number | null): string {
  return verdi === null ? '' : String(verdi);
}

// FR-2 / FR-3 / FR-4 / UX-DR13 / UX-DR15: mål-/startverdi-skjema. Samme
// feltfeil-mønster som Story 1.3/1.4s skjemaer (aria-invalid/
// aria-describedby, norsk/kort/saklig feiltekst), og samme faste
// "Ferdig"-primærknapp (.knapp-fast) som Story 1.4s oppsett-form.
export default function MalForm({
  harAmexElite,
  harMastercardPremium,
  poengmal,
  harCompanionTicket: harCompanionTicketFraServer,
  harFlyPremium: harFlyPremiumFraServer,
  bonuspoengIDag,
  bonuspoengSiste12Mnd,
  amexForbrukOre,
  trumfKronerOre,
}: MalFormProps) {
  const router = useRouter();
  const poengmalId = useId();
  const poengmalFeilId = useId();
  const companionTicketId = useId();
  const companionTicketFeilId = useId();
  const flyPremiumId = useId();
  const flyPremiumFeilId = useId();
  const bonuspoengIDagId = useId();
  const bonuspoengIDagHjelpId = useId();
  const bonuspoengIDagFeilId = useId();
  const bonuspoengSiste12MndId = useId();
  const bonuspoengSiste12MndHjelpId = useId();
  const bonuspoengSiste12MndFeilId = useId();
  const amexForbrukId = useId();
  const amexForbrukFeilId = useId();
  const trumfKronerId = useId();
  const trumfKronerFeilId = useId();

  const [poengmalVerdi, setPoengmalVerdi] = useState(heltallStreng(poengmal));
  const [harCompanionTicket, setHarCompanionTicket] = useState(harCompanionTicketFraServer);
  const [harFlyPremium, setHarFlyPremium] = useState(harFlyPremiumFraServer);
  const [bonuspoengIDagVerdi, setBonuspoengIDagVerdi] = useState(heltallStreng(bonuspoengIDag));
  const [bonuspoengSiste12MndVerdi, setBonuspoengSiste12MndVerdi] = useState(
    heltallStreng(bonuspoengSiste12Mnd),
  );
  const [amexForbrukVerdi, setAmexForbrukVerdi] = useState(oreTilKronerStreng(amexForbrukOre));
  const [trumfKronerVerdi, setTrumfKronerVerdi] = useState(oreTilKronerStreng(trumfKronerOre));
  const [feil, setFeil] = useState<LagreMalFeil>({});
  const [venter, setVenter] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeil({});
    setVenter(true);

    try {
      const resultat = await lagreMal({
        poengmal: poengmalVerdi,
        harCompanionTicket,
        harFlyPremium,
        bonuspoengIDag: bonuspoengIDagVerdi,
        bonuspoengSiste12Mnd: bonuspoengSiste12MndVerdi,
        amexForbruk: amexForbrukVerdi,
        trumfKroner: trumfKronerVerdi,
      });

      if (!resultat.ok) {
        setFeil(resultat.feil);
        setVenter(false);
        return;
      }

      // Boundaries: "Ferdig" etter gyldig lagring sender til Hjem.
      router.push('/');
      router.refresh();
    } catch {
      setFeil({ generell: 'Noe gikk feil. Prøv igjen.' });
      setVenter(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor={poengmalId}>Poengmål</label>
        <input
          id={poengmalId}
          name="poengmal"
          type="text"
          inputMode="decimal"
          value={poengmalVerdi}
          onChange={(event) => setPoengmalVerdi(event.target.value)}
          disabled={venter}
          aria-invalid={feil.poengmal ? true : undefined}
          aria-describedby={feil.poengmal ? poengmalFeilId : undefined}
        />
        {feil.poengmal && (
          <p id={poengmalFeilId} role="alert">
            {feil.poengmal}
          </p>
        )}
      </div>

      {harAmexElite && (
        <div>
          <label htmlFor={companionTicketId}>
            <input
              id={companionTicketId}
              name="har-companion-ticket"
              type="checkbox"
              checked={harCompanionTicket}
              onChange={(event) => setHarCompanionTicket(event.target.checked)}
              disabled={venter}
              aria-invalid={feil.harCompanionTicket ? true : undefined}
              aria-describedby={feil.harCompanionTicket ? companionTicketFeilId : undefined}
            />
            Companion Ticket
          </label>
        </div>
      )}
      {/* Utenfor harAmexElite-blokken: hvis brukeren tidligere hadde Amex
          Elite og lagret harCompanionTicket: true, men siden mistet kortet
          (Story 1.4s lagreOppsett erstatter BrukerKort), avviser serveren
          fortsatt (ok) — men feilen må vises selv om boksen over ikke
          rendres, ellers ser "Ferdig" ut som den ikke gjør noe. */}
      {feil.harCompanionTicket && (
        <p id={companionTicketFeilId} role="alert">
          {feil.harCompanionTicket}
        </p>
      )}

      {harMastercardPremium && (
        <div>
          <label htmlFor={flyPremiumId}>
            <input
              id={flyPremiumId}
              name="har-fly-premium"
              type="checkbox"
              checked={harFlyPremium}
              onChange={(event) => setHarFlyPremium(event.target.checked)}
              disabled={venter}
              aria-invalid={feil.harFlyPremium ? true : undefined}
              aria-describedby={feil.harFlyPremium ? flyPremiumFeilId : undefined}
            />
            Fly Premium
          </label>
        </div>
      )}
      {/* Samme begrunnelse som over, for Mastercard Premium/Fly Premium. */}
      {feil.harFlyPremium && (
        <p id={flyPremiumFeilId} role="alert">
          {feil.harFlyPremium}
        </p>
      )}

      <div>
        <label htmlFor={bonuspoengIDagId}>Bonuspoeng i dag</label>
        <input
          id={bonuspoengIDagId}
          name="bonuspoeng-i-dag"
          type="text"
          inputMode="decimal"
          value={bonuspoengIDagVerdi}
          onChange={(event) => setBonuspoengIDagVerdi(event.target.value)}
          disabled={venter}
          aria-invalid={feil.bonuspoengIDag ? true : undefined}
          aria-describedby={
            feil.bonuspoengIDag
              ? `${bonuspoengIDagHjelpId} ${bonuspoengIDagFeilId}`
              : bonuspoengIDagHjelpId
          }
        />
        <p id={bonuspoengIDagHjelpId}>Saldoen du har akkurat nå.</p>
        {feil.bonuspoengIDag && (
          <p id={bonuspoengIDagFeilId} role="alert">
            {feil.bonuspoengIDag}
          </p>
        )}
      </div>

      {/* FR-20 / UX-DR14: bare relevant for Fly Premium — skjules når målet
          ikke er valgt, i stedet for å spørre om et tall ingen bruker ser
          igjen. Feilmeldingen kan ikke dukke opp når feltet er skjult,
          siden handlinger.ts bare validerer dette feltet når
          harFlyPremium er sann — derfor trygt å ha den inni samme blokk
          (ulikt Companion Ticket/Fly Premium-feilene over, som kan komme
          fra en annen kilde enn avkrysningsboksen selv). */}
      {harFlyPremium && (
        <div>
          <label htmlFor={bonuspoengSiste12MndId}>Poeng opptjent siste 12 måneder</label>
          <input
            id={bonuspoengSiste12MndId}
            name="bonuspoeng-siste-12-mnd"
            type="text"
            inputMode="decimal"
            value={bonuspoengSiste12MndVerdi}
            onChange={(event) => setBonuspoengSiste12MndVerdi(event.target.value)}
            disabled={venter}
            aria-invalid={feil.bonuspoengSiste12Mnd ? true : undefined}
            aria-describedby={
              feil.bonuspoengSiste12Mnd
                ? `${bonuspoengSiste12MndHjelpId} ${bonuspoengSiste12MndFeilId}`
                : bonuspoengSiste12MndHjelpId
            }
          />
          <p id={bonuspoengSiste12MndHjelpId}>
            Poeng du har tjent de siste 12 månedene, også de du har brukt. Brukes til Fly
            Premium.
          </p>
          {feil.bonuspoengSiste12Mnd && (
            <p id={bonuspoengSiste12MndFeilId} role="alert">
              {feil.bonuspoengSiste12Mnd}
            </p>
          )}
        </div>
      )}

      <div>
        <label htmlFor={amexForbrukId}>Amex-forbruk hittil i kalenderåret (kr)</label>
        <input
          id={amexForbrukId}
          name="amex-forbruk"
          type="text"
          inputMode="decimal"
          value={amexForbrukVerdi}
          onChange={(event) => setAmexForbrukVerdi(event.target.value)}
          disabled={venter}
          aria-invalid={feil.amexForbrukOre ? true : undefined}
          aria-describedby={feil.amexForbrukOre ? amexForbrukFeilId : undefined}
        />
        {feil.amexForbrukOre && (
          <p id={amexForbrukFeilId} role="alert">
            {feil.amexForbrukOre}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={trumfKronerId}>Trumf-kroner siden siste overføring (kr)</label>
        <input
          id={trumfKronerId}
          name="trumf-kroner"
          type="text"
          inputMode="decimal"
          value={trumfKronerVerdi}
          onChange={(event) => setTrumfKronerVerdi(event.target.value)}
          disabled={venter}
          aria-invalid={feil.trumfKronerOre ? true : undefined}
          aria-describedby={feil.trumfKronerOre ? trumfKronerFeilId : undefined}
        />
        {feil.trumfKronerOre && (
          <p id={trumfKronerFeilId} role="alert">
            {feil.trumfKronerOre}
          </p>
        )}
      </div>

      {feil.generell && <p role="alert">{feil.generell}</p>}

      <button type="submit" className="knapp-fast" disabled={venter}>
        Ferdig
      </button>
    </form>
  );
}
