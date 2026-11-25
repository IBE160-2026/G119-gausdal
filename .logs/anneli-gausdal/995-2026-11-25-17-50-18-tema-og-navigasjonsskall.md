# Tema og navigasjonsskall

## 2026-11-25 kl. 17:50 — Anneli Gausdal

### Oppgave
Implementere spec `_bmad-output/implementation-artifacts/spec-1-2-tema-og-navigasjonsskall.md`
(Story 1.2): én CSS-temafil med design-tokens fra DESIGN.md (lys standard, mørk via
`prefers-color-scheme`), en fast nedre fanelinje (Hjem/Før kjøp/Kjøp/Meg) i rotlayouten med
sentrert 480 px-kolonne, og plassholdersider for de tre nye fanene.

### Plan
- Leste spec fullt ut, pluss kontekstfila DESIGN.md (farger, typografi, spacing, avrunding).
- `src/app/tema.css` (ny): CSS-variabler for farger (`:root` lys +
  `@media (prefers-color-scheme: dark)` mørk), typografi (display/title/body/meta), spacing
  (4/8/12/16/24/32, tap-min 48) og avrunding (sm/md/full), pluss `.skall-innhold` og
  `.nedre-navigasjon`-klassene som bruker variablene.
- `src/app/components/nedre-navigasjon.tsx` (ny): klientkomponent med `usePathname()`, fire
  `<Link>` (Hjem `/`, Før kjøp `/for-kjop`, Kjøp `/kjop`, Meg `/meg`), `aria-current="page"` via
  eksakt `pathname === href`, min 48×48 px per fane.
- `src/app/layout.tsx`: importerer `./tema.css`, pakker `{children}` i `.skall-innhold`
  (max-width 480px, margin-inline auto, padding-inline fra spacing-token), rendrer
  `<NedreNavigasjon />` fast nederst (`position: fixed`), med `padding-bottom` + safe-area-inset
  på innholdssiden og i fanelinjens egen bunnpadding.
- `src/app/for-kjop/page.tsx`, `src/app/kjop/page.tsx`, `src/app/meg/page.tsx` (nye):
  plassholdertittel + «Kommer snart.», norsk tekst, ingen ekte innhold (jf. «Never»-grensen).

### Resultat
- Opprettet: `src/app/tema.css`, `src/app/components/nedre-navigasjon.tsx`,
  `src/app/for-kjop/page.tsx`, `src/app/kjop/page.tsx`, `src/app/meg/page.tsx`.
- Endret: `src/app/layout.tsx` (import av temafil, sentrert kolonne, fanelinje).
- `src/app/page.tsx` (Hjem) er uendret, som spec krever.
- Verifisert: `npm run lint` → 0 feil. `npm run build` → alle fire ruter (`/`, `/for-kjop`,
  `/kjop`, `/meg`) bygget statisk uten feil. `npm test` → 2/2 grønt, ingen regresjon.
- Ikke committet ennå — brukeren committer selv (ingen commit-forespørsel i denne økten,
  kun loggfila committes av denne skillen).

### Åpne punkter
- Spec peker selv på at `layout.tsx` sin rendering av `<NedreNavigasjon />` må bli betinget
  når innlogging/onboarding (Story 1.3–1.5) får egne ruter, siden DESIGN.md sier fanelinjen da
  erstattes av en fast primærknapp. Ikke løst i denne historien (bevisst, iht. spec).
- Ingen andre kjente.
