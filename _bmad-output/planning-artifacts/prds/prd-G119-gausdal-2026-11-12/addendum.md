# Addendum: domenedetaljer til PRD

Oppgitt av Anneli (2026-11-17), **ikke verifisert mot SAS**. Skal kontrolleres før de brukes i krav eller regler.

## Petters mål (brukerreise UJ-1)

- Mål: long haul i business, innenfor SkyTeam-alliansen, ca. 180 000 EuroBonus-bonuspoeng.
- Selskaper som utelukkes som reisemål:
  - **Vietnam Airlines:** dobbel poengpris.
  - **China Eastern:** «ghost-billetter». De vises som alternative reiser, men kan ikke bookes.

## Petters kort og Trumf (UJ-1)

Oppgitt av Anneli (2026-11-17), **ikke verifisert**.

- Kort: American Express SAS Elite og SAS Mastercard **Premium** (briefen nevner standard SAS EuroBonus Mastercard; satsen for Premium mangler i vedlegget).
- Trumf brukes i NorgesGruppen-butikker.
- **Trumf-regel:** 13,5 EuroBonus-poeng per Trumf-krone. Ved automatisk overføring konverterer Trumf kronene til EuroBonus-poeng når man har opptjent 200 Trumf-kroner. Poeng kan altså være opptjent, men ikke overført ennå.

## Hvorfor Petter veksler mellom kortene

- **Korrigert 2026-11-17:** per 100 kr i norske kroner gir Amex Elite flest bonuspoeng (20 mot 15 for Mastercard Premium). Premium gir mer i utlandet (20 i lokal valuta) og på flybilletter på sas.no (25). Anneli oppga først 25 per 100 kr for Premium, som er sas.no-satsen.
- Amex godtas i alle NorgesGruppen- og Coop-butikker, men ikke nødvendigvis andre steder.
- Companion Ticket krever 150 000 kr forbruk på Amex. Forbruk på Amex lønner seg dermed både på poeng per krone og mot terskelen, der den godtas.
- Anbefalingen må altså veie poeng mot terskelmål og akseptanse, ikke bare velge høyeste sats.

## Tre ulike mål (presisert av Anneli 2026-11-17)

De tre målene er uavhengige og regnes ulikt:

| Mål | Hva måles | Periode | Brukes til |
|---|---|---|---|
| Poengmål | Saldo av bonuspoeng | Ingen frist | Bonusreise. Tur/retur business med et SkyTeam-selskap koster tradisjonelt 180 000 poeng (Petters mål). Har ingenting med Fly Premium å gjøre. |
| Fly Premium | Opptjening av bonuspoeng | Rullerende 12 måneder, beregnet månedlig | Bonusbilletter **bare med SAS**, ikke SkyTeam-partnere |
| Companion Ticket | Forbruk på Amex (150 000 kr) | Kalenderår | 2-for-1-billett. Utløper 31.12 året etter opptjening |

Fordi Fly Premium bare gjelder SAS-billetter, kan Companion Ticket være mer attraktivt enn Fly Premium for en reisende som vil bruke SkyTeam-partnere.

## Companion Ticket og poengpris (oppgitt av Anneli 2026-11-17, ikke verifisert)

- Companion Ticket er en 2-for-1-kupong: en medreisende kan tas med «gratis» i bookingen.
- Poengprisen per person halveres da, og en bonusreise koster 90 000 poeng i stedet for 180 000.
- Uavklart: formuleringen «reiser alene» (halveres prisen også da, eller bare når to reiser sammen?).

## Valg ved oppretting av konto: bare SAS, eller flere selskaper

Noen er fornøyd med bonusreiser kun med SAS, andre vil bruke flere SkyTeam-selskaper, som gir mer fleksibilitet i destinasjoner og datoer. Svaret avgjør om Fly Premium (bare SAS) er relevant.

## Companion Ticket: rettelse (kilde: SAS/Amex «Vilkår for fordelene», september 2025)

Fordelen er 50 % poengrabatt for opptil to personer, ikke en streng 2-for-1. Reiser Petter alene, halveres prisen også, så en bonusreise som normalt koster 180 000 poeng koster 90 000. Reiser to sammen, betaler de 180 000 til sammen i stedet for 360 000. Amex Elite har to nivåer: 150 000 kr og 300 000 kr forbruk i samme kalenderår. Detaljene står i `docs/vedlegg-satser.md`.

## Poengmål og delmål med Companion Ticket (Anneli 2026-11-17)

Petter setter poengmålet til 180 000 (full pris for tur/retur business med SkyTeam). Når saldoen når 90 000 og han har en gyldig Companion Ticket, holder det til en reise alene med 50 % rabatt, og appen varsler om det. SAS har egne poengpriser (se vedlegget), og de kan endres når som helst. Poengpriser per reisemål kan senere brukes til å foreslå mål.

## Companion Ticket i v1 (Anneli 2026-11-17)

Det kommer e-post når Companion Ticket er opptjent, og fremdriften er lett å se i Amex-appen. Siden kortet brukes flere steder enn de ni butikkene i v1, kan ikke appen vite totalt forbruk. Derfor merker bruker selv av at billetten er opptjent.

## Observasjon: SAS-priser mot SkyTeam

SAS-tabellen gjelder enkeltreise: 60 000 poeng i business til/fra Asia og Nord-Amerika, altså 120 000 tur/retur, mot 180 000 for SkyTeam. Tilgjengelighet og ruter avgjør hva som er mulig. Dette er et grunnlag for senere funksjon som foreslår poengmål ut fra reisemål.

## Føringer til arkitekturen (samlet under ferdigstilling 2026-11-17)

Dette er teknologi og hvordan, som ikke hører hjemme i PRD-en. Arkitekturen skal dekke kravene (FR og NFR) og kan peke tilbake til dem.

- **Lokal kjøring:** Docker, anbefalt av faglærer. Alt unntatt fritekst skal virke uten KI-nøkkel (NFR-1).
- **Publisering:** bare Vercel (faglærer). Appen må kunne bygges uten Docker. Vercel kjører ikke Docker-containere.
- **Database, innlogging og fillagring:** Supabase i produksjon, lokal PostgreSQL og storage-tjeneste i Docker lokalt.
- **Fillagring:** filer lagres i fillagring, aldri i databasen (NFR-5). Ikke i bruk i v1, men arkitekturen skal ha plass.
- **KI:** OpenRouter, godkjent av faglærer og betalt av Anneli. Modellnavn og nøkkel som miljøvariabler. Når nøkkelen mangler, faller appen tilbake til manuelt skjema (NFR-2).
- **Mock-fallback:** faglærers eksempelarkitektur (`.docs/planning-artifacts/architecture/technology.md`) bruker «zero-config»: hver ekstern tjeneste faller tilbake til faste svar uten nøkkel. Samme prinsipp passer her.
- **Dokumentmappe:** faglærer bruker `.docs/planning-artifacts/`, mens BMAD er satt opp med `_bmad-output/planning-artifacts/`. Bør samkjøres før arkitekturen.
- **Satser som data:** satser og regler er konfigurerbare data med kilde og dato (FR-15), fordi SAS, Trumf og kortutstederne endrer vilkår.

## Senere-idéer å ikke miste (fra briefen)

- **ChangeMakers:** kvalifiseringsperioden til EuroBonus følger ikke kalenderåret, mens ChangeMakers nullstilles ved nyttår. Man kan derfor fullføre de ti stegene to ganger i én kvalifiseringsperiode og få 10 000 i stedet for 5 000 nivåpoeng. Perioden må verifiseres mot SAS.
- **Lunar-kortet** gir bare bonuspoeng (8 per 100 kr) og skal aldri foreslås som vei til medlemsnivå, bare som lavterskel-alternativ uten kredittvurdering.
- **Partnerbutikker** (for eksempel Rituals) har egne satser, til dels mye høyere enn kortets. Må modelleres som oppslagstabell per butikk.
- **Nivåpoeng-veiviseren** skal bare foreslå kort brukeren faktisk kan få, og bare kort som gir nivåpoeng.

## Designprinsipper og skisser (til bmad-ux)

Fra det første håndskrevne PRD-utkastet (`docs/prd.md`, kap. 6, som står urørt med skisser av forside, nytt kjøp, bekreft tolkning og stabelvisning):

1. Én ting om gangen: registrering er ett felt, ikke et skjema med mange felter.
2. Vis stablingen: poeng alltid delt på kilde, aldri bare ett tall.
3. Bekreft før lagring: usikre felt markeres tydelig.
4. Alltid en vei uten KI (manuelt skjema).
5. Baren øverst er viktigst, og skiller overført fra ventende poeng.
