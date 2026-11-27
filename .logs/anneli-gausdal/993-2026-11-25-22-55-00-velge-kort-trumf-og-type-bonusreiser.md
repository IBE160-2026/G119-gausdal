# Velge kort, Trumf og type bonusreiser

## 2026-11-25 kl. 22:55 — Anneli Gausdal

### Oppgave
Implementere spec-1-4-velge-kort-trumf-og-type-bonusreiser.md: oppsettets første skjema —
velg kort (Amex Elite og/eller Mastercard Premium), svar om Trumf er koblet til EuroBonus, og
velg bare SAS eller også andre SkyTeam-selskaper. Alt lagres i én serverhandling/
Prisma-transaksjon, med nye `Kort`/`BrukerKort`/`BrukerProfil`-tabeller.

### Plan
- Egen agent (ingen tidligere kontekst) implementerte direkte fra spec-filen, uten eget
  plandokument. Rekkefølge: `prisma/schema.prisma` → ekte `prisma migrate dev` mot lokal
  Postgres (Docker) → `prisma generate` → `prisma/seed.ts` → `valider-kort.ts` + test →
  `handlinger.ts` (server-handling) → `page.tsx`/`oppsett-form.tsx`/`tema.css`.

### Resultat
- `prisma/schema.prisma`: nye modeller `Kort`, `BrukerKort`, `BrukerProfil` + to
  back-relation-felt (`brukerKort`, `brukerProfil`) på `User`. Ny migrering
  `prisma/migrations/20261125214302_legg_til_kort_og_brukerprofil/` kjørt ekte mot
  `docker compose up -d db`.
- `prisma/seed.ts`: idempotent `upsert`-seed for Amex Elite og Mastercard Premium.
- `src/app/oppsett/valider-kort.ts` (ny) + `tests/valider-kort.test.ts` (ny, 3 tester).
- `src/app/oppsett/handlinger.ts` (ny, `'use server'`): validerer kort/Trumf/SkyTeam,
  slår opp kortkoder mot `Kort.kode`, skriver i én `$transaction` (upsert `BrukerProfil`,
  erstatter `BrukerKort`-radene — ikke merge).
- `src/app/oppsett/page.tsx`: Server Component som henter `Kort`-katalogen og brukerens
  eksisterende `BrukerKort`/`BrukerProfil` for forhåndsutfylling.
- `src/app/oppsett/oppsett-form.tsx` (ny, `'use client'`): skjema med avkrysningsbokser,
  Trumf ja/nei, SAS/SkyTeam-valg, feltfeil, fast "Neste"-knapp → `/` ved gyldig lagring.
- `src/app/tema.css`: nye klasser `.knapp-fast` og `.skall-innhold--med-knapp-fast`.
- Spec-filen oppdatert: alle 9 Execution-oppgaver avkrysset `[x]`, Implementation Notes og
  Verification fylt ut med faktiske kommandoresultater og begrunnelse for valg utover det
  spec-en ordrett diktert (kortkatalog hentet fra DB i stedet for hardkodet, `@default(uuid())`
  for de nye tabellenes id-felt, ASCII-only CSS-klassenavn). Ingen Spec Change Log-oppføring —
  ingen avvik fra Boundaries/AC.
- Verifisert: `npm run lint` grønt (0 feil), `npm run build` grønt (etter `prisma generate`),
  `npm test` grønt (8/8, inkl. de 3 nye), `docker compose up --build -d` kjørt reelt (migrering
  allerede anvendt, seed-logglinje for kortkatalogen vist). `curl` mot kontaineren: uinnlogget
  `/oppsett` → 307 til `/logg-inn`; innlogget (testbrukeren) → 200 med "Amex Elite"/
  "Mastercard Premium" i HTML-en. Et frittstående, slettet verifiseringsscript (`npx tsx`)
  gjenskapte `handlinger.ts`s Prisma-kall mot testbrukerens rad og bekreftet hele
  Edge-Case-matrisen reelt: tomt utvalg avvist, ukjent kode avvist, gyldig lagring, ny lagring
  erstatter (ikke merger) `BrukerKort`, og at `page.tsx` henter nøyaktig det sist lagrede ved
  gjenbesøk. Docker-containerne er stoppet igjen (`docker compose down`, uten `-v` — data ligger
  fortsatt i volumet) etter verifiseringen.
- Ingenting committet av meg i denne økten — kun loggfila/issues.md committes av denne
  skillen, resten står ukommittert i arbeidskopien til Anneli selv vurderer og committer.

### Åpne punkter
- Ingen av de tre skjermelementene (avkrysningsbokser, Trumf-radioknapper, SkyTeam-radioknapper)
  eller den faste "Neste"-knappen er sett i en ekte nettleser denne økten — kun verifisert
  strukturelt (markup/CSS) og via `curl`/et frittstående script mot den ekte databasen.
- Spec-ens egne manuelle sjekker (prøv å lagre uten kort og se feilen; lagre og last siden på
  nytt og se forhåndsutfylling) er ikke gjort i nettleser.

## 2026-11-25 kl. 23:20 — Anneli Gausdal

### Oppgave
Fullføre resten av `bmad-build` for Story 1.4: tre parallelle kodegjennomganger av diffen,
triage av funnene, retting, re-verifisering, og landing i små commits med AR-/AD-/UX-DR-ID.

### Plan
- Kjørte `blind-hunter`, `edge-case-hunter` og `verification-gap` parallelt mot diffen siden
  baseline-commiten (ae87365).
- Vurderte alle 15 unike funn selv (noen overlappet mellom reviewerne) — bekreftet flere
  påstander direkte mot koden (ingen `kort.delete`-kall finnes noe sted; `router.push`+
  `router.refresh()` matcher Story 1.3s etablerte mønster i `meg/page.tsx`; "ikke sett i
  nettleser"-punktet var allerede i `issues.md`) i stedet for å ta reviewernes ord for det.
- Sendte de 4 rettbare funnene tilbake til samme implementeringsagent (gjenengasjert via id);
  verifiserte rettingen på nytt selv, inkludert å lese den patchede koden direkte.
- Committet i 4 små commits iht. brukerens eksplisitte instruks.

### Resultat
**Review:** 3 reviewere fant 15 unike enkeltfunn (11 blind-hunter, 7 edge-case-hunter — 2 som
"claims" — 4 verification-gap, med noe overlapp). Etter egen verifisering: 4 rettet (patch),
4 utsatt til `deferred-work.md`, 7 avvist som `false`/`by design` med motbevisning i spec-filens
`## Review Triage Log`.

**Rettet i `handlinger.ts`/`oppsett-form.tsx`, alle verifisert av meg etter retting (lest den
faktiske patchede koden, kjørt `npm run lint`/`test`/`build` på nytt, og kjørt
`docker compose up --build` på nytt for å bekrefte innlogging + ekte kortkatalog-rendering):**
- Feilmeldingene i oppsett-skjemaet fikk `id` + `aria-describedby` på alle felt, og
  `aria-invalid` på avkrysningsboksene (bevisst utelatt på radioknappene — `eslint`s
  `jsx-a11y/role-supports-aria-props` tillater det ikke der).
- `lagreOppsett()` fikk en try/catch rundt database-/transaksjonsarbeidet — returnerer nå
  `{ ok: false, feil: { generell: '...' } }` på uventede feil i stedet for å kaste.
- `kortKoder` dedupliseres nå (`[...new Set(...)]`) før validering/oppslag/transaksjon, så en
  duplikatkode ikke lenger kan treffe `@@unique([brukerId, kortId])` og kaste.
- Alle avkrysningsbokser/radioknapper i oppsett-skjemaet får nå `disabled={venter}`, ikke bare
  "Neste"-knappen.

**Commits** (4 stk, i `claude/eager-carson-eldvjj`): `78c3b8c` (Kort/BrukerKort/BrukerProfil +
seed, AD-3/AR-3), `4cd1fe9` (server-handling + validering, FR-2/FR-5/FR-6/AD-8), `6f53899`
(oppsett-skjema + fast primærknapp, FR-2/FR-5/FR-6/UX-DR13/UX-DR3), `6449902` (spec/triage/
sprint-status, AD-12).

`npm run lint`/`test`/`build` grønt etter retting (8/8 tester). Spec-filens status er `done`;
`sprint-status.yaml` har story-nøkkelen på `review` (ikke `done`) — venter på Annelis egen
manuelle nettleser-bekreftelse, se forrige seksjons åpne punkter.

### Åpne punkter
- Uendret fra forrige seksjon: manuell nettleser-bekreftelse av skjema, feilmeldinger og
  forhåndsutfylling gjenstår.
- 4 funn utsatt til `deferred-work.md` (samtidige innsendinger; database-mocket testdekning for
  `lagreOppsett()`/forhåndsutfylling; strengere kjøretids-typesjekker; re-sjekk av
  Better-Auth-PR-avhengigheten ved en fremtidig `npx auth generate`-kjøring) — ingen av dem
  blokkerer Story 1.4.

Speiles i `issues.md`.
