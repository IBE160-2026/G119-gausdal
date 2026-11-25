'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/app/auth-client';

export default function MegSide() {
  const router = useRouter();
  const [loggerUt, setLoggerUt] = useState(false);

  async function handleLoggUt() {
    setLoggerUt(true);

    try {
      const { error } = await authClient.signOut();
      if (error) {
        console.error('Logg ut feilet:', error);
      }
    } catch (error) {
      console.error('Logg ut feilet:', error);
    } finally {
      // Uansett utfall: send brukeren til /logg-inn. krevSesjon() på neste
      // side sjekker den faktiske sesjonen på nytt — knappen skal aldri bli
      // stående «venter» eller late som utlogging lyktes når den ikke gjorde
      // det.
      router.push('/logg-inn');
      router.refresh();
    }
  }

  return (
    <main>
      <h1>Meg</h1>
      <p>Kommer snart.</p>
      <button type="button" onClick={handleLoggUt} disabled={loggerUt}>
        Logg ut
      </button>
    </main>
  );
}
