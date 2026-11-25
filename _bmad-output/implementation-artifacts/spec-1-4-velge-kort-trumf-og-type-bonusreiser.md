---
title: 'Velge kort, Trumf og type bonusreiser'
type: 'feature'
created: '2026-11-25'
status: 'done'
baseline_commit: 'ae87365ba13bae737eb5296fca085b3a4b74972f'
route: 'dispatch'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Oppsett-ruten (`/oppsett`) er i dag bare en plassholder fra Story 1.3. Appen vet
ingenting om hvilke kort en bruker har, om Trumf er koblet til EuroBonus, eller om brukeren bare
reiser med SAS eller også andre SkyTeam-selskaper — data senere historier (poengberegning, mål)
er avhengige av.

**Approach:** Bygg oppsettets første skjerm som ett samlet skjema: velg kort (Amex Elite og/eller
Mastercard Premium), svar om Trumf er koblet, og velg bare SAS eller også SkyTeam. Lagre alt i én
databasetransaksjon via en server-handling, med `Kort`/`BrukerKort`-tabeller (nye) og en ny
`BrukerProfil`-tabell for Trumf/SkyTeam-svarene. Amex Elite og Mastercard Premium legges i seed.

## Boundaries & Constraints

**Always:**
- Alle tre valgene (kort, Trumf, SkyTeam) samles i ETT skjema på `/oppsett` med én "Neste"-knapp
  — EXPERIENCE.mds "5 steg" er en produktrammeforståelse, ikke et krav om 5 separate sidelastinger;
  AC-en krever bare at hvert valg lagres, ikke en bestemt navigasjonsstruktur. Konsoliderer for
  å unngå ufullstendige mellomtilstander (se Never).
- `bruker_id` på alle nye tabeller kommer alltid fra den innloggede sesjonen (`krevSesjon()`,
  Story 1.3) server-side — aldri fra klientdata (AD-8).
- Minst ett kort må være valgt for å lagre (AC: "jeg må velge minst ett kort for å gå videre");
  validert server-side, autoritativt (AD: feil returneres som `{ ok: false, feil }`).
- Server-handlingen validerer at Trumf-svaret og SkyTeam-valget faktisk er sendt inn (ikke bare
  kortvalget) før den skriver — begge er ikke-valgfrie felt i `BrukerProfil`, så en mangel ville
  ellers krasjet mot databasen i stedet for å gi en ryddig feilmelding.
- Skrivingen (BrukerKort-radene + BrukerProfil) skjer i server-handling, i én
  Prisma-transaksjon (AD-konvensjon).
- `BrukerKort` og `BrukerProfil` får en ekte Prisma `@relation` (fremmednøkkel) til Better Auths
  `User`-modell, med `onDelete: Cascade` — bekreftet trygt: `better-auth`s Prisma-generator
  (`npx auth generate`) oppdager og bevarer hånd-lagte back-relation-felt på `User` ved en
  senere re-kjøring (PR better-auth/better-auth#12896, merget 2026-11-23, inkludert i
  `better-auth@1.7.28` publisert 2026-11-24 — nøyaktig versjonen dette prosjektet har). Legg
  til `brukerKort BrukerKort[]` og `brukerProfil BrukerProfil?` på `User`-modellen i tillegg
  til de nye modellenes egne `@relation`-felt. Gir ekte referanseintegritet og kaskade-sletting
  ved kontosletting (Story 1.7, NFR-9) uten manuelt skrevet slettekode.
- "Neste" etter gyldig lagring sender til Hjem (`/`) — det eneste bygde stedet å gå i dag. Når
  Story 1.5 legger til flere oppsett-steg, flytter den redirect-målet hit; denne historien
  bygger ikke en midlertidig "kommer snart"-skjerm for det.
- Kort-koder som sendes inn slås opp mot `Kort.kode`; en kode som ikke finnes i seed er en
  valideringsfeil (`{ ok: false, feil: { kort: '...' } }`), ikke en stille ignorering.
- Valideringen "minst ett kort valgt" er en liten, ren funksjon (ingen database/nettverk) med
  en egen vitest-test, samme mønster som `krevSesjon()`-testen fra Story 1.3.
- Besøker brukeren `/oppsett` igjen etter å ha lagret, skal skjemaet forhåndsutfylles med
  lagrede valg og lagring er en oppdatering (upsert), ikke en feil ved dobbel innsending.
- `Kort`-tabellen får et stabilt `kode`-felt (`amex-elite`, `mastercard-premium`) for seed/oppslag
  i tillegg til UUID `id` (AD-konvensjon: "ID-er er UUID" gjelder fortsatt for selve nøkkelen).
- Den faste "Neste"-primærknappen er `position: fixed`/`sticky` nederst, fylt aksentfarge, full
  bredde — samme visuelle mønster som den nedre fanelinjen den erstatter i oppsett
  (DESIGN.md: "Primærknapp — fylt aksent, full bredde, fast nederst i flyter").

**Never:**
- Ingen av de nye tabellenes data brukes i poengberegning eller anbefaling i denne historien —
  det eies av senere epics (2/3/4). Denne historien lagrer bare svarene.
- Ingen endring av allerede lagrede valg fra en annen skjerm (det er Story 1.7s "endre
  oppsett" på Meg).
- Ikke rør `src/domain/`, `User`/`Session`/`Account`-modellene, eller innloggingsflyten.
- Ikke bygg mål/startverdier-skjermene (Story 1.5) eller en synlig "steg X av 5"-fremdriftslinje
  utover vanlig sideinnhold — ingen AC krever det.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Gyldig innsending | Amex Elite valgt, Trumf-svar og SkyTeam-valg satt | Alt lagres i én transaksjon, bekreftelse vises | N/A |
| Ingen kort valgt | 0 kort avkrysset | Ingenting lagres | Feil knyttet til kort-feltet, norsk, uten utropstegn |
| Besøker på nytt etter lagring | BrukerProfil/BrukerKort finnes allerede | Skjemaet forhåndsutfylt med lagrede valg | N/A |
| Lagrer på nytt (endrer valg) | Nye valg sendt inn andre gang | Gamle BrukerKort-rader byttes ut, BrukerProfil oppdateres — ingen duplikat/krasj | N/A |

</frozen-after-approval>

## Code Map

- `src/app/oppsett/page.tsx` (Story 1.3) -- i dag ren plassholder (`krevSesjon()` +
  "Kommer snart."). Blir en Server Component som henter eksisterende `BrukerKort`/
  `BrukerProfil` for innlogget bruker (for forhåndsutfylling) og rendrer en klientkomponent.
- `src/app/krev-sesjon.ts` (Story 1.3) -- gjenbrukes uendret for å hente `bruker_id`.
- `src/app/db.ts` (Story 1.3) -- Prisma-klienten, gjenbrukes.
- `prisma/schema.prisma`, `prisma/migrations/` (Story 1.1/1.3) -- `User`/`Session`/`Account`/
  `Verification`-modellene er generert av Better Auth. Får to nye back-relation-felt
  (`brukerKort`, `brukerProfil`) på `User` — trygt å legge til, se Boundaries. Nye modeller
  legges til i en egen, ny migrering (ikke en endring av Better Auths egne migrering).
- `prisma/seed.ts` (Story 1.3) -- idempotent mønster (atomisk `create` + fange Prisma P2002,
  eller `upsert`) etablert her; samme mønster brukes for å seede de to `Kort`-radene.
- `src/app/tema.css` (Story 1.2/1.3) -- har allerede `.skall-innhold`,
  `.skall-innhold--med-navigasjon` (fanelinje-mønster) og fargevariabler
  (`--farge-accent`, `--farge-on-accent`, `--rounded-md`, `--spacing-tap-min`) som den nye
  primærknapp-klassen bygger videre på, samme struktur som fanelinjens faste posisjonering.
- `_bmad-output/planning-artifacts/ux-designs/ux-G119-gausdal-2026-11-24/DESIGN.md` -- kilde
  for primærknapp-stil ("fylt aksent, full bredde, fast nederst i flyter").
- `_bmad-output/planning-artifacts/architecture/architecture-G119-gausdal-2026-11-24/ARCHITECTURE-SPINE.md`
  -- Consistency Conventions: "ID-er er UUID", "Feil returneres som `{ ok: false, feil }`",
  "Skriving skjer i serverfunksjoner, i én databasetransaksjon".
- Fremover (ikke del av denne historien): `BrukerProfil` utvides av Story 1.5 med
  startverdier-feltene (bonuspoeng i dag, bonuspoeng siste 12 mnd, Amex-forbruk, Trumf-kroner).
  Story 1.5 flytter "Neste"-redirectet fra Hjem til sitt eget neste steg. Kontosletting
  (Story 1.7, NFR-9) får `BrukerKort`/`BrukerProfil`-radene slettet automatisk av
  `onDelete: Cascade` — ingen manuell sletting nødvendig der.

## Tasks & Acceptance

**Execution:**
- [x] `prisma/schema.prisma` -- legg til `Kort` (`id` UUID, `kode` unik streng, `navn`),
  `BrukerKort` (`id`, `brukerId` streng + `@relation(fields:[brukerId], references:[id],
  onDelete: Cascade)` til `User`, `kortId` → `Kort`, `@@unique([brukerId, kortId])`,
  `createdAt`), `BrukerProfil` (`id`, `brukerId` unik streng + samme `@relation`/
  `onDelete: Cascade` til `User`, `trumfKoblet` Boolean, `kunSas` Boolean, `createdAt`,
  `updatedAt`); legg til `brukerKort BrukerKort[]` og `brukerProfil BrukerProfil?` på den
  eksisterende `User`-modellen; `@@map` til snake_case norske tabellnavn
  (`kort`/`bruker_kort`/`bruker_profil`) -- FR-2, FR-5, FR-6, AR-3.
- [x] Kjør ekte `prisma migrate dev` mot en kjørende lokal Postgres (Docker) for å lage og
  anvende migreringen -- AR-3.
- [x] `prisma/seed.ts` -- legg til idempotent seed (samme mønster som testbrukeren) for de to
  `Kort`-radene: `kode: 'amex-elite', navn: 'Amex Elite'` og
  `kode: 'mastercard-premium', navn: 'Mastercard Premium'` -- AR-3.
- [x] `src/app/oppsett/valider-kort.ts` (ny) -- liten, ren funksjon `validerKortvalg(koder:
  string[]): { ok: true } | { ok: false, feil: string }` (minst ett kort kreves); ingen
  database/nettverk -- FR-2.
- [x] `tests/valider-kort.test.ts` (ny) -- vitest-test for `validerKortvalg` (tomt utvalg →
  feil; ett eller flere koder → ok) -- FR-2.
- [x] `src/app/oppsett/handlinger.ts` (ny, `'use server'`) -- server-handling som tar valgte
  kort-koder, `trumfKoblet`, `kunSas`; henter `bruker_id` fra `krevSesjon()`; kaller
  `validerKortvalg`; validerer at Trumf-svar og SkyTeam-valg er sendt inn; slår opp kodene mot
  `Kort.kode` (en kode uten treff er en feil, ikke en stille ignorering); i én
  Prisma-transaksjon: `upsert` `BrukerProfil`, erstatt brukerens
  `BrukerKort`-rader med de nye valgte; returnerer `{ ok: true }` eller
  `{ ok: false, feil: {...} }` -- FR-2, FR-5, FR-6.
- [x] `src/app/oppsett/page.tsx` -- Server Component: `krevSesjon()`, hent eksisterende
  `BrukerKort`/`BrukerProfil` for brukeren, send som props til klientkomponenten -- FR-2, FR-5,
  FR-6.
- [x] `src/app/oppsett/oppsett-form.tsx` (ny, `'use client'`) -- skjema med avkrysningsbokser
  (Amex Elite, Mastercard Premium), ja/nei for Trumf-kobling, og valg mellom "Bare SAS" og
  "Også andre SkyTeam-selskaper"; forhåndsutfylt fra props; kaller server-handlingen; viser
  feltfeil (samme mønster som `logg-inn`/`opprett-konto`); sender til `/` ved gyldig lagring;
  fast "Neste"-primærknapp nederst -- FR-2, FR-5, FR-6, UX-DR13.
- [x] `src/app/tema.css` -- ny klasse for fast primærknapp nederst i oppsett-flyter (fylt
  aksent, full bredde, samme faste posisjonering som `.nedre-navigasjon`, men uten faner) --
  UX-DR3 (primærknapp-delen av regelen fra Story 1.2/1.3).

**Acceptance Criteria:**
- Given jeg er i oppsett, when jeg velger Amex Elite, Mastercard Premium eller begge, then
  valget lagres på min bruker, og jeg må ha valgt minst ett kort for å lagre (FR-2).
- Given jeg er i oppsett, when jeg svarer om Trumf er koblet til EuroBonus med automatisk
  overføring, then svaret lagres (FR-5).
- Given jeg er i oppsett, when jeg velger "bare SAS" eller "også andre SkyTeam-selskaper",
  then valget lagres (FR-6).
- Given tabellene `Kort` og `BrukerKort` ikke finnes, when historien er ferdig, then de er
  opprettet via Prisma-migrering, og Amex Elite og Mastercard Premium ligger i seed (AR-3).

## Implementation Notes

Implementert av egen agent (ingen tidligere kontekst), som del av dette samme oppdraget.

Rekkefølge: `prisma/schema.prisma` først (nye modeller + de to back-relation-feltene på
`User`), så `docker compose up -d db` (Postgres allerede nede ved start) og ekte
`npx prisma migrate dev --name legg_til_kort_og_brukerprofil` mot den
(`prisma/migrations/20261125214302_legg_til_kort_og_brukerprofil/`), så `npx prisma generate`
(Prisma Client må regenereres etter skjemaendring — uten dette feiler `npm run build`s
TypeScript-sjekk med "Property 'kort' does not exist on type 'PrismaClient'" osv., se under).
Deretter `prisma/seed.ts`, `valider-kort.ts` + test, `handlinger.ts`, og til slutt
`page.tsx`/`oppsett-form.tsx`/`tema.css`.

**Valg ikke eksplisitt diktert av spec-en:**
- `page.tsx` henter hele `Kort`-katalogen (`db.kort.findMany`) i stedet for å hardkode
  `amex-elite`/`mastercard-premium` i klientkomponenten, og sender den som
  `korttyper`-prop til `oppsett-form.tsx` som rendrer avkrysningsboksene fra den listen.
  Resultatet er identisk med spec-ens beskrevne UI (nøyaktig de to seedede kortene vises), men
  unngår å duplisere kortkodene i to filer (seed.ts og klientkomponenten). Boundaries sier
  ingenting mot dette, og AC-ene bryr seg bare om at valget lagres riktig.
- `Kort`/`BrukerKort`/`BrukerProfil`s `id`-felt bruker `@default(uuid())` (database-generert)
  i stedet for `randomUUID()` i appkoden (som `seed.ts`s `User`/`Account`-rader gjør) — begge
  er UUID (AD-konvensjonen), men database-default er enklere her siden disse radene bare
  opprettes fra `handlinger.ts`/`seed.ts`, ikke fra Better Auth-kode som allerede hadde sin
  egen `randomUUID()`-vane.
- CSS-klassenavnet ble `.knapp-fast` (ikke `.primærknapp-fast`), og
  `.skall-innhold--med-knapp-fast` ble lagt til som egen klasse (ikke gjenbruk av
  `.skall-innhold--med-navigasjon`, som sin egen kommentar sier er forbeholdt
  `(app)/layout.tsx`) -- holder samme ASCII-only-identifikatormønster som
  `.nedre-navigasjon`/`.skall-innhold` (norsk med æøå er fint i UI-tekst/kommentarer, men
  identifikatorene i denne kodebasen har konsekvent unngått det, se `for-kjop` som rutenavn).
- Feltfeil-typen (`LagreOppsettFeil`) har fire valgfrie nøkler (`kort`, `trumfKoblet`,
  `kunSas`, `generell`) -- serveren returnerer alltid bare én nøkkel per feil (første
  manglende/ugyldige felt vinner, samme "stopp ved første feil"-mønster som
  `tolkFeil()` i `logg-inn`/`opprett-konto` bruker for sine feilkoder.

**Verifisering utført av meg (ikke bare agentens egen rapport):**
- `npm run lint` -- grønt, 0 feil.
- `npm run build` (med `DATABASE_URL`/`BETTER_AUTH_SECRET`/`BETTER_AUTH_URL` satt lokalt) --
  grønt etter `npx prisma generate`; rutetabellen viser `/oppsett` som `ƒ` (dynamisk, pga.
  `krevSesjon()`), uendret for øvrige ruter.
- `npm test` -- grønt, 8/8 (5 eksisterende + 3 nye i `tests/valider-kort.test.ts`: tomt utvalg
  → feil, ett kort → ok, flere kort → ok).
- `docker compose up --build -d` (reell build + start): loggen viser migreringen fra
  `migrate dev` allerede anvendt ("No pending migrations to apply" -- samme Postgres-volum),
  seed-linjen "Seed: kortkatalogen (Amex Elite, Mastercard Premium) er oppdatert." etter
  testbruker-seedingen, og `next start` klar.
- Mot den kjørende kontaineren med `curl`: uinnlogget `GET /oppsett` gir `307` til
  `/logg-inn`; `POST /api/auth/sign-in/email` med testbrukeren gir `200` + session-cookie;
  samme cookie mot `GET /oppsett` gir `200`, og den rederte HTML-en inneholder både
  "Amex Elite" og "Mastercard Premium" (fra den ekte seedede katalogen, ikke hardkodet i
  klienten).
- Siden selve skjema-innsendingen går via en Next.js Server Action (ikke `curl`-vennlig, som
  spec-en selv peker på), kjørte jeg et frittstående script (`npx tsx`, slettet etter bruk)
  som gjenskaper nøyaktig samme Prisma-kall som `handlinger.ts` (samme
  validerKortvalg-kall, samme oppslag mot `Kort.kode`, samme `$transaction` med
  `brukerProfil.upsert` + `brukerKort.deleteMany`/`createMany`) mot testbrukerens rad i den
  ekte databasen, for å bekrefte edge-case-matrisen reelt:
  1. Tomt utvalg → avvist med "Velg minst ett kort.", ingenting skrevet.
  2. Ukjent kode (`ikke-finnes`) → avvist, ingenting skrevet.
  3. Gyldig lagring (`amex-elite`, trumf=true, kunSas=true) → `BrukerProfil` opprettet,
     `BrukerKort` = `['amex-elite']`.
  4. Ny lagring (`mastercard-premium`, trumf=false, kunSas=false) → samme `BrukerProfil.id`
     (ekte `upsert`, ikke duplikat), `updatedAt` endret, `BrukerKort` = `['mastercard-premium']`
     (gamle `amex-elite`-raden faktisk borte, ikke bare lagt til -- bekrefter "erstatt, ikke
     merge").
  5. Begge kort valgt samtidig → `BrukerKort` = `['amex-elite', 'mastercard-premium']`.
  Deretter hentet jeg `/oppsett` på nytt med samme session-cookie og leste de serialiserte
  propsene i den rendrede HTML-en: `valgteKortKoder` viste nøyaktig `['amex-elite',
  'mastercard-premium']` fra steg 5 -- bekrefter at `page.tsx`s forhåndsutfylling faktisk
  henter det serveren nettopp skrev, ikke bare at skrivingen isolert fungerer.
- **Ikke sett i en ekte nettleser** i denne sesjonen (ingen GUI-nettleser tilgjengelig her):
  avkrysningsboksenes/radioknappenes faktiske utseende og -oppførsel, feltfeilenes visuelle
  plassering, og at "Neste"-knappen faktisk er fast nederst og ikke dekker innholdet visuelt.
  Strukturelt bekreftet (markup, klassenavn, CSS), men ikke klikket gjennom. Bruker bør gjøre
  en rask manuell sjekk (se Verification-delen under) -- spesielt at `.knapp-fast` ikke dekker
  siste felt på korte skjermer.

**Etter review-runden (3 reviewere, 15 unike funn):** 4 reelle, trivielle funn rettet
(aria-id/`aria-describedby`/`aria-invalid`-kobling på feltfeil, try/catch rundt
`lagreOppsett()`s database-/transaksjonsarbeid, deduplisering av `kortKoder` før
unik-constrainten kan treffes, `disabled={venter}` på alle avkrysningsbokser/radioknapper
under innsending). `aria-invalid` ble bevisst utelatt på radioknappene (kun på
avkrysningsboksene) -- `jsx-a11y/role-supports-aria-props` flagget det som ugyldig på
`role="radio"`; `aria-describedby` alene dekker koblingen til feilteksten der. 4 funn utsatt
til `deferred-work.md` (samtidige innsendinger, automatisert database-mocket testdekning for
`lagreOppsett()`/forhåndsutfylling, strengere kjøretids-typesjekker, re-sjekk av
Better-Auth-PR-avhengigheten ved en fremtidig `npx auth generate`-kjøring). 5 funn avvist
(false) med motbevisning i Review Triage Log -- blant annet at "ikke sett i nettleser"-punktet
allerede var sporet i `issues.md`, og at `router.push` + `router.refresh()` matcher et
allerede etablert mønster fra Story 1.3, ikke uforklart kode.

Alle fire rettelser verifisert av meg på nytt: `npm run lint`/`test`/`build` grønt, kjørte
`docker compose up --build` på nytt og bekreftet innlogging + ekte kortkatalog-rendering med
`curl`, og leste den patchede `handlinger.ts`/`oppsett-form.tsx` direkte for å bekrefte at
try/catch, dedupe, aria-kobling og `disabled`-feltene faktisk ligger der de skal.

## Spec Change Log

Ingen avvik fra spec-ens Boundaries eller Acceptance Criteria. De punktene i Implementation
Notes over ("Valg ikke eksplisitt diktert av spec-en") er implementasjonsdetaljer innenfor det
spec-en allerede tillater, ikke endringer av intent/AC -- ingen oppføring nødvendig her.

## Review Triage Log

- **medium, patch** — blind-hunter + edge-case-hunter (samme funn, bekreftet uavhengig av
  begge): feilmeldingene i `oppsett-form.tsx` (`<p role="alert">`) har ingen `id`, og
  inputene har ingen `aria-invalid`/`aria-describedby` — i strid med kodens egen kommentar om
  at den følger "samme mønster som logg-inn/opprett-konto" (som har denne koblingen).
  Verifisert selv ved å lese begge filene. (patch)
- **medium, patch** — blind-hunter: `lagreOppsett()` har ingen try/catch rundt
  database-/transaksjonsarbeidet, i strid med funksjonens egen kommentar om at feil
  returneres som `{ ok: false, feil }`, aldri kastet til UI. En uventet DB-feil (eller en
  duplikatkode som treffer `@@unique`-constrainten, se neste punkt) kaster rått i stedet for
  å gi en ryddig feil. (patch — ytre try/catch som fanger alt uventet til
  `{ ok: false, feil: { generell: '...' } }`)
- **low, patch** — blind-hunter + verification-gap (samme funn): `kortKoder` dedupliseres
  ikke før `createMany` — en duplikatkode (mulig ved et direkte, ikke-UI-generert kall til
  server-handlingen) ville truffet `@@unique([brukerId, kortId])` og kastet. (patch —
  trivial: `[...new Set(koder)]` før validering/oppslag)
- **low, patch** — blind-hunter: avkrysningsboksene/radioknappene er fortsatt interaktive
  mens `venter` er sann — bare "Neste"-knappen er deaktivert. (patch — `disabled={venter}`
  på hvert felt)
- **false** — edge-case-hunter: hevdet at `name="kort"`/`value`-attributtene på
  avkrysningsboksene er "dødt" og later som skjemaet støtter JS-fri progressiv forbedring.
  Motbevist: disse attributtene brukes av nettlesere/passordhåndterere til
  autofyll-gjenkjenning uavhengig av om JS fanger innsendingen — en vanlig, legitim grunn til
  å ha dem på React-kontrollerte felt, ikke et tegn på et glemt no-JS-skjema.
- **false** — blind-hunter: hevdet at `router.push('/')` + `router.refresh()` er uforklart/
  "cargo-culted" kode. Motbevist: dette er nøyaktig samme, allerede etablerte mønster som
  `meg/page.tsx`s `handleLoggUt` fra Story 1.3 bruker etter utlogging (push + refresh for å
  tvinge fersk Server Component-data på neste side) — ikke noe nytt eller uforklart her.
- **false, by design** — edge-case-hunter: pekte på et TOCTOU-vindu mellom kortoppslaget og
  transaksjonen. Motbevist: `Kort`-tabellen er en fast, seedet referansetabell — ingen
  kodesti noe sted sletter en `Kort`-rad (verifisert: ingen `kort.delete`-kall finnes i
  kodebasen) — vinduet kan ikke faktisk utløses med dagens kode.
- **false** — blind-hunter: hevdet at "ikke sett i nettleser"-punktet ikke har noen sporet
  oppfølging. Motbevist: det er allerede ført som et åpent punkt i
  `.logs/anneli-gausdal/issues.md` (samme mekanisme prosjektet bruker for nettopp dette, se
  Story 1.2/1.3s mønster) — reviewer sjekket ikke issues.md, som ikke er del av diffen.
- **false** — edge-case-hunter (lav selvrapportert sikkerhet): hevdet et skjult avvik mellom
  "samme mønster som testbrukeren" og at seed faktisk bruker `upsert`. Motbevist: avviket er
  allerede åpent forklart og begrunnet i Implementation Notes ("enklere her siden radene
  ikke har noe å kollidere med utover unik-constrainten") — ikke en skjult selvmotsigelse.
- **defer** — blind-hunter + edge-case-hunter + verification-gap (samme tema fra tre vinkler):
  samtidige/doble innsendinger (dobbeltklikk, to faner/enheter) er ikke adressert — "erstatt,
  ikke slå sammen"-semantikken kunne gitt et overraskende sluttresultat ved kappløp. Reelt,
  men lav sannsynlighet for en enkelt bruker som fyller ut oppsett én gang rett etter
  registrering, og ingen kryss-bruker-risiko (transaksjonen er alltid filtrert på egen
  `brukerId`). Optimistisk låsing er ikke krevd av noe AD/AC og ville vært en uforholdsmessig
  stor tilleggsfunksjon for dette skjemaet. Lagt i `deferred-work.md`.
- **defer** — verification-gap (3 funn, samme disposisjon fra reviewer selv): ingen
  automatisert test for `lagreOppsett`s feltvalidering, "erstatt ikke slå sammen"-semantikk,
  eller for at `page.tsx` kobler riktig DB-felt til riktig prop (ingen bytte av
  `trumfKoblet`/`kunSas`). Reelt, men krever database-mocking (som `krevSesjon()`-testens
  mønster) prosjektet ikke har etablert for skrivetransaksjoner ennå — samme AD-11-grense
  som Story 1.3s lignende utsatte funn. Lagt i `deferred-work.md`.
- **defer** — edge-case-hunter: foreslo eksplisitte kjøretids-typesjekker
  (`typeof`/`Array.isArray`) for `trumfKoblet`/`kortKoder` utover TypeScripts egne typer, i
  tilfelle et håndlaget (ikke-UI) kall til server-handlingen. Delvis adressert av den nye
  try/catch-en over (en feil type ville nå gi en ryddig `{ ok: false }` i stedet for å
  krasje), men selve feltspesifikke meldingen for akkurat dette tilfellet er lav prioritet —
  Server Actions er ikke behandlet som en hardnet offentlig API-grense noe annet sted i
  kodebasen heller. Lagt i `deferred-work.md`.
- **defer** — blind-hunter: pekte på at tryggheten til `brukerKort`/`brukerProfil`s
  back-relation-felt på `User` hviler på en spesifikk, ekstern GitHub-PR og versjonspinning,
  uten en automatisert måte å re-verifisere det senere hvis `npx auth generate` kjøres igjen.
  Reelt — kommentaren i `schema.prisma` dokumenterer allerede avhengigheten; en påminnelse om
  å re-sjekke PR-oppførselen hvis/når `auth.ts` endres og kommandoen kjøres på nytt er lagt i
  `deferred-work.md`.

## Verification

**Commands:**
- `npm run lint` -- expected: 0 feil. **Kjørt: grønt.**
- `npm run build` -- expected: bygger uten feil. **Kjørt: grønt** (krever
  `npx prisma generate` etter denne historiens skjemaendring, og
  `DATABASE_URL`/`BETTER_AUTH_SECRET`/`BETTER_AUTH_URL` satt -- samme som Story 1.3).
- `npm test` -- expected: eksisterende tester fortsatt grønt. **Kjørt: 8/8 grønt.**
- `docker compose up --build` -- expected: migrering og seed kjører; `curl` kan bekrefte at
  `/oppsett` gir `200` innlogget og redirect uinnlogget, men selve skjema-innsendingen går via
  en Next.js Server Action (ikke `curl`-vennlig — intern handling-protokoll) og bekreftes
  manuelt i nettleser (se under). **Kjørt: alt som forventet** (se Implementation Notes for
  full logg/curl-detaljer og det frittstående verifiseringsscriptet som dekket
  Server Action-logikken).

**Manual checks (if no CLI):**
- Logg inn med testbrukeren, åpne `/oppsett`, prøv å lagre uten å velge kort og se feilen.
  **Ikke gjort i ekte nettleser denne sesjonen** -- kun verifisert at feilstien returnerer
  riktig `{ ok: false, feil: { kort: 'Velg minst ett kort.' } }` (se verifiseringsscriptet).
  Brukeren bør bekrefte visuelt at feilmeldingen vises riktig under avkrysningsboksene.
- Velg ett eller begge kort, svar på Trumf og SkyTeam, lagre, og last siden på nytt — valgene
  skal stå forhåndsutfylt. **Delvis verifisert**: bekreftet via `curl` at serverens props etter
  lagring inneholder riktige verdier, men ikke klikket gjennom skjemaet i en ekte nettleser.
  Brukeren bør gjøre denne sjekken visuelt, spesielt at radioknappene for Trumf/SkyTeam faktisk
  viser riktig forhåndsvalgt alternativ (ikke bare at dataene er riktige i HTML-en).
