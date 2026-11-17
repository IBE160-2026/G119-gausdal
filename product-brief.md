# Product Brief: EuroBonus Poeng-stacker

> Revidert 2026-11-11 etter tilbakemelding fra faglærer (2026-10-06). Strukturert etter malen. Detaljerte satser og regler ligger i [`docs/vedlegg-satser.md`](docs/vedlegg-satser.md). Kravene er videreført i [`docs/prd.md`](docs/prd.md).

## Sammendrag

EuroBonus Poeng-stacker regner ut hvor mange **bonuspoeng** og **nivåpoeng** et kjøp gir for et SAS EuroBonus-medlem, fordelt på kilde (Trumf, betalingskort, partnerbutikk, m.fl.). Brukeren beskriver kjøpet med vanlige ord, appen tolker det, og viser stablingen ("dobbel-/trippeldipping") tydelig: hvor mye kommer fra hva.

## Problemet

SAS EuroBonus-medlemmer som bevisst velger hvordan de betaler, må i dag sjekke 2–3 apper (SAS, American Express, Trumf), huske ulike satser per korttype og regne ut summen selv. Reglene er spredt og vanskelige å holde i hodet:

- Bonuspoeng (til premier) og nivåpoeng (til medlemsnivå) forveksles lett.
- SAS Amex Elite gir 20 bonuspoeng + 6 nivåpoeng per 100 kr, standard SAS EuroBonus Mastercard 10 bonuspoeng og ingen nivåpoeng. Lunar-debetkortet gir kun bonuspoeng og overses ofte fordi folk ikke venter lojalitetspoeng fra et debetkort.
- Partnerbutikker (f.eks. Rituals) kan gi mye høyere sats enn kortets vanlige, uten at det synes i kassen (observert: 65 bonuspoeng på 129 kr).
- **ChangeMakers-eksempelet:** EuroBonus' kvalifiseringsperiode følger ikke kalenderåret, mens ChangeMakers nullstilles ved nyttår. Man kan derfor fullføre de 10 stegene to ganger innenfor én kvalifiseringsperiode og få 10 000 i stedet for 5 000 nivåpoeng. Det er nesten umulig å oppdage uten å sammenligne datoer i to programmer.

Dette rammer reisende som bruker SAS aktivt og taper poeng eller status fordi opptjeningsreglene ikke snakker sammen.

## Løsningen (brukeropplevelsen)

1. Brukeren legger inn kort hen har (én gang).
2. Hen skriver et kjøp i fritekst, f.eks. «Handlet for 450 kr på Kiwi, betalte med SAS American Express».
3. Appen foreslår en tolkning (beløp, butikk, kort, dato). Brukeren bekrefter eller retter, og lagrer ikke før hen har bekreftet.
4. Appen viser **hva kjøpet ga**, delt på kilde og på poengtype: for eksempel Trumf X, kort Y, totalt Z bonuspoeng og W nivåpoeng.
5. Forsiden viser **samlet status**: bonuspoeng og nivåpoeng totalt, med kjøpshistorikk.

Designprinsipp: kompleksiteten ligger i regelmotoren, ikke i grensesnittet. Brukeren møter én samlet oversikt, ikke et skjema med mange felter. Registrering skal også virke **uten KI** (manuelt skjema), slik at appen kan kjøres av andre uten LLM-nøkkel.

## Hva gjør dette annerledes

SAS-appen, Amex-appen og eurobonusguiden.no finnes allerede. Ren sporing eller ren informasjon er ikke nytt. Verdien er det ingen av dem gjør:

1. **Aggregering:** alle kilder og begge poengtyper på ett kjøp, på ett sted.
2. **Utregning for brukeren:** appen leser reglene og regner, i stedet for at brukeren leser seg opp.
3. **Senere:** handlingsrettede anbefalinger («bruk kort X i butikk Y»), som ingen enkeltapp kan gi fordi hver kun kjenner sin del.

## Hvem dette er for

Nordmenn med aktivt SAS EuroBonus-medlemskap som reiser jevnlig og/eller bevisst bruker SAS-tilknyttede betalingsløsninger (kort, Trumf) i hverdagen. Typisk mål: en premiereise (bonuspoeng) eller neste medlemsnivå (nivåpoeng), og å ta informerte valg uten å regne manuelt.

## Suksesskriterier

Kriteriene kan testes. Forventede verdier regnes ut for hånd og kontrolleres mot offisielle kilder **før** regelmotoren bygges (se [`docs/vedlegg-satser.md`](docs/vedlegg-satser.md), testtabellen).

1. Regelmotoren gir riktig bonuspoeng og nivåpoeng, fordelt på kilde, for alle 10–15 kjøpene i testtabellen. Eksempel: 450 kr på Kiwi med SAS Amex Elite gir 90 bonuspoeng og 27 nivåpoeng fra kortet (20 og 6 per 100 kr, avrundingsregel avklares), pluss Trumf-poeng.
2. Fritekst som «450 kr Kiwi SAS Amex» gir riktig tolket kjøp i minst 8 av 10 testsetninger; usikre felt vises for bekreftelse i stedet for å gjettes.
3. Ingenting lagres uten at brukeren har bekreftet tolkningen.
4. Bonuspoeng og nivåpoeng vises og summeres alltid hver for seg.
5. Appen starter lokalt med `docker compose up` (eller tilsvarende), med testbruker, kort og kjøp ferdig lagt inn, og **registrering og beregning virker uten LLM-nøkkel**.
6. Satser ligger som konfigurerbare data, ikke i kode: å endre en sats krever ingen kodeendring.

## Scope

**Med i v1**
- Innlogging og brukerprofil med hvilke kort brukeren har.
- Kilder: **Trumf** + to kort: **SAS American Express** og **SAS EuroBonus Mastercard**.
- Registrering av kjøp via fritekst (KI-tolket, bekreftes av bruker) og via manuelt skjema (uten KI).
- Regelmotor med separate bonuspoeng og nivåpoeng, fordelt på kilde, med konfigurerbare satser.
- Samlet oversikt og kjøpshistorikk.

**Senere (rekkefølge ikke avgjort)**
- Fremgangsvisning mot bonuspoeng-mål, neste medlemsnivå og forbrukterskler (Companion Ticket, FlyPremium).
- ChangeMakers-sporing og varsel om dobbel fullføring.
- Lunar-kortet, partnerbutikker (per-butikk-oppslagstabell), BillKill/Betalo, flyreiser.
- Kvitteringsbilde med gjenkjenning av kortnettverk. Opplastede filer lagres i fillagring, ikke i databasen (fillagringen settes opp i arkitekturen fra start).
- Nivåpoeng-veiviser (kun kort brukeren faktisk kan få og som gir nivåpoeng).
- KI-genererte anbefalinger.

**Utenfor omfang**
- Direkte integrasjon mot bank-/kort-API-er for automatisk transaksjonsimport.
- Andre flyselskapers lojalitetsprogrammer.

## Visjon

På sikt kan appen bli et sted der man ser alle lojalitetsprogrammer som påvirker reisene sine, med flere kilder, flere programmer og anbefalinger som sier hva som lønner seg før man betaler. V1 er bevisst smal: en regelmotor som stemmer, og en registrering som er enkel.

## Åpne spørsmål (må avklares før de bygges)

- Nøyaktige satser og regler for Trumf-overføring, BillKill/Betalo og Amex Classic/Premium er ikke verifisert mot offisielle kilder.
- Start-/sluttdatoer for kvalifiseringsperioden må verifiseres mot SAS' regelverk (kreves for ChangeMakers-anbefalingen).
- Terskler for Companion Ticket/FlyPremium: verifisert mot kredittkortguider 27.09.2026, bør kontrolleres mot utsteder.
- KI-modell: OpenRouter er godkjent av faglærer, og gruppemedlemmet betaler selv. Nøkkelen holdes utenfor Git; v1 skal virke uten nøkkel (se suksesskriterium 5).
- Personvern for kjøpshistorikk (lagringstid, kryptering). Test- og eksempeldata skal være oppdiktede, aldri ekte kvitteringer.
