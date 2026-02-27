# Overview

`sugarcube-2-ModLoader` (hereinafter ModLoader) is a Mod loading and management framework for the [SugarCube2](https://www.motoslave.net/sugarcube/2/) interactive fiction engine. It was originally designed for [Degrees of Lewdity](https://gitgud.io/Vrelnir/degrees-of-lewdity) (DoL) as a complete solution for Mod loading and management, but it also works with any SugarCube2-based game.

## Core Features

### Multi-Source Mod Loading

Mods can be loaded from four sources, in this order:

| Order | Source Type      | Description                                                     |
| ----- | ---------------- | --------------------------------------------------------------- |
| 1     | **local**        | Mods embedded in the game HTML via the `insert2html` tool       |
| 2     | **remote**       | Remote Mods specified by `modList.json` on a web server         |
| 3     | **localStorage** | Mods side-loaded via browser localStorage (size limited)        |
| 4     | **IndexDB**      | Mods side-loaded via IndexedDB (main method for player uploads) |

If the same Mod name exists in multiple sources, the later-loaded source overrides the earlier one.

### Four-Stage Script Loading

ModLoader provides four script execution stages, allowing Mod authors to control game data at different points in the startup flow:

- **`inject_early`** — Injected into HTML as `<script>` immediately after the Mod loads; synchronous operations only
- **`earlyload`** — Runs after inject_early; supports async, can read unmodified raw data
- **`preload`** — Runs after all Mod data is merged into `tw-storydata`; can read the final merged data
- **`scriptFileList`** — Merged into `tw-storydata` as part of the game scripts

### Passage / Style / Script Merging

Mod content in `tweeFileList`, `styleFileList`, and `scriptFileList` is merged into the `tw-storydata` DOM node before SugarCube2 reads the data. This ensures the in-memory format after Mod installation matches directly editing the HTML.

### Inter-Mod Communication

- **AddonPlugin system**: Mods can register as Addon plugins; other Mods declare dependencies in `boot.json`'s `addonPlugin` field and interact
- **ModInfo.modRef**: Any Mod can expose its API via the `modRef` property; other Mods call `modUtils.getMod()` to obtain and use it

### Dependency Checking

Mods can declare version constraints on the following in `boot.json`'s `dependenceInfo` (see [Dependency Checking](./dependency-checking)):

- Other Mods (ordinary dependencies)
- ModLoader version
- Game version (e.g., DoL version)

Version numbers follow the [Semantic Versioning](https://semver.org/lang/en/) spec and are validated with [semver](https://www.npmjs.com/package/semver).

### Safe Mode

If ModLoader fails to load three times in a row, it enters safe mode on the next start and disables all Mods. Users can then open the Mod manager and remove the faulty Mod.

## Downloads

- Pre-built ModLoader: [ModLoader/actions](https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/actions)
- DoL build with ModLoader: [DoLModLoaderBuild](https://github.com/Lyoko-Jeremie/DoLModLoaderBuild/releases)

## Three Ways to Modify the Game

Based on an in-depth understanding of SugarCube2, ModLoader supports three modification approaches:

1. **Modify `tw-storydata`**: Change the game script node in HTML before SC2 compiles it, so the engine thinks the game was always like that. Implemented by Addons such as [TweeReplacer](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_TweeReplacer) and [ReplacePatch](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_ReplacePatch).

2. **Participate in compilation**: Hook into the SC2 Wikifier to intercept input and output. Implemented by [TweePrefixPostfixAddonMod](https://github.com/Lyoko-Jeremie/TweePrefixPostfixAddonMod).

3. **Modify rendered HTML**: Listen for SC2 passage render completion and modify HTML right after display.
