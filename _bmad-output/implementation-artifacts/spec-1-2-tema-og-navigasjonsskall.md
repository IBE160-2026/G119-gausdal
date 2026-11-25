---
title: 'Tema og navigasjonsskall'
type: 'feature'
created: '2026-11-25'
status: 'done'
baseline_commit: 'd706fd2a0b460cbd38c3af5e06d2557c3aa8cc9a'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-G119-gausdal-2026-11-24/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Appen har i dag bare det enkle rotoppsettet fra Story 1.1 — ingen samlet temafil
for farger/typografi/spacing, og ingen fast nedre fanelinje (Hjem, Før kjøp, Kjøp, Meg) slik
UX-designet krever på alle skjermer.

**Approach:** Lag én CSS-temafil med design-tokens fra DESIGN.md (lys modus som standard, mørk
modus via `prefers-color-scheme`), og en nedre fanelinje-komponent med de fire fanene, brukt i
rotlayouten sammen med en sentrert 480 px-kolonne. Legg til minimale plassholderruter for Før
kjøp, Kjøp og Meg slik at fanene faktisk navigerer (Hjem er den eksisterende rotsiden).

## Boundaries & Constraints

**Always:**
- Alle tekster på norsk (NFR-7).
- Temafilen er eneste sted farger, typografi, spacing og avrunding defineres som CSS-variabler;
  andre filer refererer variablene, aldri hardkodede verdier (UX-DR1).
- Lys/mørk styres av `prefers-color-scheme` (systeminnstilling), ingen manuell knapp (UX-DR2).
- Nedre fanelinje har nøyaktig Hjem (`/`), Før kjøp (`/for-kjop`), Kjøp (`/kjop`), Meg (`/meg`);
  innhold sentreres i maks 480 px, én kolonne, 16 px sidemarg (UX-DR3).
- Fanelinjen er alltid synlig i viewport, også ved scroll (`position: fixed` eller `sticky`
  nederst) — ikke en linje som bare scroller forbi med resten av siden (UX-DR3, DESIGN.md:
  «Nedre fanelinje er alltid synlig»). Innholdskolonnen får nok `padding-bottom` til at fast
  fanelinje ikke dekker siste tekst, og fanelinjen legger til
  `env(safe-area-inset-bottom)` i sin egen bunnpadding for iOS.
- Hver fane er en lenke med synlig tekst, minst 48×48 px trykkflate (begge dimensjoner,
  ikke bare høyde), og `aria-current="page"` på aktiv fane, satt med eksakt
  `pathname === href`-sammenligning (UX-DR13).
- Bruk relative enheter og unngå fast høyde/`overflow: hidden` på fanetekst, så ingenting kuttes
  ved størst systemtekststørrelse (UX-DR13).

**Never:**
- Ingen ikonbibliotek eller bilder for fanene — bare tekst (DESIGN.md: tekstnavn, ingen
  ikon-only-knapper).
- Ingen innlogging, databaseoppslag eller ekte skjerminnhold for Før kjøp/Kjøp/Meg i denne
  historien — bare plassholdertekst; de bygges i senere historier (1.3–1.7).
- Ikke rør `src/domain/`, Prisma, Docker eller `src/app/config.ts` i denne historien.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Mørk modus | `prefers-color-scheme: dark` | Hele appen viser mørk palett fra tema-variablene | N/A |
| Aktiv fane | URL er `/for-kjop` | Kun "Før kjøp"-lenken har `aria-current="page"` | N/A |
| Størst tekststørrelse | Nettleser skalert til maks tekst | Fanenavn forblir lesbare, ingen avkutting | N/A |

</frozen-after-approval>

## Code Map

- `src/app/layout.tsx` -- rotlayout fra Story 1.1 (`<html><body>{children}</body></html>`);
  skal importere temafilen, sentrere innhold med nøyaktig
  `max-width: 480px; margin-inline: auto; padding-inline: 16px` (480 px er kolonnens egen
  bredde, marg/padding kommer i tillegg), gi innholdet `padding-bottom` for den faste
  fanelinjen, og rendre `<NedreNavigasjon />`.
- `src/app/page.tsx` -- eksisterende Hjem-side, innhold uendret, ligger "innenfor" ny layout.
- `src/app/tema.css` (ny) -- CSS-variabler, se Tasks.
- `src/app/components/nedre-navigasjon.tsx` (ny) -- se Tasks.
- `src/app/for-kjop/page.tsx`, `src/app/kjop/page.tsx`, `src/app/meg/page.tsx` (nye) -- se Tasks.
- `_bmad-output/planning-artifacts/ux-designs/ux-G119-gausdal-2026-11-24/DESIGN.md` -- kilde for
  eksakte farge-hex (lys+mørk), typografi (display/title/body/meta), spacing (4/8/12/16/24/32,
  tap-min 48 px) og avrunding (sm 8px/md 14px/full) som skal bli CSS-variabler.
- `eslint.config.mjs` -- AD-2-grensen gjelder bare `src/domain/`; ingen endring ventet, men
  verifiser at nye filer i `src/app/` ikke trigger den.
- Fremover (ikke del av denne historien): når innlogging/oppsett (Story 1.3–1.5) får egne ruter,
  må `layout.tsx` sin rendering av `<NedreNavigasjon />` bli betinget, siden DESIGN.md sier
  fanelinjen erstattes av en fast primærknapp i de flytene. Notert, ikke løst her.

## Tasks & Acceptance

**Execution:**
- [x] `src/app/tema.css` -- CSS-variabler for farger (lys som `:root`, mørk under
  `@media (prefers-color-scheme: dark)`), typografi, spacing og avrunding fra DESIGN.md -- UX-DR1, UX-DR2.
- [x] `src/app/components/nedre-navigasjon.tsx` -- klientkomponent (`'use client'`,
  `usePathname()` fra `next/navigation`) som rendrer en `position: fixed`/`sticky`
  `<nav>` nederst med fire `<Link>`: Hjem, Før kjøp, Kjøp, Meg; aktiv fane får
  `aria-current="page"` via eksakt `pathname === href`; hver fane minst 48×48 px;
  bunnpadding inkluderer `env(safe-area-inset-bottom)` -- UX-DR3, UX-DR13.
- [x] `src/app/layout.tsx` -- importere `./tema.css`, pakke `{children}` i en sentrert
  480 px-kolonne (`max-width: 480px; margin-inline: auto; padding-inline: 16px`) med
  `padding-bottom` for den faste fanelinjen, rendre `<NedreNavigasjon />` -- UX-DR1, UX-DR3.
- [x] `src/app/for-kjop/page.tsx`, `src/app/kjop/page.tsx`, `src/app/meg/page.tsx` -- hver en
  plassholderside med tittel og "Kommer snart"-tekst, så fanene har et reelt mål -- UX-DR3.

**Acceptance Criteria:**
- Given appen åpnes på mobil, when jeg ser en side, then nedre fane viser Hjem, Før kjøp, Kjøp
  og Meg, innholdet er i én kolonne maks 480 px, farger/typografi/spacing/avrunding kommer fra
  tema-tokens, og all tekst er norsk (UX-DR1, UX-DR3, NFR-7). Bekreftet etter review-runden:
  `<h1>` bruker nå `--font-size-title` m.fl., og typografi-variablene er `rem` (ikke `px`).
- Given systemet står i mørk modus, when jeg åpner appen, then appen vises i mørk palett
  (UX-DR2).
- Given skallet, when jeg bruker skjermleser eller størst tekststørrelse, then fanene har navn
  og tilstand (`aria-current`), trykkflater er minst 48×48 px, og ingenting kuttes (UX-DR13).

## Implementation Notes

Implementert av egen agent (ingen tidligere kontekst), verifisert av meg mot diffen:
`src/app/tema.css`, `src/app/components/nedre-navigasjon.tsx`, oppdatert `src/app/layout.tsx`,
og plassholdersidene `src/app/for-kjop/page.tsx`, `src/app/kjop/page.tsx`, `src/app/meg/page.tsx`.
`src/app/page.tsx` (Hjem), `src/domain/`, Prisma, Docker og `config.ts` ble ikke rørt.

Designvalg utover ordlyden i Tasks: `.nedre-navigasjon` fikk også `max-width: 480px` +
`margin-inline: auto` (samme som innholdskolonnen), for at fanelinjen ikke skal se bredere ut
enn innholdet over på brede skjermer. Ikke i konflikt med noen Boundary.

**Verifisering utført av meg (ikke bare agentens egen rapport):**
- `npm run lint`, `npm run build`, `npm test` kjørt på nytt -- alle grønt.
- Kjørte `next dev` lokalt og hentet faktisk server-rendret HTML for `/`, `/for-kjop`, `/kjop`,
  `/meg` med `curl`: bekreftet at nøyaktig én fane har `aria-current="page"` på hver rute (dekker
  I/O-matrisens «Aktiv fane»-rad med ekte output, ikke bare lesing av koden).
- Hentet den kompilerte CSS-bundlen fra dev-serveren og bekreftet at den faktisk inneholder
  `@media (prefers-color-scheme: dark)`, `position: fixed` og `--spacing-tap-min: 48px` brukt som
  `min-height`/`min-width` på fanene.
- Det visuelle (se mørk palett faktisk gjengitt, pinch-zoom/tekstskalering uten avkutting) er
  **ikke** sett i en ekte nettleser i denne sesjonen -- ingen GUI-nettleser tilgjengelig her.
  Dekker «Mørk modus» og «Størst tekststørrelse»-radene i I/O-matrisen strukturelt (riktig CSS
  finnes og brukes), men ikke med et øyeeple. Bruker bør ta en rask visuell titt (se sluttsvar).

**Etter review-runden (3 reviewere, 12 funn):** 5 reelle, trivielle funn rettet i `tema.css`
(rem i stedet for px på typografi, `h1`-regel lagt til, spacing-alias, korrekt utledet
nav-høyde, `env()`-reserveverdier) — se Review Triage Log. 2 funn utsatt til `deferred-work.md`
(testinfrastruktur for aktiv-fane-logikken; per-side dokumenttittel). 2 funn avvist (false) med
motbevisning i Review Triage Log. Alle fem rettelser verifisert av meg på nytt: `npm run lint`,
`npm test`, `npm run build` grønt; kjørte `next dev` igjen og hentet den kompilerte CSS-en med
`curl` — bekreftet `rem`-verdier, `env(safe-area-inset-bottom, 0px)` og
`calc(var(--spacing-tap-min) + 2 * var(--spacing-1))` faktisk til stede i output.

## Spec Change Log

## Review Triage Log

- **medium, patch** — `src/app/tema.css`: typografi-variablene (`--font-size-*`, `--line-height-*`)
  er faste `px`, ikke relative enheter. Verifisert selv: OS/nettleser-innstillinger for
  tekststørrelse skalerer `rem` (mot rot-skriftstørrelsen), ikke bokstavelig `px` — dette er
  nettleser-/plattformfakta, ikke en gjetning. Bryter boundary-linjen om «relative enheter ...
  så ingenting kuttes ved størst systemtekststørrelse» (UX-DR13). Funnet uavhengig av
  blind-hunter. (patch)
- **medium, patch** — `src/app/tema.css` + plassholdersider: ingen regel stiler `<h1>`, så
  tittelen på alle fire sider får nettleserens standard `2em/fet` i stedet for
  `--font-size-title`/`--font-weight-title`/`--line-height-title`. Verifisert selv via
  CSS-kaskaden: en UA-regel som treffer `h1` direkte (nettleserens standard-stilark) vinner over
  nedarvet `font-size` fra `body`-regelen i temafilen, siden ingen forfatter-regel treffer `h1`
  selv. Bryter AC «typografi ... kommer fra tema-tokens». Funnet uavhengig av både blind-hunter
  og edge-case-hunter (sistnevnte med høy selvrapportert sikkerhet). (patch — triviell CSS-regel,
  ingen ny flate; AC var allerede klar og trengte ikke omforhandling)
- **low, patch** — `src/app/tema.css`: `--spacing-margin-mobile: 16px` er en egen bokstavelig
  verdi, identisk med `--spacing-4: 16px`, uten alias. Reell driftrisiko hvis en justeres uten
  den andre, men triviell å rette. (patch)
- **low, patch** — `src/app/tema.css`: `--nedre-navigasjon-hoyde: 64px` er en fast gjetning;
  kommentaren hevder den er «avledet av spacing-skalaen», men det stemmer ikke (verifisert ved å
  regne ut faneliens reelle høyde fra sine egne padding-/min-height-variabler: ca. 56px, ikke
  64px). Harmløst i dag (64 > 56, gir ekstra margin), men en misvisende kommentar og en verdi som
  kan komme ut av synk. Funnet uavhengig av både blind-hunter og edge-case-hunter. (patch)
- **low, patch** — `src/app/tema.css`: begge `env(safe-area-inset-bottom)`-kallene mangler
  reserveverdi; uten den kan `calc()` bli ugyldig i nettlesere uten støtte for egenskapen, og
  bunnpaddingen kollapser. Triviell å legge til (`, 0px`). (patch)
- **false** — blind-hunter antok at Hjem-siden (`src/app/page.tsx`, urørt i denne historien)
  kanskje ikke bruker `<main>` som landemerke, i motsetning til de tre nye plassholdersidene.
  Motbevist: jeg har lest `page.tsx` direkte (uendret siden Story 1.1) — den bruker allerede
  `<main>`. Ingen inkonsistens.
- **false** — blind-hunter mente `.nedre-navigasjon`s bokstavelige `z-index: 10` i `tema.css`
  bryter filens egen regel om at «andre filer» skal referere variabler, aldri hardkode verdier.
  Motbevist: regelen gjelder de fire navngitte tokenkategoriene (farger, typografi, spacing,
  avrunding) som *andre* filer skal hente fra temafilen — ikke at hver eneste CSS-egenskap i
  temafilen selv må være en variabel. `z-index` er ikke en av de fire kategoriene, og regelen er
  skrevet i temafilen selv, ikke i en annen fil.
- **defer** — blind-hunter og verification-gap-reviewer fant uavhengig av hverandre at ingen test
  kjører `NedreNavigasjon`s aktiv-fane-logikk (`pathname === fane.href` → `aria-current`).
  Verifisert: `vitest.config.ts` har `environment: 'node'` og `include: ['tests/**/*.test.ts']`
  (ingen `.tsx`), og `package.json` har ingen `@testing-library/react`/`jsdom` — ingen test kan
  rendre denne komponenten i dag. Reelt, men å fikse det krever ny testinfrastruktur
  (avhengigheter + utvidet vitest-konfig), ikke en triviell rettelse — og denne historiens
  Verification-del valgte allerede bevisst manuell sjekk for nettopp dette punktet. Hører til en
  egen testinfrastruktur-historie, ikke bundlet inn her. Lagt i `deferred-work.md`.
- **defer** — blind-hunter påpekte at ingen av de fire rutene setter egen side-`<title>` (kun
  rot-layoutens statiske `metadata.title` finnes), noe som ville hjulpet skjermleser-brukere å
  høre at navigasjon faktisk skjedde. Reelt, men ikke krevd av denne historiens frosne
  akseptkriterier (de krever navn+tilstand på selve fanene, ikke dokumenttittel per side).
  Utsatt for å ikke utvide omfanget midt i byggingen. Lagt i `deferred-work.md`.

## Verification

**Commands:**
- `npm run lint` -- expected: 0 feil.
- `npm run build` -- expected: Next.js bygger alle ruter (`/`, `/for-kjop`, `/kjop`, `/meg`)
  uten feil.
- `npm test` -- expected: eksisterende tester fortsatt grønt (ingen domenelogikk endret).

**Manual checks (if no CLI):**
- Bytt nettleserens/systemets fargemodus mellom lys og mørk og se at paletten følger med.
- Naviger mellom de fire fanene og inspiser i devtools at aktiv fane har
  `aria-current="page"` og at hver fane-lenke er minst 48×48 px.
- Scroll en side med mye innhold og se at fanelinjen blir stående nederst i viewporten
  (ikke scroller bort), og at innholdet ikke skjules under den.
- Skru opp nettleserens tekststørrelse til maks (eller bruk devtools' tekstskalering) og
  se at fanenavnene fortsatt er lesbare og ikke kuttes.
