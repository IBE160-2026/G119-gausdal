# Opprette konto og logge inn og ut

## 2026-11-25 kl. 19:05 — Anneli Gausdal

### Oppgave

Implementere `_bmad-output/implementation-artifacts/spec-1-3-opprette-konto-og-logge-inn-og-ut.md`
(Story 1.3) i sin helhet, med spec-en som eneste kilde til sannhet: Better Auth
e-post+passord, Prisma-tabeller for Better Auth, beskyttet `(app)`-rutegruppe for Hjem/Før
kjøp/Kjøp/Meg, nye sider for opprette konto og logge inn, «Logg ut» på Meg, en plassholderside
for Oppsett, og et idempotent seed-skript med en testbruker README kan vise til.

### Plan

- Lest spec-en fullt ut, pluss alle filene den refererer til i Code Map: `layout.tsx`,
  `nedre-navigasjon.tsx`, `tema.css`, `config.ts`, `.env.example`, `docker-compose.yml`,
  `Dockerfile`, `prisma.config.ts`, `schema.prisma`, `package.json`, `spec-1-1`, `README.md`,
  `epic-1-context.md`, `EXPERIENCE.md`.
- Undersøkt den faktisk installerte `node_modules/better-auth@1.7.28` og `@better-auth/core`
  (import-stier, feilkoder for sign-in/sign-up, `prismaAdapter`-signatur) i stedet for å stole
  på hukommelse, siden spec-en selv krevde det for passordlagring-feltnavn.
- Bygget `src/app/db.ts`, `src/app/auth.ts`, `src/app/api/auth/[...all]/route.ts`,
  `src/app/auth-client.ts`, `src/app/krev-sesjon.ts`.
- Kjørte ekte `npx auth@1.7.28 generate` mot `auth.ts` for å skrive Better Auths
  User/Session/Account/Verification-modeller i `prisma/schema.prisma`, og ekte
  `npx prisma migrate dev` mot en lokal Postgres startet med `docker compose up -d db`.
- Bygget `src/app/opprett-konto/page.tsx` og `src/app/logg-inn/page.tsx` med feltfeil mappet
  fra Better Auths feilkoder.
- Flyttet `src/app/page.tsx`, `for-kjop/page.tsx`, `kjop/page.tsx`, `meg/page.tsx` til
  `src/app/(app)/...` (git mv, innhold uendret utenom `meg` som fikk en «Logg ut»-knapp); ny
  `(app)/layout.tsx` som kaller `krevSesjon()` og rendrer fanelinjen.
- Ny `src/app/oppsett/page.tsx` (utenfor `(app)`-gruppen, egen `krevSesjon()`-sjekk).
- Delte `tema.css`s fanelinje-bunnpadding ut i egen klasse `.skall-innhold--med-navigasjon`;
  rotlayouten rendrer ikke lenger `<NedreNavigasjon />`.
- La til `BETTER_AUTH_SECRET`/`BETTER_AUTH_URL` i `config.ts`, `.env.example`,
  `docker-compose.yml`; `tsx` som devDependency; `migrations.seed` i `prisma.config.ts`.
- `prisma/seed.ts`: idempotent testbruker med `hashPassword` fra `better-auth/crypto`.
- Oppdaterte `Dockerfile` (seed i `CMD`, pluss to nødvendige avvik, se Resultat) og `README.md`.

### Resultat

**Alt i Tasks-listen fullført og krysset av i spec-filen** (`status` fortsatt `in-progress`,
samme mønster som Story 1.2 — venter på Annelis egen manuelle nettleser-bekreftelse før
`done`). Implementation Notes og et nytt Spec Change Log-punkt lagt til i spec-filen med full
begrunnelse.

**Ett reelt avvik fra spec-ens Code Map, oppdaget og løst:** Prisma 7.10.1 har fjernet sin
innebygde spørringsmotor — `new PrismaClient()` uten en driver-adapter kaster ved
instansiering, ikke bare ved faktisk databasebruk. Løst med `@prisma/adapter-pg@7.10.1` i
`src/app/db.ts` (`new PrismaPg({ connectionString })`). Dette fikk to følgekonsekvenser i
`Dockerfile`: build-stage trenger nå en `BETTER_AUTH_SECRET`-placeholder (siden `auth.ts`
evalueres ved `next build`, samme AD-10-mønster som den eksisterende `DATABASE_URL`-placeholderen),
og runtime-stagets `COPY`-liste måtte utvides med `src/` (seed kjøres med `tsx` og importerer
`src/app/db.ts` som TypeScript-kildekode — ville feilet med "module not found" i kontaineren,
men ikke i en lokal `npm run build`).

**Verifisert, ikke bare lest:**
- `npm run lint`, `npm run build`, `npm test` — alle grønne. Rutetabellen fra build viser
  `/`, `/for-kjop`, `/kjop`, `/meg`, `/oppsett`, `/api/auth/[...all]` som dynamisk (`ƒ`) og
  `/logg-inn`, `/opprett-konto` som statisk (`○`) — forventet fordeling.
- `docker compose up --build -d` kjørt ekte mot en frisk `db`-container: logg viser
  `No pending migrations to apply` og seed-linjen "finnes allerede. Gjør ingenting." —
  idempotens bekreftet på en reell omstart.
- `curl` mot den kjørende containeren dekket alle fem radene i spec-ens I/O-matrise: uinnlogget
  `GET /` og `GET /oppsett` → `307` til `/logg-inn`; `POST /api/auth/sign-in/email` med
  testbrukeren → `200` + session-cookie; samme med feil passord →
  `{"code":"INVALID_EMAIL_OR_PASSWORD"}`; gyldig cookie på `GET /` → `200`;
  `POST /api/auth/sign-out` + samme (nå invalide) cookie på `GET /` → `307` til `/logg-inn`.
- `npx tsx prisma/seed.ts` kjørt manuelt to ganger på rad — oppretter bruker første gang,
  "finnes allerede" andre gang.
- Ny migrering: `prisma/migrations/20261125175850_better_auth_tabeller/` (ekte
  `prisma migrate dev`-output, ikke håndskrevet).
- Testbruker i README: `petter@eksempel.test` / `kiwi-trumf-1808`.

**Løser Story 1.2s åpne punkt** om å gjøre `<NedreNavigasjon />` betinget — fanelinjen ligger nå
bare i `(app)/layout.tsx`, ikke i rotlayouten (se issues.md).

Containerne er stoppet (`docker compose down`, uten `-v`) etter verifisering; `db-data`-volumet
med testbrukeren står fortsatt.

### Åpne punkter

- Ikke sett i en ekte nettleser i denne sesjonen (ingen GUI tilgjengelig her): skjemaenes
  faktiske utseende, feltfeil-visningen i praksis, og at `/opprett-konto` faktisk sender til
  `/oppsett` via et ekte knappetrykk — bekreftet strukturelt og via `curl`, ikke klikket gjennom.
- Sette `1-3-opprette-konto-og-logge-inn-og-ut` til `done` i spec-en og `sprint-status.yaml`
  når Anneli har bekreftet manuelt i nettleser (samme mønster som Story 1.2).
