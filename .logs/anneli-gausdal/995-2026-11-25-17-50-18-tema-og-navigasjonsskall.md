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

## 2026-11-25 kl. 18:25 — Anneli Gausdal

### Oppgave
Fullføre resten av `bmad-build` for Story 1.2 etter forrige økts implementering: spec-skriving
og godkjenning, en ekstern spec-gjennomgang, uavhengig verifisering av implementeringen,
tre-lags kodegjennomgang, retting av reelle funn, og landing i små commits med UX-DR/AD-ID
(eksplisitt bedt om av brukeren, samme mønster som Story 1.1).

### Plan
- Skrev full spec (`spec-1-2-tema-og-navigasjonsskall.md`, `route: dispatch` — valgt i stedet
  for `oneshot` fordi temafil+fanelinje blir en avhengighet alle senere skjermer bygger på, og
  fordi bruker eksplisitt ba om flere små commits, som `oneshot`-ruten ikke gir).
- Bad brukeren velge godkjennings-nivå; brukeren valgte «gå gjennom spec-en først» — sendte
  spec-en til en fersk, kontekstfri agent for kritikk før godkjenning.
- Rettet 5 mangler agenten fant (fast/sticky fanelinje ikke spesifisert, manglende manuell test
  for tekststørrelse-AC, uklar 480px-sentrering, avvik mellom «48px høy» og «48×48px», Code Map
  manglet de nye filene) direkte i spec-en, presenterte på nytt, brukeren godkjente.
- Dispatchet implementering til en fersk agent (spec som eneste sannhetskilde).
- Verifiserte implementeringen selv, ikke bare agentens rapport: kjørte `next dev` lokalt,
  hentet faktisk renderet HTML/CSS med `curl` for alle fire ruter.
- Kjørte `blind-hunter`, `edge-case-hunter` og `verification-gap` parallelt mot diffen siden
  baseline-commiten; vurderte hvert funn selv (verifisert/motbevist, ikke tatt reviewernes ord
  for det) før triage.
- Sendte de rettbare funnene tilbake til samme implementeringsagent (gjenengasjert via id, ikke
  en ny agent); verifiserte rettingen på nytt selv.
- Committet i 6 små, UX-DR/AD-merkede commits iht. brukerens eksplisitte instruks.
- Plandokument: ingen eget — fulgte `bmad-build`s innebygde steg (clarify → plan → implement →
  review → present), med spec-filen selv som planartefakt.

### Resultat
**Review:** 3 reviewere fant 12 enkeltfunn (8 fra blind-hunter, 3 fra edge-case-hunter, 1 fra
verification-gap). Etter egen verifisering: 5 rettet (patch), 2 utsatt til `deferred-work.md`
(testinfrastruktur for aktiv-fane-logikken; per-side dokumenttittel), 2 avvist som `false` med
motbevisning (se `## Review Triage Log` i spec-filen for alle 12 rader).

**Rettet i `src/app/tema.css`, alle verifisert av meg etter retting (lest kompilert CSS via
`curl` mot `next dev`):**
- Typografi-variabler konvertert fra `px` til `rem` (skalerer med nettleser/OS-tekststørrelse).
- Ny `h1`-regel lagt til (brukte ikke `--font-size-title` før — fikk nettleserens standard
  2em/fet i stedet for tema-tokens).
- `--spacing-margin-mobile` er nå et alias til `--spacing-4` i stedet for en egen literal.
- `--nedre-navigasjon-hoyde` er nå faktisk utledet (`calc(tap-min + 2×spacing-1)`) i stedet for
  en gjetning som kommentaren feilaktig hevdet var utledet.
- `env(safe-area-inset-bottom)` fikk `0px`-reserveverdi begge steder.

**Commits** (6 stk, i `claude/eager-carson-eldvjj`):
`94819d8` (temafil, UX-DR1/UX-DR2), `581cb7e` (fanelinje, UX-DR3/UX-DR13), `290b440`
(rotlayout, UX-DR1/UX-DR3), `1ea301e` (plassholdersider, UX-DR3), `326cc5f` (gitignore for
Next sin auto-genererte `AGENTS.md`, urelatert hygiene), `0e3d3f1` (spec til `done`,
triage-logg, sprint-status, AD-12).

`npm run lint`/`npm test`/`npm run build` grønt etter retting. Spec-filens status er `done`;
`sprint-status.yaml` har story-nøkkelen på `review` (ikke `done`) — se Åpne punkter.

### Åpne punkter
- Ingen GUI-nettleser var tilgjengelig i denne sesjonen. Jeg bekreftet `aria-current`,
  `rem`-verdier, `env()`-reserveverdier og nav-høyde-formelen strukturelt (ekte server-rendret
  HTML og kompilert CSS via `curl`), men har ikke *sett* mørk modus eller tekstskalering i en
  ekte nettleser. Bruker bør selv åpne appen (`npm run dev` eller `docker compose up`) og gå
  gjennom de resterende manuelle sjekkene i spec-filens `## Verification`-seksjon (bytt
  lys/mørk, skru opp tekststørrelsen, scroll og se at fanelinjen ikke dekker innhold), og sette
  `1-2-tema-og-navigasjonsskall` til `done` i `sprint-status.yaml` når det er bekreftet.
- Uendret fra forrige seksjon: `<NedreNavigasjon />` må bli betinget når Story 1.3–1.5 får egne
  innloggings-/onboardingruter.

Speiles i `issues.md`.

## 2026-11-25 kl. 18:35 — Anneli Gausdal

### Oppgave
Anneli bekrefter selv i en ekte nettleser at Story 1.2 fungerer, og ber om at punktet krysses
av og historien settes til `done`.

### Plan
- Ingen — rent bekreftelses- og statusoppdateringssteg, ingen kodeendring.

### Resultat
Anneli testet appen selv og bekreftet: fanelinjen virker, mørk modus virker, stor tekst virker,
og fanelinjen dekker ikke innhold. De gjenstående manuelle sjekkene fra forrige seksjon er
dermed utført. `1-2-tema-og-navigasjonsskall` er satt til `done` i `sprint-status.yaml`
(commit `a93d96f`, AD-12). Story 1.2 er nå fullstendig `done`.

### Åpne punkter
- Uendret: `<NedreNavigasjon />` må bli betinget når Story 1.3–1.5 får egne
  innloggings-/onboardingruter (se tidligere seksjoner).

Speiles i `issues.md`.
