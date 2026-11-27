---
title: 'Velge mål og legge inn startverdier'
type: 'feature'
created: '2026-11-27'
status: 'done'
baseline_commit: 'd0c2663dacac40d33cc0bc0f2fc714d875a0b4fd'
route: 'dispatch'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Oppsettets andre halvdel finnes ikke. Appen vet ikke hvilke mål brukeren har
(poengmål, Companion Ticket, Fly Premium) eller hvor hun står i dag (bonuspoeng, Amex-forbruk,
Trumf-kroner) — tall senere historier (Hjem, fremdrift) er avhengige av.

**Approach:** Bygg et nytt oppsett-steg på `/oppsett/mal`, nådd via Story 1.4s "Neste"-knapp
(som nå peker hit i stedet for til Hjem). Ett samlet skjema: poengmål (tall, påkrevd),
Companion Ticket og Fly Premium (valgfrie avkrysningsbokser, bare synlige/tillatt hvis
brukeren faktisk har det relevante kortet), og de fire startverdiene. Lagres i `BrukerProfil`
(utvidet med nye felt, iht. forward-noten fra Story 1.4). "Ferdig"-knappen sender til Hjem.

## Boundaries & Constraints

**Always:**
- `bruker_id` kommer alltid fra `krevSesjon()` server-side — aldri fra klientdata (AD-8).
- Besøker brukeren `/oppsett/mal` uten å ha fullført Story 1.4s steg først (ingen
  `BrukerProfil`-rad finnes), omdirigeres hun til `/oppsett` — AC-ens "Given jeg har valgt
  kort og bonusreisetype" er en forutsetning, ikke noe denne siden selv kan garantere.
- `(app)/layout.tsx` (Hjem, Før kjøp, Kjøp, Meg) sjekker i dag bare innlogging, ikke at
  oppsettet er fullført. Bekreftet reelt, utløsbart hull: `logg-inn/page.tsx` sender alltid
  rett til `/` — en bruker som gjør Story 1.4s steg, lukker appen, og logger inn igjen,
  lander på Hjem med `poengmal`/startverdiene fortsatt `null`. Siden Story 1.5 er historien
  som introduserer selve "fullført oppsett"-begrepet, tettes hullet her: `(app)/layout.tsx`
  sjekker også `BrukerProfil` og omdirigerer til `/oppsett` (ingen rad) eller `/oppsett/mal`
  (rad finnes, men `poengmal` er fortsatt `null`) før noe av innholdet rendres.
- Companion Ticket er bare valgbar hvis brukeren har Amex Elite; Fly Premium bare hvis hun har
  Mastercard Premium (FR-2). Bonusreisetypen («bare SAS»/«også SkyTeam») endrer bare
  forklaringstekst for Fly Premium i en senere historie (Story 7.2) — den styrer IKKE om
  Fly Premium er valgbar her (AC-ens "og «bare SAS» eller «også SkyTeam»" dekker begge verdier
  av det valget, altså ingen ekstra filtrering i denne historien).
- Serveren validerer Companion Ticket/Fly Premium-valgene på nytt mot brukerens faktiske
  `BrukerKort` — stoler aldri på at klienten skjulte avkrysningsboksen riktig.
- Poengmål er et påkrevd positivt heltall (≥1). Bonuspoeng i dag, Amex-forbruk og Trumf-kroner
  er alltid påkrevde heltall ≥0 (aldri negative). "Poeng opptjent siste 12 måneder" er bare
  påkrevd (og bare vist) når Fly Premium er valgt — se Spec Change Log 2026-11-27. Alt
  validert server-side, autoritativt (`{ ok: false, feil }`).
- Bonuspoeng-feltene lagres som rene heltall; Amex-forbruk og Trumf-kroner lagres som heltall
  i øre (FR-4, AR-5). Alle tallfelt bruker `inputMode="decimal"` og godtar komma som
  desimaltegn (UX-DR15) — et beløp med mer enn 2 desimaler rundes ned til nærmeste øre
  (samme "alltid nedover"-filosofi som AD-5, selv om selve rundingsregelen der gjelder
  poengberegning, ikke inntasting).
- Tallparsing/validering er to små, rene funksjoner (ingen database/nettverk), med egne
  vitest-tester — samme mønster som `valider-kort.ts` fra Story 1.4.
- `BrukerProfil` (Story 1.4) utvides med de nye feltene — raden opprettes allerede i Story 1.4s
  steg, før disse feltene er kjent, og fylles inn her ved en `update` (ikke `upsert` — raden må
  allerede finnes, se forrige punkt). De fem tallfeltene (`poengmal`,
  `bonuspoengIDag/Siste12Mnd`, `amexForbrukOre`, `trumfKronerOre`) er **valgfrie** (nullable) —
  `null` betyr "ikke fylt ut ennå". Companion Ticket/Fly Premium-flaggene
  (`harCompanionTicket`/`harFlyPremium`) er derimot `Boolean` med standardverdi `false`, ikke
  nullable — "ikke valgt ennå" og "valgt bort" er samme ting for disse to (ingen av dem er en
  bevisst "nei" som må skilles fra "ikke spurt", ulikt Trumf-spørsmålet i Story 1.4).
- Besøker brukeren `/oppsett/mal` igjen etter å ha lagret, forhåndsutfylles skjemaet med
  lagrede verdier (samme gjenbesøk-mønster som Story 1.4).
- Story 1.4s `oppsett-form.tsx` endrer "Neste"-redirectet fra `/` til `/oppsett/mal` — dette
  var eksplisitt planlagt i Story 1.4s Code Map.
- "Ferdig" etter gyldig lagring sender til Hjem (`/`) (AC: "jeg trykker Ferdig... kommer til
  Hjem").

**Never:**
- Ingen Mål-detalj-skjerm, utløpsdato for Companion Ticket, eller nivåvisning for Fly Premium
  i denne historien — det er Epic 7s ansvar (Story 7.1/7.2). Her lagres bare at målet er valgt.
- Ingen bruk av disse feltene i poengberegning, Hjem eller fremdriftsbar i denne historien —
  det eies av senere epics (2/3/4). Denne historien lagrer bare svarene.
- Ingen endring av allerede lagrede mål/startverdier fra en annen skjerm (Story 1.7s "endre
  oppsett" på Meg).
- Ikke rør `src/domain/`, `User`/`Session`/`Account`-modellene, eller Story 1.4s
  `Kort`/`BrukerKort`-tabeller utover å lese fra dem.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Gyldig innsending | poengmål 180000, begge mål-bokser krysset (begge kort), gyldige startverdier | Alt lagres, sendes til Hjem | N/A |
| Mangler/ugyldig poengmål | tomt felt, 0, negativt, eller tekst | Ingenting lagres | Feil knyttet til poengmål-feltet |
| Companion Ticket krysset uten Amex Elite | `harCompanionTicket: true`, bruker har ikke Amex Elite | Avvist, ingenting lagres | Feil (server stoler ikke på klienten) |
| Besøker `/oppsett/mal` uten fullført steg 1 | ingen `BrukerProfil`-rad | Omdirigert til `/oppsett` | N/A |
| Besøker på nytt etter lagring | `BrukerProfil` har mål/startverdier fra før | Skjemaet forhåndsutfylt | N/A |
| Beløp med komma og mer enn 2 desimaler | `"1234,567"` kr | Lagres som `123456` øre (rundet ned) | N/A |
| Logger inn med ufullført oppsett | innlogget, `BrukerProfil` finnes men `poengmal` er `null` | Besøk på `/`, `/for-kjop`, `/kjop` eller `/meg` omdirigerer til `/oppsett/mal` | N/A |
| Logger inn uten noe oppsett | innlogget, ingen `BrukerProfil`-rad | Besøk på `/`, `/for-kjop`, `/kjop` eller `/meg` omdirigerer til `/oppsett` | N/A |

</frozen-after-approval>

## Code Map

- `src/app/oppsett/page.tsx`, `oppsett-form.tsx`, `handlinger.ts`, `valider-kort.ts` (Story 1.4)
  -- `oppsett-form.tsx` sin `router.push('/')` endres til `router.push('/oppsett/mal')`; resten
  uendret.
- `src/app/krev-sesjon.ts`, `src/app/db.ts` (Story 1.3) -- gjenbrukes uendret.
- `src/app/(app)/layout.tsx` (Story 1.3) -- sjekker i dag bare `krevSesjon()`. Får en ny
  sjekk av `BrukerProfil`/`poengmal` og omdirigerer til riktig oppsett-steg hvis ufullført
  (se Boundaries) — tetter et reelt, allerede utløsbart hull (ikke bare forebyggende for
  Story 1.6).
- `prisma/schema.prisma` (Story 1.1/1.3/1.4) -- `BrukerProfil` (Story 1.4) utvides med 7 nye
  **valgfrie** felt: `poengmal Int?`, `harCompanionTicket Boolean @default(false)`,
  `harFlyPremium Boolean @default(false)`, `bonuspoengIDag Int?`, `bonuspoengSiste12Mnd Int?`,
  `amexForbrukOre Int?`, `trumfKronerOre Int?`. Ny migrering (ALTER TABLE, ikke en ny tabell —
  AC-ens "tabellene for mål og startverdier" dekkes av at kolonnene opprettes via en reell
  Prisma-migrering, se Boundaries for hvorfor dette er `BrukerProfil` og ikke en egen tabell).
- `_bmad-output/planning-artifacts/architecture/architecture-G119-gausdal-2026-11-24/ARCHITECTURE-SPINE.md`
  -- AD-5 (heltall/øre, avrunding nedover), AD-8 (bruker_id), Consistency Conventions
  (`{ ok: false, feil }`).
- `_bmad-output/planning-artifacts/ux-designs/ux-G119-gausdal-2026-11-24/DESIGN.md` -- norsk
  tallformat (mellomrom tusenskille, komma desimal: `90 000`, `13,5`).
- Fremover (ikke del av denne historien): Epic 7 (Story 7.1/7.2) bygger Mål-detalj,
  Companion Ticket-dato og Fly Premium-nivåvisning på toppen av `harCompanionTicket`/
  `harFlyPremium`-flaggene herfra. Epic 2/3 leser `poengmal`/startverdiene i faktisk
  poengberegning.

## Tasks & Acceptance

**Execution:**
- [x] `prisma/schema.prisma` -- utvid `BrukerProfil` med de 7 nye valgfrie feltene (se
  Code Map) -- FR-3, FR-4, AR-3, AR-5.
- [x] Kjør ekte `prisma migrate dev` mot en kjørende lokal Postgres (Docker) for å lage og
  anvende migreringen -- AR-3.
- [x] `src/app/oppsett/tall.ts` (ny) -- to rene funksjoner, ingen database/nettverk:
  `parserHeltall(input: string): number | null` (avviser desimaler, negative tall, tomt/
  ugyldig); `parserKronerTilOre(input: string): number | null` (godtar komma som desimal,
  mellomrom som tusenskille, runder ned til nærmeste øre, avviser negative tall) -- FR-4,
  UX-DR15.
- [x] `tests/tall.test.ts` (ny) -- vitest-tester for begge funksjonene (gyldig, tomt, negativt,
  desimal i heltallsfelt, komma-beløp med 3 desimaler rundet ned, komma-beløp med
  tusenskille-mellomrom og ingen desimaldel (`"12 000"` -- skal GODTAS, gir `1200000`),
  etterhengende komma (`"12,"`) og flere komma (`"12,34,56"`) -- disse to siste skal
  avvises som ugyldige) -- FR-4.
- [x] `src/app/oppsett/mal/handlinger.ts` (ny, `'use server'`) -- server-handling
  `lagreMal(input)`: henter `bruker_id` fra `krevSesjon()`; henter brukerens `BrukerKort` og
  revaliderer at `harCompanionTicket`/`harFlyPremium` bare kan være sanne hvis riktig kort
  finnes; validerer poengmål (`parserHeltall`, ≥1) og de fire startverdiene (`parserHeltall`
  for poeng, `parserKronerTilOre` for beløp, ≥0); `update` (ikke `upsert`) på `BrukerProfil`
  i en try/catch (samme mønster som Story 1.4s `handlinger.ts` etter review-rettingen);
  returnerer `{ ok: true }` eller `{ ok: false, feil: {...} }` -- FR-3, FR-4, AR-5.
- [x] `src/app/oppsett/mal/page.tsx` (ny) -- Server Component: `krevSesjon()`; hvis
  `BrukerProfil` ikke finnes, `redirect('/oppsett')`; hent brukerens `BrukerKort` (for
  CT/FP-tilgjengelighet) og eksisterende mål/startverdier (for forhåndsutfylling); send som
  props til klientkomponenten -- FR-2, FR-3, FR-4.
- [x] `src/app/oppsett/mal/mal-form.tsx` (ny, `'use client'`) -- skjema: poengmål-felt,
  Companion Ticket-avkrysningsboks (bare rendret hvis Amex Elite finnes), Fly
  Premium-avkrysningsboks (bare rendret hvis Mastercard Premium finnes), fire
  startverdi-felt, feltfeil (samme mønster som Story 1.3/1.4s skjemaer, inkludert
  `aria-invalid`/`aria-describedby`), fast "Ferdig"-primærknapp (gjenbruk `.knapp-fast`/
  `.skall-innhold--med-knapp-fast` fra Story 1.4); sender til `/` ved gyldig lagring -- FR-2,
  FR-3, FR-4, UX-DR13, UX-DR15.
- [x] `src/app/oppsett/oppsett-form.tsx` (Story 1.4) -- endre `router.push('/')` til
  `router.push('/oppsett/mal')` ved gyldig lagring -- FR-3.
- [x] `src/app/(app)/layout.tsx` (Story 1.3) -- etter `krevSesjon()`, hent brukerens
  `BrukerProfil`; hvis raden ikke finnes, `redirect('/oppsett')`; hvis raden finnes men
  `poengmal` er `null`, `redirect('/oppsett/mal')` -- før `NedreNavigasjon`/innhold rendres.
  Tetter hullet der `logg-inn` sender rett til Hjem uansett oppsett-status -- FR-3.

**Acceptance Criteria:**
- Given jeg har valgt kort og bonusreisetype, when jeg velger poengmål og eventuelt Companion
  Ticket og Fly Premium, then målene lagres på min bruker; Companion Ticket tilbys bare med
  Amex Elite, og Fly Premium bare med Mastercard Premium og «bare SAS» eller «også
  SkyTeam» — altså uansett hvilken av de to verdiene bonusreisetypen har, siden Story 7.2s
  AC bekrefter at valget der bare endrer forklaringstekst, ikke tilgjengelighet (FR-2, FR-3,
  FR-6).
- Given jeg er i oppsett, when jeg oppgir bonuspoeng i dag, Amex-forbruk hittil i
  kalenderåret og Trumf-kroner siden siste overføring, then verdiene lagres som heltall
  (poeng) og øre (beløp); tallfelt åpner talltastatur med komma, og ugyldige verdier gir en
  forståelig feil knyttet til feltet (FR-4, AR-5, UX-DR13, UX-DR15). "Poeng opptjent siste
  12 måneder" vises og spørres bare når Fly Premium er valgt — se Spec Change Log 2026-11-27
  (FR-20, UX-DR14).
- Given de nye feltene for mål og startverdier ikke finnes, when historien er ferdig, then de
  er opprettet via Prisma-migrering (AR-3).
- Given oppsettet er fullført, when jeg trykker Ferdig, then jeg kommer til Hjem.

## Implementation Notes

Implementert av egen agent (ingen tidligere kontekst), som del av dette samme oppdraget.

Rekkefølge: `prisma/schema.prisma` (7 nye valgfrie felt på `BrukerProfil`), så
`docker compose up -d db` (var allerede nede ved start) og ekte
`npx prisma migrate dev --name legg_til_mal_og_startverdier` mot den
(`prisma/migrations/20261127105725_legg_til_mal_og_startverdier/` — ren `ALTER TABLE` på
`bruker_profil`, ingen ny tabell), så `npx prisma generate`. Deretter `tall.ts` + test,
`mal/handlinger.ts`, `mal/page.tsx`, `mal/mal-form.tsx`, `oppsett-form.tsx`s
redirect-endring, og til slutt `(app)/layout.tsx`.

**Valg ikke eksplisitt diktert av spec-en:**
- `lagreMal()` validerer og returnerer ved FØRSTE ugyldige felt (samme "stopp ved første
  feil"-mønster som Story 1.4s `lagreOppsett()`), ikke en samlet liste over alle feil på én
  gang. Spec-en sier "returnerer ... `{ ok: false, feil: {...} }`" uten å kreve akkumulering,
  og dette unngår `!`-ikke-null-assertions ved at TypeScript kan smale typen naturlig etter
  hver tidlig retur.
- `parserKronerTilOre` sin avrunding-ned er implementert som strengtrunkering til to
  sifre etter komma (ikke `Math.floor` på et flyttall) -- unngår flyttallspresisjonsfeil for
  store beløp, og er matematisk identisk med gulv-avrunding for et ikke-negativt tall siden
  regexen allerede avviser minustegn.
- `mal-form.tsx` har en lokal, utestet hjelpefunksjon `oreTilKronerStreng()` for
  forhåndsutfylling (motsatt retning av `parserKronerTilOre`) -- spec-en krever bare tester
  for de to funksjonene i `tall.ts` selv (ingen database/nettverk), og denne visningsfunksjonen
  er UI-spesifikk (del av klientkomponenten, ikke en delt domenefunksjon).
- Alle fem tallfelt (poengmål + de fire startverdiene) har `inputMode="decimal"`, inkludert
  de tre som er rene heltall -- Boundaries sier ordrett "Alle tallfelt bruker
  inputMode='decimal'". Dette endrer bare mobil-tastaturet som vises, ikke hva
  `parserHeltall` faktisk godtar (desimaler i disse feltene gir fortsatt feltfeil).
- `(app)/layout.tsx` gjør ett `findUnique`-kall til `BrukerProfil` per sidevisning i hele
  `(app)`-gruppen (Hjem/Før kjøp/Kjøp/Meg) i stedet for f.eks. en cachet/memoized sjekk --
  samme enkle, direkte mønster som resten av `app/`-laget bruker (ingen caching-lag er
  etablert i kodebasen ennå), og matcher spec-ens Code Map ordrett ("Får en ny sjekk av
  BrukerProfil/poengmal").

**Verifisering utført av meg (ikke bare agentens egen rapport):**
- `npm run lint` -- grønt, 0 feil.
- `npm test` -- grønt, 20/20 (8 eksisterende + 12 nye i `tests/tall.test.ts`: 5 for
  `parserHeltall`, 7 for `parserKronerTilOre`, inkludert alle edge-case-ene spec-en lister
  ordrett).
- `npm run build` (med `DATABASE_URL`/`BETTER_AUTH_SECRET` satt lokalt) -- grønt;
  rutetabellen viser `/oppsett/mal` som `ƒ` (dynamisk).
- `docker compose up --build -d` (reell build + start): loggen viser migreringen fra
  `migrate dev` allerede anvendt ("No pending migrations to apply" -- samme Postgres-volum),
  seed kjørt, `next start` klar.
- Mot den kjørende kontaineren med `curl` (session-cookie fra
  `POST /api/auth/sign-in/email` med testbrukeren), bekreftet HELE edge-case-matrisen reelt
  via frittstående Prisma-script (slettet/tilbakestilt etter bruk, siden selve
  skjema-innsendingen går via en Server Action som spec-en selv sier ikke er
  `curl`-vennlig):
  1. Testbruker uten `BrukerProfil` -- `GET /oppsett/mal` og `GET /` gir begge `307` til
     `/oppsett`.
  2. Samme bruker med en `BrukerProfil`-rad (fra Story 1.4s steg) men `poengmal: null` og
     ingen `BrukerKort` -- `GET /oppsett/mal` gir `200` og viser BARE poengmål-feltet (ingen
     Companion Ticket/Fly Premium-bokser, siden ingen kort er valgt); `GET /` og `GET /meg`
     gir begge `307` til `/oppsett/mal` (ikke til `/oppsett` -- riktig steg siden raden
     faktisk finnes).
  3. Samme bruker med `BrukerKort` = `['amex-elite', 'mastercard-premium']` -- `GET
     /oppsett/mal` viser nå begge avkrysningsboksene.
  4. Satte `poengmal: 180000`, begge CT/FP-flagg `true`, og de fire startverdiene
     (inkludert `amexForbrukOre: 123456` og `trumfKronerOre: 1200000`) direkte i databasen,
     deretter `GET /oppsett/mal` på nytt: rendret HTML viste `value="180000"`, begge
     avkrysningsboksene `checked`, `value="5000"`/`value="20000"` for poengfeltene, og --
     viktigst -- `value="1234,56"` for Amex-forbruk (123456 øre -> `1234,56` kr, komma
     bekreftet) og `value="12000"` for Trumf-kroner (1200000 øre -> `12000` kr, ingen
     unødvendig `,00`). Bekrefter at forhåndsutfyllingen faktisk bruker lagrede verdier, i
     riktig retning (øre -> norsk kroneformat).
  5. Med `poengmal` satt (ikke null), `GET /` og `GET /meg` gir begge `200` -- (app)-gruppen
     er nå åpen.
  Testbrukerens `BrukerKort`/`BrukerProfil`-rader ble slettet igjen etter verifiseringen, og
  `docker compose down` kjørt, slik at databasen står tilbake i samme tilstand (bare seedet
  kort-katalog + testbruker uten profil) som før denne sesjonen.
**Etter review-runden (3 reviewere, 15 unike funn):** 6 reelle, trivielle funn rettet
(try/catch + fail-closed redirect i `(app)/layout.tsx`, flyttet feilmeldingen for Companion
Ticket/Fly Premium ut av kort-betinget blokk, `aria-invalid` på begge avkrysningsboksene,
øvre-grense-sjekk mot Postgres' `INTEGER`-område i begge tallparserne, ny test for det
vanligste beløpstilfellet `"100,50"`, og en ny automatisert test for hele
`(app)/layout.tsx`s omdirigeringslogikk inkl. fail-closed-grenen). 2 funn utsatt til
`deferred-work.md`. 3 funn avvist som `false`/`by design` med motbevisning. 2 funn var
feil i min egen spec-tekst (ikke kodefeil) — rettet direkte i Boundaries/Tasks: en
selvmotsigelse om hvilke felt som er nullable, og en tvetydig testbeskrivelse som
grupperte `"12 000"` (skal godtas) feilaktig sammen med de to som skal avvises. Full liste
med bevis i Review Triage Log.

Alle seks kode-rettelser verifisert av meg på nytt: `npm run lint`/`test` grønt (27/27
tester, inkl. den nye `tests/app-layout.test.ts`), `npm run build` grønt, leste den
patchede `(app)/layout.tsx`/`tall.ts`/`mal-form.tsx` direkte for å bekrefte try/catch,
grense-sjekk og at feilmeldingen faktisk ligger utenfor den kort-betingede blokken, og
kjørte `docker compose up --build` en siste gang for å bekrefte at innlogging og
omdirigering fortsatt virker.

- **Selve skjema-innsendingen (lagreMal via skjemaet) er IKKE testet i en ekte nettleser** i
  denne sesjonen (ingen GUI tilgjengelig her) -- spec-ens egen Verification-del sier dette er
  et manuelt sjekkpunkt ("ikke curl-vennlig"). Alt som INNGÅR i `lagreMal()` er likevel
  verifisert separat: parserne har egne vitest-tester, og kort-revalideringslogikken (steg 2
  vs. 3 over) er bekreftet mot den ekte `BrukerKort`-tabellen. Ikke bekreftet: det visuelle
  (feltfeilenes plassering, at `.knapp-fast` ikke dekker siste felt på korte skjermer) -- bør
  sjekkes manuelt i nettleser (se spec-ens Manual checks).

## Spec Change Log

- **2026-11-27, brukerforespurt (Anneli, direkte, etter manuell nettleser-test):** "Bonuspoeng
  siste 12 måneder" var uklar og så ut som en duplikat av "Bonuspoeng i dag". Endret til:
  (1) feltet omdøpt til "Poeng opptjent siste 12 måneder"; (2) hjelpetekst lagt til under
  begge feltene ("Saldoen du har akkurat nå" / "Poeng du har tjent de siste 12 månedene, også
  de du har brukt. Brukes til Fly Premium"); (3) feltet vises og er påkrevd bare når Fly
  Premium er valgt (tidligere alltid påkrevd) — det er nøyaktig det tallet FR-20 beskriver
  ("Fremgang mot Fly Premium ... oppgitt av bruker"), og ingen AC krever det uavhengig av
  Fly Premium. Ingen migrering nødvendig — `bonuspoengSiste12Mnd` var allerede nullable.
  KEEP: resten av skjemaet (poengmål, Companion Ticket/Fly Premium-gating, Amex-forbruk,
  Trumf-kroner) er uendret og fungerer som før.

## Review Triage Log

- **medium, patch** — blind-hunter + edge-case-hunter (samme kodested, to vinkler):
  `(app)/layout.tsx`s nye `db.brukerProfil.findUnique` har ingen try/catch — en DB-feil tar nå
  ned hele den innloggede appen (Hjem/Før kjøp/Kjøp/Meg), ikke bare oppsett-flyten. Samme
  "fail-closed" filosofi som `krevSesjon()` fikk i Story 1.3s review. (patch — try/catch,
  `redirect('/oppsett')` som trygg, idempotent reserveløsning ved feil)
- **medium, patch** — blind-hunter + edge-case-hunter + verification-gap (funnet uavhengig av
  tre reviewere, to ganger for Companion Ticket og to for Fly Premium): hvis et kort fjernes
  (Story 1.4s `lagreOppsett` erstatter `BrukerKort`) etter at `harCompanionTicket`/
  `harFlyPremium` ble lagret som sann, revaliderer serveren riktig og avviser — men
  feilmeldingen for akkurat det feltet er nestet inni samme
  `{harAmexElite && (...)}`/`{harMastercardPremium && (...)}`-blokk som nettopp ble `false`,
  så brukeren ser ingenting og "Ferdig" later til å gjøre ingenting. (patch — flytt
  feilmeldingsavsnittet ut av den kort-betingede blokken, behold selve avkrysningsboksen
  betinget)
- **low, patch** — blind-hunter: avkrysningsboksene for Companion Ticket/Fly Premium har
  `aria-describedby` ved feil, men ikke `aria-invalid` (de fem tekstfeltene har begge) — i
  strid med kommentarens egen påstand om samme mønster overalt. (patch — legg til
  `aria-invalid` på begge avkrysningsboksene)
- **low, patch** — blind-hunter + edge-case-hunter (samme rot, to vinkler): `tall.ts`s
  `Number.isSafeInteger`-sjekk tillater tall langt utenfor Postgres' `INTEGER`-område
  (±2 147 483 647) — et faktisk skrivefeil-tastetrykk (en ekstra null) ville gitt en generisk
  "Noe gikk feil"-feil fra databasen i stedet for en feltspesifikk melding. (patch — avvis
  tall over 2 147 483 647 i begge parserne, inkludert det kombinerte `kroner*100+øre`-resultatet)
- **low, patch** — blind-hunter: ingen test dekker det vanligste reelle tilfellet for
  beløpsfelt — et beløp med nøyaktig 2 desimaler (`"100,50"` → `10050`). (patch — én ny
  vitest-test)
- **medium, patch** — verification-gap: ingen automatisert test dekker `(app)/layout.tsx`s nye
  omdirigeringslogikk (de tre grenene: ingen rad → `/oppsett`; rad med `poengmal: null` →
  `/oppsett/mal`; rad med `poengmal` satt → ingen omdirigering). Dette er nå den mest
  sikkerhetskritiske logikken i hele appen (hullet denne historien selv sier den tetter), og
  prosjektet har allerede et etablert, database-fritt mock-mønster for nøyaktig denne typen
  logikk (`tests/krev-sesjon.test.ts`). (patch — ny test som mocker `../db`, `../krev-sesjon`
  og `next/navigation`s `redirect`, samme mønster)
- **false** — blind-hunter: hevdet `schema.prisma` har en urelatert whitespace-diff på
  `User`-modellen. Motbevist: dette er Prismas egen formatter som justerer kolonnebredder på
  nytt etter at nye felt ble lagt til andre steder i filen — ingen faktisk verdi/attributt er
  endret, et harmløst, automatisk sideeffekt av `prisma generate`/`format`.
- **false, by design** — blind-hunter: hevdet at `poengmal >= 1`/startverdiene `>= 0` bare
  håndheves i appkoden, ikke med DB-nivå `CHECK`-constraints. Motbevist som en ny mangel:
  dette matcher det eksisterende, konsekvente mønsteret i HELE kodebasen (ingen modell noe sted
  har `CHECK`-constraints; alle invarianter håndheves i serverfunksjoner, iht. ARCHITECTURE-
  SPINEs konvensjon) — ikke noe denne historien introduserer som unikt.
- **false** — blind-hunter: hevdet `sprint-status.yaml`-endringen ikke kan verifiseres fra
  diffen under gjennomgang. Riktig observasjon, men ikke en mangel — `sprint-status.yaml`
  utelates med vilje fra kode-diffen som sendes til reviewerne (samme praksis i alle historier
  denne sesjonen); den committes og spores separat.
- **defer** — blind-hunter: pekte på at "slå opp BrukerKort, bygg et kortKoder-sett"-logikken
  er nær-duplisert i `mal/page.tsx` (visningsgating) og `mal/handlinger.ts`
  (sikkerhets-revalidering). Reelt, men de to stedene tjener ulike formål (visning vs.
  autoritativ server-sjekk), og en delt hjelpefunksjon for en 3-linjers oppslag er en
  beskjeden, ikke-blokkerende forbedring — ikke verdt en ny, delt modul nå.
- **avklart i selve spec-en (ikke et kode-funn)** — edge-case-hunter (claim, høy sikkerhet):
  påpekte at Tasks-setningen om `"12 000"` var selvmotsigende mot Boundaries (grupperte den med
  de to som skal avvises, mens Boundaries krever at tusenskille-mellomrom godtas). Bekreftet
  reelt ved å lese min egen tekst på nytt — rettet direkte i spec-ens Tasks-seksjon (ikke en
  kodefeil; koden/testen fulgte allerede riktig den autoritative Boundaries-teksten).
- **avklart i selve spec-en (ikke et kode-funn)** — blind-hunter: påpekte at Boundaries kalte
  ALLE sju nye feltene "valgfrie (nullable)", mens `harCompanionTicket`/`harFlyPremium` faktisk
  er non-nullable `Boolean @default(false)` i både Code Map og kode. Bekreftet reelt — rettet
  Boundaries-teksten til å skille de fem nullable tallfeltene fra de to boolean-feltene med
  standardverdi, med begrunnelse.

## Verification

**Commands:**
- `npm run lint` -- expected: 0 feil.
- `npm run build` -- expected: bygger uten feil.
- `npm test` -- expected: eksisterende tester fortsatt grønt.
- `docker compose up --build` -- expected: migrering kjører; `curl` kan bekrefte at
  `/oppsett/mal` gir redirect til `/oppsett` for en bruker uten `BrukerProfil`, og `200` for
  en bruker som har fullført steg 1. Selve skjema-innsendingen går via en Next.js Server
  Action (ikke `curl`-vennlig) og bekreftes manuelt i nettleser.

**Manual checks (if no CLI):**
- Fullfør Story 1.4s steg, bekreft at "Neste" nå sender til `/oppsett/mal`.
- Prøv å lagre uten poengmål og se feilen; lagre med gyldige verdier og se at "Ferdig" sender
  til Hjem; last `/oppsett/mal` på nytt og bekreft forhåndsutfylling.
