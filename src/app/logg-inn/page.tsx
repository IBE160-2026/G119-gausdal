'use client';

import { useId, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/app/auth-client';

type Feltfeil = {
  epost?: string;
  passord?: string;
  generell?: string;
};

// UX-DR13 / UX-DR14: feil e-post/passord gir én samlet feilmelding knyttet
// til passordfeltet — Better Auth skiller ikke mellom «finnes ikke» og
// «feil passord» av sikkerhetsgrunner, og meldingen skal ikke late som den
// vet mer enn den gjør. Norsk, kort, saklig, uten utropstegn.
function tolkFeil(kode: string | undefined): Feltfeil {
  switch (kode) {
    case 'INVALID_EMAIL':
      return { epost: 'Ugyldig e-postadresse.' };
    case 'INVALID_EMAIL_OR_PASSWORD':
      return { passord: 'Feil e-post eller passord.' };
    default:
      return { generell: 'Noe gikk feil. Prøv igjen.' };
  }
}

export default function LoggInnSide() {
  const router = useRouter();
  const epostId = useId();
  const passordId = useId();
  const [epost, setEpost] = useState('');
  const [passord, setPassord] = useState('');
  const [feil, setFeil] = useState<Feltfeil>({});
  const [venter, setVenter] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeil({});
    setVenter(true);

    try {
      const { error } = await authClient.signIn.email({
        email: epost,
        password: passord,
      });

      if (error) {
        setFeil(tolkFeil(error.code));
        setVenter(false);
        return;
      }

      router.push('/');
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
      <h1>Logg inn</h1>
      <form onSubmit={handleSubmit}>
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
            autoComplete="current-password"
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
          Logg inn
        </button>
      </form>
      <p>
        Ny her? <Link href="/opprett-konto">Opprett konto</Link>
      </p>
    </main>
  );
}
