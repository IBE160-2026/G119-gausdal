---
title: EuroBonus Poeng-stacker
status: final
created: 2026-11-12
updated: 2026-11-17
---

# PRD: EuroBonus Poeng-stacker

> `[ASSUMPTION]` = antatt, ikke bekreftet av Anneli. `[VERIFISER]` = tall eller regel oppgitt av Anneli eller hentet fra et skjermbilde, ikke kontrollert mot offisiell kilde. Domenedetaljer ligger i `addendum.md` og `docs/vedlegg-satser.md`.

## Sammendrag

EuroBonus Poeng-stacker hjelper SAS EuroBonus-medlemmer å finne **raskeste vei til poengmålet sitt**. Appen vet hvilke kort brukeren har, hvilke mål hen jager, og hvor hen står. Den sier hvilket kort og hvilken butikk som lønner seg *før* hen handler, og hvor lang tid det er til målet.

SAS-appen viser opptjening, men gir ikke råd om hvordan man tjener poeng raskest. Det er hullet appen fyller.

**Visjon.** På sikt kan appen vise alle programmene som påvirker reisene en bruker drømmer om, med flere kort, flere butikker, kvitteringsbilder og råd om hva som lønner seg før man betaler. V1 er bevisst smal: en regelmotor som stemmer, en enkel registrering og tydelige råd.

## Brukere

**Primærbruker:** nordmann med aktivt EuroBonus-medlemskap som bevisst velger betalingsmåte for å nå et konkret mål (en premiereise, eller et kortgodt som Companion Ticket eller Fly Premium). Kundegruppen antas å ha de dyreste versjonene av kredittkortene (SAS Amex Elite og SAS Mastercard Premium), fordi de gir mest opptjening per krone brukt.

## Ordliste

- **Bonuspoeng:** EuroBonus-poeng som brukes til bonusreiser. Appen regner bare bonuspoeng i v1.
- **Nivåpoeng:** poeng som avgjør medlemsnivå. Senere versjon.
- **Poengmål:** et antall bonuspoeng brukeren vil spare, for eksempel 180 000.
- **Trumf-krone:** Trumf-bonus i kroner. Hver Trumf-krone gir 13,5 EuroBonus-poeng.
- **Overført / ventende poeng:** Trumf overfører til EuroBonus når 200 Trumf-kroner er opptjent. Opptjente Trumf-kroner under 200 er ventende.
- **Trippel-Trumf-torsdag:** en torsdag med 3 % Trumf-bonus i stedet for 1 %. Trippel-Trumf-torsdager er alltid på torsdager, men ikke hver torsdag (ca. hver 3.–4. uke). De annonseres på trumf.no, Trumfs Facebookside og via nyhetsbrev, SMS og push-varsel i Trumf-appen.
- **Companion Ticket:** 50 % poengrabatt for opptil to personer på en bonusreise, opptjent ved forbruk på Amex i et kalenderår.
- **Fly Premium:** Mastercard-fordel som gir tilgang til å bestille bonusreiser i premium economy/business hos SAS, avhengig av alle EuroBonus-poeng opptjent siste 12 måneder, fra kort, kjøp og flyreiser.

## Brukerreise UJ-1: Petter sparer til business class

Petter er 27, reiser litt med SAS og vil samle ca. 180 000 bonuspoeng til en long haul-reise i business innenfor SkyTeam `[VERIFISER]`. Reisemål hos Vietnam Airlines (dobbel poengpris) og China Eastern («ghost-billetter») utelukkes. Han har SAS Mastercard Premium og American Express SAS Elite, og bruker Trumf i NorgesGruppen-butikker.

1. **Oppsett.** Når Petter oppretter bruker, velger han kortene sine og målene sine: antall poeng, og eventuelt Companion Ticket (Amex) eller Fly Premium (Mastercard). Han legger inn hvor han står i dag, og om Trumf er koblet til EuroBonus med automatisk overføring.
2. **Før et kjøp.** Petter skal handle og åpner appen. Appen anbefaler hvilket kort han bør bruke. I butikker der Amex godtas (alle NorgesGruppen- og Coop-butikker) gir Amex Elite flere poeng (20 mot 15 per 100 kr) og teller mot Companion Ticket. Ellers er Mastercard Premium det sikre valget.
3. **Etter kjøpet.** Petter registrerer kjøpet med noen ord («450 kr på Kiwi med Mastercard Premium») eller et skjema. Han krysser av hvis det er Trippel-Trumf-torsdag. Appen foreslår en tolkning med beløp, butikk, kort og dato, og regner ut Trumf-bonusen selv. Han bekrefter eller retter.
4. **Fremgang.** Baren øverst flytter seg. Appen viser ca. hvor mange poeng kjøpet ga, fordelt på kilde (kort og Trumf), og hva som gjenstår til målet.
5. **Tempo.** Appen viser når han når målet i dagens tempo, og hva han kan gjøre for å nå det raskere (se FR om tempo).

## Suksesskriterier

1. **SK-1** Regelmotoren gir riktig antall bonuspoeng for alle kjøp i testtabellen (10–15 kjøp), regnet for hånd og kontrollert mot offisielle kilder.
2. **SK-2** Fritekst tolkes riktig (beløp, butikk, kort, dato) i minst 8 av 10 testsetninger. Usikre felt markeres i stedet for å gjettes.
3. **SK-3** Ingenting lagres uten at brukeren har bekreftet.
4. **SK-4** Appen starter lokalt med `docker compose up`, med testbruker og eksempeldata, og alt unntatt fritekst virker uten KI-nøkkel.
5. **SK-5** Å endre en sats krever ingen kodeendring.

**Motmål:** appen viser aldri flere poeng enn brukeren har tjent. I testtabellen overstiger estimatet aldri forventet verdi med mer enn ett poeng per kjøp. `[ASSUMPTION: grensen på ett poeng]`

## Omfang (MVP)

**Med i v1**
- Oppretting av bruker med valg av kort og mål (poengmål, Companion Ticket, Fly Premium) og startverdier.
- Kort: SAS Mastercard Premium og American Express SAS Elite. Kilde: Trumf, begrenset til ni dagligvarebutikker: MENY, KIWI, SPAR, Joker, CC Mat, Jacob's, Lerøy Mat, Nærbutikken og Gigaboks (Trumf gir bonus i over 250 butikker, men v1 holdes enkelt).
- Registrering av kjøp med fritekst (KI-tolket, bekreftes av bruker) og manuelt skjema.
- Regelmotor for bonuspoeng per kilde, med konfigurerbare satser.
- Fremdriftsbar og fremdrift mot de valgte målene.
- Tempo og prognose mot målet.
- Varsel når saldoen når halvparten av poengmålet og en gyldig Companion Ticket gjør at det holder til en reise alene.
- Anbefaling før kjøp: hvilket kort (og Trumf) gir mest poeng, gitt valgte mål og hvor kortene godtas.

**Senere versjon**
- Poengpriser per reisemål (SAS og SkyTeam) som grunnlag for å foreslå poengmål.
- Kvitteringsbilde med automatisk lesing av kort og Trumf-kroner.
- Nivåpoeng, som krediteres én gang i måneden på begge kort (Mastercard Premium: 25 % av månedens bonuspoeng, minimum 500 i måneder kortet brukes) og nivåpoeng-veiviser.
- Flere kort (Lunar, andre), partnerbutikker, BillKill/Betalo, flyreiser, ChangeMakers.
- Trumf i flere butikker (Esso, Norli, Mester Grønn og andre) og råd om å vente til neste Trippel-Trumf-torsdag (krever at appen kjenner datoene).

**Utenfor omfang**
- Automatisk import fra bank eller kort. Andre flyselskapers lojalitetsprogrammer.

## Funksjonelle krav

### Oppsett og mål
- **FR-1** Bruker kan opprette konto, logge inn og ut.
- **FR-2** Bruker velger om hen har Amex Elite, Mastercard Premium eller begge. Beregning og anbefaling tilpasses valget: har bruker bare ett kort, regnes bare det kortet. Companion Ticket er bare relevant med Amex Elite, og Fly Premium bare med Mastercard Premium.
- **FR-3** Bruker velger ett eller flere mål: poengmål (saldo av bonuspoeng til en bonusreise, for eksempel 180 000 for tur/retur business med et SkyTeam-selskap), Companion Ticket (forbruk på Amex) og Fly Premium (rullerende 12 måneders opptjening).
- **FR-4** Bruker oppgir startverdier: bonuspoeng i dag, bonuspoeng opptjent siste 12 måneder (alle kilder, fra EuroBonus), forbruk på Amex hittil i kalenderåret, og Trumf-kroner opptjent siden siste overføring.
- **FR-5** Bruker oppgir om Trumf er koblet til EuroBonus med automatisk overføring.
- **FR-6** Bruker velger om hen bare vil bruke bonusreiser med SAS, eller også med andre SkyTeam-selskaper. Valget styrer hvilke mål som er relevante: Fly Premium gjelder bare SAS-billetter, mens poengmålet kan gjelde SkyTeam-partnere.

### Registrere kjøp
- **FR-7** Bruker kan registrere et kjøp med fritekst. KI tolker beløp, butikk, kort og dato.
- **FR-8** Bruker kan registrere et kjøp med manuelt skjema uten KI.
- **FR-9** Tolkningen vises som forslag, usikre felt markeres, og ingenting lagres før bruker har bekreftet.
- **FR-10** Bruker kan redigere og slette et kjøp. Poeng og fremdrift regnes på nytt.
- **FR-11** Bruker ser en liste over registrerte kjøp med beregnede poeng per kjøp.
- **FR-12** Ved registrering av et kjøp (fritekst og skjema) kan bruker krysse av for at det er Trippel-Trumf-torsdag. Uten avkryssing regner appen 1 % Trumf-bonus, med avkryssing 3 %.

### Poengberegning
- **FR-13** Regelmotoren beregner bonuspoeng per kilde og kjøp: Amex Elite 20 per 100 kr, og Mastercard Premium 15 per 100 kr på kjøp i norske kroner (20 i lokal valuta i utlandet og 25 på flybilletter på sas.no). I v1 gjelder bare kjøp i norske kroner i de ni butikkene. Eksempel: 450 kr gir 90 poeng med Amex Elite og 67 poeng med Mastercard Premium (67,5 rundet ned). `[VERIFISER: Amex 20 per 100 kr stemmer i to kontrollkjøp; Mastercard Premium ikke kontrollert; avrunding uavklart]`
- **FR-14** Appen beregner Trumf-bonus for kjøp i de ni dagligvarebutikkene i v1: 1 % av beløpet, og 3 % hvis bruker har krysset av for Trippel-Trumf-torsdag. Disse er alltid på torsdager, men kommer ikke hver torsdag (ca. hver 3.–4. uke). Hver Trumf-krone gir 13,5 EuroBonus-poeng, og poengene overføres når 200 Trumf-kroner er opptjent. Beregningen er et estimat, siden Trumf-appens faktiske bonus kan avvike noe fra 1 % av kjøpesummen. Estimatet rundes ned, så appen ikke overestimerer. Eksempel: 450 kr hos KIWI gir 4,50 Trumf-kroner, altså 60 poeng (60,75 rundet ned). På Trippel-Trumf-torsdag gir det 13,50 Trumf-kroner, altså 182 poeng (182,25 rundet ned). `[VERIFISER: 13,5 poeng per Trumf-krone og overføring ved 200 er bekreftet i Trumf-appen (200 kr ga 2 700 poeng); 1 % avviker noe i kontrollkjøp]`
- **FR-15** Satser og regler lagres som konfigurerbare data med kilde og dato for verifisering.
- **FR-16** Etter at et kjøp er lagret, viser appen poengene fordelt på kilde (kort og Trumf) med sum, slik at stablingen er synlig.

### Mål og fremdrift
- **FR-17** En bar øverst viser fremgang mot poengmålet. Baren skiller mellom poeng som er overført til EuroBonus og poeng som venter på Trumf-overføring (opptjente Trumf-kroner under 200).
- **FR-18** Har bruker et poengmål og en gyldig Companion Ticket, varsler appen i appen når saldoen når halvparten av målet (for eksempel 90 000 av 180 000), fordi det da holder til én reise alene med 50 % rabatt. `[ASSUMPTION: varselet krever at bruker har krysset av for opptjent Companion Ticket, og at den ikke er utløpt]`
- **FR-19** Companion Ticket (Amex Elite): bruker krysser av for at billetten er opptjent og oppgir når. Appen beregner ikke opptjeningen fra registrerte kjøp, siden kortet også brukes utenfor de ni butikkene. Appen viser utløpsdatoen: opptjent i 2026 gjelder til 31.12.2027, og fordelen kan ikke forlenges. Bruker kan oppdatere Amex-forbruket i kalenderåret (fra Amex-appen) mot 150 000 kr og 300 000 kr (maks to fordeler per år). `[VERIFISER: vilkår fra september 2025]`
- **FR-20** Fremgang mot Fly Premium: alle EuroBonus-poeng opptjent de siste 12 månedene, uansett om de kommer fra kort, kjøp eller flyreiser, mot nivåene fra og med 75 000 (Europa, business, ubegrenset), 125 000 (verden, premium economy) og 200 000 (verden, premium economy/business). Poeng overført fra andre, nivåpoeng, SAS/Scandic-veksling, kampanjer og goodwill teller ikke. Fly Premium gjelder bare bonusbilletter med SAS, ikke SkyTeam-partnere. Appen kjenner bare de registrerte kjøpene, så bruker oppgir totalen fra EuroBonus og oppdaterer den selv. `[VERIFISER]`
- **FR-21** Tempo: ut fra kjøpene de siste fire ukene viser appen når målet nås hvis tempoet fortsetter, og hva en endring i hvor bruker betaler ville gjort med tidspunktet. Uten kjøp de siste fire ukene vises ingen dato. `[ASSUMPTION: tidsvindu på fire uker]`

### Anbefaling
- **FR-22** Før et kjøp oppgir bruker butikk og beløp, og appen anbefaler kort og Trumf som gir flest poeng gitt aktive mål. Eksempel: 800 kr hos KIWI gir 160 poeng med Amex Elite og 120 med Mastercard Premium, begge pluss 108 Trumf-poeng (8 Trumf-kroner).
- **FR-23** Anbefalingen tar hensyn til akseptanse: Amex godtas i alle NorgesGruppen- og Coop-butikker, ellers anbefales Mastercard. `[VERIFISER]`
- **FR-24** Anbefalingen viser avveiningen når et kort gir færre poeng, men bringer bruker nærmere et terskelmål (Companion Ticket). `[NOTE FOR PM: beholdt etter Annelis vurdering, siden kortene har ulike fordeler. Har liten virkning i v1, siden Amex Elite gir flere poeng enn Mastercard Premium i alle ni butikker. Får effekt med utenlandskjøp eller sas.no.]`
- **FR-25** Anbefalingen beregnes av regelmotoren og virker uten KI.

## Ikke-funksjonelle krav

- **NFR-1** Appen starter lokalt med Docker, med testbruker og eksempeldata, og alle funksjoner unntatt fritekst virker uten KI-nøkkel.
- **NFR-2** Fritekstregistrering bruker OpenRouter (godkjent av faglærer). Når nøkkel mangler, faller appen tilbake til manuelt skjema.
- **NFR-3** Regelmotoren er testbar mot en tabell med forventede poeng (10–15 kjøp) som er regnet for hånd og kontrollert mot offisielle kilder.
- **NFR-4** Appen kan publiseres på Vercel.
- **NFR-5** Filer som lastes opp lagres i fillagring, ikke i databasen. Ikke i bruk i v1 (kvitteringsbilde er senere), men arkitekturen skal ha plass til det.
- **NFR-6** Test- og eksempeldata er oppdiktede. Ingen ekte kvitteringer, kortnummer eller nøkler i repoet.
- **NFR-7** Norsk grensesnitt.
- **NFR-8** Appen overestimerer ikke poeng. Der beregningen er usikker (Trumf-bonus, avrunding), rundes det ned, så brukeren ikke tror målet er nådd før det er det.
- **NFR-9** Kjøpshistorikk er privat for hver bruker og slettes når kontoen slettes. `[ASSUMPTION: ikke bekreftet av Anneli]`

## Åpne punkter

Ingen av disse hindrer UX og arkitektur. Alle er utsatt med eier og revurdering.

| Punkt | Eier | Revurderes |
|---|---|---|
| Verifiser alt merket `[VERIFISER]` mot SAS, American Express, Mastercard og Trumf (se `docs/verifiseringsliste.md`). Mastercard Premium-poeng vises ikke i EuroBonus-appen og må kontrolleres et annet sted. | Anneli | Før regelmotoren bygges |
| Skal appen kjenne flyselskapene (Vietnam Airlines, China Eastern)? V1 sier nei: poengmålet er et tall. | Anneli | Når «Poengpriser per reisemål» tas inn |

## Antakelser

1. Tempo regnes ut fra de siste fire ukene (FR om tempo).
2. Delmålsvarselet krever at bruker har krysset av for opptjent Companion Ticket, og at den ikke er utløpt (FR om delmålsvarsel).
3. Grensen i motmålet er ett poeng per kjøp (Suksesskriterier).
4. Kjøpshistorikken er privat og slettes med kontoen (NFR-9).
