---
status: draft
stepsCompleted: [1, 2]
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
FR-12: Ved registrering kan bruker krysse av for Trippel-Trumf-dag (1 % mot 3 % Trumf-bonus).
FR-13: Regelmotoren beregner bonuspoeng per kilde og kjøp: Amex Elite 20 per 100 kr, Mastercard Premium 15 per 100 kr i NOK (v1: bare NOK i de ni butikkene).
FR-14: Appen beregner Trumf-bonus i de ni dagligvarebutikkene: 1 % (3 % på Trippel-Trumf-dag), 13,5 poeng per Trumf-krone, overføring ved 200 Trumf-kroner. Estimat som rundes ned.
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
FR-12: Epic 2 - Trippel-Trumf-dag
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

**Given** en ren maskin med Docker og repoet klonet
**When** jeg kjører `docker compose up`
**Then** app og PostgreSQL starter, Prisma-migreringer kjøres, og en startside svarer på `http://localhost:3000`
**And** `.env.example` finnes med alle variabelnavn og ingen verdier, og `.env` er i `.gitignore` (AR-10, NFR-6)

**Given** prosjektet er satt opp
**When** jeg kjører `npm test`
**Then** Vitest kjører og består uten nøkler og uten nettverk, med minst én test mot en funksjon i `src/domain/` (AR-11)

**Given** koden i `src/domain/`
**When** en fil der importerer fra `src/app/`, Prisma, eller bruker `fetch` eller `Date.now()`
**Then** lint feiler (AR-2)

**And** mappestrukturen følger ryggraden (`src/domain/`, `src/app/`, `prisma/`, `tests/`, `docs/`), og README har en første versjon med oppstartskommandoene (AR-13)

### Story 1.2: Tema og navigasjonsskall

As a bruker,
I want en app som ser rolig og ryddig ut på mobil med fast navigasjon,
So that jeg finner frem uten å tenke.

**Acceptance Criteria:**

**Given** appen åpnes på mobil
**When** jeg ser en innlogget side
**Then** nedre fane viser Hjem, Før kjøp, Kjøp og Meg, med innholdet i én kolonne og maks 480 px bredde (UX-DR3)
**And** farger, typografi, spacing og avrunding kommer fra tokens i én temafil (UX-DR1)

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
