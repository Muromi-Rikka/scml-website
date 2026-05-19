# scml-website

Official documentation site for the **SugarCube-2 Mod Loading Framework** ([ModLoader](https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader)). Built with [Rspress](https://rspress.dev/) and published at [modloader.pages.dev](https://modloader.pages.dev).

## Contents

The site covers:

| Section            | Path (locale root)                                              | Description                                                                                                                             |
| ------------------ | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **ModLoader (ML)** | `/ml/guide/`, `/ml/api/`, `/ml/creating-mods/`, `/ml/advanced/` | Loader lifecycle, APIs, authoring mods, advanced topics (e.g. encryption, CI/CD)                                                        |
| **MapleBirch**     | `/maplebirch/`                                                  | [Maplebirch framework](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework) docs for DOL mod development on top of ModLoader |
| **Contributors**   | `/contributors/`                                                | Contributor credits                                                                                                                     |

Documentation is **bilingual** (Simplified Chinese `zh` and English `en`), with per-locale navigation under [`docs/zh/_nav.json`](docs/zh/_nav.json) and [`docs/en/_nav.json`](docs/en/_nav.json).

## Tech stack

| Piece                             | Role                                                                                                  |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [Rspress 2](https://rspress.dev/) | Docs framework (React-based), `docs/` as content root                                                 |
| **React 19**                      | UI runtime                                                                                            |
| **Bun**                           | Recommended for `install` / `build` / `postinstall` scripts (see [`bun.lock`](bun.lock)); CI uses Bun |
| **oxlint** / **oxfmt**            | Lint and format                                                                                       |
| **elkjs**                         | ELK layout for Mermaid; copied into `docs/public/` before dev/build                                   |
| **beautiful-mermaid**             | Mermaid rendering in the custom plugin                                                                |

### Rspress plugins ([`rspress.config.ts`](rspress.config.ts))

- **[@rspress/plugin-llms](https://rspress.dev/plugin/official/llms)** — LLM-oriented UI (`llmsUI: true`)
- **[@rspress/plugin-sitemap](https://rspress.dev/plugin/official/sitemap)** — Sitemap, `siteUrl: https://modloader.pages.dev`
- **`plugin-mermaid`** ([`plugin-mermaid/`](plugin-mermaid/)) — Mermaid + beautiful-mermaid + ELK (light/dark themes, `transparent` option); uses `rspress-plugin-devkit` for code-block handling
- **[rspress-plugin-file-tree](https://www.npmjs.com/package/rspress-plugin-file-tree)** — File-tree navigation in docs
- **[rspress-plugin-reading-time](https://www.npmjs.com/package/rspress-plugin-reading-time)** — Reading time estimates

Theme options include last-updated time, edit links to this repo, and a GitHub link to the ModLoader upstream.

## Prerequisites

- **[Bun](https://bun.sh/)** (recommended; matches CI and `package.json` scripts)
- Alternatively **Node.js 18+** with your own runner for `rspress` if you do not use Bun (you must run the ELK copy step yourself; see [Scripts](#scripts))

## Setup

```bash
bun install
```

`postinstall` runs [`scripts/copy-elk.ts`](scripts/copy-elk.ts), which copies `elk.bundled.js` from `elkjs` into [`docs/public/`](docs/public/) for Mermaid layout. `dev` and `build` run the same copy step again so local builds stay in sync.

## Scripts

| Command                             | Description                                                     |
| ----------------------------------- | --------------------------------------------------------------- |
| `bun run dev`                       | Copy ELK assets, then start Rspress dev server                  |
| `bun run build`                     | Copy ELK, then production build to **`doc_build/`**             |
| `bun run preview`                   | Preview the **`doc_build/`** output locally (`rspress preview`) |
| `bun run update-elk`                | Only run the ELK copy script                                    |
| `bun run lint` / `bun run lint:fix` | [oxlint](https://github.com/oxc-project/oxlint)                 |
| `bun run fmt` / `bun run fmt:check` | [oxfmt](https://github.com/oxc-project/oxfmt)                   |

Equivalent: `npm run <script>` if dependencies are installed with npm and `rspress`/ox tools are on `PATH`.

## Project structure

```
.
├── docs/                      # Rspress content root
│   ├── zh/                    # Simplified Chinese pages + _nav.json
│   ├── en/                    # English pages + _nav.json
│   └── public/                # Static assets (logo, elk.bundled.js, …)
├── plugin-mermaid/            # Custom Mermaid + ELK Rspress plugin
│   ├── index.ts
│   ├── MermaidRender.tsx
│   └── elk-shim.js
├── scripts/
│   └── copy-elk.ts            # Copies elkjs bundle into docs/public
├── rspress.config.ts          # Locales, plugins, theme, sitemap URL
├── bun.lock
└── package.json
```

## Authoring

- Add or edit Markdown / MDX under **`docs/zh/`** or **`docs/en/`**, and update the matching **`_nav.json`** when adding new top-level sections.
- **Mermaid:** fenced blocks with language `mermaid`.
- **Edit on GitHub:** configured in `themeConfig.editLink` →  
  `https://github.com/Muromi-Rikka/scml-website/tree/master/docs`

## Deployment

GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) deploys **`doc_build/`** to **Cloudflare Pages**:

| Item         | Value                                                                    |
| ------------ | ------------------------------------------------------------------------ |
| **Triggers** | `workflow_dispatch`, push of tags matching `v*`                          |
| **Runner**   | `ubuntu-latest`                                                          |
| **Install**  | `bun install --frozen-lockfile` with cache on `~/.bun/install/cache`     |
| **Build**    | `bun run build` (`NODE_ENV=production`, `CI=true`)                       |
| **Publish**  | `wrangler pages deploy doc_build --project-name=modloader --branch main` |

**Secrets:** `CLOUDFLARE_API_TOKEN`, `ACCOUNT_ID`.

Concurrency cancels an in-flight deploy for the same ref when a newer run starts.

## Contributing

1. Fork and branch from [`Muromi-Rikka/scml-website`](https://github.com/Muromi-Rikka/scml-website).
2. Change docs in **`docs/zh/`** and/or **`docs/en/`** (keep locales aligned when possible).
3. Run `bun run build` (and `bun run lint` / `bun run fmt:check` if you touch TS/JS).
4. Open a pull request.

Upstream ModLoader code: [Lyoko-Jeremie/sugarcube-2-ModLoader](https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader).

## License

See this repository and the ModLoader project for license terms.
