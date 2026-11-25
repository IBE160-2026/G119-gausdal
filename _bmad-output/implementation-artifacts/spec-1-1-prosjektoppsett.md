---
title: 'Story 1.1: Prosjektoppsett som kan startes med én kommando'
type: 'feature'
created: '2026-11-25'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '4d9af965cd9056f3631906cc1159a533f0163c6a'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-G119-gausdal-2026-11-24/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Repoet har ingen kode. Sensor må kunne klone det og starte appen uten å sette opp noe selv, og kjernen (`domain/`) må være beskyttet mot avhengigheter fra første dag.

**Approach:** Sett opp Next.js 16 (App Router, TypeScript) med Prisma, Better Auth og Vitest, en `docker-compose.yml` som starter app og PostgreSQL og kjører migreringer, en enkel Hjem-side, en lint-regel som holder `src/domain/` ren, og en første README. Bare oppsett: ingen innloggingsskjermer, ingen datamodell utover det som trengs for at migrering kjører.

## Boundaries & Constraints

**Always:** Mappestruktur etter ryggraden (`src/domain/`, `src/app/`, `prisma/`, `tests/`, `docs/`). Norsk UI-tekst. Eksakte versjoner pinnes i `package.json` og `docker-compose.yml` (AD-3, ryggradens Stack). Konfigurasjon leses kun i `src/app/config.ts` (AD-10). Commit-meldinger nevner AR-/AD-ID (AD-12).

**Never:** Ingen ekte nøkler eller passord i repoet (kun `.env.example` uten verdier). Ingen SQLite. Ingen tema, navigasjon, innlogging, satser eller poengregler (Story 1.2, 1.3, Epic 2). Ingen filer lagres i v1. Ikke flytt eller slett eksisterende `_bmad/`, `.claude/`, `docs/`, `.logs/`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Oppstart | Ren maskin, Docker, `docker compose up` | Postgres og app starter, migreringer kjører, `http://localhost:3000` viser Hjem | App venter på at databasen er klar (healthcheck) |
| Test | `npm test` uten nett og nøkler | Vitest består, minst én test mot `src/domain/` | N/A |
| Lint-brudd | Fil i `src/domain/` importerer fra `src/app/`, `@prisma/*`, bruker `fetch` eller `Date.now()` | `npm run lint` feiler | Meldingen peker på AD-2 |
| Mangler `.env` | Ingen `.env` | Compose bruker standardverdier for lokal utvikling | Ingen krasj |

</frozen-after-approval>

## Code Map

Greenfield: repoet har ingen app-kode. Eksisterer allerede og skal ikke røres: `_bmad/`, `.claude/`, `docs/`, `.logs/`, `_bmad-output/`, `product-brief.md`, `.gitignore` (dekker allerede `.env`, `node_modules/`, `.next/`; utvides ved behov), `README.md` (eksisterer; utvides, ikke erstattes blindt).

## Tasks & Acceptance

**Execution:**
- [x] `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx` -- Next.js 16-app med enkel norsk Hjem-side -- AR-1
- [x] `src/domain/` (f.eks. `hello.ts`) og `tests/` -- én ren funksjon med Vitest-test -- AR-11, AD-2
- [x] `vitest.config.ts` -- konfigurasjon uten nettverk -- AD-11
- [x] `eslint.config.mjs` -- `no-restricted-imports` og `no-restricted-globals`/-syntax for `src/domain/` -- AR-2
- [x] `prisma/schema.prisma`, `prisma/migrations/` -- datasource PostgreSQL, ingen domenemodeller -- AR-3
- [x] `src/app/config.ts` og `.env.example` -- én leser for miljøvariabler, navn uten verdier -- AR-10
- [x] `src/app/storage/` -- tomt grensesnitt med lokal mappe som standard -- AR-9
- [x] `Dockerfile`, `docker-compose.yml` -- app og PostgreSQL, migrering ved oppstart -- AR-11
- [x] `README.md` -- første versjon med forutsetninger og kommandoene `docker compose up` og `npm test` -- AR-13

**Acceptance Criteria:**
- Given repoet klonet og Docker kjører, when `docker compose up`, then app og Postgres starter, migreringer kjører og Hjem svarer på port 3000.
- Given prosjektet, when `npm test`, then Vitest består uten nøkler og nett.
- Given en forbudt import i `src/domain/`, when `npm run lint`, then lint feiler.
- Given `.env.example` og `.gitignore`, then alle variabelnavn finnes uten verdier og `.env` er ignorert.

## Implementation Notes

**Prisma 7 og tilkoblingsstreng (viser til Design Notes-beslutningen):** `prisma validate`
feilet med `P1012` — Prisma 7.10.1 har fjernet støtte for `url` i `datasource`-blokken i
`schema.prisma`. Løsning: `datasource db { provider = "postgresql" }` uten `url`, og en ny
`prisma.config.ts` i rotmappen (`defineConfig`/`env` fra `prisma/config`) leser
`DATABASE_URL` for Prisma CLI (migrate/generate). `src/app/config.ts` er fortsatt det eneste
stedet *appen* leser `process.env` fra (AD-10 uendret) — `prisma.config.ts` styrer bare
CLI-et, ikke kjøretiden til Next.js.

**Tom schema fungerte, men uten `url`:** Et tomt schema (ingen domenemodeller) validerer og
genererer klient fint i Prisma 7, så ingen plassholdermodell var nødvendig. Siden ingen
database var tilgjengelig i utviklingsmiljøet til å kjøre `prisma migrate dev`, er den første
migreringen (`prisma/migrations/20261125000000_init/migration.sql`) håndskrevet som en
bevisst tom, kommentert migrering i Prisma sitt standardformat, i stedet for CLI-generert.
Dette bør bekreftes med en reell `prisma migrate deploy`-kjøring ved første `docker compose up`.

**Sikkerhet:** `npm audit` fant en høy ReDoS-sårbarhet i `effect` (transitiv avhengighet via
`@prisma/config`). Fikset med `"overrides": { "effect": "3.22.5" }` i `package.json` — 0
sårbarheter etter dette.

**Verifisert (uten Docker daemon tilgjengelig i miljøet):** `npm test`, `npm run lint`
(inkludert en midlertidig fil i `src/domain/` som bekreftet at forbudt import/`fetch`/
`Date.now()`/`new Date()` faktisk feiler lint med AD-2-henvisning), `npm run build`,
`npx prisma validate`, `docker compose config`. **Ikke verifisert:** `docker compose up`
live (Postgres + migrering + app i container) — Docker Desktop-daemonen var ikke tilgjengelig
i dette miljøet. Må kjøres manuelt før historien godkjennes.

## Spec Change Log

## Review Triage Log

| Finding | Verdict | Evidence |
|---|---|---|
| `Dockerfile` build-stage: `RUN npx prisma generate` har ingen `DATABASE_URL` tilgjengelig (ingen `ARG`/`ENV`, `.dockerignore` utelater `.env`); `prisma.config.ts`s `env('DATABASE_URL')` kaster synkront når variabelen ikke er et ekte prosessmiljøvariabel. Samme feil hindrer `npm run prisma:migrate:dev` lokalt når bare en `.env`-fil finnes. | high | Reprodusert: `env -i ... npx prisma validate` feiler med `PrismaConfigEnvError` både uten og med en `.env`-fil på disk (Prisma 7 laster ikke `.env` automatisk). `docker compose build` vil derfor feile før Postgres/migrering/app nås — bryter historiens hovedkriterium. |
| `src/app/config.ts`: `lesPakrevd`/`lesValgfri` sjekker `.trim()` for tomhet, men returnerer den utrimmede rå-verdien. | medium | Lest kildekoden: begge funksjonene `return verdi` / `return verdi`, ikke `.trim()`. Whitespace i `.env` (f.eks. etter copy-paste) gir en tilkoblingsstreng/mappe-sti med usynlig whitespace. |
| `docker-compose.yml` `app`-tjenesten hardkoder `DATABASE_URL` og `STORAGE_DIR` fra `POSTGRES_*`/fast verdi i stedet for å videreføre en bruker-satt verdi fra `.env`. | medium | Bekreftet i filen; README sier likevel "Skal du sette egne verdier, kopier `.env.example` til `.env` og fyll inn" — løftet stemmer ikke for `app`-tjenesten under `docker compose up`. |
| `docker-compose.yml`: Postgres-port `5432` publiseres på alle grensesnitt med svakt standardpassord (`g119`/`g119`), udokumentert. | low | Bekreftet `ports: ['5432:5432']` uten binding til `127.0.0.1`; ingen omtale i README. |
| `Dockerfile`: ingen `USER`-direktiv — containeren kjører som root. | low | Bekreftet: ingen `USER` i noen stage. |
| `package.json`: `"allowScripts"`-feltet er ikke en gyldig npm-nøkkel (pnpm-konsept). | low | Bekreftet: `npm help package.json` nevner ikke `allowScripts`; feltet gjør ingenting i npm. |
| `.dockerignore` utelater ikke `tests/` — sendes med i build-konteksten (ender ikke i runtime-image). | low | Bekreftet ved lesing av filen; kun kosmetisk, `runtime`-stage kopierer ikke `tests/`. |
| `eslint.config.mjs`: domenegrensen (AD-2) kan omgås med dynamisk `import()`, `require()`, `Date.now`-aliasing eller `process`-destrukturering. | medium | Reprodusert: testfiler med disse mønstrene ga 0 lint-feil, mens statisk `import '../app/config'` korrekt ble blokkert. |
| `src/app/config.ts`: eager evaluering kobler `storageDir`-bruk til `DATABASE_URL`-krav. | false | Ingen nåværende importør av `config` utenom `storage/lokal-lagring.ts`, som selv ikke importeres noe sted i `src/app/`. Uutløselig i dagens tre. |
| Ingen Prisma-klient-singleton (`src/app/db.ts`) er lagt til. | false | Frosset Approach sier eksplisitt "ingen datamodell utover det som trengs for migrering"; Better Auth/Story 1.3 eier dette. Ikke en del av AR-3/AR-10. |
| `vitest.config.ts` har ingen alias-oppsett for `@/*`. | false | Eneste testfil bruker relativ import og passerer; ingen kode i treet bruker `@/`-alias i tester i dag. |
| `src/app/storage/lokal-lagring.ts`: `lagre()` har ingen path-traversal-sjekk på `filnavn`. | false | Ingen kaller av `lokalLagring`/`lagre` finnes noe sted i `src/`. Frosset "Never": "Ingen filer lagres i v1." |
| `lokal-lagring.ts`: `hent()`/`slett()` tar vilkårlig `sti`, ikke begrenset til `storageDir`. | false | Samme årsak som over — uutløselig, eksplisitt utenfor scope i v1. |
| `lokal-lagring.ts`: `lagre()` overskriver eksisterende fil uten varsel. | false | Samme årsak — uutløselig i v1. |
| `restart: unless-stopped` + migreringsfeil kan gi restart-loop uten at feilen "synliggjøres". | false | Den eneste migreringen i dette diffet er bevisst tom/no-op (dokumentert i Implementation Notes) og kan ikke feile; `docker compose up` kjørt i forgrunnen (slik AC beskriver) viser feilen i loggen uansett. |
| `src/domain/hello.ts`: `hilsen()` kastes TypeError ved `navn === null/undefined`. | false | `navn: string` er ikke-nullbar i strict TypeScript; eneste kaller (testfilen) sender alltid gyldige strenger. |
| `AR-10 "ett sted for konfigurasjon"` brytes teknisk av `prisma.config.ts` som også leser `DATABASE_URL`. | false | Nødvendig konsekvens av at Prisma 7 fjernet `url` fra `schema.prisma`; kun én praktisk brukbar tolkning finnes (CLI-bootstrap ≠ appens kjøretidskonfigurasjon), allerede dokumentert transparent i Implementation Notes. |
| `Dockerfile`: `runtime`-stage kopierer full `node_modules` fra `build` uten å fjerne devDependencies (Vitest/ESLint/TS/Prisma CLI følger med i prod-image); `next.config.ts` setter ikke `output: 'standalone'`. | low | Bekreftet i begge filer. Avvist: usannsynlig å merkes i dagens lokale/vurderingsbruk, og en fullgod fiks krever omstrukturering av Docker-stages (mer enn en direkte rettelse). |
| `docker-compose.yml`: `app`-tjenesten har ingen `healthcheck` (i motsetning til `db`). | low | Bekreftet. Avvist: `alpine`-basen har ikke `curl`/`wget` installert, så en reell HTTP-helsesjekk krever mer enn en direkte rettelse. |

## Design Notes

Prisma kan ikke migrere uten modeller i enkelte versjoner; dersom tom schema ikke fungerer, brukes `prisma migrate deploy` uten migreringer, eller en minimal plassholder fjernes igjen i Story 1.3 (Better Auth eier brukertabellene). Beslutningen tas under implementering og noteres i Implementation Notes.

## Verification

**Commands:**
- `npm test` -- expected: alle tester består
- `npm run lint` -- expected: ingen feil; feiler når forbudt import legges inn midlertidig
- `npm run build` -- expected: Next.js bygger uten feil
- `docker compose config` -- expected: gyldig konfigurasjon

**Manual checks (if no CLI):**
- `docker compose up` på en maskin med Docker daemon: Hjem vises på `http://localhost:3000`.
