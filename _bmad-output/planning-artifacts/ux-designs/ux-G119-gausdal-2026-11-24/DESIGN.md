---
name: EuroBonus Poeng-stacker
description: Mobil-først verktøy for å nå poengmål raskere. Rolig, tallfokusert og ærlig om usikkerhet. Dempede grå flater med én dempet blå aksent, lys og mørk modus.
status: final
updated: 2026-11-24
sources:
  - _bmad-output/planning-artifacts/prds/prd-G119-gausdal-2026-11-12/prd.md
colors:
  surface-base: '#ECEEF0'
  surface-raised: '#FFFFFF'
  ink-primary: '#1B1F24'
  ink-secondary: '#58606A'
  ink-disabled: '#9AA1AA'
  border-hairline: '#D3D7DC'
  accent: '#2F5D8C'
  accent-soft: '#E0E9F2'
  on-accent: '#FFFFFF'
  pending: '#8E98A4'
  uncertain: '#8A5A00'
  uncertain-soft: '#FFF1D6'
  danger: '#B3261E'
  surface-base-dark: '#14171B'
  surface-raised-dark: '#1E2227'
  ink-primary-dark: '#EDEFF1'
  ink-secondary-dark: '#A8AFB8'
  ink-disabled-dark: '#636B75'
  border-hairline-dark: '#2E343B'
  accent-dark: '#7FAEDB'
  accent-soft-dark: '#1F2E3D'
  on-accent-dark: '#101418'
  pending-dark: '#707B88'
  uncertain-dark: '#F0B955'
  uncertain-soft-dark: '#3A2D10'
  danger-dark: '#F2B8B5'
typography:
  display:
    fontFamily: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif
    fontSize: 32px
    fontWeight: 700
    lineHeight: 36px
    note: Brukes bare til hovedtallet på Hjem (poeng nå). Tabulære siffer.
  title:
    fontFamily: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif
    fontSize: 20px
    fontWeight: 600
    lineHeight: 26px
  body:
    fontFamily: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  meta:
    fontFamily: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
rounded:
  sm: 8px
  md: 14px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
  margin-mobile: 16px
  tap-min: 48px
components:
  button-primary:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.on-accent}'
    rounded: '{rounded.md}'
    height: '{spacing.tap-min}'
  button-secondary:
    backgroundColor: '{colors.surface-raised}'
    textColor: '{colors.ink-primary}'
    rounded: '{rounded.md}'
    height: '{spacing.tap-min}'
  card:
    backgroundColor: '{colors.surface-raised}'
    rounded: '{rounded.md}'
    padding: '{spacing.4}'
  progress-bar:
    trackColor: '{colors.border-hairline}'
    transferredColor: '{colors.accent}'
    pendingColor: '{colors.pending}'
    rounded: '{rounded.full}'
    height: 12px
  field-uncertain:
    backgroundColor: '{colors.uncertain-soft}'
    textColor: '{colors.uncertain}'
    rounded: '{rounded.sm}'
---

## Brand & Style

Appen er en **kalkulator med anbefaling**, ikke et spill og ikke en bankapp. Den skal føles som en nøktern venn som kan regelverket: kort, presis og ærlig om hva den ikke vet. Ingen konfetti, ingen streaks, ingen «du er nesten der!»-oppfordringer. Tallene er hovedpersonen.

Utseendet bygger på tillit gjennom ro: dempede grå flater, mye luft og ett dempet blått aksent. Grånyansen er valgt fordi den ligger nær tonen i flybransjen og SAS-logoen, uten å kopiere den. Blåtonen er stålblå og dempet, bevisst ikke den lysere, mettede blåfargen som EuroBonus-guiden bruker. Appen bruker ikke SAS', American Express', Mastercards eller Trumfs logoer, kortbilder eller eksakte varemerkefarger. Kort og butikker omtales med tekst.

## Colors

- **Overflate (`surface-base` / `surface-raised`)** er en lys, nøytral grå bakgrunn med hvite kort. Mørk modus følger systeminnstillingen og har tilsvarende dype grå flater.
- **Aksent (`accent`, dempet stålblå)** betyr «fremdrift og anbefalt valg». Den brukes på primærknappen, den overførte delen av fremdriftsbaren og anbefalt kort. Aldri til pynt.
- **Venter (`pending`, mellomgrå)** er den ventende delen av fremdriftsbaren: Trumf-kroner under 200 som ikke er overført ennå. Den skal se mindre «sikker» ut enn aksenten, og må kunne skilles fra den blå også uten farge (se etikett under baren).
- **Usikker (`uncertain` på `uncertain-soft`, gul-brun)** markerer felt KI-tolkningen er usikker på, og estimater med kjent usikkerhet. Bruker alltid tekst i tillegg til farge.
- **Feil (`danger`)** er forbeholdt sletting og valideringsfeil.

Unngå: rødt/grønt som eneste skille mellom to tilstander, gradienter og flere aksentfarger.

## Typography

Systemfonter (iOS/Android/Windows). Fire roller: `display` til hovedtallet, `title` til skjermtitler, `body` til innhold og `meta` til forklaringer og kilder. Alle tall bruker tabulære siffer og norsk formatering (mellomrom som tusenskille, komma som desimal: `90 000`, `13,5`). Skalering følger systemets tekststørrelse; ingenting kuttes ved størst innstilling.

## Layout & Spacing

Skala 4 / 8 / 12 / 16 / 24 / 32 px. Én kolonne, 16 px sidemarg. Kort stables vertikalt med 12–16 px mellom. Nedre fanelinje er alltid synlig, bortsett fra i registrerings- og onboardingflyter, der den erstattes av en fast knapp nederst. Alle trykkflater er minst 48 px høye. På bredere skjermer sentreres innholdet i en kolonne på maks 480 px. Ingen flerkolonnelayout i v1.

## Elevation & Depth

Flatt. Kort skilles fra bakgrunnen med tonen i `surface-raised` og en hårfin kant (`border-hairline`), ikke med skygge. Ark (bottom sheets) for bekreftelse og sletting har en lett skygge og dimmet bakgrunn; det er det eneste stedet dybde brukes.

## Shapes

`rounded/md` (14 px) på kort, knapper og ark. `rounded/sm` (8 px) på felt og markeringer. `rounded/full` bare på fremdriftsbar og avkrysningsbrytere. Konsekvent, mykt og rolig.

## Components

- **Hovedtall-kort (Hjem)** — `display` for «poeng nå», `meta` for «av 180 000». Under: fremdriftsbar og tempolinje.
- **Fremdriftsbar** — to segmenter: `transferredColor` (overført) og `pendingColor` (venter på Trumf-overføring), på `trackColor`. Segmentene har alltid tekstetikett under med tall, og sammenlagt tall til høyre. Fargen alene bærer aldri betydningen.
- **Mål-kort** — tittel (Poengmål, Companion Ticket, Fly Premium), én fremdriftslinje og én setning status. Companion Ticket viser utløpsdato.
- **Anbefalingskort** — to rader (ett per kort) med poeng per kilde. Det anbefalte kortet har `accent-soft` bakgrunn, aksentkant og teksten «Anbefalt».
- **Stablingsrad** — kilde (kort eller Trumf), poeng og kort forklaring; sum nederst i `title`.
- **Kjøpsrad** — butikk og dato i `body`/`meta`, beløp og kort i `meta`, poeng til høyre. Rader med estimerte tall har «ca.» foran.
- **Forslagsskjema (bekreft)** — ett felt per tolket verdi (beløp, butikk, kort, dato, Trippel-Trumf). Usikre felt bruker `field-uncertain` med forklaringstekst under.
- **Primærknapp** — fylt aksent, full bredde, fast nederst i flyter. **Sekundærknapp** — hvit med kant.
- **Varselbanner (i appen)** — `accent-soft` kort øverst på Hjem med tekst og én handling. Lukkbart.
- **Bunnark** — bekreft sletting, velg kort, velg butikk.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Vis «ca.» og forklaring der tallet er et estimat | Vis estimater som eksakte tall |
| Bruk tekst + form + farge for tilstand | Rødt/grønt eller farge alene som eneste signal |
| Én dempet blå aksent, sparsomt, på grå flater | Flere aksentfarger, mettet lysblå, gradienter, pynt |
| Norsk tallformat (`90 000`, `13,5`) | Engelsk tallformat |
| La «Anbefalt» være en tydelig merkelapp på ett kort | Skjule hvorfor kortet er anbefalt |
| Trykkflater ≥ 48 px | Små ikon-only-knapper |
| Tekstnavn på kort og butikker | Kortbilder, logoer og varemerkefarger |
