---
title: 'Story 1.1: Prosjektoppsett som kan startes med én kommando'
type: 'feature'
created: '2026-11-25'
status: 'draft'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-G119-gausdal-2026-11-24/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Repoet har ingen kode. Sensor må kunne klone det og starte appen uten å sette opp noe selv, og kjernen (`domain/`) må være beskyttet mot avhengigheter fra første dag.

**Approach:** Sett opp Next.js 16 (App Router, TypeScript) med Prisma, Better Auth og Vitest, en `docker-compose.yml` som starter app og PostgreSQL og kjører migreringer, en enkel Hjem-side, en lint-regel som holder `src/domain/` ren, og en første README. Bare oppsett: ingen innloggingsskjermer, ingen datamodell utover det som trengs for at migrering kjører.

## Boundaries & Constraints

**Always:** Mappestruktur etter ryggraden (`src/domain/`, `src/app/`, `prisma/`, `tests/`, `docs/`). Norsk UI-tekst. Eksakte versjoner pinnes i `package.json` og `docker-compose.yml` (AD-3, ryggradens Stack). Konfigurasjon leses kun i `src/app/config.ts` (AD-10). Commit-meldinger nevner AR-/AD-ID (AD-12).

**Never:** Ingen ekte nøkler eller passord i repoet (kun `.env.example` uten verdier). Ingen SQLite. Ingen tema, navigasjon, innlogging, satser eller poengregler (Story 1.2, 1.3, Epic 2). Ingen filer lagres i v1. Ikke flytt eller slett eksisterende `_bmad/`, `.claude/`, `docs/`, `.logs/`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Oppstart | Ren maskin, Docker, `docker compose up` | Postgres og app starter, migreringer kjører, `http://localhost:3000` viser Hjem | App venter på at databasen er klar (healthcheck) |
| Test | `npm test` uten nett og nøkler | Vitest består, minst én test mot `src/domain/` | N/A |
| Lint-brudd | Fil i `src/domain/` importerer fra `src/app/`, `@prisma/*`, bruker `fetch` eller `Date.now()` | `npm run lint` feiler | Meldingen peker på AD-2 |
| Mangler `.env` | Ingen `.env` | Compose bruker standardverdier for lokal utvikling | Ingen krasj |

</frozen-after-approval>

## Code Map

Greenfield: repoet har ingen app-kode. Eksisterer allerede og skal ikke røres: `_bmad/`, `.claude/`, `docs/`, `.logs/`, `_bmad-output/`, `product-brief.md`, `.gitignore` (dekker allerede `.env`, `node_modules/`, `.next/`; utvides ved behov), `README.md` (eksisterer; utvides, ikke erstattes blindt).

## Tasks & Acceptance

**Execution:**
- [ ] `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx` -- Next.js 16-app med enkel norsk Hjem-side -- AR-1
- [ ] `src/domain/` (f.eks. `hello.ts`) og `tests/` -- én ren funksjon med Vitest-test -- AR-11, AD-2
- [ ] `vitest.config.ts` -- konfigurasjon uten nettverk -- AD-11
- [ ] `eslint.config.mjs` -- `no-restricted-imports` og `no-restricted-globals`/-syntax for `src/domain/` -- AR-2
- [ ] `prisma/schema.prisma`, `prisma/migrations/` -- datasource PostgreSQL, ingen domenemodeller -- AR-3
- [ ] `src/app/config.ts` og `.env.example` -- én leser for miljøvariabler, navn uten verdier -- AR-10
- [ ] `src/app/storage/` -- tomt grensesnitt med lokal mappe som standard -- AR-9
- [ ] `Dockerfile`, `docker-compose.yml` -- app og PostgreSQL, migrering ved oppstart -- AR-11
- [ ] `README.md` -- første versjon med forutsetninger og kommandoene `docker compose up` og `npm test` -- AR-13

**Acceptance Criteria:**
- Given repoet klonet og Docker kjører, when `docker compose up`, then app og Postgres starter, migreringer kjører og Hjem svarer på port 3000.
- Given prosjektet, when `npm test`, then Vitest består uten nøkler og nett.
- Given en forbudt import i `src/domain/`, when `npm run lint`, then lint feiler.
- Given `.env.example` og `.gitignore`, then alle variabelnavn finnes uten verdier og `.env` er ignorert.

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Design Notes

Prisma kan ikke migrere uten modeller i enkelte versjoner; dersom tom schema ikke fungerer, brukes `prisma migrate deploy` uten migreringer, eller en minimal plassholder fjernes igjen i Story 1.3 (Better Auth eier brukertabellene). Beslutningen tas under implementering og noteres i Implementation Notes.

## Verification

**Commands:**
- `npm test` -- expected: alle tester består
- `npm run lint` -- expected: ingen feil; feiler når forbudt import legges inn midlertidig
- `npm run build` -- expected: Next.js bygger uten feil
- `docker compose config` -- expected: gyldig konfigurasjon

**Manual checks (if no CLI):**
- `docker compose up` på en maskin med Docker daemon: Hjem vises på `http://localhost:3000`.
