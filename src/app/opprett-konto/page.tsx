'use client';

import { useId, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/app/auth-client';

type Feltfeil = {
  navn?: string;
  epost?: string;
  passord?: string;
  generell?: string;
};

// FR-1 / UX-DR13: feilmeldinger knyttes til feltet som har feilen, norsk,
// kort, saklig, uten utropstegn (Voice and Tone, EXPERIENCE.md).
function tolkFeil(kode: string | undefined): Feltfeil {
  switch (kode) {
    case 'INVALID_EMAIL':
      return { epost: 'Ugyldig e-postadresse.' };
    case 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL':
      return { epost: 'Denne e-postadressen er allerede registrert.' };
    case 'PASSWORD_TOO_SHORT':
      return { passord: 'Passordet er for kort.' };
    case 'PASSWORD_TOO_LONG':
      return { passord: 'Passordet er for langt.' };
    case 'INVALID_PASSWORD':
      return { passord: 'Skriv et passord.' };
    default:
      return { generell: 'Noe gikk feil. Prøv igjen.' };
  }
}

export default function OpprettKontoSide() {
  const router = useRouter();
  const navnId = useId();
  const epostId = useId();
  const passordId = useId();
  const [navn, setNavn] = useState('');
  const [epost, setEpost] = useState('');
  const [passord, setPassord] = useState('');
  const [feil, setFeil] = useState<Feltfeil>({});
  const [venter, setVenter] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeil({});
    setVenter(true);

    try {
      const { error } = await authClient.signUp.email({
        name: navn,
        email: epost,
        password: passord,
      });

      if (error) {
        setFeil(tolkFeil(error.code));
        setVenter(false);
        return;
      }

      router.push('/oppsett');
      router.refresh();
    } catch {
      // Uventet feil (f.eks. nettverksfeil) — vis generell feilmelding i
      // stedet for å la knappen bli stående «venter» uten tilbakemelding.
      setFeil({ generell: 'Noe gikk feil. Prøv igjen.' });
      setVenter(false);
    }
  }

  return (
    <main className="skall-innhold">
      <h1>Opprett konto</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor={navnId}>Navn</label>
          <input
            id={navnId}
            name="navn"
            type="text"
            autoComplete="name"
            required
            value={navn}
            onChange={(event) => setNavn(event.target.value)}
            aria-invalid={feil.navn ? true : undefined}
            aria-describedby={feil.navn ? `${navnId}-feil` : undefined}
          />
          {feil.navn && (
            <p id={`${navnId}-feil`} role="alert">
              {feil.navn}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={epostId}>E-post</label>
          <input
            id={epostId}
            name="epost"
            type="email"
            autoComplete="email"
            required
            value={epost}
            onChange={(event) => setEpost(event.target.value)}
            aria-invalid={feil.epost ? true : undefined}
            aria-describedby={feil.epost ? `${epostId}-feil` : undefined}
          />
          {feil.epost && (
            <p id={`${epostId}-feil`} role="alert">
              {feil.epost}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={passordId}>Passord</label>
          <input
            id={passordId}
            name="passord"
            type="password"
            autoComplete="new-password"
            required
            value={passord}
            onChange={(event) => setPassord(event.target.value)}
            aria-invalid={feil.passord ? true : undefined}
            aria-describedby={feil.passord ? `${passordId}-feil` : undefined}
          />
          {feil.passord && (
            <p id={`${passordId}-feil`} role="alert">
              {feil.passord}
            </p>
          )}
        </div>
        {feil.generell && <p role="alert">{feil.generell}</p>}
        <button type="submit" disabled={venter}>
          Opprett konto
        </button>
      </form>
      <p>
        Har du allerede konto? <Link href="/logg-inn">Logg inn</Link>
      </p>
    </main>
  );
}
