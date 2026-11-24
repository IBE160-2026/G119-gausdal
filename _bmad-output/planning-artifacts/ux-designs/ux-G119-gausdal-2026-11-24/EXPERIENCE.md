---
name: EuroBonus Poeng-stacker
status: final
sources:
  - _bmad-output/planning-artifacts/prds/prd-G119-gausdal-2026-11-12/prd.md
  - _bmad-output/planning-artifacts/prds/prd-G119-gausdal-2026-11-12/addendum.md
updated: 2026-11-24
---

# EuroBonus Poeng-stacker — Experience Spine

> Godkjent av Anneli 2026-11-24. Visuell identitet ligger i `DESIGN.md` (tokens refereres som `{path.til.token}`). Spinene vinner ved konflikt med eventuelle skisser.

## Foundation

Mobil først, enkelt tilgjengelig: en responsiv webapp som brukes med én hånd i butikken og på farten. Norsk grensesnitt (NFR-7). Lys og mørk modus følger systemet. UI-system (for eksempel shadcn/Tailwind) avgjøres i `bmad-architecture`; denne spinen spesifiserer bare atferd. Alle funksjoner unntatt fritekst virker uten KI-nøkkel (NFR-1, FR-25).

Primærprotagonist: **Petter**, 27, SAS Mastercard Premium + American Express SAS Elite, handler på Kiwi og Meny, sparer til ca. 180 000 bonuspoeng.

## Information Architecture

Nedre fanelinje med fire faner.

| Flate | Nås fra | Formål | Dekker |
|---|---|---|---|
| Logg inn / Opprett konto | Første åpning | Konto og innlogging | FR-1 |
| Oppsett (5 steg) | Etter opprettet konto; Meg → Endre oppsett | Kort, mål, startverdier, Trumf, SAS/SkyTeam | FR-2–6 |
| **Hjem** (fane) | Åpning | Hovedtall, fremdriftsbar, mål-kort, tempo, varsel, knapp «Registrer kjøp» | FR-17, 18, 21 |
| Mål-detalj | Trykk på mål-kort | Poengmål, Companion Ticket (utløp, Amex-forbruk), Fly Premium (nivåer, 12-mnd total) | FR-3, 19, 20 |
| **Før kjøp** (fane) | Fane; Hjem-snarvei | Skriv butikk og beløp, få anbefalt kort og Trumf | FR-22–25 |
| **Kjøp** (fane) | Fane | Liste over kjøp med poeng per kjøp, knapp «Registrer kjøp» | FR-11 |
| Registrer kjøp | Hjem eller Kjøp | Fritekst eller skjema | FR-7, 8, 12 |
| Bekreft forslag | Etter tolkning | Gå gjennom tolket forslag, rett, bekreft | FR-9 |
| Poengfordeling | Etter lagring | Stabling per kilde med sum | FR-16 |
| Kjøp-detalj | Trykk på kjøpsrad | Rediger og slett | FR-10 |
| **Meg** (fane) | Fane | Oppdater saldoer (poeng i dag, 12-mnd, Amex-forbruk, Trumf-kroner), endre oppsett, logg ut, slett konto | FR-1, 4, 5, NFR-9 |

Overflateavstemming: hvert FR har en flate; hver flate nås fra en journey under. Modaler (ark) er maks ett nivå dypt. Hjem er alltid startflaten for en innlogget bruker. Satser og regler har ingen egen flate i v1: de endres som data uten kodeendring (SK-5, FR-15).

## Voice and Tone

Mikrotekst, på norsk, kort og saklig. Du-form. Ingen utropstegn, ingen oppmuntring.

| Gjør | Ikke |
|---|---|
| «Du har 62 400 av 180 000 poeng.» | «Fantastisk! Du er på god vei!» |
| «ca. 60 poeng fra Trumf» | «60 poeng fra Trumf» (når det er et estimat) |
| «Vi er usikre på butikken. Sjekk den.» | «Feil ved tolkning» |
| «Ingen dato ennå: du har ikke registrert kjøp de siste fire ukene.» | Vise en gjettet dato |
| «Amex godtas ikke her, bruk Mastercard Premium.» | «Kortet avvist» |
| «Dette lagres ikke før du bekrefter.» | Autolagring uten beskjed |

## Component Patterns

Atferd. Visuelle spesifikasjoner ligger i `DESIGN.md.Components`.

| Komponent | Bruk | Atferdsregler |
|---|---|---|
| Hovedtall-kort | Hjem | Viser overførte poeng + ventende Trumf-poeng sammen som «poeng nå», og skiller dem i baren. Trykk åpner Mål-detalj. |
| Fremdriftsbar | Hjem, Mål-detalj | To segmenter (overført / venter) med tallforklaring under. Venter-segmentet er merket «venter på overføring (under 200 Trumf-kroner)». |
| Mål-kort | Hjem | Ett per valgt mål. Companion Ticket viser utløpsdato; Fly Premium viser nærmeste nivå. |
| Anbefalingskort | Før kjøp | Viser alltid begge kort (hvis bruker har begge) med poeng per kilde og sum. Anbefalt kort merkes «Anbefalt». Når et kort gir færre poeng, men er nærmere et terskelmål, vises avveiningen som én setning. |
| Fritekstfelt | Registrer kjøp | Ett felt, eksempeltekst: «450 kr på Kiwi med Mastercard Premium». Uten KI-nøkkel vises skjemaet direkte og fritekst skjules med forklaring. |
| Forslagsskjema | Bekreft forslag | Ett felt per verdi (beløp, butikk, kort, dato, Trippel-Trumf). Usikre felt merkes og forklares; bekreft-knappen er alltid tilgjengelig, men usikre felt må ses (se State Patterns). |
| Kjøpsrad | Kjøp | Trykk åpner Kjøp-detalj. Estimerte poeng har «ca.». |
| Bunnark | Slett, velg kort/butikk | Maks ett nivå. Lukkes med sveip ned eller «Avbryt». |
| Varselbanner | Hjem | Vises når saldo ≥ halvparten av poengmål og gyldig Companion Ticket er avkrysset. Kan lukkes og kommer ikke tilbake før saldo endrer seg. |

## State Patterns

| Tilstand | Flate | Behandling |
|---|---|---|
| Ny bruker uten kjøp | Hjem | Hovedtall fra startverdier. Tempo: «Ingen dato ennå: du har ikke registrert kjøp de siste fire ukene.» Knappen «Registrer første kjøp» er primær. |
| Ingen kjøp siste 4 uker | Hjem | Ingen tempodato vises (FR-21). |
| Ventende Trumf | Hjem | Segmentet «venter» vises med antall Trumf-kroner av 200. |
| Trumf ikke koblet | Hjem, Før kjøp | Trumf-poeng vises ikke i tempoet; Før kjøp viser bare kortpoeng. Lenke «Endre oppsett». |
| Bruker har ett kort | Før kjøp, Hjem | Bare det kortet vises og regnes. Companion Ticket-mål skjules uten Amex Elite; Fly Premium skjules uten Mastercard Premium (FR-2). |
| Fritekst tolket sikkert | Bekreft | Alle felt fylt. Bruker må likevel trykke Bekreft. |
| Fritekst delvis usikker | Bekreft | Usikre felt markert og tomme eller forhåndsvalgt «Velg…». Bekreft er deaktivert til usikre felt er sett (trykket eller endret). |
| KI utilgjengelig / nøkkel mangler | Registrer kjøp | Skjema vises. Beskjed: «Fritekst er ikke tilgjengelig akkurat nå. Fyll ut skjemaet.» Ingenting blokkeres. |
| Butikk utenfor de ni | Før kjøp, Registrer | «Denne butikken gir ikke Trumf-poeng i appen ennå.» Kortpoeng regnes fortsatt. |
| Kjøp i annen valuta | Registrer | Forklar at v1 bare regner kjøp i norske kroner. |
| Amex godtas ikke | Før kjøp | Anbefal Mastercard Premium og forklar hvorfor (FR-23). |
| Companion Ticket utløpt | Mål-detalj, Hjem | Mål-kortet merkes utløpt; varselet vises ikke. |
| Estimat | Alle tall med usikkerhet | «ca.» og kilde i `meta`. Rund ned (NFR-8). |
| Tomt/feil nettverk | Alle | Siste kjente tall vises; «Kan ikke hente nye data» i `meta`; lagring vises ikke som fullført før den er det. |

## Interaction Primitives

- Trykk for å handle. Sveip ned lukker ark. Ingen skjulte bevegelser.
- Kjøpsrader kan slettes fra Kjøp-detalj med bekreftelsesark. Ingen sveip-sletting i v1.
- Pull-to-refresh bare på Hjem og Kjøp.
- Tallfelt åpner talltastatur med komma som desimaltegn.
- Beløp og butikk i «Før kjøp» oppdaterer anbefalingen mens bruker skriver, uten egen «Beregn»-knapp.
- **Forbudt:** konfetti, streaks, push-varsler for å få bruker tilbake, popup-annonser, automatisk lagring av KI-tolkning.

## Accessibility Floor

Atferd. Visuell kontrast ligger i `DESIGN.md`.

- Skjermleser (VoiceOver/TalkBack): alle kontroller har rolle og tilstand. Fremdriftsbaren leser opp «62 400 av 180 000 poeng, 14 400 venter på overføring».
- Farge er aldri eneste signal: usikre felt har tekst og ikon, anbefalt kort har merkelapp.
- Tekst skalerer til systemets største størrelse uten avkutting.
- Trykkflater ≥ 48 px. Fokusrekkefølge følger lesing, både med tastatur og skjermleser.
- Reduser bevegelse: ingen animasjon på fremdriftsbaren når systeminnstillingen er på.
- Skjemafeil leses opp og knyttes til feltet.

## Responsive & Platform

Én kolonne på mobil. På nettbrett og desktop sentreres samme layout i maks 480 px bredde; ingen egen desktopopplevelse i v1. Nedre fane beholdes.

## Ærlighet om usikkerhet

Produktspesifikk regel. Appen skal aldri se sikrere ut enn den er (NFR-8, SK-2, SK-3).

- Tall der Trumf-bonus er estimert vises med «ca.» og rundes ned.
- Poeng fra bruker-oppgitte saldoer (Fly Premium-total, Amex-forbruk) vises med «oppgitt av deg, sist oppdatert [dato]».
- Verdier som ikke er verifisert mot offisiell kilde (se `docs/verifiseringsliste.md`) merkes ikke i grensesnittet i v1; de er et datakvalitetsmål, ikke en brukerhandling.
- Ingenting lagres før bruker har bekreftet.

## Key Flows

### Flow 1 — Før kjøp (Petter, tirsdag kveld, utenfor Kiwi med handlekurv)

1. Petter åpner appen. Hjem viser 62 400 av 180 000 poeng.
2. Han trykker fanen **Før kjøp** (eller snarveien på Hjem).
3. Han skriver «Kiwi» og «800».
4. Anbefalingskortet oppdateres: Amex Elite 160 poeng, Mastercard Premium 120 poeng, begge med ca. 108 Trumf-poeng.
5. Amex Elite er merket **Anbefalt** med teksten «Godtas i Kiwi».
6. **Climax:** Petter ser sum og forskjell side om side, og bruker Amex uten å tenke mer.

Variant: han skriver en butikk der Amex ikke godtas → kortet merkes «Godtas ikke her», Mastercard anbefales.

### Flow 2 — Registrere kjøp med fritekst (Petter, hjemme etter handelen)

1. Petter trykker **Registrer kjøp** på Hjem.
2. Han skriver «450 kr på Kiwi med Mastercard Premium».
3. Han trykker Tolk.
4. Forslaget vises: beløp 450, butikk Kiwi, kort Mastercard Premium. Datoen er usikker og markert gul: «Vi antok i dag. Sjekk den.»
5. Han krysser av Trippel-Trumf-dag (det var det) og retter datoen til i går.
6. Han trykker Bekreft.
7. **Climax:** Poengfordelingen vises: Mastercard Premium 67, Trumf ca. 182, sum ca. 249. Baren på Hjem har flyttet seg.

Feil: KI utilgjengelig → skjema vises i steg 2.

### Flow 3 — Første oppsett (Petter, nytt medlem)

1. Petter oppretter konto.
2. Han velger kort: begge.
3. Han velger mål: poengmål 180 000 og Companion Ticket. Han velger «også andre SkyTeam-selskaper».
4. Han oppgir startverdier: 31 000 poeng i dag, 48 000 siste 12 mnd, 82 000 kr Amex-forbruk, 40 Trumf-kroner.
5. Han svarer at Trumf er koblet til EuroBonus.
6. **Climax:** Hjem viser hovedtallet hans for første gang, med en fremdriftsbar og «Ingen dato ennå» til han har registrert kjøp.

### Flow 4 — Halvveis-varsel (Petter, noen måneder senere)

1. Petter åpner appen. Saldoen er 90 400 av 180 000.
2. Varselbanner øverst: «Du har halvparten. Med Companion Ticket (gyldig til 31.12.2027) holder det til en reise alene.»
3. Han trykker banneret og ser Mål-detalj for Companion Ticket.
4. **Climax:** Han ser at poengene rekker til én reise med 50 % rabatt, og at billetten utløper om 13 måneder.

### Flow 5 — Rette et kjøp (Petter, la inn feil beløp)

1. Petter trykker Kjøp og trykker kjøpsraden.
2. Han endrer 540 til 450 og trykker Lagre.
3. **Climax:** Poeng på raden og hovedtallet regnes på nytt, og raden viser nytt tall.
