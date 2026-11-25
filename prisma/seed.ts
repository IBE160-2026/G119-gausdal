/**
 * NFR-6 / AR-8: Oppretter en oppdiktet testbruker README kan vise til, slik
 * at sensor kan logge inn uten å registrere konto manuelt. Skriver
 * User+Account-rader direkte med Prisma (ikke via sign-up over HTTP) og
 * hasher passordet med Better Auths egen `hashPassword` — aldri egen
 * hashing-kode, aldri klartekst i databasen.
 *
 * Idempotent: `app`-tjenesten i docker-compose.yml har
 * `restart: unless-stopped`, så dette skriptet kjører på HVER oppstart, ikke
 * bare første gang. `create()` kan likevel kollidere med en annen prosess
 * som seeder samtidig (en `findUnique` først, så et separat `create()`, er
 * ikke atomisk) — fanger derfor Prismas unik-constraint-feil (`P2002`) og
 * behandler den som «finnes allerede» i stedet for å sjekke først.
 */
import { randomUUID } from 'node:crypto';
import { hashPassword } from 'better-auth/crypto';
import { Prisma } from '@prisma/client';
import { db } from '../src/app/db';

export const TEST_EPOST = 'petter@eksempel.test';
export const TEST_PASSORD = 'kiwi-trumf-1808';
const TEST_NAVN = 'Petter Testbruker';

async function main() {
  const brukerId = randomUUID();
  const hashetPassord = await hashPassword(TEST_PASSORD);
  const nå = new Date();

  try {
    await db.user.create({
      data: {
        id: brukerId,
        name: TEST_NAVN,
        email: TEST_EPOST,
        emailVerified: false,
        createdAt: nå,
        updatedAt: nå,
        accounts: {
          create: {
            id: randomUUID(),
            accountId: brukerId,
            providerId: 'credential',
            password: hashetPassord,
            createdAt: nå,
            updatedAt: nå,
          },
        },
      },
    });

    console.log(`Seed: testbrukeren ${TEST_EPOST} er opprettet.`);
  } catch (error) {
    const erAlleredeOpprettet =
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';

    if (!erAlleredeOpprettet) {
      throw error;
    }

    console.log(`Seed: testbrukeren ${TEST_EPOST} finnes allerede. Gjør ingenting.`);
  }
}

// Story 1.4 / AR-3: kortkatalogen (Amex Elite, Mastercard Premium) seedes
// idempotent med samme `upsert`-mønster som README nevner som alternativ til
// testbrukerens `create` + fang-P2002-mønster — `upsert` på `kode` er enklere
// her siden radene ikke har noe å kollidere med utover unik-constrainten.
const KORT_SEED = [
  { kode: 'amex-elite', navn: 'Amex Elite' },
  { kode: 'mastercard-premium', navn: 'Mastercard Premium' },
] as const;

async function seedKort() {
  for (const kort of KORT_SEED) {
    await db.kort.upsert({
      where: { kode: kort.kode },
      update: { navn: kort.navn },
      create: { kode: kort.kode, navn: kort.navn },
    });
  }

  console.log('Seed: kortkatalogen (Amex Elite, Mastercard Premium) er oppdatert.');
}

main()
  .then(seedKort)
  .catch((error) => {
    console.error('Seed feilet:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
