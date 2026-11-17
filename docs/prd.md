# PRD: EuroBonus Poeng-stacker (v1)

| | |
|---|---|
| Versjon | 0.1 (utkast) |
| Dato | 2026-11-11 |
| Bygger på | [`product-brief.md`](../product-brief.md), [`docs/vedlegg-satser.md`](vedlegg-satser.md) |
| Status | Utkast til gjennomgang. Satser er ikke verifisert (se vedlegg). |

## 1. Mål

Gi et EuroBonus-medlem et riktig svar på «hva ga dette kjøpet meg?», fordelt på kilde og poengtype, uten at hen må åpne flere apper eller regne selv.

**Ikke-mål i v1:** fremgangsvisning mot mål/nivå, ChangeMakers, veiviser, kvitteringsbilder, KI-anbefalinger, flere enn to kort, partnerbutikker (se Scope i briefen).

## 2. Brukere og brukssituasjoner

**Primærbruker:** nordmann med EuroBonus som bevisst velger betalingsmåte.

| # | Situasjon | Behov |
|---|---|---|
| S1 | Har nettopp handlet og vil vite hva det ga | Skriv én setning, få poeng fordelt på kilde |
| S2 | Lurer på om kortet gir nivåpoeng eller bare bonuspoeng | Se de to typene tydelig atskilt |
| S3 | Vil se samlet status over tid | Oversikt og historikk |
| S4 | Sensor/annen utvikler skal kjøre appen uten egne nøkler | Manuelt skjema, testbruker, ingen LLM-nøkkel nødvendig |

## 3. Funksjonelle krav

Prioritet: **M** = må i v1.

| ID | Krav | Pri. | Akseptanse |
|---|---|---|---|
| F1 | Bruker kan registrere seg, logge inn og ut. | M | Uinnlogget bruker når ingen data. |
| F2 | Bruker velger hvilke av kortene (SAS Amex, SAS EuroBonus Mastercard) hen har, inkl. kortnivå der satsen avhenger av det. | M | Valg lagres og brukes i beregning. |
| F3 | Bruker kan legge inn kjøp via **manuelt skjema** (beløp, butikk, kort, dato, Trumf ja/nei). | M | Fungerer uten LLM-nøkkel. |
| F4 | Bruker kan legge inn kjøp via **fritekst**; KI (via OpenRouter) tolker til samme felt som F3. Modellnavn og API-nøkkel settes som miljøvariabler, ikke i kode. | M | ≥ 8 av 10 testsetninger tolkes riktig (SK2). |
| F5 | Tolkning vises som forslag; bruker bekrefter eller retter før lagring. Usikre felt markeres og gjettes ikke. | M | Ingen lagring uten bekreftelse (SK3). |
| F6 | Regelmotor beregner bonuspoeng og nivåpoeng **separat**, per kilde, for hvert kjøp. | M | Treffer testtabellen 100 %. |
| F7 | Satser leses fra konfigurerbare data (database/seed), ikke fra kode. | M | Endret sats gir endret beregning uten kodeendring. |
| F8 | Etter lagring vises en **stabelvisning** for kjøpet: kilde → bonus og nivå, med totaler. | M | Alle kilder og begge typer synlige. |
| F9 | Forside viser samlet sum bonuspoeng og nivåpoeng og kjøpshistorikk. | M | Summer stemmer med historikken. |
| F10 | Bruker kan slette og redigere et lagret kjøp; poeng beregnes på nytt. | M | Sum oppdateres. |

## 4. Ikke-funksjonelle krav

- **Kjørbarhet:** `docker compose up` starter appen med testbruker, kort og kjøp. `.env.example` uten ekte nøkler. README beskriver hvordan man setter inn egen LLM-nøkkel (valgfritt).
- **Korrekthet:** regelmotoren er ren funksjon uten KI, dekket av enhetstester som leses rett fra testtabellen.
- **Personvern:** test- og eksempeldata er oppdiktede; ingen ekte kvitteringer eller kortnummer i repoet. Nøkler holdes utenfor Git.
- **Feilhåndtering:** hvis KI ikke svarer eller mangler nøkkel, tilbyr appen manuelt skjema i stedet for å feile.
- **Fillagring:** opplastede filer (kvitteringsbilder og annet brukeren sender inn og som skal lagres) lagres i en egen fillagring (lokalt en storage-tjeneste i Docker, i produksjon Supabase Storage), **aldri i databasen**. Databasen lagrer bare en referanse (filsti, type, eier). Fillagringen skal være på plass i arkitekturen fra v1, selv om kvitteringsbilder først kommer senere.
- **Språk:** norsk grensesnitt.

## 5. Datamodell (skisse)

Bruker · Kort (type, nivå) · BrukerKort · Kilde (Trumf, kort) · Sats (kilde, poengtype, per-100-kr, gyldig fra/til) · Kjøp (beløp, butikk, dato, kort, Trumf) · Poengtransaksjon (kjøp, kilde, poengtype, antall) · Fil (eier, kjøp, filsti i fillagring, type, opprettet), der selve filen ligger i fillagringen og ikke i databasen.

Poengtransaksjon lagres per kilde og type slik at stabelvisningen kan vises uten å regne på nytt.

## 6. Design

### 6.1 Prinsipper

1. **Én ting om gangen.** Registrering er ett felt; ikke et skjema med ti.
2. **Vis stablingen.** Poeng alltid delt på kilde, aldri bare ett tall.
3. **To poengtyper, to visuelle identiteter** (farge/ikon) brukt konsekvent: bonuspoeng og nivåpoeng blandes aldri i samme sum.
4. **Bekreft før lagring.** Usikre felt er tydelig markert.
5. **Alltid en vei uten KI** (manuelt skjema).

### 6.2 Kjerneflyt

```
Forside ──► Nytt kjøp (fritekst) ──► Bekreft tolkning ──► Stabelvisning ──► Forside
                │                          │
                └── "Fyll ut selv" ────────┘ (manuelt skjema, samme bekreftelsessteg)
```

### 6.3 Skisser (lavoppløselige)

**Forside**
```
┌──────────────────────────────┐
│ EuroBonus Poeng-stacker      │
│ ┌──────────┐  ┌───────────┐  │
│ │ Bonus    │  │ Nivå      │  │
│ │ 12 450   │  │ 1 830     │  │
│ └──────────┘  └───────────┘  │
│ [ + Nytt kjøp ]              │
│ Siste kjøp                   │
│  Kiwi 450 kr      +90 / +27  │
│  Rema 99 kr       +…  / +…   │
└──────────────────────────────┘
```

**Nytt kjøp**
```
┌──────────────────────────────┐
│ Hva handlet du?              │
│ ┌──────────────────────────┐ │
│ │ Handlet for 450 kr på    │ │
│ │ Kiwi med SAS Amex        │ │
│ └──────────────────────────┘ │
│ [ Tolk ]      Fyll ut selv › │
└──────────────────────────────┘
```

**Bekreft tolkning** (usikre felt markert)
```
┌──────────────────────────────┐
│ Stemmer dette?               │
│ Beløp   450 kr               │
│ Butikk  Kiwi                 │
│ Kort    SAS Amex ⚠ bekreft   │
│ Dato    i dag                │
│ Trumf   Ja                   │
│ [ Lagre ]        [ Rett ]    │
└──────────────────────────────┘
```

**Stabelvisning**
```
┌──────────────────────────────┐
│ Kiwi · 450 kr                │
│              Bonus   Nivå    │
│ Trumf        +…       –      │
│ SAS Amex     +90     +27     │
│ ──────────────────────────── │
│ Totalt       +…      +27     │
└──────────────────────────────┘
```

### 6.4 Åpne designspørsmål

- Mobil først eller desktop først? (Anbefaling: mobil først, siden registrering skjer rett etter kjøp.)
- Navn og farger på de to poengtypene.
- Hvordan vises «ukjent sats» (f.eks. Trumf før den er verifisert) uten å villede?

## 7. Teknologi (til arkitekturdokumentet)

**KI-modell:** OpenRouter (godkjent av faglærer; gruppemedlemmet betaler selv). Modellen er en innstilling i miljøvariabel (`OPENROUTER_API_KEY`, modellnavn), slik at den kan byttes uten kodeendring. Nøkkelen ligger aldri i Git (`.env.example` uten ekte nøkkel; hos Vercel som Environment Variable). Uten nøkkel faller appen tilbake til det manuelle skjemaet (F3).

Foreløpig fra briefen: Supabase (database, innlogging og fillagring) og Docker (anbefalt av faglærer for lokal kjøring), LLM-API for fritekst. Valgene skal begrunnes i et eget arkitekturdokument, inkludert alternativ med lokal database for kjøring uten kontoer.

## 8. Risiko

| Risiko | Konsekvens | Tiltak |
|---|---|---|
| Satser feil/utdaterte | Appen gir feil svar | Verifiser mot offisielle kilder; konfigurerbare satser; testtabell |
| Avrundingsregler ukjente | Avvik på enkeltkjøp | Avklar og dokumenter i vedlegget før koding |
| Kostnad og nøkkel til OpenRouter | Sensor har ikke nøkkel; kostnad ved bruk | Manuelt skjema er fullverdig vei (F3); billig modell; kostnaden bæres av gruppemedlemmet (godkjent av faglærer) |
| For stort omfang | Ikke ferdig | Holde v1 til Trumf + 2 kort |

## 9. Neste steg

1. Verifiser satser og fyll ut testtabellen (10–15 kjøp).
2. Avklar BMAD og arkitekturdokument med faglærer.
3. Del opp F1–F10 i historier med akseptansekriterier.
4. Detaljer skjermbildene i 6.3 (verktøy etter ønske).
