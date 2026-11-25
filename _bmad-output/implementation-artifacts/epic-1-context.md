# Epic 1 Context: Kom i gang med konto og oppsett

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Bruker kan opprette konto, logge inn, velge kort og mål, legge inn startverdier og se Hjem med sin startsaldo. Første historie setter opp hele prosjektet slik at sensor kan starte appen med én kommando.

## Stories

- Story 1.1: Prosjektoppsett som kan startes med én kommando
- Story 1.2: Tema og navigasjonsskall
- Story 1.3: Opprette konto og logge inn og ut
- Story 1.4: Velge kort, Trumf og type bonusreiser
- Story 1.5: Velge mål og legge inn startverdier
- Story 1.6: Hjem med startsaldo
- Story 1.7: Meg: endre oppsett, oppdatere saldoer og slette konto

## Requirements & Constraints

- Appen starter lokalt med Docker; alt unntatt fritekst virker uten KI-nøkkel (NFR-1).
- Norsk grensesnitt (NFR-7). Test- og eksempeldata er oppdiktede; ingen hemmeligheter i repoet (NFR-6).
- Bruker velger kort (Amex Elite, Mastercard Premium eller begge), mål, startverdier, Trumf-kobling og SAS/SkyTeam (FR-1–6).
- Brukerdata er privat per bruker og slettes med kontoen (NFR-9).
- Små commits på en gren per historie; commit nevner FR-/AD-ID (AD-12).

## Technical Decisions

- Én Next.js 16-app (App Router, TypeScript 5, React 19, Node 22) uten egen backend (AD-1).
- To soner: `src/domain/` er ren kjerne (ingen database, nettverk, `Date.now()`, miljøvariabler; lint håndhever det), `src/app/` er skall (AD-2).
- PostgreSQL med Prisma 7; alle skjemaendringer via migreringer; ingen SQLite (AD-3).
- Better Auth med e-post og passord; alle brukerdata-tabeller har `bruker_id` og spørringer filtreres på innlogget bruker (AD-8).
- Fillagring bak grensesnitt i `src/app/storage/`; ingen filer i v1 (AD-9).
- Konfigurasjon leses ett sted (`src/app/config.ts`); `.env.example` uten verdier; `.env` i `.gitignore` (AD-10).
- `docker compose up` starter app og Postgres, kjører migrering og seed; `npm test` (Vitest) kjører uten nøkler og nettverk (AD-11).
- Feil returneres som `{ ok: false, feil }`; skriving skjer i serverfunksjoner i én transaksjon.
- Norske domenenavn uten æøå i filnavn og datamodell; engelsk for tekniske navn. ID-er er UUID.

## UX & Interaction Patterns

- Design-tokens fra DESIGN.md samles i én temafil; lys/mørk følger system.
- Nedre fanelinje (Hjem, Før kjøp, Kjøp, Meg); i oppsett erstattes den av fast primærknapp. Maks 480 px, én kolonne, 16 px sidemarg.
- Trykkflater ≥ 48 px, farge aldri eneste signal, norsk tallformat.

## Cross-Story Dependencies

- Story 1.1 er grunnlaget for alle andre historier i alle epics.
- 1.2 (tema) før alle skjermer; 1.3 (innlogging) før 1.4–1.7; 1.4–1.5 før 1.6.
