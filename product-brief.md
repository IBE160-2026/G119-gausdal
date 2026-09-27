# Product Brief: EuroBonus Poeng-stacker

## Hva

EuroBonus Poeng-stacker er en applikasjon som hjelper SAS EuroBonus-medlemmer med å holde oversikt over og maksimere poengopptjening på tvers av flere, ofte overlappende kilder samtidig: dagligvarehandel via Trumf (automatisk overføring til EuroBonus), betalingskort (SAS-tilknyttede kort med ulik poengverdi og -type — American Express og SAS EuroBonus Mastercard gir både bonuspoeng og nivåpoeng, mens Lunar sitt SAS-tilknyttede debetkort kun gir bonuspoeng — 8 poeng per 100 kr på alle kjøp, uten krav om kredittvurdering, men lett å overse siden folk ikke forventer at et debetkort gir lojalitetspoeng), EuroBonus-partnerbutikker (f.eks. Rituals), hvor poeng registreres automatisk via det tilknyttede kortet — ofte til en betydelig høyere sats enn kortets normale opptjening (brukererfaring: 65 bonuspoeng på et kjøp på 129 kr, altså rundt 50 poeng per 100 kr), regningsbetalingstjenester (BillKill/Betalo), flyreiser, og SAS' miljøprogram **ChangeMakers** (opptil 5000 nivåpoeng årlig ved å fullføre 10 steg).

Appen skiller mellom to separate poengtyper som i dag lett forveksles:
- **Bonuspoeng** — brukes til å løse inn premier (flyreiser, hotell, oppgraderinger)
- **Nivåpoeng** — brukes til å oppnå og beholde medlemsnivå (Basic → Silver → Gold → Diamond)

Kjernefunksjonaliteten er en KI-drevet innlesing: brukeren beskriver et kjøp i fritekst (f.eks. "Handlet for 450 kr på Kiwi, betalte med SAS American Express") eller laster opp et bilde av en kvittering, og en språkmodell tolker dette og fyller ut beregningen automatisk — i stedet for at brukeren må taste inn hvert felt manuelt i et skjema. Ved kvitteringstolkning skal KI-agenten også gjenkjenne hvilket kortnettverk som er brukt (Mastercard, American Express eller Visa) direkte fra kvitteringen, siden dette avgjør hvilke poengsatser som gjelder.

Appen er bygget rundt at mange bevisst **"dobbeldipper" eller "trippeldipper"** — altså kombinerer flere lojalitetsprogrammer på ett og samme kjøp (f.eks. Trumf-overføring *og* kortpoeng *og* eventuelt en regningsbetalingstjeneste samtidig). Å synliggjøre denne stablingen tydelig er selve kjerneverdien i appen, fremfor bare å vise ett tall.

I tillegg til bonuspoeng og nivåpoeng finnes en tredje belønningstype: **terskelbaserte fordeler**, som låses opp ved et gitt årlig kortforbruk fremfor akkumulerte poeng — f.eks. American Express' **Companion Ticket** (2-for-1-billett ved 100 000–300 000 kr årlig forbruk, avhengig av kortnivå) og Mastercard Premiums **FlyPremium** (oppgradering til Premium/Business på bonusreiser). Appen bør vise fremgang mot disse tersklene også.

I tillegg til å beregne opptjente poeng, inneholder appen en **nivåpoeng-veiviser**: basert på hvilke betalingskort brukeren faktisk har tilgang til (ikke alle kvalifiserer for f.eks. American Express Elite), foreslår appen den enkleste veien til ønsket medlemsnivå — enten det innebærer å endre betalingsvaner med eksisterende kort, eller å vurdere et nytt kort brukeren kan søke på.

## Hvorfor

**Ren sporing er ikke nytt, og heller ikke ren informasjon.** SAS-appen viser allerede bonuspoeng og nivåpoeng fordelt på kilde, American Express-appen viser fremgang mot Companion Ticket, og grundige community-ressurser som eurobonusguiden.no dokumenterer reglene i detalj. Men ingen av disse løser det egentlige problemet: brukeren må fortsatt selv *lese* seg opp, *forstå* reglene, og *regne ut* summen manuelt på tvers av kilder. Skulle EuroBonus Poeng-stacker bare gjenskape informasjonen som allerede finnes, ville den ikke ha noen grunn til å eksistere — verdien ligger i at appen gjør utregningen for deg, ikke i at den samler enda mer å lese.

Det disse appene *ikke* gjør, er å snakke sammen. Brukeren må selv sjekke 2–3 apper, huske ulike satser per korttype (f.eks. SAS American Express Elite gir 20 bonuspoeng + 6 nivåpoeng per 100 kr, mens standard SAS EuroBonus Mastercard gir 10 bonuspoeng og ingen nivåpoeng), og manuelt regne ut hvilken kombinasjon av butikk og betalingsmåte som faktisk lønner seg. Den reelle verdien i EuroBonus Poeng-stacker ligger derfor i to ting ingen enkeltapp tilbyr i dag:
1. **Aggregering** — alle kilder samlet ett sted, i stedet for manuell sammenstilling på tvers av apper
2. **Handlingsrettede anbefalinger** — konkrete forslag som "bruk kort X i butikk Y for flest poeng", noe ingen enkeltapp kan gi siden hver av dem kun kjenner sin egen del av bildet

Et konkret eksempel på hvorfor dette er vanskelig å se selv: EuroBonus' kvalifiseringsperiode for medlemsnivå følger *ikke* kalenderåret, mens ChangeMakers-programmet nullstilles *ved* nyttår. Det betyr at man i praksis kan fullføre ChangeMakers sine 10 steg to ganger innenfor én og samme kvalifiseringsperiode (én gang før og én gang etter årsskiftet) og dermed tjene 10 000 nivåpoeng i stedet for 5 000 — noe som er nesten umulig å oppdage uten å aktivt sammenligne datoene i to forskjellige programmer. Dette er nøyaktig den typen anbefaling appen skal kunne gi automatisk.

Dette rammer særlig reisende som bruker SAS aktivt og ønsker å ta bevisste valg om hvor og hvordan de betaler, men som i dag taper potensielle poeng eller status fordi opptjeningsreglene er spredt over flere apper og vanskelige å holde i hodet samtidig.

## Hvem

Primær målgruppe: nordmenn med aktivt SAS EuroBonus-medlemskap som reiser jevnlig og/eller bevisst bruker SAS-tilknyttede betalingsløsninger (kort, Trumf) i hverdagen. Typisk bruker er interessert i å nå et konkret mål — enten en premiereise (bonuspoeng) eller neste medlemsnivå (nivåpoeng) — og ønsker verktøy for å ta informerte valg fremfor å regne manuelt.

## Hvordan

**Kjernefunksjoner (MVP):**
- Registrering av kjøp via fritekst eller kvitteringsbilde, tolket av en KI-modell
- Brukerprofil med hvilke betalingskort brukeren faktisk har (ikke alle kort er tilgjengelige for alle, f.eks. pga. inntektskrav eller årsavgift)
- Regelmotor som beregner bonuspoeng og nivåpoeng separat, basert på konfigurerbare satser per kilde (Trumf, kort-type, partnerbutikker, BillKill/Betalo, flyreise, ChangeMakers)
- ChangeMakers-sporing: registrerer fullførte steg og varsler bruker om mulighet til å fullføre programmet to ganger innenfor én kvalifiseringsperiode, siden nullstillingssyklusene ikke er synkronisert
- Lagring av kjøps-/reisehistorikk per bruker, med innlogging
- Fremgangsvisning mot et bonuspoeng-mål (f.eks. en drømmereise), mot neste medlemsnivå, og mot årlige forbrukterskler for Companion Ticket / FlyPremium
- Nivåpoeng-veiviser: foreslår enkleste vei til ønsket medlemsnivå basert på brukerens tilgjengelige kort og kjøpsmønster
- KI-genererte anbefalinger for hvilken betalingsmåte/butikk som gir mest poeng ved fremtidige kjøp

**Designprinsipp:** kompleksiteten skal ligge i regelmotoren, ikke i grensesnittet. Brukeren skal møte én samlet oversikt (status på tvers av alle kilder og alle tre belønningstyper) og én klar anbefaling — ikke et skjema med mange felter å forstå. Detaljene (satser, kilder, terskler) skal ligge bak, håndtert av KI-tolkning og regelmotor, ikke eksponeres som noe brukeren må sette seg inn i.

**Tekniske valg:**
- Satser lagres som konfigurerbare verdier (ikke hardkodet), siden kortutstedere og Trumf endrer vilkårene over tid
- Bygges med verktøykjeden fra kurset: Claude Code som utviklingsagent, database/autentisering via Supabase
- **Fullstack, kjørbar lokalt via Docker** — ingen krav om publisering. Leveres som kildekode + Dockerfile, i tråd med emnets innleveringskrav. Hosting til en gratis plattform (f.eks. Vercel/Netlify + en container-host) vurderes som en valgfri utvidelse, ikke en forutsetning for godkjenning

**Beslutningspunkter:**
- Regelmotor vs. KI-tolkning av fritekst/kvitteringer, og hvordan usikker KI-tolkning håndteres (bekreftelse fra bruker før lagring)
- Nivåpoeng-veiviseren bør kun foreslå kort brukeren faktisk har mulighet til å få, og kun kort som faktisk gir nivåpoeng — Lunar sitt SAS-tilknyttede kort gir f.eks. kun bonuspoeng og skal derfor aldri foreslås som vei til medlemsnivå, kun som lavterskel-alternativ (ingen kredittvurdering) i bonuspoeng-sammenheng
- Kvitteringer viser ikke alltid korttype tydelig (kan stå som avkortet kortnummer, logo, eller mangle helt) — KI-agenten må håndtere usikker gjenkjenning ved å spørre brukeren om bekreftelse fremfor å gjette feil kilde
- Terskler for Companion Ticket/FlyPremium varierer per korttype og kan endres av utsteder — lagres konfigurerbart, verifisert mot kredittkortguider 27.09.2026, bør reverifiseres mot American Express/Mastercard direkte
- Nøyaktige satser og regler for BillKill/Betalo, samt nivåpoeng-satser for American Express Classic/Premium, er ikke fullt verifisert og må bekreftes fra offisielle kilder før implementasjon — eurobonusguiden.no er en nyttig, detaljert kilde å ta utgangspunkt i her
- Nøyaktige start-/sluttdatoer for EuroBonus' kvalifiseringsperiode (som ikke følger kalenderåret) må verifiseres mot SAS' offisielle regelverk for at ChangeMakers-anbefalingen skal beregnes riktig
- EuroBonus-partnerbutikker (som Rituals) har individuelle poengsatser som kan være betydelig høyere enn kortets vanlige sats (opptil ~50 poeng per 100 kr observert), varierer fra butikk til butikk, og er lett å gå glipp av siden det ikke er tydelig i kassen — dette må modelleres som en per-butikk-oppslagstabell, ikke én fast verdi, og er et sterkt argument for KI-tolkning av kvittering/e-postbekreftelse fremfor manuell utregning
- Personvern og lagring av kjøpshistorikk (kryptering, lagringstid)
- Håndtering av API-nøkler (f.eks. til KI-modellen) er ikke avklart av faglærer ennå — avvent konkret løsning før dette bygges inn i Dockerfile/miljøvariabler
- Omfang for MVP: start med Trumf + de to mest brukte SAS-kortene, utvid til flere kilder i senere iterasjon

**Utenfor omfang (for nå):** direkte integrasjon mot bank-/kort-API-er for automatisk transaksjonsimport; støtte for andre flyselskapers lojalitetsprogrammer.
