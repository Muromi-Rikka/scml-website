# scml-website

Rspress-based documentation site for SugarCube-2 ModLoader (SCML).

## Commands

- **Dev server:** `bun run dev`
- **Build:** `bun run build`
- **Preview:** `bun run preview`
- **Lint:** `bun run lint` (oxlint)
- **Lint fix:** `bun run lint:fix`
- **Format:** `bun run fmt` (oxfmt)
- **Format check:** `bun run fmt:check`

## Stack

- Package manager: Bun
- Framework: Rspress 2.x + React 19
- Language: TypeScript (strict mode)
- Linter: oxlint
- Formatter: oxfmt
- Deployment: Cloudflare Workers (wrangler)
- Multi-language: zh (default) / en

## Project Structure

- `docs/` — Documentation source (zh/en locales)
- `docs/zh/` — Chinese documentation
- `docs/en/` — English documentation
- `plugin-mermaid/` — Custom Mermaid diagram plugin
- `scripts/` — Build scripts (copy-elk.ts)
- `doc_build/` — Build output
