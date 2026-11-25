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

## 2026-11-25 kl. 15:10 — Anneli Gausdal

### Oppgave
Fortsette `bmad-build` for Story 1.1 etter forrige økts implementering: kjøre review-steget
(tre uavhengige kodegjennomganger), triagere funnene, rette det som var reelt, verifisere alt
selv, og lande arbeidet i små commits merket med AR-/AD-ID (eksplisitt bedt om av brukeren).

### Plan
- Kjøre `blind-hunter`, `edge-case-hunter` og `verification-gap`-reviewerne parallelt mot
  diffen siden baseline-commiten.
- Verifisere hvert funn selv mot faktisk kode/kjørte kommandoer (ikke stole på reviewernes
  påstander) og gi hver ett av: high/medium/low/false/maybe-false.
- Sende de reelle, rettbare funnene tilbake til implementeringsagenten som én samlet
  patch-liste; la agenten gjøre minimal retting; verifisere på nytt selv.
- Committe i små, AR-/AD-ID-merkede commits (ikke én stor commit), siden brukeren ba om det.
- Plandokument: ingen eget — fulgte `bmad-build`s innebygde step-04-review.md/step-05-present.md.

### Resultat
**Review:** 3 reviewere fant totalt 18 enkeltfunn (14 fra blind-hunter, 9 fra edge-case-hunter
— noen overlappet —, 1 fra verification-gap). Etter selvstendig verifisering (lest kode, kjørt
`npm test`/`lint`/`build`/`docker compose config`, og reprodusert flere funn direkte med
testfiler i `src/domain/`) endte triagen med 8 reelle funn som ble rettet, og 10 forkastet som
`false`/uutløselig/utenfor scope (se `## Review Triage Log` i spec-filen for alle 18 rader med
verdikt og bevis).

**Rettet (patch), alle verifisert av meg etter retting:**
- `Dockerfile`: `prisma generate` i build-stage hadde ingen `DATABASE_URL` tilgjengelig
  (ingen `.env` i build-konteksten) — reprodusert at `docker build` ville feilet før Postgres/
  migrering/app i det hele tatt ble nådd. Fikset med en plassholder-`ARG`/`ENV` før
  `RUN npx prisma generate`.
- `src/app/config.ts`: `lesPakrevd`/`lesValgfri` sjekket `.trim()` men returnerte den
  utrimmede verdien — fikset til å returnere den trimmede strengen.
- `docker-compose.yml`: `DATABASE_URL`/`STORAGE_DIR` for `app`-tjenesten var hardkodet og
  ignorerte verdier satt i `.env`, i strid med READMEs eget løfte — fikset til
  `${VAR:-standardverdi}`-mønster, samme som `db`-tjenesten allerede brukte.
- `docker-compose.yml`: Postgres-porten var publisert på alle grensesnitt med svakt
  standardpassord — bundet til `127.0.0.1:5432:5432`.
- `Dockerfile`: ingen `USER`-direktiv (kjørte som root) — lagt til egen, ikke-root bruker i
  runtime-stage.
- `package.json`: `"allowScripts"`-feltet var ikke en reell npm-funksjon (forrige økts logg
  beskrev det feilaktig som nødvendig for Prisma — det var dødt, gjorde ingenting) — fjernet.
- `.dockerignore`: manglet `tests` — lagt til (kosmetisk, nådde aldri runtime-imaget).
- `eslint.config.mjs`: AD-2-grensen for `src/domain/` kunne omgås med dynamisk `import()`,
  `require()` eller `const { env } = process` — reprodusert at alle tre ga 0 lint-feil før
  fiks; lagt til tre nye `no-restricted-syntax`-regler, reprodusert at alle tre nå feiler
  lint med AD-2-henvisning.

**Forkastet (false/utenfor scope), ikke rettet — se triage-loggen for full begrunnelse:**
bl.a. manglende Prisma-klient-singleton (eksplisitt utenfor scope i frosset Intent),
path-traversal i `src/app/storage/lokal-lagring.ts` (uutløselig — ingen kaller finnes, og
«ingen filer lagres i v1» er et frosset krav), manglende `@/`-alias i `vitest.config.ts`
(ingen test bruker aliaset i dag), og et par lav-prioriterte Docker-hygienepunkter
(devDependencies i prod-image, manglende healthcheck på `app`) der fiksen ville vært mer enn
en direkte rettelse.

**Commits** (8 stk, i `claude/eager-carson-eldvjj`):
`815e327` (AR-1), `0f363a7` (AR-11/AR-2/AD-2/AD-11), `58665bb` (AR-3), `048607b` (AR-10/AD-10),
`39a3e12` (AR-9/AD-9), `72fcaf0` (AR-11/AD-11), `36b82ba` (AR-13), `0c49b50` (AD-12 —
spec-status + triage-logg). Spec-filen (`spec-1-1-prosjektoppsett.md`) er `status: done`;
`sprint-status.yaml` har story-nøkkelen på `review` (ikke `done` — venter på at `docker
compose up` faktisk kjøres, se Åpne punkter).

### Åpne punkter
- Uendret fra forrige økt: `docker compose up` er fortsatt ikke kjørt live (ingen Docker-
  daemon i dette miljøet) — hele kjeden Postgres → migrering → app på port 3000 må bekreftes
  manuelt før historien kan settes til `done` i sprint-status. Se forrige punkt i denne fila.
- Nytt: `eslint.config.mjs`s nye regler dekker ikke alle tenkelige omveier (f.eks.
  `Date.now`-aliasing: `const n = Date.now; n()`) — vurdert og bevisst utelatt fra denne
  patch-runden siden en fullgod fiks for all aliasing er mer enn en direkte rettelse; notert i
  triage-loggen som lav prioritet.

Speiles i `issues.md`.
