---
title: 'Opprette konto og logge inn og ut'
type: 'feature'
created: '2026-11-25'
status: 'done'
baseline_commit: '452730221c8e587e63d0f8da366c7ad037fef645'
route: 'dispatch'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Appen har ingen innlogging ennå. Det finnes ingen bruker-/sesjonstabeller, og
Story 1.2s skjermer (Hjem, Før kjøp, Kjøp, Meg) er helt åpne — ingenting hindrer en som ikke er
innlogget i å se dem, og det finnes ingen måte å opprette konto, logge inn eller ut.

**Approach:** Sette opp Better Auth (e-post+passord, ingen sosiale leverandører, ingen
e-postbekreftelse/passordtilbakestilling — frosset ute av arkitekturen) med Prisma-adapter mot
PostgreSQL. Flytte Story 1.2s fanelinje inn i en ny beskyttet rutegruppe `(app)` hvis
`layout.tsx` krever innlogget sesjon; legge til offentlige sider for å opprette konto og logge
inn; en plassholderside for Oppsett (det ekte innholdet eies av Story 1.4–1.5); en "Logg
ut"-knapp på Meg (per EXPERIENCE.md); og et seed-skript som lager en testbruker README kan vise
til.

## Boundaries & Constraints

**Always:**
- Kun e-post+passord. Ingen sosiale leverandører, e-postbekreftelse, passordtilbakestilling
  eller 2FA (arkitekturens Deferred-liste; FR-1, AR-8).
- Passord hashes av Better Auth selv (scrypt, innebygd); aldri egen hashing-kode, aldri
  klartekst i databasen (AR-8).
- Alle fem skjermene (Hjem, Før kjøp, Kjøp, Meg i `(app)`-gruppen, og Oppsett utenfor den)
  krever innlogget sesjon, sjekket **server-side** med `auth.api.getSession({ headers })` —
  ikke bare en cookie-sjekk. `(app)/layout.tsx` sjekker for gruppens fire sider; Oppsett sjekker
  selv (se Code Map/Tasks om den delte hjelpefunksjonen). Uinnlogget bruker omdirigeres til
  `/logg-inn` (AR-8, NFR-9).
- Next.js 16 har erstattet `middleware.ts` med `proxy.ts`. Bruk IKKE middleware/proxy til
  sesjonssjekk i denne historien — server-side sjekk i `(app)/layout.tsx` er eneste beskyttelse.
- `BETTER_AUTH_SECRET` og `BETTER_AUTH_URL` leses kun i `src/app/config.ts`, samme mønster som
  `DATABASE_URL`/`STORAGE_DIR`; `.env.example` får navnene uten verdier; `docker-compose.yml`
  får en lokal standardverdi for secret, samme mønster som `POSTGRES_PASSWORD` i dag (AD-10).
- Prisma-skjemaet for Better Auths tabeller genereres med `npx auth@1.7.28 generate` (pinnet
  til samme versjon som den installerte `better-auth`, ikke `@latest`) mot den faktiske
  `auth.ts`-konfigurasjonen — ikke håndskrevet fra hukommelse (feltnavn, særlig for
  passordlagring, er ikke sikre uten det). Deretter en ekte `prisma migrate dev` mot en kjørende
  Postgres (Docker er tilgjengelig i dette miljøet).
- Seed-skriptet oppretter testbrukeren med `hashPassword` fra `better-auth/crypto` og skriver
  rader direkte med Prisma — ikke via sign-up over HTTP (deterministisk, uten nettverkskall).
- Seed-skriptet er **idempotent**: sjekker om testbrukerens e-post allerede finnes før det
  skriver, og gjør ingenting (ikke feiler) hvis den gjør det. `docker-compose.yml`s
  `app`-tjeneste har `restart: unless-stopped`, så seed kjører på *hver* omstart, ikke bare
  første gang — uten denne sjekken feiler et plent `create()` på andre og senere oppstart med
  en unik-constraint-feil, og `&&`-kjeden hindrer `npm run start` fra å kjøre i det hele tatt.
- Oppsett (`/oppsett`) er **ikke** i `(app)`-rutegruppen og viser **ikke** fanelinjen — iht.
  epic-1-context.md er oppsett en egen flyt der fanelinjen i stedet erstattes av en fast
  primærknapp (den knappen bygges først i Story 1.4–1.5; her er det bare en ren plassholder
  uten fanelinje). Sesjonssjekken gjenbrukes via en delt hjelpefunksjon, se Code Map.
- `prisma/seed.ts` sitt kjørekommando konfigureres i `prisma.config.ts`s `migrations.seed`
  (Prisma 7-mønster) — **ikke** et `package.json#prisma.seed`-felt (det er Prisma 5/6, finnes
  ikke i denne versjonen). Krever en TS-kjører (`tsx`) som ny devDependency, siden
  `prisma/seed.ts` er TypeScript og prosjektet ikke har en TS-kjører i dag.
- Feil e-post/passord gir en forståelig feilmelding knyttet til feltet; norsk, kort, saklig,
  ingen utropstegn (UX-DR13, UX-DR14, Voice and Tone i EXPERIENCE.md).
- README dokumenterer testbrukerens e-post og passord (oppdiktet, NFR-6).

**Never:**
- Ingen e-postbekreftelse, passordtilbakestilling, 2FA eller sosial innlogging.
- Ikke bygg ekte innhold for Oppsett (plassholder "Kommer snart.", samme mønster som Story
  1.2s øvrige plassholdere) eller for Meg utover "Logg ut" — resten av Meg (oppdater saldoer,
  endre oppsett, slett konto) eies av senere historier.
- Ikke rør `src/domain/`, regelmotor, eller kort-/mål-/sats-datamodeller (eies av 1.4+).
- Ingen kontosletting i denne historien (NFR-9s sletting eies av Story 1.7).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Gyldig registrering | ny e-post + passord | Konto lagres (passord hashet), bruker logges inn, sendes til `/oppsett` | N/A |
| Feil passord ved innlogging | riktig e-post, feil passord | Blir på innloggingssiden | Feilmelding knyttet til passordfeltet |
| Uinnlogget besøker beskyttet side | ingen sesjon, GET `/` (eller `/for-kjop`, `/kjop`, `/meg`, `/oppsett`) | Omdirigert til `/logg-inn` | N/A |
| Logg ut | innlogget, trykker "Logg ut" på Meg | Sesjon avsluttes, sendes til `/logg-inn`, beskyttede sider krever innlogging igjen | N/A |
| Seed + testbruker | seed kjørt, logger inn med README-opplysningene | Innlogging fungerer | N/A |

</frozen-after-approval>

## Code Map

- `src/app/layout.tsx` (Story 1.2) -- importerer `tema.css`, pakker `{children}` i
  `.skall-innhold`, rendrer i dag `<NedreNavigasjon />` direkte. Skal slutte å rendre
  navigasjonen her — den flytter til `(app)/layout.tsx`.
- `src/app/page.tsx`, `src/app/for-kjop/page.tsx`, `src/app/kjop/page.tsx`,
  `src/app/meg/page.tsx` (Story 1.2) -- flyttes til `src/app/(app)/...` (samme filnavn,
  Hjem/Før kjøp/Kjøp uendret innhold; Meg får i tillegg en "Logg ut"-knapp).
- `src/app/components/nedre-navigasjon.tsx` (Story 1.2) -- uendret innhold; brukes nå fra
  `(app)/layout.tsx` i stedet for rotlayouten.
- `src/app/tema.css` (Story 1.2) -- `.skall-innhold` har i dag `padding-bottom` reservert for
  fanelinjen. Den paddingen hører bare til sider MED fanelinje — del den ut i en egen
  modifier-klasse (f.eks. `.skall-innhold--med-navigasjon`) brukt bare av `(app)/layout.tsx`.
- `src/app/config.ts`, `.env.example`, `docker-compose.yml` (Story 1.1) -- AD-10-mønsteret for
  `DATABASE_URL`/`STORAGE_DIR`; samme mønster for de to nye navnene under.
- `prisma/schema.prisma`, `prisma/migrations/` (Story 1.1) -- får Better Auths tabeller; dagens
  migrering er bevisst tom (ingen domenemodeller før nå).
- `_bmad-output/implementation-artifacts/spec-1-1-prosjektoppsett.md` -- triagerad om manglende
  Prisma-klient-singleton markerte det som denne historiens ansvar ("Better Auth/Story 1.3 eier
  dette"); `src/app/db.ts` løser det.
- `package.json` -- ny devDependency `tsx`; ingen `"prisma": {"seed": ...}`-felt (feil
  Prisma-versjons-konvensjon, se Boundaries).
- `prisma.config.ts` (Story 1.1) -- får `migrations: { seed: 'tsx prisma/seed.ts' }` i tillegg
  til eksisterende `schema`/`migrations.path`/`datasource`.
- `Dockerfile`, `README.md` -- se Tasks.
- `node_modules/better-auth` (allerede installert, v1.7.28). Research gjort i denne
  planleggingsrunden mot offisiell dokumentasjon, nøkkelpunkter:
  - Server: `betterAuth({ database: prismaAdapter(db, { provider: 'postgresql' }),
    emailAndPassword: { enabled: true } })` fra `better-auth` + `better-auth/adapters/prisma`.
    Krever `BETTER_AUTH_SECRET` (≥32 tegn) og `BETTER_AUTH_URL`.
  - Skjema: `npx auth@1.7.28 generate` mot `auth.ts` skriver `prisma/schema.prisma`s
    User/Session/Account/Verification-modeller (ingen nettverks-DB-tilkobling trengs for selve
    genereringen, bare den initielle `npx`-nedlastingen).
  - Rutehåndterer: `src/app/api/auth/[...all]/route.ts` →
    `export const { GET, POST } = toNextJsHandler(auth)` fra `better-auth/next-js`.
  - Klient: `createAuthClient` fra `better-auth/react`; `authClient.signUp.email(...)`,
    `.signIn.email(...)`, `.signOut()`.
  - Sesjonssjekk server-side: `await auth.api.getSession({ headers: await headers() })`.
  - Seed: `hashPassword` fra `better-auth/crypto`, skriv User+Account-rader direkte med Prisma.
- `_bmad-output/planning-artifacts/ux-designs/ux-G119-gausdal-2026-11-24/EXPERIENCE.md`
  (IA-tabell) -- "Logg ut" hører til Meg-fanen, ikke et globalt element; innlogging sender til
  Hjem; registrering sender til Oppsett (5 steg, eies av 1.4–1.5).

## Tasks & Acceptance

**Execution:**
- [x] `src/app/db.ts` (ny) -- Prisma-klient-singleton (standard Next.js-mønster: cacher
  instansen på `global` i utvikling for å unngå nye tilkoblinger ved hot-reload) -- AD-3.
- [x] `src/app/auth.ts` (ny) -- Better Auth-serverinstans (`betterAuth` + `prismaAdapter(db,
  {provider:'postgresql'})`, `emailAndPassword: {enabled:true}`, secret/url fra `config`)
  -- FR-1, AR-8.
- [x] `src/app/api/auth/[...all]/route.ts` (ny) -- `toNextJsHandler(auth)` -- FR-1.
- [x] `src/app/auth-client.ts` (ny) -- `createAuthClient` for bruk i klientkomponenter -- FR-1.
- [x] `prisma/schema.prisma` -- kjør `npx auth@1.7.28 generate` mot `auth.ts` for å legge til
  Better Auths modeller; kjør en ekte `prisma migrate dev` mot en kjørende Postgres (Docker) for
  å lage og anvende en reell ny migrering (i tillegg til, ikke i stedet for, den eksisterende
  tomme) -- AD-3, AR-8.
- [x] `src/app/opprett-konto/page.tsx` (ny) -- skjema (navn, e-post, passord), kaller
  `authClient.signUp.email`, viser feltfeil, sender til `/oppsett` ved suksess, lenke til
  `/logg-inn` for den som allerede har konto -- FR-1, UX-DR13.
- [x] `src/app/logg-inn/page.tsx` (ny) -- skjema (e-post, passord), kaller
  `authClient.signIn.email`, viser feltfeil ved feil opplysninger, sender til `/` ved suksess,
  lenke til `/opprett-konto` -- FR-1, UX-DR13.
- [x] `src/app/krev-sesjon.ts` (ny) -- delt hjelpefunksjon: kaller `auth.api.getSession`,
  `redirect('/logg-inn')` hvis ingen sesjon, returnerer sesjonen ellers. Brukes av både
  `(app)/layout.tsx` og `oppsett/page.tsx` -- AR-8.
- [x] `src/app/(app)/layout.tsx` (ny) -- bruker `krevSesjon()`; render `{children}` i en
  `<div className="skall-innhold skall-innhold--med-navigasjon">` + `<NedreNavigasjon />` under
  (nav-klassen finnes IKKE i rotlayouten lenger, så denne wrapperen må legges til her) -- AR-8,
  UX-DR3.
- [x] `src/app/(app)/page.tsx`, `/for-kjop/page.tsx`, `/kjop/page.tsx` (flyttet, uendret) og
  `/meg/page.tsx` (flyttet + "Logg ut"-knapp som kaller `authClient.signOut()` og sender til
  `/logg-inn`) -- FR-1.
- [x] `src/app/oppsett/page.tsx` (ny, UTENFOR `(app)`-gruppen) -- kaller `krevSesjon()` selv;
  plassholder "Kommer snart." uten fanelinje (se Boundaries) -- FR-1.
- [x] `src/app/layout.tsx`, `src/app/tema.css` -- fjerner `<NedreNavigasjon />` fra
  rotlayouten (rotlayouten beholder bare tema-import + `.skall-innhold`-sentrering, uten
  nav-padding); deler bunnpaddingen for fanelinjen ut i en egen klasse
  `.skall-innhold--med-navigasjon` brukt bare av `(app)/layout.tsx` -- UX-DR3 (løser Story 1.2s
  åpne punkt om betinget navigasjon).
- [x] `src/app/config.ts`, `.env.example`, `docker-compose.yml` -- `BETTER_AUTH_SECRET`
  (påkrevd i kode, lokal standardverdi i compose) og `BETTER_AUTH_URL` (valgfri, standard
  `http://localhost:3000`) -- AD-10.
- [x] `package.json` -- legg til `tsx` som devDependency (kjører `prisma/seed.ts`).
- [x] `prisma.config.ts` -- legg til `migrations: { seed: 'tsx prisma/seed.ts' }`.
- [x] `prisma/seed.ts` (ny) -- lager testbrukeren med `hashPassword` fra `better-auth/crypto`
  og direkte Prisma-skriving, oppdiktet e-post/passord; **idempotent** — sjekker om e-posten
  finnes først og gjør ingenting hvis den gjør det (se Boundaries) -- NFR-6, AR-8.
- [x] `Dockerfile` -- `CMD` kjører seed etter migrering:
  `npx prisma migrate deploy && npx prisma db seed && npm run start` -- AD-11.
- [x] `README.md` -- dokumenterer testbrukerens e-post/passord og at seed kjører automatisk med
  `docker compose up` -- AR-11, AR-13.

**Acceptance Criteria:**
- Given jeg ikke er innlogget, when jeg oppretter konto med gyldig e-post og passord, then
  kontoen lages, jeg logges inn og sendes til `/oppsett`, og passordet er hashet i Postgres,
  aldri i klartekst (FR-1, AR-8).
- Given jeg har en konto, when jeg logger inn med riktige opplysninger, then jeg kommer til
  Hjem; med feil passord vises en forståelig feilmelding knyttet til feltet (UX-DR13).
- Given jeg er innlogget, when jeg logger ut (på Meg), then sesjonen avsluttes, jeg sendes til
  `/logg-inn`, og de beskyttede sidene krever innlogging igjen.
- Given seed er kjørt, when jeg logger inn med testbrukeren fra README, then det fungerer, og
  testbrukeren har oppdiktede data (NFR-6).

## Implementation Notes

Implementert av egen agent (ingen tidligere kontekst), som del av dette samme oppdraget.

Rekkefølge: `src/app/db.ts` og `src/app/auth.ts` først (research mot installerte
`node_modules/better-auth@1.7.28` og `@better-auth/core` bekreftet alle import-stier og
feilkoder i Code Map stemte eksakt med det som er installert — ingen gjetning fra hukommelse).
Deretter `npx auth@1.7.28 generate --config ./src/app/auth.ts --output ./prisma/schema.prisma`
(ekte kjøring, ikke håndskrevet skjema), så `npx prisma migrate dev` mot en kjørende lokal
Postgres (startet med `docker compose up -d db`) som skrev
`prisma/migrations/20261125175850_better_auth_tabeller/`. Deretter sidene, rutegruppeflyttingen
og seed-skriptet.

**Avvik fra Code Map (nødvendig, ikke valgfritt):** Prisma 7.10.1 har fjernet den innebygde
Rust-spørringsmotoren — `new PrismaClient()` uten en driver-adapter kaster ved instansiering
("A driver adapter is required to connect to your database"), bekreftet ved at
`npx auth generate` selv feilet med denne meldingen da den lastet `auth.ts` → `db.ts` første
gang. Dette gjelder ikke bare skjemagenerering, men appens kjøretid (og `next build`, som
evaluerer `auth.ts` ved modul-last). Løst med `@prisma/adapter-pg@7.10.1` (samme versjon som
`prisma`/`@prisma/client`, matcher AD-3s PostgreSQL-valg): `src/app/db.ts` instansierer
`new PrismaPg({ connectionString: config.databaseUrl })` og gir den til `PrismaClient({
adapter })`. Dette var ikke nevnt i spec-ens Code Map/Boundaries (skrevet mot Better Auths
dokumentasjon, ikke mot Prisma 7s driver-adapter-krav) — lagt i Spec Change Log under.

**Konsekvens for Dockerfile (også nødvendig):** siden `auth.ts` nå evalueres ved `next build`
(ikke bare ved runtime), må byggetrinnet ha en `BETTER_AUTH_SECRET`-placeholder på samme måte
som den allerede hadde for `DATABASE_URL` — lagt til som egen `ARG`/`ENV` i build-stage, samme
AD-10-mønster. Og siden `prisma/seed.ts` importerer `src/app/db.ts` (TypeScript-kildekode, kjørt
med `tsx` i runtime-stagets `CMD`), måtte runtime-stagets `COPY`-liste utvides med
`COPY --from=build /app/src ./src` — uten den ville `npx prisma db seed` feilet i kontaineren
med "module not found" (ikke fanget av `npm run build` lokalt, bare av en faktisk
`docker compose up --build`).

**Feilmelding-mapping (UX-DR13/14):** Better Auth gir samme feilkode
(`INVALID_EMAIL_OR_PASSWORD`) for både "bruker finnes ikke" og "feil passord" — bevisst, av
sikkerhetsgrunner (tidsangrep/brukeroppramsing). `logg-inn/page.tsx` knytter denne feilen til
passordfeltet (matcher AC-ens formulering "feilmelding knyttet til passordfeltet") i stedet for
å late som appen vet hvilket felt som faktisk var feil. Andre kjente feilkoder
(`INVALID_EMAIL`, `PASSWORD_TOO_SHORT`, `PASSWORD_TOO_LONG`, `INVALID_PASSWORD`,
`USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL`) er lest direkte fra den installerte
`@better-auth/core/dist/error/codes.mjs`, ikke gjettet, og mappet til korte norske
feltmeldinger uten utropstegn.

**Verifisering utført av meg (ikke bare agentens egen rapport):**
- `npm run lint` -- grønt, 0 feil.
- `npm run build` (med `DATABASE_URL`/`BETTER_AUTH_SECRET` satt lokalt) -- grønt; rutetabellen
  viser `/`, `/for-kjop`, `/kjop`, `/meg`, `/oppsett`, `/api/auth/[...all]` som `ƒ` (dynamisk,
  pga. `headers()`-bruk i sesjonssjekken) og `/logg-inn`, `/opprett-konto` som `○` (statisk) —
  nøyaktig forventet fordeling.
- `npm test` -- grønt, 2/2 (ingen domenelogikk rørt).
- `docker compose up --build -d` (reell build + start, ikke bare lest kode): loggen viser
  `No pending migrations to apply` (migreringen fra `migrate dev` var allerede anvendt) og
  seed-logglinjen "testbrukeren ... finnes allerede. Gjør ingenting." -- bekrefter idempotens
  på en faktisk omstart, ikke bare ved lesing av koden.
- Mot den kjørende kontaineren med `curl`: uinnlogget `GET /` og `GET /oppsett` gir begge `307`
  til `/logg-inn`; `POST /api/auth/sign-in/email` med testbrukerens opplysninger gir `200` +
  session-cookie; samme kall med feil passord gir `{"code":"INVALID_EMAIL_OR_PASSWORD"}`; en
  `GET /` med den gyldige session-cookien gir `200`; `POST /api/auth/sign-out` følgt av samme
  `GET /` med samme (nå ugyldige) cookie gir `307` til `/logg-inn` igjen. Dekker alle fem radene
  i I/O-matrisen med ekte HTTP-kall, ikke bare lesing av koden.
- Kjørte `prisma/seed.ts` manuelt to ganger på rad mot databasen (`npx tsx prisma/seed.ts`):
  første kjøring oppretter brukeren, andre kjøring logger "finnes allerede" og gjør ingenting --
  bekrefter idempotens isolert fra Docker-laget også.
- **Ikke sett i en ekte nettleser** i denne sesjonen (ingen GUI-nettleser tilgjengelig her):
  skjemaenes faktiske utseende, feltfeil-visningen i praksis, og at `/opprett-konto` faktisk
  sender til `/oppsett` via et ekte skjema-trykk (bekreftet strukturelt via kildekode og via
  `curl` mot API-et, men ikke klikket gjennom i en nettleser). Bruker bør gjøre en rask manuell
  sjekk av disse tre (se sluttsvar / Verification-delen under).

**Etter review-runden (3 reviewere, 19 funn):** 7 reelle, trivielle funn rettet (dobbel
sidemarg på Hjem/Før kjøp/Kjøp/Meg, test for `krevSesjon()`, fail-closed sesjonssjekk,
try/catch rundt innlogging/registrering og utlogging, atomisk seed via `upsert`-mønster,
lengdesjekk på `BETTER_AUTH_SECRET`). 4 funn utsatt til `deferred-work.md`. 2 funn avvist som
`false` etter å ha lest den installerte `better-auth`-kildekoden direkte (e-post normaliseres
allerede av biblioteket; rate-limiting er på by default i produksjon). 1 funn avvist som
«by design» (iht. allerede godkjent AD-11). Se Review Triage Log for alle 19 med bevis.

Alle rettelser verifisert av meg på nytt, ikke bare agentens rapport: `npm run lint`/`test`
grønt (5/5 tester inkl. den nye `krev-sesjon.test.ts`), `npm run build` grønt (med lokale
placeholder-miljøvariabler, samme mønster som Dockerfile). Kjørte `docker compose up --build`
på nytt og `docker compose restart app` for å reprodusere en reell omstart — seed-loggen viser
«finnes allerede. Gjør ingenting.» begge ganger, ingen krasj. Hentet Hjem/logg-inn/oppsetts
rendrede HTML med `curl` og talte `skall-innhold`-klassen: nøyaktig én per side nå (var to på
Hjem/Før kjøp/Kjøp/Meg). Kjørte hele innlogging → feil passord → riktig innlogging → utlogging
→ ny omdirigering-kjeden på nytt mot den patchede containeren — alt fungerer fortsatt.

## Spec Change Log

- **Code Map/Boundaries manglet Prisma 7s driver-adapter-krav.** Spec-en ble skrevet mot Better
  Auths dokumentasjon for `prismaAdapter`, men nevnte ikke at Prisma 7.10.1 (allerede valgt i
  Story 1.1) har fjernet sin innebygde spørringsmotor og krever en driver-adapter
  (`@prisma/adapter-pg` for PostgreSQL) for at `new PrismaClient()` skal fungere i det hele
  tatt -- ikke bare for Better Auth, for enhver bruk av Prisma Client i appen. Lagt til som ny
  dependency og brukt i `src/app/db.ts`; ingen Boundary eller AC endret, bare et manglende
  implementasjonsdetalj fylt inn. Se Implementation Notes for begrunnelse og verifisering.

## Review Triage Log

- **medium, patch** — verification-gap (annet funn): `(app)/layout.tsx` pakker `{children}` i
  `<div className="skall-innhold skall-innhold--med-navigasjon">`, men denne diven blir selv
  rendret inne i rotlayoutens EGEN `<div className="skall-innhold">` (siden `{children}` i
  rotlayouten er `(app)/layout.tsx`s output). Verifisert selv ved å lese begge filene og
  CSS-reglene: to nestede divs med `padding-inline`/`max-width`/`margin-inline` dobler
  sidemargen (32px i stedet for 16px) på alle fire sidene med fanelinje. Ikke sett i nettleser
  av implementeringsagenten. (patch)
- **medium, patch** — verification-gap: ingen test dekker `krevSesjon()`s eneste grein
  (redirect ved `null`-sesjon vs. returner sesjonen) — en invertert eller fjernet `redirect`
  ville sluppet alle uinnloggede gjennom til alle fem beskyttede sider, og ingenting i
  `npm run lint`/`build`/`test` ville fanget det. (patch — vitest-test som mocker
  `auth.api.getSession` + `next/navigation`s `redirect`, trenger ingen database/nettverk)
- **medium, patch** — blind-hunter: `authClient.signIn.email`/`signUp.email` i
  `logg-inn/page.tsx`/`opprett-konto/page.tsx` har ingen try/catch — en uventet avvist
  Promise (f.eks. nettverksfeil) lar "venter"-tilstanden stå på for alltid, uten feilmelding.
  (patch — fang og vis `feil.generell`, nullstill `venter`)
- **medium, patch** — blind-hunter + edge-case-hunter (samme kodested, to vinkler): `handleLoggUt`
  i `(app)/meg/page.tsx` ignorerer både en avvist Promise fra `authClient.signOut()` (knappen
  blir stående deaktivert for alltid) og et eventuelt `{error}`-resultat (brukeren får tro hun
  er utlogget selv om serveren sa nei). (patch — try/catch/finally, naviger uansett i `finally`)
- **low–medium, patch** — blind-hunter + edge-case-hunter (samme kodested): seed-skriptets
  idempotens er `findUnique` + separat `create()`, ikke atomisk — et kappløp mellom to
  samtidige seed-kjøringer kan fortsatt treffe unik-constraint-feilen boundary'en skulle
  forhindre. (patch — bytt til `upsert`, eller fang Prisma-feilkode P2002 rundt `create()`)
- **low–medium, patch** — edge-case-hunter: `krevSesjon()` har ingen try/catch rundt
  `auth.api.getSession` — en uventet feil (f.eks. DB nede) kaster til Next sin generiske
  feilside i stedet for å feile trygt til innloggingssiden. Better Auths egen `session.mjs` har
  mye intern try/catch, men ikke verifisert at den dekker alle feilveier. (patch — triviell,
  kost null, gir en garantert fail-closed sesjonsvakt)
- **low, patch** — edge-case-hunter: `config.ts` validerer ikke at `BETTER_AUTH_SECRET` er
  minst 32 tegn (Better Auths eget dokumenterte minimum, sitert i spec-ens Code Map) — en kort
  hemmelighet godtas i dag uten varsel. (patch — lengdesjekk i `config.ts`)
- **false** — blind-hunter: hevdet e-post ikke normaliseres (store/små bokstaver), så
  `Petter@Eksempel.test` og `petter@eksempel.test` kunne blitt behandlet som ulike kontoer.
  Motbevist ved å lese den installerte `better-auth`-koden direkte:
  `node_modules/better-auth/dist/api/routes/sign-up.mjs:158`
  (`const normalizedEmail = email.toLowerCase();`) og `sign-in.mjs:320`
  (`findUserByEmail(email.toLowerCase())`) — biblioteket normaliserer selv, appen trenger ikke.
- **false** — blind-hunter: hevdet at brute-force-vern på innloggingsendepunktet ikke er
  adressert noe sted. Motbevist ved å lese `node_modules/better-auth/dist/context/create-context.mjs:172`:
  `enabled: options.rateLimit?.enabled ?? isProduction` — rate-limiting er på by default når
  `NODE_ENV=production`, som `Dockerfile`s runtime-stage faktisk setter. Standard er 100
  forespørsler per 10 sekunder, uten noen ekstra konfigurasjon.
- **false, by design** — edge-case-hunter: hevdet at hvis `npx prisma db seed` feiler av en
  ANNEN grunn enn idempotens, blokkerer `&&`-kjeden `npm run start` helt. Dette er en bevisst,
  godkjent del av den frosne spec-en (AD-11: "seed kjører automatisk ved oppstart, før appen
  starter") — appen skal ikke serveres fra en database som ikke ble migrert/seedet riktig. Den
  ene konkrete, reelle feilveien (idempotens) er allerede rettet over.
- **defer** — blind-hunter: `krevSesjon()` omdirigerer alltid til en bar `/logg-inn` uten
  `?next=`, så et dypt lenke-besøk (f.eks. `/meg`) mens uinnlogget sender brukeren til Hjem
  etter innlogging, ikke tilbake til siden hun faktisk ville til. Reelt, men den frosne AC-en
  sier eksplisitt "jeg kommer til Hjem" ved innlogging — å bygge retur-til-forespurt-side nå
  ville gått forbi det frosne akseptkriteriet. Lagt i `deferred-work.md`.
- **defer** — blind-hunter: Oppsett-siden har ingen fanelinje og ingen annen vei ut enn å endre
  URL-en manuelt. Reelt, men den faste primærknappen som skal gi en vei videre/ut er eksplisitt
  Story 1.4–1.5s ansvar iht. denne spec-ens egne Boundaries ("den knappen bygges først i Story
  1.4–1.5"). Ingen endring her.
- **defer** — blind-hunter: ingen automatisert testdekning for sign-up/sign-in/sign-out-flytene
  eller feilkode-til-feltmelding-mappingen utover den ene `krevSesjon()`-testen som ble lagt til
  over. Reelt, men full dekning av disse flytene uten database/nettverk i tester (prosjektets
  AD-2/AR-11-konvensjon) er en større endring enn denne runden. Lagt i `deferred-work.md`.
- **defer** — verification-gap: ingen automatisert test beviser seed-idempotensen (kjør
  `main()` to ganger mot en reell database). Reelt, men krever databasetilkoblet testinfrastruktur
  prosjektet bevisst ikke har i dag (AD-2/AR-11: `npm test` skal kjøre uten database/nettverk).
  Selve koden er rettet (se patch-funnet over); bare den automatiserte *testen* av det er utsatt.
  Lagt i `deferred-work.md`.
- **defer** — blind-hunter: `docker-compose.yml`s lokale standardverdi for
  `BETTER_AUTH_SECRET` er en ekte, versjonskontrollert streng, uten varsel hvis den brukes i en
  produksjonslignende utrulling. Reelt, men følger nøyaktig samme, allerede godkjente mønster
  som `POSTGRES_PASSWORD` fra Story 1.1 (AD-10), og produksjonshemmeligheter er eksplisitt
  utsatt arkitektur-bredt ("Publisering ... avgjøres når kjernen kjører lokalt"). Hører til den
  fasen, ikke denne historien.
- **defer** — blind-hunter: `Dockerfile`s runtime-steg kopierer hele `src/`-treet bare for at
  `prisma/seed.ts` skal kunne importere `db.ts`/`config.ts`. Reelt (mer kildekode enn
  nødvendig i prod-imaget), men å smalne `COPY`-lista til nøyaktig de filene seed.ts importerer
  gjør `Dockerfile` skjørt mot fremtidige endringer i `seed.ts`s importgraf — vurdert som en
  rimelig avveining, ikke en feil å rette nå.
- **defer** — blind-hunter: innloggingssiden sier ingenting om at passordtilbakestilling ikke
  finnes, så en bruker som har glemt passordet står uten synlig vei videre. Reelt som
  brukeropplevelse, men passordtilbakestilling er eksplisitt utsatt arkitektur-bredt («ikke i
  v1») — ingen endring i denne historien.

## Verification

**Commands:**
- `npm run lint` -- expected: 0 feil.
- `npm run build` -- expected: bygger uten feil.
- `npm test` -- expected: eksisterende tester fortsatt grønt.
- `docker compose up --build` -- expected: migrering og seed kjører automatisk; en forespørsel
  uten sesjonscookie mot `/` gir en redirect til `/logg-inn`; innlogging med testbrukeren fra
  README fungerer (kan bekreftes med en innloggings-forespørsel mot auth-endepunktet, eller
  manuelt i nettleser).

**Manual checks (if no CLI):**
- Opprett en ny konto i nettleseren og bekreft at du sendes til Oppsett.
- Logg inn med feil passord og se feltfeilmeldingen.
- Logg ut fra Meg og bekreft at Hjem omdirigerer til innlogging.
