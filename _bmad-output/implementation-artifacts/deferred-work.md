- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-tema-og-navigasjonsskall.md`
  summary: Legg til komponenttest-infrastruktur (jsdom + @testing-library/react, utvid vitest sitt `include` til `.test.tsx`) og en regresjonstest som bekrefter at `NedreNavigasjon` setter `aria-current="page"` på nøyaktig den aktive fanen.
  evidence: Verifisert at ingen test i dag kan rendre React-komponenter — `vitest.config.ts` har `environment: 'node'` og `include: ['tests/**/*.test.ts']`, og `package.json` har ingen `@testing-library/react`/`jsdom`. En regresjon i aktiv-fane-logikken (f.eks. endret til `startsWith`) ville derfor ikke bli fanget av `npm test`/`lint`/`build`. Funnet uavhengig av to reviewere (blind-hunter og verification-gap).

- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-tema-og-navigasjonsskall.md`
  summary: Gi hver rute (`/for-kjop`, `/kjop`, `/meg`, og etter hvert Hjem) sin egen `metadata.title` i stedet for å dele rot-layoutens statiske tittel, så skjermleser-brukere hører at navigasjon faktisk skjedde.
  evidence: Verifisert at kun rot-layouten setter `metadata.title`; ingen av de fire rutene overstyrer den per side. Ikke krevd av Story 1.2s frosne akseptkriterier (de krever navn+tilstand på fanene, ikke dokumenttittel), derfor utsatt i stedet for å utvide omfanget midt i byggingen.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-3-opprette-konto-og-logge-inn-og-ut.md`
  summary: La `krevSesjon()` ta vare på hvilken side brukeren faktisk ba om (f.eks. via `?next=`), og send henne dit etter innlogging i stedet for alltid til Hjem.
  evidence: Reelt UX-tap for dype lenker (f.eks. å dele en lenke til `/meg`), men Story 1.3s frosne akseptkriterium sier eksplisitt "jeg kommer til Hjem" ved innlogging. Å bygge retur-til-forespurt-side nå ville gått forbi det frosne kriteriet uten å renegotiere intent. Funnet av blind-hunter.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-3-opprette-konto-og-logge-inn-og-ut.md`
  summary: Utvid automatisert testdekning for hele auth-flyten — sign-up/sign-in/sign-out og feilkode-til-feltmelding-mappingen i `logg-inn`/`opprett-konto` — utover den ene `krevSesjon()`-testen lagt til i denne runden.
  evidence: Reelt, men full dekning av disse flytene uten database/nettverk i tester (prosjektets AD-2/AR-11-konvensjon: `npm test` skal kjøre uten database/nettverk) er en større endring enn denne runden. Funnet av blind-hunter.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-3-opprette-konto-og-logge-inn-og-ut.md`
  summary: Automatisert test som beviser at `prisma/seed.ts` faktisk er idempotent (kjør `main()` to ganger mot en reell database og bekreft at andre kjøring ikke feiler).
  evidence: Selve koden er gjort idempotent i denne runden (atomisk `upsert`/fanget P2002), men å teste det automatisk krever databasetilkoblet testinfrastruktur prosjektet bevisst ikke har (AD-2/AR-11). Verifisert manuelt to ganger i stedet. Funnet av verification-gap-reviewer.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-3-opprette-konto-og-logge-inn-og-ut.md`
  summary: Vurder produksjonshåndtering av hemmeligheter (f.eks. `BETTER_AUTH_SECRET`) når publisering planlegges — i dag deler den samme "lokal standardverdi i docker-compose.yml"-mønsteret som `POSTGRES_PASSWORD`, uten varsel hvis standardverdien brukes i en produksjonslignende utrulling.
  evidence: Følger et allerede godkjent mønster fra Story 1.1 (AD-10), men produksjonshemmeligheter er eksplisitt utsatt arkitektur-bredt til publiseringsfasen ("avgjøres når kjernen kjører lokalt"). Funnet av blind-hunter.
