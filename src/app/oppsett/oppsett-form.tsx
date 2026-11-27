'use client';

import { useId, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { lagreOppsett, type LagreOppsettFeil } from './handlinger';

type Korttype = {
  kode: string;
  navn: string;
};

type OppsettFormProps = {
  korttyper: Korttype[];
  valgteKortKoder: string[];
  trumfKoblet: boolean | null;
  kunSas: boolean | null;
};

// FR-2 / FR-5 / FR-6 / UX-DR13: ett samlet skjema for kort, Trumf og
// SkyTeam-valget, med én fast "Neste"-knapp (se Boundaries i spec-1-4 for
// hvorfor dette ikke er fem separate sidelastinger). Feltfeil vises med
// samme mønster som logg-inn/opprett-konto (Story 1.3): norsk, kort,
// saklig, uten utropstegn, knyttet til feltet som har feilen.
export default function OppsettForm({
  korttyper,
  valgteKortKoder,
  trumfKoblet: trumfKobletFraServer,
  kunSas: kunSasFraServer,
}: OppsettFormProps) {
  const router = useRouter();
  const kortFeilId = useId();
  const trumfJaId = useId();
  const trumfNeiId = useId();
  const trumfFeilId = useId();
  const kunSasJaId = useId();
  const kunSasNeiId = useId();
  const kunSasFeilId = useId();

  const [valgteKoder, setValgteKoder] = useState<Set<string>>(() => new Set(valgteKortKoder));
  const [trumfKoblet, setTrumfKoblet] = useState<boolean | null>(trumfKobletFraServer);
  const [kunSas, setKunSas] = useState<boolean | null>(kunSasFraServer);
  const [feil, setFeil] = useState<LagreOppsettFeil>({});
  const [venter, setVenter] = useState(false);

  function vekslKort(kode: string, avkrysset: boolean) {
    setValgteKoder((forrige) => {
      const neste = new Set(forrige);
      if (avkrysset) {
        neste.add(kode);
      } else {
        neste.delete(kode);
      }
      return neste;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeil({});
    setVenter(true);

    try {
      const resultat = await lagreOppsett({
        kortKoder: Array.from(valgteKoder),
        trumfKoblet: trumfKoblet ?? undefined,
        kunSas: kunSas ?? undefined,
      });

      if (!resultat.ok) {
        setFeil(resultat.feil);
        setVenter(false);
        return;
      }

      // Boundaries: "Neste" etter gyldig lagring sender til oppsettets
      // andre steg (Story 1.5), ikke til Hjem.
      router.push('/oppsett/mal');
      router.refresh();
    } catch {
      // Uventet feil (f.eks. nettverksfeil) — vis generell feilmelding i
      // stedet for å la knappen bli stående «venter» uten tilbakemelding.
      setFeil({ generell: 'Noe gikk feil. Prøv igjen.' });
      setVenter(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>Hvilke kort har du?</legend>
        {korttyper.map((korttype) => (
          <div key={korttype.kode}>
            <label>
              <input
                type="checkbox"
                name="kort"
                value={korttype.kode}
                checked={valgteKoder.has(korttype.kode)}
                onChange={(event) => vekslKort(korttype.kode, event.target.checked)}
                disabled={venter}
                aria-invalid={feil.kort ? true : undefined}
                aria-describedby={feil.kort ? kortFeilId : undefined}
              />
              {korttype.navn}
            </label>
          </div>
        ))}
        {feil.kort && (
          <p id={kortFeilId} role="alert">
            {feil.kort}
          </p>
        )}
      </fieldset>

      <fieldset>
        <legend>Er Trumf koblet til EuroBonus med automatisk overføring?</legend>
        <div>
          <label htmlFor={trumfJaId}>
            <input
              id={trumfJaId}
              type="radio"
              name="trumf-koblet"
              checked={trumfKoblet === true}
              onChange={() => setTrumfKoblet(true)}
              disabled={venter}
              aria-describedby={feil.trumfKoblet ? trumfFeilId : undefined}
            />
            Ja
          </label>
        </div>
        <div>
          <label htmlFor={trumfNeiId}>
            <input
              id={trumfNeiId}
              type="radio"
              name="trumf-koblet"
              checked={trumfKoblet === false}
              onChange={() => setTrumfKoblet(false)}
              disabled={venter}
              aria-describedby={feil.trumfKoblet ? trumfFeilId : undefined}
            />
            Nei
          </label>
        </div>
        {feil.trumfKoblet && (
          <p id={trumfFeilId} role="alert">
            {feil.trumfKoblet}
          </p>
        )}
      </fieldset>

      <fieldset>
        <legend>Reiser du bare med SAS, eller også andre SkyTeam-selskaper?</legend>
        <div>
          <label htmlFor={kunSasJaId}>
            <input
              id={kunSasJaId}
              type="radio"
              name="kun-sas"
              checked={kunSas === true}
              onChange={() => setKunSas(true)}
              disabled={venter}
              aria-describedby={feil.kunSas ? kunSasFeilId : undefined}
            />
            Bare SAS
          </label>
        </div>
        <div>
          <label htmlFor={kunSasNeiId}>
            <input
              id={kunSasNeiId}
              type="radio"
              name="kun-sas"
              checked={kunSas === false}
              onChange={() => setKunSas(false)}
              disabled={venter}
              aria-describedby={feil.kunSas ? kunSasFeilId : undefined}
            />
            Også andre SkyTeam-selskaper
          </label>
        </div>
        {feil.kunSas && (
          <p id={kunSasFeilId} role="alert">
            {feil.kunSas}
          </p>
        )}
      </fieldset>

      {feil.generell && <p role="alert">{feil.generell}</p>}

      <button type="submit" className="knapp-fast" disabled={venter}>
        Neste
      </button>
    </form>
  );
}
