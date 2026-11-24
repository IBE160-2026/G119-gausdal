---
status: final
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-G119-gausdal-2026-11-12/prd.md
  - _bmad-output/planning-artifacts/prds/prd-G119-gausdal-2026-11-12/addendum.md
  - _bmad-output/planning-artifacts/architecture/architecture-G119-gausdal-2026-11-24/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-G119-gausdal-2026-11-24/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-G119-gausdal-2026-11-24/EXPERIENCE.md
---

# EuroBonus Poeng-stacker - Epic Breakdown

## Overview

Dette dokumentet deler kravene fra PRD, UX (DESIGN.md og EXPERIENCE.md) og arkitekturen (ARCHITECTURE-SPINE.md) opp i epics og historier som kan bygges og vises for sensor én etter én.

## Requirements Inventory

### Functional Requirements

FR-1: Bruker kan opprette konto, logge inn og ut.
FR-2: Bruker velger Amex Elite, Mastercard Premium eller begge. Beregning og anbefaling tilpasses valget. Companion Ticket er bare relevant med Amex Elite, Fly Premium bare med Mastercard Premium.
FR-3: Bruker velger ett eller flere mål: poengmål, Companion Ticket, Fly Premium.
FR-4: Bruker oppgir startverdier: bonuspoeng i dag, bonuspoeng siste 12 måneder, forbruk på Amex hittil i kalenderåret, Trumf-kroner siden siste overføring.
FR-5: Bruker oppgir om Trumf er koblet til EuroBonus med automatisk overføring.
FR-6: Bruker velger bare SAS-bonusreiser eller også andre SkyTeam-selskaper. Valget styrer hvilke mål som er relevante.
FR-7: Bruker kan registrere kjøp med fritekst. KI tolker beløp, butikk, kort og dato.
FR-8: Bruker kan registrere kjøp med manuelt skjema uten KI.
FR-9: Tolkningen vises som forslag, usikre felt markeres, og ingenting lagres før bekreftelse.
FR-10: Bruker kan redigere og slette et kjøp. Poeng og fremdrift regnes på nytt.
FR-11: Bruker ser en liste over registrerte kjøp med beregnede poeng per kjøp.
FR-12: Ved registrering kan bruker krysse av for Trippel-Trumf-torsdag (1 % mot 3 % Trumf-bonus).
FR-13: Regelmotoren beregner bonuspoeng per kilde og kjøp: Amex Elite 20 per 100 kr, Mastercard Premium 15 per 100 kr i NOK (v1: bare NOK i de ni butikkene).
FR-14: Appen beregner Trumf-bonus i de ni dagligvarebutikkene: 1 % (3 % på Trippel-Trumf-torsdag), 13,5 poeng per Trumf-krone, overføring ved 200 Trumf-kroner. Estimat som rundes ned.
FR-15: Satser og regler lagres som konfigurerbare data med kilde og dato for verifisering.
FR-16: Etter lagring viser appen poengene fordelt på kilde (kort og Trumf) med sum.
FR-17: En bar øverst viser fremgang mot poengmålet, og skiller overførte poeng fra ventende Trumf-poeng.
FR-18: Varsel i appen når saldoen når halvparten av poengmålet og gyldig Companion Ticket er avkrysset.
FR-19: Companion Ticket: bruker krysser av for opptjent billett og dato. Appen viser utløpsdato og Amex-forbruk mot 150 000 og 300 000 kr.
FR-20: Fremgang mot Fly Premium (12 måneders opptjening mot 75 000, 125 000 og 200 000), oppgitt av bruker.
FR-21: Tempo: ut fra kjøp siste fire uker vises når målet nås, og effekten av å endre hvor bruker betaler. Ingen dato uten kjøp siste fire uker.
FR-22: Før et kjøp oppgir bruker butikk og beløp, og appen anbefaler kort og Trumf som gir flest poeng.
FR-23: Anbefalingen tar hensyn til akseptanse: Amex godtas i alle NorgesGruppen- og Coop-butikker, ellers Mastercard.
FR-24: Anbefalingen viser avveiningen når et kort gir færre poeng, men bringer bruker nærmere et terskelmål. (Kandidat til «Senere».)
FR-25: Anbefalingen beregnes av regelmotoren og virker uten KI.

### NonFunctional Requirements

NFR-1: Appen starter lokalt med Docker, med testbruker og eksempeldata. Alt unntatt fritekst virker uten KI-nøkkel.
NFR-2: Fritekst bruker OpenRouter. Uten nøkkel faller appen tilbake til manuelt skjema.
NFR-3: Regelmotoren er testbar mot en tabell med 10–15 forventede kjøp, regnet for hånd og kontrollert mot offisielle kilder.
NFR-4: Appen kan publiseres på Vercel.
NFR-5: Filer lagres i fillagring, ikke i databasen. Ikke i bruk i v1, men plass i arkitekturen.
NFR-6: Test- og eksempeldata er oppdiktede. Ingen ekte kvitteringer, kortnummer eller nøkler i repoet.
NFR-7: Norsk grensesnitt.
NFR-8: Appen overestimerer ikke poeng. Der beregningen er usikker rundes det ned.
NFR-9: Kjøpshistorikk er privat per bruker og slettes med kontoen.

### Additional Requirements

- AR-1 (starter): Prosjektet settes opp fra Next.js 16 (App Router, TypeScript) med Prisma, Better Auth, Vitest og `docker-compose.yml` (app + PostgreSQL). Dette er Epic 1, Story 1. (AD-1, AD-3)
- AR-2: `src/domain/` er ren kjerne og importerer aldri fra `src/app/`, Prisma, `fetch`, miljøvariabler eller `Date.now()`. Håndheves med lint-regel. (AD-2)
- AR-3: Datamodellen eies av `prisma/schema.prisma`; alle endringer via Prisma-migreringer. (AD-3)
- AR-4: Satser ligger i tabellen `Sats` (kilde, poengtype, per 100 kr, gyldig fra/til, kilde-URL, verifisert dato) og fylles av seed. Ingen sats-tall i `domain/`. (AD-4)
- AR-5: Beløp lagres som heltall øre; poeng er heltall; all avrunding skjer nedover i `domain/`. (AD-5)
- AR-6: Poengtransaksjoner lagres per kjøp og kilde med `sats_id`, og regnes på nytt i én databasetransaksjon ved endring/sletting. Hjem, liste og tempo summerer lagrede transaksjoner pluss startverdier. (AD-6)
- AR-7: KI kalles bare fra server med nøkkel fra miljøvariabel. Svar valideres og vises som forslag. Uten nøkkel eller ved feil vises skjema. (AD-7)
- AR-8: Better Auth med e-post og passord. Alle brukerdata-tabeller har `bruker_id`, og alle spørringer filtreres på innlogget bruker. (AD-8)
- AR-9: Filer skrives via ett grensesnitt i `src/app/storage/`; databasen lagrer bare referanse. (AD-9)
- AR-10: Konfigurasjon leses ett sted (`src/app/config.ts`). `.env.example` har alle navn og ingen verdier; `.env` er i `.gitignore`. (AD-10)
- AR-11: `docker compose up` starter app og Postgres, kjører migrering og seed. `npm test` kjører alle enhetstester uten nøkler og nettverk. Begge står i README. (AD-11)
- AR-12: Små commits på en gren per historie; commit og PR nevner FR-/AD-ID; tester navngis med kravet de dekker. (AD-12)
- AR-13 (sensorveiledning): README med versjoner, eksakte kommandoer, mappestruktur og lenker til prosessdokumentasjon. Ryddig rotmappe (løse filer flyttes til `docs/`). Ingen hemmeligheter eller byggefiler i repoet.

### UX Design Requirements

UX-DR1: Design-tokens fra DESIGN.md (farger i lys og mørk, typografi display/title/body/meta, spacing, rounded) samlet i én temafil som resten av appen bruker.
UX-DR2: Lys og mørk modus følger systeminnstillingen.
UX-DR3: Nedre fanelinje med Hjem, Før kjøp, Kjøp, Meg. I oppsett og registrering erstattes den av en fast primærknapp nederst. Innhold sentreres i maks 480 px, én kolonne, 16 px sidemarg.
UX-DR4: Fremdriftsbar med to segmenter (overført og ventende), tallforklaring under og skjermleser-tekst («62 400 av 180 000 poeng, 14 400 venter på overføring»).
UX-DR5: Hovedtall-kort på Hjem («poeng nå», av målet) med fremdriftsbar og tempolinje.
UX-DR6: Mål-kort for Poengmål, Companion Ticket (med utløpsdato) og Fly Premium (nærmeste nivå). Mål som ikke er relevante for valgte kort skjules.
UX-DR7: Anbefalingskort i «Før kjøp»: ett per kort med poeng per kilde og sum, «Anbefalt»-merke, avveiningstekst, og oppdatering mens bruker skriver (ingen «Beregn»-knapp).
UX-DR8: Forslagsskjema («Bekreft forslag») med usikre felt markert gult med forklaring. Bekreft er deaktivert til usikre felt er sett.
UX-DR9: Poengfordeling etter lagring: rader per kilde med sum.
UX-DR10: Kjøpsliste (estimerte tall med «ca.») og kjøp-detalj med redigering og sletting via bekreftelsesark.
UX-DR11: Lukkbart varselbanner på Hjem for halvveis-varselet.
UX-DR12: Tilstander: ny bruker uten kjøp, ingen kjøp siste 4 uker (ingen tempodato), Trumf ikke koblet, ett kort, KI utilgjengelig, butikk utenfor de ni, annen valuta, Amex godtas ikke, utløpt Companion Ticket, nettverksfeil.
UX-DR13: Tilgjengelighet: trykkflater ≥ 48 px, skjermleser-etiketter med rolle og tilstand, støtte for største tekststørrelse, reduser bevegelse, farge aldri eneste signal, skjemafeil knyttet til felt.
UX-DR14: Norsk tallformat (`90 000`, `13,5`) og mikrotekst etter Voice and Tone: kort, saklig, ingen utropstegn, «ca.» på estimater.
UX-DR15: Talltastatur med komma som desimaltegn i tallfelt.

### FR Coverage Map

FR-1: Epic 1 - Konto, innlogging
FR-2: Epic 1 - Valg av kort
FR-3: Epic 1 - Valg av mål
FR-4: Epic 1 - Startverdier
FR-5: Epic 1 - Trumf koblet
FR-6: Epic 1 - SAS eller SkyTeam
FR-7: Epic 6 - Fritekst med KI
FR-8: Epic 2 - Skjema for kjøp
FR-9: Epic 6 - Forslag og bekreftelse av KI-tolkning
FR-10: Epic 2 - Rediger og slett kjøp
FR-11: Epic 2 - Kjøpsliste
FR-12: Epic 2 - Trippel-Trumf-torsdag
FR-13: Epic 2 - Regelmotor kort
FR-14: Epic 2 - Regelmotor Trumf
FR-15: Epic 2 - Satser som data
FR-16: Epic 2 - Poengfordeling per kilde
FR-17: Epic 3 - Fremdriftsbar (overført/venter)
FR-18: Epic 7 - Halvveis-varsel
FR-19: Epic 7 - Companion Ticket
FR-20: Epic 7 - Fly Premium
FR-21: Epic 7 - Tempo og prognose
FR-22: Epic 4 - Anbefaling før kjøp
FR-23: Epic 4 - Akseptanse (Amex/Mastercard)
FR-24: Epic 7 - Avveining mellom kort (kandidat til «Senere»)
FR-25: Epic 4 - Anbefaling uten KI

NFR-1, NFR-4, NFR-6, AR-11, AR-13: Epic 5 (kjøring, publisering, README, opprydding). NFR-3 og AR-5/6: Epic 2. NFR-2 og AR-7: Epic 6. NFR-7, NFR-8, NFR-9, AR-8, UX-DR13/14: gjelder alle epics som akseptkriterier.

## Epic List

### Epic 1: Kom i gang med konto og oppsett
Bruker kan opprette konto, logge inn, velge kort og mål, legge inn startverdier og se Hjem med sin startsaldo. Første historie setter opp prosjektet (Next.js, Prisma, Better Auth, Docker).
**FRs covered:** FR-1, FR-2, FR-3, FR-4, FR-5, FR-6

### Epic 2: Registrere kjøp og se poengene
Bruker registrerer et kjøp med skjema og ser nøyaktig hvor mange poeng det ga, fordelt på kort og Trumf. Kjøp kan rettes og slettes. Regelmotoren er testet mot testtabellen.
**FRs covered:** FR-8, FR-10, FR-11, FR-12, FR-13, FR-14, FR-15, FR-16

### Epic 3: Se fremgang mot poengmålet
Bruker ser på Hjem hvor langt hen er kommet mot poengmålet, med skille mellom overførte og ventende Trumf-poeng.
**FRs covered:** FR-17

### Epic 4: Få anbefaling før kjøp
Bruker skriver butikk og beløp og får vite hvilket kort som gir flest poeng, med hensyn til hvor kortene godtas.
**FRs covered:** FR-22, FR-23, FR-25

### Epic 5: Klar for sensor og publisering
Sensor kan klone repoet, følge README og kjøre og teste appen på 15–20 minutter. Appen er publisert og repoet er ryddig.
**FRs covered:** (ingen nye FR) NFR-1, NFR-4, NFR-6, AR-11, AR-13

### Epic 6: Registrere kjøp med fritekst
Bruker skriver «450 kr på Kiwi med Mastercard Premium», får et forslag med usikre felt markert, og bekrefter før noe lagres.
**FRs covered:** FR-7, FR-9

### Epic 7: Mål i detalj, varsler og tempo
Bruker følger Companion Ticket og Fly Premium, får varsel ved halvveis, og ser når målet nås i dagens tempo.
**FRs covered:** FR-18, FR-19, FR-20, FR-21, FR-24

## Epic 1: Kom i gang med konto og oppsett

Bruker kan opprette konto, logge inn, velge kort og mål, legge inn startverdier og se Hjem med sin startsaldo. Første historie setter opp prosjektet.

### Story 1.1: Prosjektoppsett som kan startes med én kommando

As a sensor,
I want å starte appen med `docker compose up`,
So that jeg ser at den kjører uten å sette opp noe selv.

**Acceptance Criteria:**

**Given** en ren maskin med Docker og repoet klonet, og prosjektet satt opp fra Next.js 16 (App Router, TypeScript) med Prisma, Better Auth og Vitest (AR-1)
**When** jeg kjører `docker compose up`
**Then** app og PostgreSQL starter, Prisma-migreringer kjøres, og en enkel Hjem-side svarer på `http://localhost:3000`
**And** `.env.example` finnes med alle variabelnavn og ingen verdier, og `.env` er i `.gitignore` (AR-10, NFR-6)

**Given** prosjektet er satt opp
**When** jeg kjører `npm test`
**Then** Vitest kjører og består uten nøkler og uten nettverk, med minst én test mot en funksjon i `src/domain/` (AR-11)

**Given** koden i `src/domain/`
**When** en fil der importerer fra `src/app/`, Prisma, eller bruker `fetch` eller `Date.now()`
**Then** lint feiler (AR-2)

**And** et tomt grensesnitt for fillagring finnes i `src/app/storage/` med lokal mappe som standard, og ingen filer lagres i v1 (AR-9, NFR-5)
**And** mappestrukturen følger ryggraden (`src/domain/`, `src/app/`, `prisma/`, `tests/`, `docs/`), og README har en første versjon med oppstartskommandoene (AR-13)

### Story 1.2: Tema og navigasjonsskall

As a bruker,
I want en app som ser rolig og ryddig ut på mobil med fast navigasjon,
So that jeg finner frem uten å tenke.

**Acceptance Criteria:**

**Given** appen åpnes på mobil
**When** jeg ser en side i appen
**Then** nedre fane viser Hjem, Før kjøp, Kjøp og Meg, med innholdet i én kolonne og maks 480 px bredde (UX-DR3)
**And** farger, typografi, spacing og avrunding kommer fra tokens i én temafil (UX-DR1)
**And** all tekst i grensesnittet er på norsk (NFR-7)

**Given** systemet står i mørk modus
**When** jeg åpner appen
**Then** appen vises i mørk palett (UX-DR2)

**Given** skallet
**When** jeg bruker skjermleser eller størrelsen på tekst er satt til størst
**Then** fanene har navn og tilstand, trykkflater er minst 48 px, og ingenting kuttes (UX-DR13)

### Story 1.3: Opprette konto og logge inn og ut

As a bruker,
I want å opprette konto med e-post og passord og logge inn og ut,
So that dataene mine er mine alene.

**Acceptance Criteria:**

**Given** jeg ikke er innlogget
**When** jeg oppretter konto med gyldig e-post og passord
**Then** kontoen lages, jeg logges inn og sendes til oppsett (FR-1)
**And** passordet lagres hashet i egen Postgres, aldri i klartekst (AR-8)

**Given** jeg har en konto
**When** jeg logger inn med riktige opplysninger
**Then** jeg kommer til Hjem
**And** med feil passord vises en forståelig feilmelding knyttet til feltet (UX-DR13)

**Given** jeg er innlogget
**When** jeg logger ut
**Then** sesjonen avsluttes og beskyttede sider krever innlogging

**Given** seed er kjørt
**When** jeg logger inn med testbrukeren fra README
**Then** det fungerer, og testbrukeren har oppdiktede data (NFR-6)

### Story 1.4: Velge kort, Trumf og type bonusreiser

As a ny bruker,
I want å fortelle hvilke kort jeg har, om Trumf er koblet, og om jeg vil bruke SAS eller også SkyTeam,
So that appen regner riktig for meg.

**Acceptance Criteria:**

**Given** jeg er i oppsett
**When** jeg velger Amex Elite, Mastercard Premium eller begge
**Then** valget lagres på min bruker (FR-2)
**And** jeg må velge minst ett kort for å gå videre

**Given** jeg er i oppsett
**When** jeg svarer om Trumf er koblet til EuroBonus med automatisk overføring
**Then** svaret lagres (FR-5)

**Given** jeg er i oppsett
**When** jeg velger «bare SAS» eller «også andre SkyTeam-selskaper»
**Then** valget lagres og styrer hvilke mål som vises senere (FR-6)

**Given** tabellene `Kort` og `BrukerKort` ikke finnes
**When** historien er ferdig
**Then** de er opprettet via Prisma-migrering og Amex Elite og Mastercard Premium ligger i seed (AR-3)

### Story 1.5: Velge mål og legge inn startverdier

As a ny bruker,
I want å velge målene mine og fortelle hvor jeg står i dag,
So that fremgangen min har et utgangspunkt.

**Acceptance Criteria:**

**Given** jeg har valgt kort og bonusreisetype
**When** jeg velger poengmål (antall poeng), og eventuelt Companion Ticket og Fly Premium
**Then** målene lagres (FR-3)
**And** Companion Ticket tilbys bare med Amex Elite, og Fly Premium bare med Mastercard Premium og «bare SAS» eller «også SkyTeam» (FR-2, FR-6)

**Given** jeg er i oppsett
**When** jeg oppgir bonuspoeng i dag, poeng siste 12 måneder, Amex-forbruk hittil i kalenderåret og Trumf-kroner siden siste overføring
**Then** verdiene lagres som heltall (poeng) og øre (beløp) (FR-4, AR-5)
**And** tallfelt åpner talltastatur med komma, og ugyldige verdier gir en forståelig feil knyttet til feltet (UX-DR13, UX-DR15)

**Given** tabellene for mål og startverdier ikke finnes
**When** historien er ferdig
**Then** de er opprettet via Prisma-migrering (AR-3)

**Given** oppsettet er fullført
**When** jeg trykker Ferdig
**Then** jeg kommer til Hjem

### Story 1.6: Hjem med startsaldo

As a bruker,
I want å se poengene mine og målet mitt på Hjem,
So that jeg ser hvor jeg står med en gang.

**Acceptance Criteria:**

**Given** jeg har fullført oppsett og ikke har registrert kjøp
**When** jeg åpner Hjem
**Then** jeg ser «poeng nå» fra mine startverdier av poengmålet, med en fremdriftsbar og norsk tallformat (`62 400`, `180 000`) (UX-DR5, UX-DR14)
**And** tempo viser «Ingen dato ennå: du har ikke registrert kjøp de siste fire ukene.» (UX-DR12)

**Given** jeg bare har ett kort
**When** jeg åpner Hjem
**Then** bare relevante mål vises (UX-DR6)

**Given** jeg bruker skjermleser
**When** jeg møter hovedtallet
**Then** det leses opp som «62 400 av 180 000 poeng» (UX-DR4, UX-DR13)

### Story 1.7: Meg: endre oppsett, oppdatere saldoer og slette konto

As a bruker,
I want å endre kort, mål og saldoer og kunne slette kontoen min,
So that appen holder seg riktig og jeg styrer dataene mine.

**Acceptance Criteria:**

**Given** jeg er på fanen Meg
**When** jeg endrer kort, mål eller startverdier
**Then** endringene lagres og Hjem viser de nye tallene (FR-2–5)

**Given** jeg er på fanen Meg
**When** jeg oppdaterer poeng i dag, siste 12 måneder, Amex-forbruk eller Trumf-kroner
**Then** verdiene lagres og viser «oppgitt av deg, sist oppdatert [dato]»

**Given** jeg velger Slett konto
**When** jeg bekrefter i bunnarket
**Then** kontoen og all min data slettes, og andre brukeres data påvirkes ikke (NFR-9, AR-8)

## Epic 2: Registrere kjøp og se poengene

Bruker registrerer et kjøp med skjema og ser nøyaktig hvor mange poeng det ga, fordelt på kort og Trumf. Kjøp kan rettes og slettes. Regelmotoren er testet mot en tabell med forventede poeng.

### Story 2.1: Satser og butikker som data

As a utvikler,
I want satser, butikker og regler lagret som data med kilde og dato,
So that en sats kan endres uten kodeendring.

**Acceptance Criteria:**

**Given** tabellene `Sats` og `Butikk` ikke finnes
**When** historien er ferdig
**Then** de er opprettet med Prisma-migrering (AR-3)
**And** `Sats` har kilde, poengtype, poeng per 100 kr, gyldig fra/til, kilde-URL og verifisert dato (FR-15, AR-4)

**Given** seed kjøres
**When** jeg ser i databasen
**Then** satsene er: Amex Elite 20 per 100 kr, Mastercard Premium 15 per 100 kr (NOK), Trumf 1 % (3 % på Trippel-Trumf-torsdag) og 13,5 poeng per Trumf-krone
**And** de ni Trumf-butikkene (MENY, KIWI, SPAR, Joker, CC Mat, Jacob's, Lerøy Mat, Nærbutikken, Gigaboks) ligger i `Butikk` med felt for om Amex godtas (FR-23)
**And** hver sats merkes `[VERIFISER]` der den ikke er kontrollert, i tråd med `docs/verifiseringsliste.md`

**Given** en sats i databasen endres
**When** appen leser aktive satser
**Then** den nye satsen brukes uten kodeendring (SK-5)

### Story 2.2: Regelmotor for kortpoeng

As a bruker,
I want at appen regner ut bonuspoengene fra kortet riktig,
So that jeg kan stole på tallene.

**Acceptance Criteria:**

**Given** `src/domain/` og en sats (poeng per 100 kr)
**When** jeg beregner poeng for et beløp i øre
**Then** resultatet er et heltall, avrundet nedover (FR-13, AR-5, NFR-8)
**And** avrundingsregelen følger vedlegget: beløp × sats ÷ 100 kr, rundet ned per kjøp og kilde (AR-5)
**And** 450 kr gir 90 poeng med Amex Elite og 67 poeng med Mastercard Premium, og 99 kr gir 19 med Amex Elite og 14 med Mastercard Premium

**Given** testtabellen med 15 kjøp i `docs/vedlegg-satser.md`, regnet for hånd og lagt som testdata i `tests/` (FR-13, NFR-3)
**When** jeg kjører `npm test`
**Then** alle forventede verdier stemmer
**And** estimatet overstiger aldri forventet verdi med mer enn ett poeng per kjøp (motmålet i PRD)

**Given** funksjonen
**When** den kalles
**Then** den bruker bare argumentene den får (ingen database, ingen klokke) (AR-2)
**And** testene er navngitt med kravet de dekker (AR-12)

### Story 2.3: Regelmotor for Trumf-poeng

As a bruker,
I want at appen anslår Trumf-poengene riktig, også på Trippel-Trumf-torsdag,
So that jeg ser hele bildet av hva et kjøp gir.

**Acceptance Criteria:**

**Given** et kjøp i en av de ni butikkene
**When** jeg beregner Trumf-poeng uten Trippel-Trumf
**Then** Trumf-bonus er 1 % av beløpet og poengene er 13,5 per Trumf-krone, avrundet nedover
**And** 450 kr gir 4,50 Trumf-kroner og 60 poeng (60,75 rundet ned) (FR-14)

**Given** Trippel-Trumf-torsdag er avkrysset
**When** jeg beregner Trumf-poeng
**Then** Trumf-bonus er 3 % og 450 kr gir 13,50 Trumf-kroner og 182 poeng (FR-12, FR-14)

**Given** en butikk som ikke er blant de ni
**When** jeg beregner Trumf-poeng
**Then** resultatet er 0, og funksjonen sier hvorfor (FR-14)

**Given** en kjøpsdato
**When** jeg spør om Trippel-Trumf-torsdag er mulig
**Then** svaret er ja bare hvis datoen er en torsdag, og 3 % brukes aldri på andre dager (FR-12)

**Given** testtabellen fra 2.2
**When** den utvides med Trumf-kolonner
**Then** `npm test` stemmer for alle rader

### Story 2.4: Registrere kjøp med skjema og se poengfordelingen

As a bruker,
I want å registrere et kjøp og se hvor mange poeng det ga fra kort og Trumf,
So that jeg ser at stablingen virker.

**Acceptance Criteria:**

**Given** jeg er på Registrer kjøp
**When** jeg fyller inn beløp, butikk, kort og dato, og eventuelt krysser av for Trippel-Trumf-torsdag
**Then** jeg kan lagre kjøpet (FR-8, FR-12)
**And** avkryssingen for Trippel-Trumf-torsdag kan bare velges når kjøpsdatoen er en torsdag, ellers er den deaktivert med forklaring (FR-12)
**And** beløp i NOK gjelder, tallfeltet har talltastatur med komma, og andre valutaer får en forklaring (UX-DR12, UX-DR15)

**Given** jeg lagrer
**When** kjøpet er gyldig
**Then** `Kjop` og én `Poengtransaksjon` per kilde (kort og Trumf) lagres i én databasetransaksjon, med `sats_id` (AR-6)
**And** Trumf-transaksjonen lagrer også Trumf-kroner i øre, slik at Story 3.1 kan regne overføring
**And** tabellene opprettes i denne historien med Prisma-migrering

**Given** kjøpet er lagret
**When** jeg ser Poengfordeling
**Then** jeg ser rader per kilde (kort, Trumf) og en sum, der Trumf-tall har «ca.» (FR-16, UX-DR9, UX-DR14)

**Given** jeg velger en butikk utenfor de ni
**When** jeg lagrer
**Then** kortpoeng regnes og jeg ser «Denne butikken gir ikke Trumf-poeng i appen ennå.» (UX-DR12)

**Given** jeg har ett kort
**When** jeg velger kort
**Then** bare det kortet vises

**Given** Hjem
**When** et kjøp er lagret
**Then** «poeng nå» summerer startverdi og lagrede kortpoeng; Trumf-poeng vises i fordelingen (skillet overført/ventende kommer i Epic 3) (AR-6)

### Story 2.5: Se kjøpslisten

As a bruker,
I want en liste over kjøpene mine med poeng per kjøp,
So that jeg kan sjekke hva jeg har registrert.

**Acceptance Criteria:**

**Given** jeg har registrert kjøp
**When** jeg åpner fanen Kjøp
**Then** jeg ser kjøpene sist-først, med butikk, dato, beløp, kort og poeng til høyre (FR-11, UX-DR10)
**And** estimerte tall har «ca.» (UX-DR14)

**Given** jeg ikke har registrert kjøp
**When** jeg åpner fanen Kjøp
**Then** jeg ser en tom tilstand med knappen «Registrer første kjøp» (UX-DR12)

**Given** to brukere med kjøp
**When** jeg er innlogget
**Then** jeg ser bare mine egne kjøp (NFR-9, AR-8)

### Story 2.6: Rette og slette et kjøp

As a bruker,
I want å rette eller slette et kjøp jeg la inn feil,
So that poengene mine stemmer.

**Acceptance Criteria:**

**Given** jeg åpner et kjøp fra listen
**When** jeg endrer beløp, butikk, kort, dato eller Trippel-Trumf og lagrer
**Then** poengtransaksjonene for kjøpet regnes på nytt i én databasetransaksjon, og listen og Hjem viser nye tall (FR-10, AR-6)

**Given** jeg åpner et kjøp
**When** jeg velger Slett og bekrefter i bunnarket
**Then** kjøpet og transaksjonene slettes, og Hjem regnes på nytt (FR-10, UX-DR10)

**Given** satsene er endret siden kjøpet ble lagret
**When** jeg endrer kjøpet
**Then** nye transaksjoner bruker aktiv sats, og `sats_id` viser hvilken som ble brukt (AR-6)

## Epic 3: Se fremgang mot poengmålet

Bruker ser på Hjem hvor langt hen er kommet mot poengmålet, med skille mellom overførte og ventende Trumf-poeng.

### Story 3.1: Regel for overførte og ventende Trumf-poeng

As a bruker,
I want at appen skiller mellom Trumf-poeng som er overført og de som venter,
So that jeg ikke tror målet er nådd før poengene faktisk er på EuroBonus-kontoen.

**Acceptance Criteria:**

**Given** `src/domain/` og Trumf-kroner opptjent (startverdi pluss lagrede kjøp)
**When** Trumf er koblet med automatisk overføring
**Then** hver hele 200 Trumf-kroner regnes som overført (13,5 poeng per Trumf-krone), og resten under 200 regnes som ventende (FR-14, FR-17)
**And** 200 Trumf-kroner gir 2 700 poeng, og tallene rundes nedover (AR-5, NFR-8)

**Given** Trumf ikke er koblet til EuroBonus
**When** funksjonen kalles
**Then** Trumf-poeng regnes ikke med som overført eller ventende (FR-5)

**Given** enhetstester i `tests/`
**When** jeg kjører `npm test`
**Then** grensetilfellene 0, 199,99, 200 og 400 Trumf-kroner består, og testene er navngitt med FR-17 (AR-12)

### Story 3.2: Fremdriftsbar på Hjem

As a bruker,
I want en bar som viser hvor mange poeng jeg har og hvor mange som venter,
So that jeg ser fremgangen mot poengmålet med en gang.

**Acceptance Criteria:**

**Given** jeg har et poengmål og har registrert kjøp
**When** jeg åpner Hjem
**Then** «poeng nå» er startverdi pluss kortpoeng pluss overførte Trumf-poeng (FR-17, AR-6)
**And** baren har to segmenter, overført og ventende, med tekstetikett og tall under (UX-DR4)

**Given** baren vises
**When** jeg bruker skjermleser
**Then** den leses opp som «62 400 av 180 000 poeng, 14 400 venter på overføring» (UX-DR4, UX-DR13)

**Given** poengene overstiger målet
**When** baren tegnes
**Then** den stopper på 100 % uten feil

**Given** systemet har «reduser bevegelse»
**When** baren oppdateres
**Then** den animeres ikke (UX-DR13)

**Given** jeg registrerer, endrer eller sletter et kjøp
**When** jeg går til Hjem
**Then** baren viser de nye tallene (FR-10)

## Epic 4: Få anbefaling før kjøp

Bruker skriver butikk og beløp og får vite hvilket kort som gir flest poeng, med hensyn til hvor kortene godtas.

### Story 4.1: Anbefalingsmotor

As a bruker,
I want at appen regner ut hvilket kort som gir flest poeng i en butikk,
So that jeg velger riktig før jeg betaler.

**Acceptance Criteria:**

**Given** `src/domain/`, en butikk, et beløp, brukerens kort og aktive satser
**When** jeg beregner anbefaling
**Then** resultatet viser poeng per kort og Trumf-poeng, og anbefalt kort er det med flest poeng (FR-22, FR-25)
**And** 800 kr hos KIWI gir 160 poeng med Amex Elite, 120 med Mastercard Premium og 108 Trumf-poeng (8 Trumf-kroner)

**Given** en butikk der Amex ikke godtas
**When** jeg beregner anbefaling
**Then** Mastercard Premium anbefales og Amex merkes «godtas ikke her» (FR-23)

**Given** brukeren bare har ett kort
**When** jeg beregner anbefaling
**Then** bare det kortet regnes og anbefales (FR-2)

**Given** Trumf ikke er koblet eller butikken ikke er blant de ni
**When** jeg beregner anbefaling
**Then** Trumf-poeng er 0 og årsaken følger med

**Given** funksjonen
**When** den kjøres
**Then** den bruker samme regelmotor som kjøpsregistreringen og ingen KI (FR-25, AR-2)
**And** testene i `tests/` består med `npm test`

### Story 4.2: Før kjøp-skjermen

As a bruker,
I want å skrive butikk og beløp og se anbefalingen med en gang,
So that jeg kan bestemme meg mens jeg står i butikken.

**Acceptance Criteria:**

**Given** jeg er på fanen Før kjøp (eller har trykket snarveien på Hjem)
**When** jeg skriver beløp og velger butikk
**Then** anbefalingskortene oppdateres mens jeg skriver, uten «Beregn»-knapp (UX-DR7)
**And** det anbefalte kortet har merket «Anbefalt» og forklaring, og begge kort vises med poeng per kilde og sum

**Given** butikken er utenfor de ni eller Amex ikke godtas
**When** jeg ser anbefalingen
**Then** jeg ser forklaringen i klartekst («Denne butikken gir ikke Trumf-poeng i appen ennå.», «Amex godtas ikke her, bruk Mastercard Premium.») (UX-DR12)

**Given** felt er tomme
**When** jeg åpner skjermen
**Then** jeg ser en rolig tom tilstand uten feilmelding

**Given** jeg bruker skjermleser
**When** anbefalingen endres
**Then** den nye anbefalingen leses opp, og tallfeltet har talltastatur med komma (UX-DR13, UX-DR15)

**Given** appen kjører uten KI-nøkkel
**When** jeg bruker Før kjøp
**Then** alt virker (FR-25, NFR-1)

## Epic 5: Klar for sensor og publisering

Sensor kan klone repoet, følge README og kjøre og teste appen på 15–20 minutter. Appen er publisert, repoet er ryddig, og prosessen er dokumentert og kan følges fra plan til kode.

### Story 5.1: README som sensor kan følge uten hjelp

As a sensor,
I want en README med eksakte kommandoer,
So that jeg får appen til å kjøre uten å spørre gruppen.

**Acceptance Criteria:**

**Given** README.md
**When** jeg leser den
**Then** den har en kort beskrivelse av hva appen gjør og hvem den er for, forutsetninger med versjoner (Node, Docker), og steg-for-steg oppstart med kommandoer som kan kopieres (AR-13, AR-11)
**And** den beskriver `.env.example`, testbrukeren, hvordan `npm test` kjøres og at fritekst er valgfritt uten nøkkel (NFR-1, NFR-2)

**Given** en ren klone av repoet
**When** jeg følger README fra topp til bunn
**Then** appen starter og kjernefunksjonene kan brukes uten avvik
**And** README inneholder en oversikt over mappestrukturen og lenker til planleggings- og prosessdokumentasjonen

### Story 5.2: Eksempeldata som viser appen

As a sensor,
I want en testbruker med realistiske, oppdiktede data,
So that jeg ser appen i bruk med en gang.

**Acceptance Criteria:**

**Given** seed kjøres
**When** jeg logger inn med testbrukeren
**Then** hen har begge kort, et poengmål, startverdier og 10–15 oppdiktede kjøp i flere butikker (NFR-1, NFR-6)
**And** Hjem, Kjøp og Før kjøp viser meningsfulle tall

**Given** repoet
**When** jeg søker etter ekte nøkler, kortnummer eller kvitteringer
**Then** jeg finner ingen (NFR-6)

### Story 5.3: Ryddig repo

As a sensor,
I want et repo med bare relevante filer,
So that jeg finner frem og ikke møter hemmeligheter.

**Acceptance Criteria:**

**Given** rotmappen
**When** jeg ser på den
**Then** løse notater (`product-brief.md`, `tilbakemelding-product-brief.md`, `poeng-*.bundle`) er flyttet til `docs/` eller fjernet, og mappen inneholder bare kode, konfig, README og dokumentmapper (AR-13)

**Given** `.gitignore`
**When** jeg kjører en ny installasjon og build
**Then** `node_modules`, byggemapper og `.env` havner ikke i git

**Given** git-historikken
**When** jeg søker etter nøkler og `.env`-filer
**Then** jeg finner ingen (kontrollert og notert)

### Story 5.4: Testplan og kvalitetssikring dokumentert

As a sensor,
I want å se hva som er testet og hvordan feil ble funnet og rettet,
So that jeg kan vurdere kvalitetssikringen.

**Acceptance Criteria:**

**Given** `docs/testplan.md`
**When** jeg leser den
**Then** den lister automatiserte tester (hva de dekker og hvordan de kjøres), manuelle tester for kjerneflytene og for feil input (ugyldig beløp, tomt skjema, feil passord, manglende KI-nøkkel), og resultatet av hver

**Given** historikken
**When** jeg leser PR-er eller commit-meldinger
**Then** jeg finner minst tre konkrete eksempler på feil i KI-generert kode som ble funnet og rettet, beskrevet i `docs/prosess/`

### Story 5.5: Prosessdokumentasjon som kan følges

As a sensor,
I want en oversikt over prosessen fra idé til kode,
So that jeg ser hvordan KI ble styrt.

**Acceptance Criteria:**

**Given** `docs/prosess/README.md`
**When** jeg åpner den
**Then** den lenker til brief, PRD, UX, arkitektur, epics og sesjonsloggene i `.logs/`, i rekkefølgen de ble laget (AR-12)
**And** den har en tabell fra krav (FR-ID) til historie til commit eller PR for kjernen

**Given** viktige valg
**When** jeg leser dokumentet
**Then** valgene fra arkitekturen (for eksempel PostgreSQL, ren kjerne, Better Auth) er forklart med begrunnelse og alternativer

### Story 5.6: Publisering på Vercel

As a bruker,
I want at appen er tilgjengelig på nett,
So that jeg kan bruke den fra mobilen.

**Acceptance Criteria:**

**Given** en administrert PostgreSQL-database (Neon eller Supabase brukt som ren Postgres) og et Vercel-prosjekt koblet til repoet
**When** appen bygges
**Then** miljøvariabler er satt i Vercel (ikke i repoet), migreringer er kjørt, og appen svarer på en offentlig adresse (NFR-4, AR-10)
**And** kjernefunksjonene kan brukes fra mobilen

**Given** nøkkel til OpenRouter ikke er satt
**When** appen kjører på Vercel
**Then** fritekst er skjult og skjemaet fungerer (NFR-2)

**And** adressen og eventuelle begrensninger står i README

## Epic 6: Registrere kjøp med fritekst

Bruker skriver «450 kr på Kiwi med Mastercard Premium», får et forslag med usikre felt markert, og bekrefter før noe lagres.

### Story 6.1: KI-tolkning på serveren med trygg fallback

As a utvikler,
I want at serveren tolker fritekst via OpenRouter og alltid faller trygt tilbake,
So that appen aldri krasjer eller lekker nøkkelen.

**Acceptance Criteria:**

**Given** en miljøvariabel med OpenRouter-nøkkel
**When** serveren får en fritekst
**Then** den kaller OpenRouter og returnerer et strukturert forslag (beløp, butikk, kort, dato), validert mot kjente felt (FR-7, AR-7)
**And** nøkkelen finnes bare på serveren og aldri i klienten eller i git (AR-10)

**Given** nøkkelen mangler eller kallet feiler
**When** bruker prøver fritekst
**Then** serveren svarer at fritekst ikke er tilgjengelig, og skjemaet vises (NFR-2)

**Given** innspilte svar i `tests/`
**When** jeg kjører `npm test`
**Then** validering og fallback testes uten nøkkel og uten nettverk

### Story 6.2: Fritekstfelt og bekreftelse av forslaget

As a bruker,
I want å skrive kjøpet med egne ord og bekrefte forslaget,
So that registreringen går raskt uten at feil lagres.

**Acceptance Criteria:**

**Given** jeg er på Registrer kjøp og KI er tilgjengelig
**When** jeg skriver «450 kr på Kiwi med Mastercard Premium» og trykker Tolk
**Then** Bekreft forslag viser beløp, butikk, kort og dato som felt jeg kan rette (FR-7, FR-9)

**Given** KI er usikker på et felt
**When** forslaget vises
**Then** feltet er markert med forklaring («Vi antok i dag. Sjekk den.»), og Bekreft er deaktivert til jeg har sett eller endret feltet (UX-DR8)
**And** farge er ikke eneste signal (UX-DR13)

**Given** forslaget vises
**When** jeg ikke har trykket Bekreft
**Then** ingenting er lagret (FR-9, SK-3)

**Given** jeg bekrefter
**When** kjøpet lagres
**Then** det følger samme lagring og poengberegning som skjemaet (Story 2.4)

**Given** KI ikke er tilgjengelig
**When** jeg åpner Registrer kjøp
**Then** jeg ser skjemaet og beskjeden «Fritekst er ikke tilgjengelig akkurat nå. Fyll ut skjemaet.»

### Story 6.3: Måle treffsikkerheten

As a utvikler,
I want å måle hvor godt tolkningen treffer,
So that jeg vet om SK-2 er oppfylt.

**Acceptance Criteria:**

**Given** en fil med minst 10 testsetninger og forventet tolkning i `tests/`
**When** jeg kjører et eget skript med en gyldig nøkkel
**Then** skriptet viser antall riktige tolkninger og hvilke felt som feilet (SK-2)
**And** minst 8 av 10 er riktige, og usikre felt markeres i stedet for å gjettes

**Given** skriptet
**When** jeg kjører `npm test`
**Then** skriptet kjøres ikke (det krever nøkkel og kjøres manuelt), og README forklarer hvordan det kjøres

## Epic 7: Mål i detalj, varsler og tempo

Bruker følger Companion Ticket og Fly Premium, får varsel ved halvveis, og ser når målet nås i dagens tempo.

### Story 7.1: Companion Ticket

As a bruker med Amex Elite,
I want å følge Companion Ticket og utløpsdatoen,
So that jeg ikke mister fordelen.

**Acceptance Criteria:**

**Given** jeg har Amex Elite og har valgt Companion Ticket som mål
**When** jeg åpner Mål-detalj fra mål-kortet
**Then** jeg kan krysse av for at billetten er opptjent og oppgi når (FR-19)
**And** appen viser utløpsdato (opptjent i 2026 gjelder til 31.12.2027, og kan ikke forlenges)

**Given** jeg oppdaterer Amex-forbruket i kalenderåret
**When** jeg lagrer
**Then** jeg ser fremgang mot 150 000 og 300 000 kr, maks to fordeler per år, merket «oppgitt av deg, sist oppdatert [dato]» (FR-19)

**Given** billetten er utløpt
**When** jeg åpner Hjem
**Then** mål-kortet er merket utløpt (UX-DR12)

### Story 7.2: Fly Premium

As a bruker med Mastercard Premium,
I want å følge fremgangen mot Fly Premium,
So that jeg vet hvor langt det er til nivået jeg vil ha.

**Acceptance Criteria:**

**Given** jeg har Mastercard Premium og velger Fly Premium som mål
**When** jeg åpner Mål-detalj
**Then** jeg oppgir total for EuroBonus-poeng opptjent siste 12 måneder, og ser nærmeste nivå (75 000, 125 000 eller 200 000) og hva som gjenstår (FR-20)
**And** totalen er merket «oppgitt av deg, sist oppdatert [dato]»

**Given** jeg bare vil bruke SAS-bonusreiser eller også SkyTeam
**When** jeg ser Fly Premium
**Then** det vises med forklaringen at det gjelder bare bonusbilletter med SAS (FR-6, FR-20)

### Story 7.3: Halvveis-varsel

As a bruker med poengmål og Companion Ticket,
I want varsel når jeg har halvparten av målet,
So that jeg vet at det holder til én reise alene.

**Acceptance Criteria:**

**Given** saldoen er minst halvparten av poengmålet og en gyldig Companion Ticket er avkrysset
**When** jeg åpner Hjem
**Then** et banner viser «Du har halvparten. Med Companion Ticket (gyldig til [dato]) holder det til en reise alene.» (FR-18, UX-DR11)

**Given** jeg lukker banneret
**When** saldoen er uendret
**Then** det vises ikke igjen før saldoen endres

**Given** billetten er utløpt eller ikke avkrysset
**When** jeg åpner Hjem
**Then** banneret vises ikke

### Story 7.4: Tempo og prognose

As a bruker,
I want å se når jeg når målet i dagens tempo,
So that jeg kan avgjøre om jeg bør endre hvor jeg betaler.

**Acceptance Criteria:**

**Given** jeg har registrert kjøp siste fire uker
**When** jeg åpner Hjem
**Then** jeg ser «Du når målet ca. [dato] hvis tempoet fortsetter» (FR-21)
**And** tidspunktet og beregningen kommer fra `domain/`, med tiden som argument (AR-2)

**Given** jeg ikke har kjøp siste fire uker
**When** jeg åpner Hjem
**Then** ingen dato vises, men «Ingen dato ennå: du har ikke registrert kjøp de siste fire ukene.» (FR-21, UX-DR12)

**Given** jeg har kjøp med ulike kort
**When** jeg ser tempoet
**Then** jeg ser hva dato ville blitt om alle kjøpene gikk med anbefalt kort (FR-21)

### Story 7.5: Avveining mellom kort (utsettes hvis tiden er knapp)

As a bruker,
I want å se når et kort gir færre poeng, men bringer meg nærmere et terskelmål,
So that jeg tar et informert valg.

**Acceptance Criteria:**

**Given** anbefalingen viser to kort og ett gir færre poeng
**When** det andre kortet bringer meg nærmere et terskelmål (Companion Ticket)
**Then** en setning viser avveiningen (FR-24)

**Given** Amex Elite gir flest poeng i alle ni butikker
**When** jeg bruker v1-butikkene
**Then** avveiningen vises ikke (ingen virkning i v1), og historien kan utsettes til «Senere»
