# Velge mål og legge inn startverdier

## 2026-11-27 kl. 12:23 — Anneli Gausdal

### Oppgave
Kjøre `bmad-build` for Story 1.5: oppsettets andre steg på `/oppsett/mal` — poengmål
(påkrevd tall), valgfrie Companion Ticket/Fly Premium-avkrysningsbokser (bare tilgjengelig
hvis riktig kort er valgt i Story 1.4), og fire startverdier (bonuspoeng i dag, bonuspoeng
siste 12 måneder, Amex-forbruk hittil i kalenderåret, Trumf-kroner siden siste overføring).

### Plan
- Leste Story 1.5 i `epics.md` og Story 7.1/7.2 (for å avklare om SAS/SkyTeam-valget skal
  gate Fly Premiums tilgjengelighet — konkluderte med "nei", bekreftet mot Story 7.2s AC).
- Skrev full spec (`spec-1-5-velge-mal-og-legge-inn-startverdier.md`, `route: dispatch`):
  `BrukerProfil` (Story 1.4) utvides med 7 nye felt i stedet for en egen tabell; to rene
  tallparsing-funksjoner (`parserHeltall`, `parserKronerTilOre`) med egne tester; ny
  `/oppsett/mal`-side + server-handling; Story 1.4s "Neste" peker nå hit i stedet for Hjem.
- Sendte spec-en til en fersk, kontekstfri agent for kritikk FØR godkjenning (samme mønster
  som Story 1.2–1.4).
- Dispatchet implementering til en fersk agent; kjørte tre parallelle kodegjennomganger
  (`blind-hunter`, `edge-case-hunter`, `verification-gap`) mot diffen; sendte rettbare funn
  tilbake til samme agent; landet i 5 små commits med FR-/AR-/AD-ID.

### Resultat
**Spec-gjennomgang før godkjenning fant noe viktig:** et EKTE, allerede utløsbart
sikkerhetshull som eksisterte FØR denne historien — `(app)/layout.tsx` sjekket bare
innlogging, ikke om oppsettet var fullført, og `logg-inn/page.tsx` sender alltid rett til
Hjem (`/`). En bruker som gjorde Story 1.4s steg, lukket appen, og logget inn på nytt, landet
på Hjem med `poengmal`/startverdiene fortsatt `null` — ikke en fremtidig bekymring for
Story 1.6, men noe som skjedde allerede i produktet slik det stod. Bekreftet selv ved å lese
`logg-inn/page.tsx` og `(app)/layout.tsx` direkte. Lagt inn som del av denne historien
(naturlig siden Story 1.5 er den som introduserer "fullført oppsett"-begrepet):
`(app)/layout.tsx` sjekker nå `BrukerProfil`/`poengmal` og omdirigerer til riktig
oppsett-steg (`/oppsett` eller `/oppsett/mal`) før noe beskyttet innhold rendres.

**Databasemodeller:** `BrukerProfil` utvidet med `poengmal`, `harCompanionTicket`,
`harFlyPremium`, `bonuspoengIDag`, `bonuspoengSiste12Mnd`, `amexForbrukOre`,
`trumfKronerOre` — ren `ALTER TABLE`, ingen ny tabell (bevisst valg, dokumentert i spec-ens
Code Map). Ekte migrering kjørt mot lokal Postgres via `prisma migrate dev`.

**Nye filer:** `src/app/oppsett/tall.ts` (tallparsing, norsk format: komma desimal,
mellomrom tusenskille, alltid rundet ned), `src/app/oppsett/mal/{handlinger.ts,page.tsx,
mal-form.tsx}`, `tests/tall.test.ts`, `tests/app-layout.test.ts`.

**Egen verifisering (ikke bare agentrapportene):**
- Sporet `parserKronerTilOre`s regex manuelt for hånd (komma, flere komma, etterhengende
  komma, mellomrom-tusenskille) i stedet for å stole på at testene var grønne.
- Kjørte `docker compose up --build` og testet alle fire oppsett-tilstander direkte mot
  databasen (ingen rad, rad med `poengmal: null`, rad med alt satt, kort fjernet/lagt til).
- **Falsk alarm oppdaget og løst underveis:** en `psql`-sjekk viste én `BrukerProfil`-rad,
  men den tilhørte Annelis egen konto (`anneli.ga@icloud.com`, fra en tidligere manuell test
  i nettleseren), ikke testbrukeren jeg var innlogget som. Oppdaget ved å sjekke `brukerId`
  mot sesjonens faktiske `userId` — ingen reell feil i koden.

**Review:** 3 reviewere fant 15 unike funn. 2 av dem var feil i MIN EGEN spec-tekst, ikke
kodefeil: en selvmotsigelse om hvilke felt som er nullable (rettet i Boundaries), og en
tvetydig testbeskrivelse der jeg feilaktig grupperte `"12 000"` (skal godtas,
tusenskille-mellomrom) sammen med de to som skal avvises (etterhengende/flere komma) —
edge-case-hunter fanget dette, jeg bekreftet det selv ved å lese min egen tekst på nytt og
rettet direkte. 6 reelle kodefunn rettet: try/catch + fail-closed redirect i
`(app)/layout.tsx`; flyttet feilmeldingen for Companion Ticket/Fly Premium ut av den
kort-betingede blokken (unngår en "stille feil" hvis et kort fjernes etter at avkrysningen
ble lagret); `aria-invalid` lagt til på begge avkrysningsboksene; øvre grense mot Postgres'
`INTEGER`-overflow i begge tallparserne; ny test for det vanligste beløpstilfellet
(`"100,50"`); ny automatisert test for hele `(app)/layout.tsx`s omdirigeringslogikk. 2 funn
utsatt til `deferred-work.md` (en kodeduplisering, re-sjekk av Better-Auth-avhengighet).

**Commits** (5 stk, i `claude/eager-carson-eldvjj`): `ba282ed` (database, AD-3/AR-3/AR-5),
`45773ac` (tallparsing, FR-4/UX-DR15), `2b6de41` (skjema/server-handling,
FR-2/FR-3/FR-4/UX-DR13), `3b83994` (redirect-kobling + sikkerhetshull tettet, FR-3/AR-8),
`fa7480a` (spec/triage/sprint-status, AD-12).

`npm run lint`/`test`/`build` grønt (27/27 tester, inkl. de nye for `tall.ts` og
`(app)/layout.tsx`). Spec-filens status er `done`; `sprint-status.yaml` har story-nøkkelen
`1-5-velge-mål-og-legge-inn-startverdier` på `review` (ikke `done`).

### Åpne punkter
- Selve skjema-innsendingen (via `/oppsett/mal`) er ikke testet i en ekte nettleser denne
  sesjonen (ingen GUI tilgjengelig her) — Anneli bør bekrefte visuelt: feilmelding uten
  poengmål, forhåndsutfylling ved gjenbesøk, og at "Ferdig" sender til Hjem. Sett
  `1-5-velge-mål-og-legge-inn-startverdier` til `done` i `sprint-status.yaml` når bekreftet.
- 2 funn utsatt til `deferred-work.md` (kodeduplisering i kort-oppslaget; periodisk re-sjekk
  av at `better-auth`s Prisma-generator fortsatt bevarer de håndlagte back-relation-feltene)
  — ingen av dem blokkerer Story 1.5.

Speiles i `issues.md`.

## 2026-11-27 kl. 12:35 — Anneli Gausdal

### Oppgave
Anneli testet `/oppsett/mal` i nettleseren og fant at "Bonuspoeng siste 12 måneder" var
uklar og så ut som en duplikat av "Bonuspoeng i dag". Ba om: ny etikett ("Poeng opptjent
siste 12 måneder"), hjelpetekst under begge feltene, og at det andre feltet bare vises når
Fly Premium er valgt.

### Plan
- Direkte, presis endring (ikke full `bmad-build`-runde) siden instruksene var eksplisitte.
- `mal-form.tsx`: ny etikett, hjelpetekst under begge felt (koblet med `aria-describedby`
  sammen med feilmeldingen når den finnes), feltet for "siste 12 måneder" pakket inn i
  `{harFlyPremium && (...)}`.
- `handlinger.ts`: feltet er nå bare påkrevd (og validert) når `input.harFlyPremium` er sann
  — lagres som `null` ellers (feltet var allerede nullable i databasen, ingen migrering
  nødvendig).
- Oppdaterte spec-filens AC/Boundaries og la til en Spec Change Log-oppføring (siden dette
  endrer et frosset akseptkriterium — brukerens eget, direkte ønske etter manuell testing).

### Resultat
`npm run lint`/`test`/`build` grønt (27/27 tester, uendret — ingen eksisterende test dekket
denne logikken, og ingen ny test ble bedt om utover det). Verifisert i Docker mot ekte
database: feltet er skjult og "Bonuspoeng i dag" har riktig hjelpetekst når
`harFlyPremium: false`; feltet vises med ny etikett og hjelpetekst når `harFlyPremium: true`.

**Commit:** `d149403` (FR-4, FR-20, UX-DR14), pushet til `claude/eager-carson-eldvjj`
(`97da969..d149403`).

### Åpne punkter
Uendret fra forrige seksjon — manuell nettleser-bekreftelse og `sprint-status.yaml` → `done`
gjenstår fortsatt for hele Story 1.5.

Speiles i `issues.md`.
