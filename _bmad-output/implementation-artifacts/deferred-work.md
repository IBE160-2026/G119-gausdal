- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-tema-og-navigasjonsskall.md`
  summary: Legg til komponenttest-infrastruktur (jsdom + @testing-library/react, utvid vitest sitt `include` til `.test.tsx`) og en regresjonstest som bekrefter at `NedreNavigasjon` setter `aria-current="page"` på nøyaktig den aktive fanen.
  evidence: Verifisert at ingen test i dag kan rendre React-komponenter — `vitest.config.ts` har `environment: 'node'` og `include: ['tests/**/*.test.ts']`, og `package.json` har ingen `@testing-library/react`/`jsdom`. En regresjon i aktiv-fane-logikken (f.eks. endret til `startsWith`) ville derfor ikke bli fanget av `npm test`/`lint`/`build`. Funnet uavhengig av to reviewere (blind-hunter og verification-gap).

- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-tema-og-navigasjonsskall.md`
  summary: Gi hver rute (`/for-kjop`, `/kjop`, `/meg`, og etter hvert Hjem) sin egen `metadata.title` i stedet for å dele rot-layoutens statiske tittel, så skjermleser-brukere hører at navigasjon faktisk skjedde.
  evidence: Verifisert at kun rot-layouten setter `metadata.title`; ingen av de fire rutene overstyrer den per side. Ikke krevd av Story 1.2s frosne akseptkriterier (de krever navn+tilstand på fanene, ikke dokumenttittel), derfor utsatt i stedet for å utvide omfanget midt i byggingen.
