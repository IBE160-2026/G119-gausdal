# Vedlegg: satser, regler og testtabell

Status per 2026-11-11. **Alle satser her må verifiseres mot offisielle kilder (SAS, American Express, Mastercard, Trumf; eurobonusguiden.no som utgangspunkt) før regelmotoren bygges.** Kolonnen «Verifisert» skal oppdateres med kilde og dato.

## Satser fra product brief

| Kilde | Bonuspoeng | Nivåpoeng | Verifisert |
|---|---|---|---|
| SAS Amex Elite | 20 per 100 kr | 6 per 100 kr (krediteres månedlig, ikke per kjøp) | Delvis: 20 per 100 kr stemmer i to kjøp (2026-11-17) |
| SAS EuroBonus Mastercard (standard) | 10 per 100 kr i NOK (15 i lokal valuta i utlandet, 20 på flybilletter på sas.no) | 0 | Delvis: stemmer med saseurobonusmastercard.no (skjermbilde 2026-11-17) |
| Lunar SAS-debetkort (senere) | 8 per 100 kr | 0 | Nei |
| Partnerbutikk, eksempel Rituals (senere) | ca. 50 per 100 kr observert (65 på 129 kr) | ukjent | Nei |
| Trumf → EuroBonus | 13,5 per Trumf-krone, overføres ved 200 opptjente Trumf-kroner (oppgitt av Anneli 2026-11-17). Trumf-bonus 1 % av kjøpet, 3 % på Trippel-Trumf-torsdag (trumf.no, skjermbilde 2026-11-17) | 0 (antatt) | Delvis: prosentene fra trumf.no, poengsats ikke |
| SAS Mastercard Premium | **15 per 100 kr på kjøp i norske kroner, 20 i lokal valuta i utlandet, 25 på flybilletter på sas.no** (saseurobonusmastercard.no, skjermbilde 2026-11-17; Anneli oppga først 25). Kolonnen er ikke merket i skjermbildet, Premium antas å være høyre kolonne | 25 % av månedens opptjente bonuspoeng på kortet (4800 → 1200), minimum 500 i måneder kortet brukes, ingen årlig grense. Beregnes **månedlig**, ikke per kjøp. | Delvis: nivåregelen fra SAS Mastercard-siden (skjermbilde 2026-11-17), bonussats ikke |
| SAS Amex Classic/Premium | ukjent | ukjent | Nei |
| BillKill/Betalo | ukjent | ukjent | Nei |
| ChangeMakers (senere) | – | opptil 5 000 per år (10 steg) | Delvis |

## Terskelbaserte fordeler (senere)

- Amex Companion Ticket (kilde: SAS/Amex «Vilkår for fordelene», september 2025, PDF fra Anneli 2026-11-17). Fordelen er **50 % poengrabatt for opptil to personer** på en bonusreise, ikke en streng 2-for-1. Reiser man alene, halveres prisen også (180 000 → 90 000 poeng).

  | Kort | Forbruk i kalenderåret | Gjelder |
  |---|---|---|
  | Amex Elite | 150 000 kr (første fordel), 300 000 kr (andre fordel) | Valgfri bonusreise med SAS eller SkyTeam |
  | Amex Premium | 150 000 kr | Bonusreise i økonomi/premium med SAS eller SkyTeam, én fordel per år |
  | Amex Classic | 100 000 kr | Europa, SAS Go/Economy og SAS Plus/Premium Economy, bare SAS, én fordel per år |

  Felles: maks to fordeler per år (Elite), gyldig inneværende og neste kalenderår og kan ikke forlenges. Bestilling må skje innen gyldighetsperioden, reisen kan gjennomføres etter. Skatter og avgifter kommer i tillegg. Gjelder ikke ordinære reiser betalt med penger eller poeng. Med forbehold om tilgjengelighet. Én fordel per bestilling. Kan ikke kombineres med andre rabatter. Dokumentet er fra september 2025 og kan være utdatert.
- Mastercard Premium FlyPremium: oppgradering på bonusreiser. Vilkår fra SAS (skjermbilde fra Anneli 2026-11-17):
  - Nivå/saldo bestemmes av **samlet opptjening av bonuspoeng de siste 12 månedene**.
  - Poeng overført fra familie og venner, nivåpoeng fra kortet, SAS/Scandic-veksling, kampanjer og goodwill-poeng teller **ikke**.
  - Nivået beregnes månedlig, siste dag i måneden. Et oppnådd nivå kan brukes til booking i 12 måneder, og forlenges for hver måned nivået holdes. Et høyere nivå gjelder automatisk 12 måneder frem.
  - Gjelder bare hvis det finnes ledige seter på SAS Premium Bonus/SAS Business Bonus på avgangen. Alle standard bonusreiser kan bookes som enkeltreise og tur/retur.
  - **Nivåer (saseurobonusmastercard.no, skjermbilde fra Anneli 2026-11-17, ikke verifisert):**

    | Poeng siste 12 måneder | Reis til/innenfor | Gjelder | Antall ganger |
    |---|---|---|---|
    | 0 | Innenriks/Skandinavia | Premium Economy/Business | 1 bonusreise tur/retur |
    | fra og med 75 000 | Europa | Business | Ubegrenset |
    | fra og med 125 000 | Verden | Premium Economy | Ubegrenset |
    | fra og med 200 000 | Verden | Premium Economy/Business | Ubegrenset |

    Siden sier «samlet poengsaldo i EuroBonus de siste 12 månedene», mens vilkårene sier «opptjening». Må avklares.

## Testtabell (regnet for hånd, skal kontrolleres av Anneli)

Kjøp er oppdiktede. «Forventet» er regnet ut for hånd fra satsene i dette vedlegget, ikke fra koden. Satsene er delvis verifisert (se øverst), så tabellen er `[VERIFISER]` til de er kontrollert mot offisielle kilder.

**Avrundingsregel (valgt 2026-11-24, `[VERIFISER]`):**
- Kortpoeng: beløp (i øre) × sats per 100 kr ÷ 10 000, deretter rundet **ned** til hele poeng. Regnes per kjøp og per kilde, ikke per 100 kr-blokk. Eksempel: 450 kr med Mastercard Premium gir 67 (67,5 rundet ned).
- Trumf: Trumf-bonus (1 % eller 3 % av beløpet) rundes ned til hele øre. Trumf-poeng = Trumf-kroner × 13,5, rundet **ned** til hele poeng.
- Butikker utenfor de ni Trumf-butikkene gir 0 Trumf-poeng, men kortpoeng regnes.
- Nivåpoeng er ikke med i v1 og er derfor ikke i tabellen.

| # | Kjøp | Kort | Forventet kortpoeng | Trumf-kroner | Forventet Trumf-poeng | Sum |
|---|---|---|---|---|---|---|
| 1 | 450 kr, KIWI, vanlig dag | Amex Elite | 90 | 4,50 | 60 | 150 |
| 2 | 450 kr, KIWI, vanlig dag | Mastercard Premium | 67 | 4,50 | 60 | 127 |
| 3 | 450 kr, KIWI, Trippel-Trumf-torsdag | Mastercard Premium | 67 | 13,50 | 182 | 249 |
| 4 | 99 kr, KIWI, vanlig dag | Amex Elite | 19 | 0,99 | 13 | 32 |
| 5 | 99 kr, KIWI, vanlig dag | Mastercard Premium | 14 | 0,99 | 13 | 27 |
| 6 | 99 kr, Rema 1000 (ikke Trumf) | Amex Elite | 19 | 0,00 | 0 | 19 |
| 7 | 1 000 kr, Coop Extra (ikke Trumf) | Mastercard Premium | 150 | 0,00 | 0 | 150 |
| 8 | 1 000 kr, MENY, vanlig dag | Amex Elite | 200 | 10,00 | 135 | 335 |
| 9 | 1 000 kr, MENY, Trippel-Trumf-torsdag | Mastercard Premium | 150 | 30,00 | 405 | 555 |
| 10 | 0 kr, KIWI (grensetilfelle) | Amex Elite | 0 | 0,00 | 0 | 0 |
| 11 | 1 kr, KIWI (grensetilfelle) | Amex Elite | 0 | 0,01 | 0 | 0 |
| 12 | 12 345,67 kr, SPAR (høyt beløp) | Mastercard Premium | 1851 | 123,45 | 1666 | 3517 |
| 13 | 250 kr, Joker, Trippel-Trumf-torsdag | Amex Elite | 50 | 7,50 | 101 | 151 |
| 14 | 575 kr, Jacob's, vanlig dag | Mastercard Premium | 86 | 5,75 | 77 | 163 |
| 15 | 5 000 kr, Gigaboks, vanlig dag | Amex Elite | 1000 | 50,00 | 675 | 1675 |

Rad 1–3 er eksemplene fra PRD (FR-13 og FR-14). Rad 4–5 viser avrunding, rad 6–7 butikker uten Trumf, rad 10–11 grensetilfeller, rad 12 høyt beløp.

## Akseptanse (oppgitt av Anneli 2026-11-17, ikke verifisert)

- American Express godtas i alle NorgesGruppen- og Coop-butikker. Andre steder er det ikke sikkert. Mastercard kan brukes der.

## Trumf (trumf.no, skjermbilde fra Anneli 2026-11-17)

- Grunnbonus: 1 % Trumf-bonus med fysisk eller digitalt Trumf-kort.
- Trippel-Trumf-torsdag: +2 %, totalt 3 %, når Trumf-kortet skannes før betaling.
- Ingen Trumf-bonus med digitalt Trumf-kort hos Esso.
- V1 begrenses til NorgesGruppen-butikker, selv om Trumf gir bonus i over 250 butikker.

**Utledede eksempler (ikke verifisert, avrunding avklares):** 100 kr gir 1 Trumf-krone, altså 13,5 EuroBonus-poeng. På Trippel-Trumf-torsdag gir 100 kr 3 Trumf-kroner, altså 40,5 poeng.

| Kjøp | Kort | Kortpoeng | Trumf-kroner | Trumf-poeng | Sum |
|---|---|---|---|---|---|
| 450 kr, Kiwi, vanlig dag | Mastercard Premium (15 per 100 kr) | 67,5 | 4,5 | 60,75 | 128,25 |
| 450 kr, Kiwi, vanlig dag | Amex Elite (20 per 100 kr) | 90 | 4,5 | 60,75 | 150,75 |
| 450 kr, Kiwi, Trippel-Trumf-torsdag | Mastercard Premium | 67,5 | 13,5 | 182,25 | 249,75 |

200 Trumf-kroner tilsvarer 2 700 EuroBonus-poeng per overføring, og nås ved 20 000 kr forbruk (6 667 kr på Trippel-Trumf-torsdager).

## Oppdatering 2026-11-17 (oppgitt av Anneli og trumf.no, ikke verifisert)

**Butikker med Trumf-bonus (trumf.no, skjermbilde):** MENY, KIWI, SPAR, Joker, CC Mat, Jacob's, Lerøy Mat, Nærbutikken, Gigaboks, Mester Grønn (ikke nettbutikk), Norli (ikke nettbutikk), Esso (kun fysisk Trumf-kort). V1 er avgrenset til dagligvarer/NorgesGruppen-butikker. Hvilke av disse som er med, avklares.

**Trippel-Trumf-torsdager:** er **alltid på torsdager** (trumf.no, skjermbilde 2026-11-24), men ikke hver torsdag (ca. hver 3.–4. uke). De annonseres på trumf.no, Facebook og via nyhetsbrev, SMS og push-varsel.

**Companion Ticket:** gjelder kalenderår. Billett opptjent i 2026 utløper 31.12.2027.

## SAS bonusreiser: poengpriser og regler (sas.no, skjermbilder fra Anneli 2026-11-17, ikke verifisert)

**Poengpriser for en enkeltreise med SAS, eksklusive skatter og avgifter, gyldig fra 1. desember 2025** (sas.no, «Poengtabeller & reisesoner»). Tur/retur koster dobbelt. Tabellen er avkortet i skjermbildet:

| Region | Economy Bonus | Premium Bonus | Business Bonus |
|---|---|---|---|
| Innenlands i Danmark, Norge og Sverige | 5 000 | 10 000 | – |
| Mellom Norden+ | 10 000 | – | 20 000 |
| Mellom Norden+ og Europa | 15 000 | – | 35 000 |
| Mellom Europa | 25 000 | – | 40 000 |
| Til/fra Asia og Nord-Amerika | 30 000 | 45 000 | 60 000 |

Poengprisen for tur/retur business med et SkyTeam-selskap er tradisjonelt 180 000 poeng, og SAS har egne priser (Anneli). **SAS kan endre poeng og prisregler når som helst**, så priser må være konfigurerbare data.

**Regler for bonusreiser:**
- Hele billetten betales i poeng, skatter og avgifter betales med kort. Poengprisene er fastsatt etter reisemål og reiseklasse.
- Bonusseter er begrenset og frigis opptil 330 dager før avgang.
- Barn 2–11 år betaler 50 % i poeng, barn under 2 år reiser uten poeng (skatt gjelder).
- Bonus- og vanlige billetter kan blandes i samme bestilling.
- Amex 2-for-1 og Mastercard Fly Premium gjelder, men kan bare brukes ved bestilling, ikke på reiser som allerede er bestilt.
- Mellomlandinger over 24 timer er bare tillatt på SAS-flyginger til/fra Asia eller Nord-Amerika (én vei hver).
- Kansellering/endring er mulig opptil 1 time før avgang (gebyr). Innenlands og Europa: NOK 250. Asia og Nord-Amerika: NOK 750.
- Det tjenes ikke EuroBonus-poeng eller kvalifiserende flyginger på bonusreiser.

## Kontroll mot Trumf-appen (skjermbilder fra Anneli 2026-11-17)

Butikknavn, datoer og kvitteringsnummer er utelatt med vilje (ingen ekte transaksjoner i repoet).

**Overføring til EuroBonus:** en automatisk overføring av **200,00 Trumf-kroner** ga **2 700 EuroBonus-poeng**. Det bekrefter 13,5 poeng per Trumf-krone og overføringsgrensen på 200.

**Trumf-bonus per kjøp (grunnbonus 1 %), åtte kjøp (fire i SPAR, resten blant annet KIWI):**

| Kjøp | Kjøpesum | 1 % av kjøpesum | Faktisk bonus | Avvik | Estimat rundet ned til øre | Estimat over faktisk? |
|---|---|---|---|---|---|---|
| A | 566,34 kr | 5,6634 | 5,68 kr | +0,017 | 5,66 | nei |
| B | 137,50 kr | 1,3750 | 1,33 kr | −0,045 | 1,37 | ja, +0,04 |
| C | 261,75 kr | 2,6175 | 2,62 kr | +0,003 | 2,61 | nei |
| D | 243,56 kr | 2,4356 | 2,40 kr | −0,036 | 2,43 | ja, +0,03 |
| E | 400,54 kr | 4,0054 | 4,01 kr | +0,005 | 4,00 | nei |
| F | 150,70 kr | 1,5070 | 1,51 kr | +0,003 | 1,50 | nei |
| G | 1 124,88 kr | 11,2488 | 11,27 kr | +0,021 | 11,24 | nei |
| H | 252,30 kr | 2,5230 | 2,53 kr | +0,007 | 2,52 | nei |
| **Sum** | 3 137,07 kr | 31,376 | **31,35 kr** | −0,026 (−0,08 %) | 31,33 | |

Bonusen er altså ikke alltid nøyaktig 1 % av kjøpesummen, og årsaken er ukjent (varer uten bonus, pant eller rabatter). Samlet er avviket bare −0,08 %, og enkeltavvikene (opptil 5 øre) tilsvarer under ett EuroBonus-poeng (13,5 poeng per Trumf-krone). **Beslutning (Anneli):** appen regner et estimat og **runder ned**, slik at den ikke overestimerer. Brukeren skal ikke måtte åpne Trumf-appen for å oppgi faktisk bonus.

**Kortpoeng:** hverken Mastercard-appen eller Amex-appen viser hvor mange poeng et enkelt kjøp gir (Anneli). Satsene kan ikke kontrolleres per kjøp der. Mulig vei: sammenlign månedens kortforbruk med krediteringen i EuroBonus-historikken.

## Kontroll mot EuroBonus-historikken (skjermbilder fra Anneli 2026-11-17)

Butikknavn og datoer er utelatt med vilje. Kortet er SAS American Express Elite (oppgitt av Anneli).

| Kjøp | 20 per 100 kr | Kreditert | Avvik |
|---|---|---|---|
| 901,10 kr | 180,22 | 180 bonuspoeng | −0,22 |
| 182,40 kr | 36,48 | 36 bonuspoeng | −0,48 |

- **Satsen 20 per 100 kr stemmer** i begge kjøp.
- **Poengene krediteres per kjøp**, omtrent to dager senere (oppføringen heter «Amex Norway Reward»), ikke som en månedlig sum.
- **Avrunding er uavklart:** begge brøkene er under 0,5, så «rund ned» og «nærmeste» gir samme svar. Trenger et kjøp der 0,2 × beløp har brøk på 0,5 eller mer.
- **Nivåpoeng er 0 per kjøp fordi de krediteres én gang i måneden** på begge kort (Anneli). Den månedlige oppføringen er ikke kontrollert mot 6 per 100 kr.
- Seks oppføringer totalt (81, 311, 149, 180, 36 og 1 008 bonuspoeng). De fire uten kjent kjøp kan ikke kontrolleres.

## Mastercard: kontrollkjøp (venter på kontroll av poeng)

Fem fakturerte kjøp fra Mastercard-appen (skjermbilde fra Anneli 2026-11-17, butikknavn utelatt), betalt med **SAS Mastercard Premium**. Kjøpene vises ikke i EuroBonus-appen (Anneli), så poengene kan ikke kontrolleres der. Forventet kreditering ved 15 per 100 kr:

| Kjøp | 15 per 100 kr | Rund ned | Nærmeste |
|---|---|---|---|
| 4 050,00 kr | 607,50 | 607 | 608 |
| 368,06 kr | 55,209 | 55 | 55 |
| 235,00 kr | 35,25 | 35 | 35 |
| 748,00 kr | 112,20 | 112 | 112 |
| 838,90 kr | 125,835 | 125 | 126 |

To av kjøpene (4 050,00 og 838,90 kr) skiller «rund ned» fra «nærmeste». Sum av fem kjøp: 6 240,96 kr, som gir ca. 936 poeng. Neste steg er å finne ut hvor Mastercard-poengene vises (Mastercards egen portal eller en månedlig sum). Noen kjøp kan være unntatt (for eksempel helsetjenester).

## Fly Premium: presisering (Anneli 2026-11-17)

Opptjeningen som teller for Fly Premium er **alle EuroBonus-poeng samlet de siste 12 månedene, uansett kilde** (kredittkortkjøp eller flyreiser). Vilkårene ekskluderer likevel poeng overført fra familie og venner, SAS/Scandic-veksling, kampanjer, goodwill-poeng og nivåpoeng. SAS-siden bruker ordet «poengsaldo», som trolig er upresist. Appen ser bare de registrerte kjøpene, så bruker må oppgi totalen fra EuroBonus selv.

«+» foran tersklene betyr «fra og med» (Anneli 2026-11-17): 75 000 poeng eller mer gir ubegrenset business i Europa.
