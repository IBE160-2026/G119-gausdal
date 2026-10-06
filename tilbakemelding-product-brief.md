# Tilbakemelding på product brief

| | |
|---|---|
| **Gruppe** | G119 – G119-gausdal |
| **Product brief** | `product-brief.md` (commit `2505c46`) |
| **Tilbakemelding fra** | Faglærer i IBE160 (utarbeidet med KI-støtte) |
| **Dato** | 2026-10-06 |

## Samlet vurdering

- **Bør revideres før dere går videre.** Rett punktene markert «Endre» før dere lager PRD og arkitektur.

**Det som er bra:**

1. Dere har tydelig domenekunnskap, og problemet er konkret. Skillet mellom bonuspoeng, nivåpoeng og terskelbaserte fordeler, «trippeldipping» på tvers av Trumf, kort og partnerbutikker, og ChangeMakers-eksempelet (to fullføringer innenfor én kvalifiseringsperiode) viser en reell innsikt som ingen enkeltapp gir i dag.
2. Godt designprinsipp: «kompleksiteten skal ligge i regelmotoren, ikke i grensesnittet». Satser lagres konfigurerbart fordi vilkårene endrer seg, og KI-tolkning av kvitteringer skal bekreftes av brukeren før lagring.
3. Ærlig om usikkerhet. Dere skriver selv hvilke satser og datoer som ikke er verifisert (BillKill/Betalo, Amex Classic/Premium, kvalifiseringsperioden), og foreslår å starte med Trumf og de to mest brukte kortene.

**De viktigste endringene:**

1. **Briefen mangler suksesskriterier og en tydelig v1.** Det finnes ingen del som sier hvordan dere vet at appen virker. «Kjernefunksjoner (MVP)» har åtte punkter, mens «Omfang for MVP» under beslutningspunkter sier at dere skal starte med Trumf og to kort. Samle dette i én Scope-del med «Med i v1» og «Senere», og legg til suksesskriterier som kan testes, for eksempel «et kjøp på 450 kr på Kiwi med SAS Amex Elite gir X bonuspoeng og Y nivåpoeng, fordelt på kilde».
2. **Omfanget er for stort for én person.** V1 har KI-tolkning av fritekst *og* kvitteringsbilder, regelmotor for seks kilder, ChangeMakers-sporing, tre typer fremdriftsvisning, nivåpoeng-veiviser, KI-anbefalinger, innlogging og Docker. Regelmotoren med manuell eller fritekstbasert registrering er en god kjerne. Kvitteringsbilder, veiviser og KI-anbefalinger bør komme senere.
3. **Planlegg kjøring uten egne nøkler og kontoer.** Supabase og et LLM-API krever nøkler. Beskriv hvordan sensor kan kjøre appen lokalt, for eksempel med lokal database og testbruker, og med manuell registrering som virker uten LLM-nøkkel. Briefen sier at nøkkelhåndtering venter på faglærer. Vanlig praksis er `.env.example` uten ekte nøkler, og en tydelig beskrivelse i README av hvordan man setter inn sin egen.

## Vanskelighetsgrad og gjennomførbarhet

### Vurdert vanskelighetsgrad

- **Vanskelig**

**Sammenlignbart med:** 4) KI-støttet MRP II (vanskelig) i sin karakter. Det er ikke et produksjonssystem, men det har en regelmotor med mange satser som må stemme, flere moduler som avhenger av hverandre (registrering → beregning → fremdrift → veiviser → anbefaling) og KI-tolkning av ustrukturerte data. Avgrenset til regelmotor og registrering for Trumf og to kort ville det vært middels, på nivå med 2) AI CV- og søknadsassistent.

**Begrunnelse:**

| Faktor | Nivå (lav / middels / høy) | Kommentar |
|---|---|---|
| Domenelogikk – hvor mange og hvor kompliserte regler og beregninger må stemme? | høy | Satser per kort og kilde, separate bonus- og nivåpoeng, partnerbutikker med egne satser, terskler per kortnivå, ChangeMakers mot kvalifiseringsperiode og en veiviser som skal finne «enkleste vei». |
| Datamodell – antall entiteter og relasjoner mellom dem | høy | Bruker, kort, kilde, sats, partnerbutikk, kjøp, poengtransaksjon, terskel, ChangeMakers-steg, mål og kvalifiseringsperiode. |
| Brukere, roller og innlogging | middels | Én rolle med innlogging og lagret kjøpshistorikk via Supabase. |
| KI-funksjonalitet i appen, f.eks. kall til språkmodell, prompts i koden og håndtering av usikre svar | høy | Tolkning av fritekst, tolkning av kvitteringsbilder med gjenkjenning av kortnettverk, og KI-genererte anbefalinger. Usikker gjenkjenning skal håndteres med bekreftelse. |
| Integrasjoner og eksterne tjenester, f.eks. API-er, betaling og e-post | middels | Supabase og et LLM-API med bildestøtte. Bank-API-er er bevisst holdt utenfor. |
| Sanntid, samtidighet eller flere brukere som påvirker hverandre | lav | Ingen. |
| Filhåndtering, f.eks. opplasting, PDF-lesing og eksport | middels | Opplasting av kvitteringsbilder i varierende kvalitet. |
| Sikkerhet og personvern | middels | Kjøpshistorikk og kortinformasjon er personlige økonomiske data. Det er bra at kryptering og lagringstid er nevnt. Lagre aldri fulle kortnummer. |

**Hva vanskelighetsgraden betyr for dere:**

- _Vanskelig:_ Et vanskelig prosjekt gir større mulighet for toppkarakter, men også større risiko. Definer en minimal versjon som sikkert kan bli ferdig, og legg resten i tydelige trinn etterpå. For dere bør den minimale versjonen være regelmotoren med registrering for Trumf og de to vanligste kortene, med tester mot håndregnede eksempler.

### Gjennomførbarhet med BMAD og Claude Code

Dere skal planlegge med BMAD (product brief → PRD → arkitektur → epics og stories) og implementere med Claude Code. Vurderingen under tar hensyn til at det må være tid til hele denne flyten, og til testing, retting og README til slutt.

| Spørsmål | Vurdering (OK / risiko / stor risiko) | Kommentar |
|---|---|---|
| **Tid og omfang** – kan v1 realistisk bli ferdig og stabil i løpet av semesteret, med tid til flere iterasjoner? | stor risiko | Åtte kjernefunksjoner alene er for mye. Med regelmotor, registrering og fremdrift mot ett mål er det realistisk. |
| **BMAD-flyten** – er briefen konkret nok til at PRD, arkitektur og stories kan lages uten store hull, og blir det overkommelig mange stories? | risiko | Domenet er godt beskrevet, men briefen mangler suksesskriterier, en samlet Scope og visjon. Den følger ikke malens struktur. BMAD er ikke satt opp i repoet. |
| **Egnet for Claude Code** – bruker løsningen en vanlig, godt dokumentert teknologistakk som Claude Code håndterer godt, eller krever den nisjeteknologi, spesialmaskinvare eller mye manuell konfigurasjon? | OK | En fullstack-webapp med Supabase og et LLM-API er godt dokumentert. Docker er nyttig, men ikke nødvendig hvis README gir en enkel lokal oppstart. |
| **Kontroll på KI-ens arbeid** – kan gruppen selv avgjøre om koden gjør det riktige? Krever domenet kunnskap gruppen ikke har, f.eks. avanserte beregninger eller fagregler, så er det vanskelig å kvalitetssikre. | risiko | Dere har domenekunnskapen til å regne ut riktige svar for hånd. Risikoen er at satsene og reglene ikke er verifisert. Hvis grunnlaget er feil, tester dere mot feil fasit. |
| **Testbarhet** – finnes det tydelige regler og forventede resultater som tester kan skrives mot? | OK | Regelmotoren er svært godt egnet for automatiske tester: gitt kjøp, kort og kilde, forvent X bonus- og Y nivåpoeng. |
| **Kjørbar for sensor** – kan appen kjøres lokalt etter README, uten gruppens nøkler, betalte kontoer eller egen infrastruktur? | risiko | Supabase i skyen og LLM krever nøkler. Planlegg lokal database (Supabase kan kjøres lokalt), testbruker og manuell registrering uten LLM. |
| **Avhengigheter og kostnader** – krever løsningen betalte API-er, f.eks. språkmodeller, og finnes det en plan for kostnad, testmodus eller mock-data? | risiko | Bildetolkning av kvitteringer koster mer enn tekst. Lagre noen eksempelkvitteringer og forventede tolkninger som testdata. |

**Konklusjon om gjennomførbarhet:**

- **Gjennomførbart med justert omfang.** Se forslagene under.

**Forslag til justering av omfang eller vanskelighetsgrad:**

1. **V1:** innlogging, profil med brukerens kort, registrering av kjøp via skjema og KI-tolket fritekst (med bekreftelse), regelmotor for Trumf og to SAS-kort med separate bonus- og nivåpoeng, og fremdrift mot ett bonuspoengmål og neste medlemsnivå.
2. **Trinn 2 og 3:** partnerbutikker og ChangeMakers-sporing, deretter kvitteringsbilder, terskelfremdrift (Companion Ticket, FlyPremium), nivåpoeng-veiviser og KI-anbefalinger.

## Hvorfor product brief er viktig for mappen

Product brief er utgangspunktet for PRD, arkitektur, stories og til slutt koden. Del 1 av mappen vurderes blant annet på om sensor kan følge en sporbar vei fra plan til ferdig app. Den vurderes også på om appen gjør det dere har beskrevet, om den er testet, om den er godt designet, og om den kan kjøres etter README. Et uklart, for stort eller for lite brief gjør alt dette vanskeligere senere. Det er mye enklere å rette nå enn sent i semesteret.

## 1. Gjennomgang av briefens deler

| Del av brief | Status | Kommentar |
|---|---|---|
| Executive Summary – er det klart hva appen er, og hvilket problem den løser? | Juster | «Hva» forklarer appen, men er svært lang og detaljert. Start med to–tre setninger om hva appen gjør for brukeren, og flytt satser og eksempler til et vedlegg. |
| The Problem – er problemet konkret, med reelle situasjoner og brukere? | OK | «Hvorfor» er konkret og godt argumentert, med ChangeMakers-eksempelet som en sterk illustrasjon. |
| The Solution – beskriver løsningen brukeropplevelsen, ikke bare teknologi? | Juster | Designprinsippet er godt, men «Hvordan» blander funksjoner, teknologivalg (Supabase, Docker) og åpne beslutninger. Beskriv først hva brukeren opplever, og flytt teknologi til arkitekturen. |
| What Makes This Different – er vurderingen ærlig og realistisk? | OK | Ærlig om at SAS-appen, Amex-appen og eurobonusguiden.no finnes, og tydelig på at verdien er aggregering og handlingsrettede anbefalinger. |
| Who This Serves – er primærbrukerne tydelige, og vet vi hva de trenger? | OK | Tydelig primærbruker med et konkret mål (premiereise eller neste nivå). |
| Success Criteria – kan kriteriene faktisk sjekkes eller testes? | Endre | Mangler. Legg til funksjonelle kriterier med konkrete regneeksempler. |
| Scope – er det klart hva som er med i første versjon, og hva som ikke er det? | Endre | MVP-listen og «start med Trumf + to kort» motsier hverandre. Samle i én Scope-del med v1 og senere trinn. |
| Vision – henger visjonen sammen med resten uten å blåse opp omfanget? | Juster | Mangler. Noen setninger om hvor appen kan gå (flere kilder, andre lojalitetsprogrammer) gir retning uten å påvirke v1. |

## 2. Utgangspunkt for del 1 av mappen

Punktene følger kriteriene i sensorveiledningen for del 1. Vektene i parentes viser hvor mye hvert kriterium teller i del 1.

| Kriterium i del 1 | Hva briefen bør legge til rette for | Status | Kommentar |
|---|---|---|---|
| **1. Prosess og KI-styring** (30 %) | Brief som er presis nok til at PRD og stories kan bygges direkte på den, slik at krav kan spores fra brief til kode. | Juster | Domenet er beskrevet presist nok til gode krav. Strukturer briefen etter malen, sett opp BMAD og lag PRD. |
| **2. Funksjonalitet og omfang** (20 %) | Realistisk omfang for gruppen og semesteret: en tydelig kjerneflyt som kan bli ferdig og stabil, og nok innhold til å vise reell funksjonalitet. | Endre | For mange moduler i v1. Velg regelmotor og registrering som kjerne. |
| **3. Kvalitetssikring og testing** (15 %) | Suksesskriterier og funksjoner som er konkrete nok til å bli testtilfeller. | Endre | Regelmotoren er ideell for tester, men det finnes ingen suksesskriterier. Lag en tabell med 10–15 kjøp og forventede poeng, regnet ut for hånd og sjekket mot offisielle kilder. |
| **4. Design og brukeropplevelse** (10 %) | Tydelige brukere og brukssituasjoner som designet kan bygges rundt, gjerne med de viktigste skjermbildene eller flytene skissert. | OK | «Én samlet oversikt og én klar anbefaling» er et godt utgangspunkt. Skisser oversikten og registreringen. |
| **5. Kodekvalitet og arkitektur** (10 %) | Teknologivalg som er begrunnet og ikke mer komplekse enn appen trenger. | OK | Konfigurerbare satser er et godt, begrunnet arkitekturvalg. Supabase og Docker bør begrunnes i arkitekturdokumentet. |
| **6. README og kjørbarhet** (10 %) | Løsning som andre kan kjøre lokalt uten betalte kontoer, og uten tilgang til gruppens egne tjenester og nøkler. | Juster | Planlegg lokal oppstart, `.env.example`, testbruker med kort og kjøp, og at regelmotoren virker uten LLM. |
| **7. Ryddighet i repoet** (5 %) | En plan for hvor hemmeligheter, testdata og dokumentasjon skal ligge. | Juster | Bruk anonymiserte eller oppdiktede kvitteringer som testdata, aldri ekte kvitteringer med kortinformasjon. Hold nøkler utenfor Git. |

## 3. Neste steg for gruppen

1. Strukturer briefen etter malen (sammendrag, problem, løsning, differensiering, brukere, suksesskriterier, scope, visjon), og flytt detaljerte satser til et vedlegg.
2. Lag en tabell med testkjøp og forventede poeng, og verifiser satsene mot offisielle kilder før dere bygger regelmotoren.
3. Sett opp BMAD i repoet og lag PRD med v1 avgrenset til Trumf og to kort.

Oppdater product brief i repoet når dere har gjort endringene, slik at historikken viser hvordan planen utviklet seg. Det er en del av prosessen sensor ser etter.
