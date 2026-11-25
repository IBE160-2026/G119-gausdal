# Prosjektoppsett Story 1.1

## 2026-11-25 kl. 14:49 — Anneli Gausdal

### Oppgave
Implementere `_bmad-output/implementation-artifacts/spec-1-1-prosjektoppsett.md` (Story 1.1:
«Prosjektoppsett som kan startes med én kommando») i sin helhet, slik at sensor kan klone
repoet og starte appen med `docker compose up`, med en ren `src/domain/` beskyttet av lint
fra dag én.

### Plan
- Next.js 16 (App Router, TypeScript) med enkel norsk Hjem-side.
- `src/domain/` med én ren funksjon + Vitest-test; `eslint.config.mjs` med
  `no-restricted-imports`/`no-restricted-globals`/`no-restricted-syntax` som håndhever AD-2
  for `src/domain/**`.
- `prisma/schema.prisma` (PostgreSQL, ingen domenemodeller) + `prisma/migrations/`.
- `src/app/config.ts` (eneste sted som leser `process.env`) + `.env.example`.
- `src/app/storage/` — grensesnitt + lokal mappe som standardimplementasjon (AD-9).
- `Dockerfile` + `docker-compose.yml` — app + PostgreSQL, migrering ved oppstart (AD-11).
- `README.md` oppdatert med forutsetninger, `docker compose up`, `npm test`.
- Plandokument: ingen eget plan-dokument ble skrevet først — spec-filen selv
  (`spec-1-1-prosjektoppsett.md`) var kilden til sannhet og ble lest fullt ut, sammen med
  `epic-1-context.md` og `ARCHITECTURE-SPINE.md` fra frontmatter `context:`.

### Resultat
Alle filer i spec-ens Tasks & Acceptance er laget:
`package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`,
`src/domain/hello.ts`, `tests/domain/hello.test.ts`, `vitest.config.ts`, `eslint.config.mjs`,
`prisma/schema.prisma`, `prisma/migrations/20261125000000_init/` (bevisst tom migrering),
`prisma/migrations/migration_lock.toml`, `prisma.config.ts` (ny — se avvik under),
`src/app/config.ts`, `.env.example`, `src/app/storage/{typer.ts,lokal-lagring.ts,index.ts}`,
`Dockerfile`, `docker-compose.yml`, `.dockerignore`, `public/.gitkeep`, oppdatert
`.gitignore` og `README.md`.

Versjoner pinnet eksakt (AD-3/AR-1): Next.js 16.4.6, React 19.3.1, TypeScript 5.9.3,
Vitest 5.1.2, Prisma 7.10.1 / `@prisma/client` 7.10.1, Better Auth 1.7.28 (kun avhengighet,
ikke konfigurert — eies av Story 1.3), ESLint 9.39.5, `eslint-config-next` 16.4.6,
PostgreSQL `19.0-alpine` i `docker-compose.yml`, Node 22 LTS i `Dockerfile`.

**Avvik fra spec, oppdaget under implementering (notert i spec-filens Implementation Notes):**
Prisma 7.10.1 støtter ikke lenger `url` i `datasource`-blokken i `schema.prisma` — den
ble fjernet i Prisma 7 (bekreftet med `npx prisma validate`, feilkode P1012). Løsning:
tilkoblingsstrengen flyttet til en ny `prisma.config.ts` i rotmappen
(`defineConfig`/`env` fra `prisma/config`), `schema.prisma` har bare `provider`.
`src/app/config.ts` er fortsatt det eneste stedet appen selv leser `DATABASE_URL`/`STORAGE_DIR`
fra (AD-10 uendret).

**Sikkerhet:** `npm audit` fant én høy ReDoS-sårbarhet i `effect` (transitiv via
`@prisma/config`) — fikset med `"overrides": { "effect": "3.22.5" }` i `package.json`.
`npm audit` viser 0 sårbarheter etter dette. `package.json` fikk også et `allowScripts`-felt
(npm sin install-scripts-godkjenning for `@prisma/engines`, `prisma`, `fsevents`) — nødvendig
for at Prisma skal laste ned query engine-binærer ved `npm install`.

**Verifisert i denne sesjonen:**
- `npm test` — 2 tester, grønt (Vitest, ingen nettverk/nøkler).
- `npm run lint` — grønt på hele repoet; bekreftet live at en fil i `src/domain/` som
  importerer `@prisma/client`, importerer `@/app/config`, bruker `fetch`, `Date.now()` og
  `new Date()` faktisk feiler lint med 6 feil, alle med AD-2-henvisning i meldingen
  (testfilen ble fjernet igjen etter verifisering).
- `npm run build` — Next.js bygger uten feil (Turbopack).
- `npx prisma validate` — gyldig schema.
- `docker compose config` — gyldig, og bekrefter at standardverdier for
  `POSTGRES_USER`/`PASSWORD`/`DB` og `DATABASE_URL` brukes når `.env` mangler (AD-10,
  I/O-matrisens «Mangler .env»-rad).

Ingen commit er gjort av selve implementasjonen — venter på bruker.

### Åpne punkter
- `docker compose up` er **ikke** kjørt live: Docker Desktop-daemonen var ikke tilgjengelig
  i dette sandbox-miljøet (ingen socket, ingen prosess). Hele kjeden
  (Postgres-healthcheck → `prisma migrate deploy` → `next start` → svar på port 3000) må
  verifiseres manuelt på en maskin med Docker kjørende før historien kan godkjennes.
- `prisma/migrations/20261125000000_init/migration.sql` er håndskrevet (bevisst tom, bare en
  kommentar) i stedet for generert av `prisma migrate dev`, fordi ingen database var
  tilgjengelig i sandbox til å generere den ekte migreringen mot. Formatet følger Prisma sin
  standard, men bør bekreftes med en reell `prisma migrate deploy`-kjøring (dekkes av punktet
  over).
- Spec-filens metadata (`status: in-progress`, `baseline_commit`) ble ikke endret av meg —
  de var allerede satt før denne økten startet og eies av dispatch-flyten, ikke av
  implementeringsarbeidet.

Speiles i `issues.md`.
