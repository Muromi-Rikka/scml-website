# Build System

This page gives an overview of ModLoader’s build flow. For Mod creation only, see [Packaging](../creating-mods/packaging). The content here targets ModLoader contributors and users building custom game bundles.

## Quick Navigation

- [Insert Tools](./insert-tools) — insert2html, packModZip, sc2ReplaceTool, sc2PatchTool usage, options, and examples
- [CI/CD Pipeline](./ci-cd) — GitHub Actions flow and per-repo build artifacts
- [Custom SC2 Engine](./sc2-engine) — Engine changes and how to replace it without full recompile

## Building ModLoader

```bash
yarn run webpack:BeforeSC2
yarn run ts:ForSC2
yarn run webpack:insertTools
```

Outputs:

- `dist-BeforeSC2/BeforeSC2.js` — ModLoader core
- `dist-insertTools/insert2html.js` — HTML injection tool
- `dist-insertTools/packModZip.js` — Mod packaging tool
- `dist-insertTools/sc2ReplaceTool.js` — SC2 engine replacement tool

See [Insert Tools](./insert-tools).

## Full Packing Overview

1. **Build modified SC2 engine** — Run `node build.js -d -u -b 2` in [sugarcube-2_Vrelnir](https://github.com/Lyoko-Jeremie/sugarcube-2_Vrelnir) to produce `format.js`
2. **Replace game engine** — Override `devTools/tweego/storyFormats/sugarcube-2/format.js` in the game project with `format.js`, or use [sc2ReplaceTool](./insert-tools) on compiled HTML
3. **Inject ModLoader** — Use [insert2html](./insert-tools#insert2htmljs) to inject ModLoader into the game HTML and embed Mods from `modList.json`
