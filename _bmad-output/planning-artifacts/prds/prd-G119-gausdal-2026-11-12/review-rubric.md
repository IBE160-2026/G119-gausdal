# PRD Quality Review — EuroBonus Poeng-stacker

(Gjennomført av Claude som rubrikk-gjennomgang under ferdigstilling, 2026-11-17. Ingen separate reviewer-agenter ble brukt.)

## Overall verdict

PRD-en har en tydelig tese (raskeste vei til poeng, ikke bare sporing), én konkret brukerreise som driver kravene, og ærlig merking av alt som ikke er verifisert. Det som truet den, var manglende suksesskriterier, to kjerneverdier fra briefen og det eldre utkastet som ikke var blitt krav (poeng fordelt på kilde, kjøpshistorikk), og krav uten testbare konsekvenser. Alt dette er rettet i ferdigstillingen. Største gjenstående risiko er omfanget: 25 funksjonelle krav for én person.

## Decision-readiness — adequate

Avveiningene er navngitt: Amex Elite gir flere poeng enn Mastercard Premium (20 mot 15 per 100 kr) men godtas ikke overalt; Companion Ticket kan være mer attraktivt enn Fly Premium for den som vil bruke SkyTeam. Åpne punkter er reelt åpne. Valgene er tatt av Anneli og loggført i `.memlog.md`.

### Findings
- **medium** FR «Anbefalingen viser avveiningen» (FR-22 før renummerering) har ingen virkning i v1. Amex Elite gir flere poeng enn Premium i alle ni butikker, så det finnes ikke noe tilfelle der et kort gir færre poeng men nærmere et terskelmål. *Fix:* behold, men merk at kravet først får effekt med utenlandskjøp eller sas.no (Anneli avgjør om det skal flyttes til «Senere»).

## Substance over theater — strong

Én persona, ingen dekorative seksjoner, NFR-ene har produktspesifikke innhold (nedrunding, kjøring uten nøkkel, fillagring). Ingen innovasjons- eller visjonsteater.

## Strategic coherence — adequate

Tesen er tydelig og kravene følger av den. Mangel: ingen suksesskriterier og ingen motmål. *(Rettet: egen seksjon med fem kriterier og to motmål, hentet fra briefen.)* MVP-typen er problemløsende og logikken i omfanget henger sammen.

### Findings
- **high** Suksesskriterier manglet. *Fix:* lagt til (se PRD).
- **medium** Omfanget er stort for ett semester og én person (tilbakemeldingen advarte om det). *Fix:* ikke endret; listen over kandidater å kutte hvis tiden blir knapp: tempo/prognose, delmålsvarsel, Fly Premium-fremdrift.

## Done-ness clarity — thin → adequate etter rettelser

Flere krav var formulert uten testbar konsekvens (tempo, anbefaling, regelmotor). *Rettet:* arbeidseksempler på FR for regelmotor, Trumf og anbefaling, og et konkret tidsvindu for tempo (antatt, merket).

### Findings
- **high** Tempo/prognose hadde ingen definisjon av grunnlag. *Fix:* snitt over siste fire uker (antagelse).
- **high** Regelmotor og Trumf manglet eksempler. *Fix:* lagt til regnede eksempler.
- **medium** Fly Premium-fremdrift er ikke definert før SAS bekrefter om det er opptjening eller saldo. *Fix:* uavklart, merket som åpent punkt og `[VERIFISER]`.

## Scope honesty — adequate

«Utenfor omfang» og «Senere» er eksplisitte. `[ASSUMPTION]` er brukt, men manglet indeks. *(Rettet.)* Åpne punkter er mange, men nesten alle er verifiseringer, ikke beslutninger.

## Downstream usability — adequate etter rettelser

Manglet ordliste og to krav fra tidligere utkast. *Rettet:* ordliste, stabelvisning av poeng på kilde og kjøpshistorikk. ID-ene er sammenhengende FR-1 til FR-25 og NFR-1 til NFR-9.

## Shape fit — strong

Forbrukerprodukt med én brukerreise og navngitt hovedperson passer formen.

## Mechanical notes

- Ordliste og antakelsesindeks lagt til.
- Alle `[ASSUMPTION]`-merker i teksten finnes i indeksen.
- Brukerreisen har navngitt hovedperson (Petter).
- Kravet om at Trumf-poeng skiller mellom overført og ventende var merket som antagelse i FR-13, men er bestemt (baren skiller). Merket er fjernet.
