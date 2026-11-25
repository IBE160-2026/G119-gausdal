# G119 — Anneli

Gruppeprosjekt i **IBE160 Programmering med KI** ved Høgskolen i Molde, høsten 2026 (15 studiepoeng).

Repoet inneholder gruppens applikasjon og dokumentasjon av utvikling, testing og kvalitetssikring med KI.

## Medlemmer

- Anneli Gausdal

## Forutsetninger

- [Docker](https://www.docker.com/) med Docker Compose (for å kjøre appen)
- [Node.js](https://nodejs.org/) 22 LTS og npm (for å kjøre tester lokalt uten Docker)

Ingen nøkler eller nettverkstilgang er nødvendig for å starte appen eller kjøre testene i v1.

## Kjøre appen

```sh
docker compose up
```

Dette starter PostgreSQL og appen, kjører databasemigreringer og seed
automatisk, og innlogging er tilgjengelig på <http://localhost:3000>
(uinnlogget sendes du til `/logg-inn`). Mangler `.env`, brukes
standardverdier for lokal utvikling (satt i `docker-compose.yml`) — appen
krasjer ikke.

Skal du sette egne verdier, kopier `.env.example` til `.env` og fyll inn.

### Testbruker (NFR-6)

Seed-skriptet (`prisma/seed.ts`) oppretter denne oppdiktede testbrukeren
automatisk hver gang `docker compose up` kjører (idempotent — oppretter den
ikke på nytt hvis den finnes):

- E-post: `petter@eksempel.test`
- Passord: `kiwi-trumf-1808`

Logg inn med disse opplysningene på <http://localhost:3000/logg-inn>, eller
opprett en ny konto på `/opprett-konto`.

## Kjøre tester

```sh
npm install
npm test
```

Testene kjører med Vitest, uten nettverk og uten nøkler.

## Lint

```sh
npm run lint
```

`src/domain/` er en ren kjerne (AD-2): den kan ikke importere fra `src/app/`
eller Prisma, og kan ikke bruke `fetch` eller klokken (`Date.now()`/`new Date()`)
direkte. Lint-regelen håndhever dette og feiler med en melding som peker til AD-2.

## Mappestruktur

```text
src/
  domain/   # ren regelmotor (AD-2) — ingen database, nettverk eller klokke
  app/      # sider, serverfunksjoner, config, fillagring
prisma/     # datamodell og migreringer (AD-3)
tests/      # Vitest mot domain/
docs/       # PRD, vedlegg, prosessdokumentasjon
```
