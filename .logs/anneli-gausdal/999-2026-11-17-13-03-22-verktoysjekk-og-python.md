# Verktøysjekk og Python-installasjon

## 2026-11-17 kl. 13:03 — Anneli Gausdal

### Oppgave
Sjekke om Docker Desktop, Node.js, uv, Python 3.14.7, git, gh og Claude Code 2.1.326 er installert, og installere det som mangler.

### Plan
- Kjøre `--version` for hvert verktøy og sjekke `/Applications/Docker.app`.
- Installere manglende Python-versjon med uv.

### Resultat
- Installert fra før: Docker 29.8.0 (Docker Desktop), Node.js v26.10.0, uv 0.12.19, git 2.50.1, gh 2.103.3, Claude Code 2.1.326.
- Python 3.14.7 manglet (bare systemets 3.9.6). Installert med `uv python install 3.14.7` til `~/.local/share/uv/python/cpython-3.14-macos-aarch64-none/bin/python3.14`.

- PATH fikset med `uv python update-shell`: `~/.local/bin` lagt til i `~/.bash_profile` og `~/.bashrc` (ny fil); `~/.zshrc` hadde det fra før. Verifisert i nytt login-shell: `python3.14 --version` → Python 3.14.7.

### Åpne punkter
Ingen.
