# ModLoader Documentation Website

Documentation site for the **SugarCube-2 Mod Loading Framework** (ModLoader). Built with [Rspress](https://rspress.dev/) and deployed at [modloader.pages.dev](https://modloader.pages.dev).

## Overview

This repository hosts the official docs for:

- **ModLoader (ML)** — Mod loading and management for the SugarCube-2 interactive fiction engine (multi-source loading, script stages, dependency checking, addon plugins, etc.)
- **MapleBirch** — Related tooling and features documented alongside ModLoader

The site is **bilingual** (Simplified Chinese and English) and includes Mermaid diagrams, reading-time estimates, file-tree navigation, and optional LLM-assisted search.

## Tech Stack

- **[Rspress](https://rspress.dev/)** — Documentation framework (React-based)
- **React 19** — UI
- **TypeScript** — Config and custom plugins
- **Custom Mermaid plugin** — Renders Mermaid code blocks with [beautiful-mermaid](https://www.npmjs.com/package/beautiful-mermaid) and ELK layout; themes configurable per light/dark mode

## Prerequisites

- **Node.js** 18+ (or **Bun** for install/build; CI uses Bun)
- npm, yarn, pnpm, or bun

## Setup

Install dependencies:

```bash
npm install
```

For ELK-based Mermaid layout, the build copies `elk.bundled.js` from `elkjs` into `docs/public/` via `scripts/copy-elk.js` (runs automatically with `dev` and `build`).

## Scripts

| Command             | Description                                                       |
| ------------------- | ----------------------------------------------------------------- |
| `npm run dev`       | Start the dev server (copies ELK, then runs Rspress dev).         |
| `npm run build`     | Copy ELK and build the site for production. Output: `doc_build/`. |
| `npm run preview`   | Serve the production build locally.                               |
| `npm run lint`      | Run [oxlint](https://github.com/oxc-project/oxlint).              |
| `npm run lint:fix`  | Run oxlint with auto-fix.                                         |
| `npm run fmt`       | Format code with [oxfmt](https://github.com/oxc-project/oxfmt).   |
| `npm run fmt:check` | Check formatting only.                                            |

## Project Structure

```
.
├── docs/                 # Documentation source (Rspress root)
│   ├── en/               # English locale
│   ├── zh/               # Simplified Chinese locale
│   └── public/           # Static assets (e.g. elk.bundled.js, logo)
├── plugin-mermaid/       # Custom Rspress plugin for Mermaid + ELK
│   ├── index.ts          # Plugin entry and options
│   ├── MermaidRender.tsx # React component for rendering
│   └── elk-shim.js       # Shim for elkjs in the bundle
├── scripts/
│   └── copy-elk.js       # Copies elk.bundled.js to docs/public
├── rspress.config.ts     # Rspress config (locales, plugins, theme)
└── package.json
```

## Plugins (rspress.config.ts)

- **pluginLlms** — LLM-powered search/assistant UI
- **pluginSitemap** — Sitemap with `siteUrl: https://modloader.pages.dev`
- **plugin-mermaid** — Mermaid with beautiful-mermaid and ELK (light/dark themes, transparent option)
- **rspress-plugin-file-tree** — File tree navigation
- **rspress-plugin-reading-time** — Reading time for docs

## Deployment

The site is deployed to **Cloudflare Pages** via GitHub Actions (`.github/workflows/deploy.yml`):

- **Trigger:** Manual `workflow_dispatch`
- **Runtime:** Bun (install + build)
- **Deploy:** `doc_build` to Cloudflare Pages project `modloader`, branch `main`

Required secrets: `CLOUDFLARE_API_TOKEN`, `ACCOUNT_ID`.

## Contributing

- **Edit links** in the theme point to:  
  `https://github.com/Muromi-Rikka/scml-website/tree/master/docs`
- **ModLoader repo:**  
  [Lyoko-Jeremie/sugarcube-2-ModLoader](https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader)

Add or edit Markdown under `docs/en/` or `docs/zh/`, then open a PR. Use Mermaid in fenced code blocks with `mermaid` as the language for diagrams.

## License

See the repository and the ModLoader project for license information.
