---
name: scml-mod-development
description: Create, configure, and debug SugarCube-2 ModLoader (SCML) mods. Use this skill whenever the user is building a mod for any SugarCube-2-based game using ModLoader — including writing boot.json manifests, choosing script loading stages (inject_early, earlyload, preload, scriptFileList), using the ModUtils API, setting up AddonPlugin dependencies, handling image replacement via HtmlTagSrcHook, using lifecycle hooks, packaging .mod.zip files, or troubleshooting mod loading issues. Also applies when the user mentions DoL mods, Degrees of Lewdity mods, SugarCube modding, twee passages for modloader, or mod packaging. This skill covers the full SCML ecosystem including Maplebirch framework integration.
---

# SCML Mod Development Skill

You are helping a developer build mods for SugarCube-2 ModLoader (SCML). SCML is a mod loading framework for SugarCube-2 interactive fiction games (primarily targeting Degrees of Lewdity but compatible with any SC2 game).

## Quick Context

SCML intercepts the SugarCube-2 startup sequence, loads mod content from multiple sources, merges it into game data, then allows SC2 to proceed. The startup flow is:

```
jQuery → ModLoader initialization → SugarCube2 engine start
```

Three global objects are available to mod scripts:

| Global                     | Purpose                                      |
| -------------------------- | -------------------------------------------- |
| `window.modSC2DataManager` | Central orchestrator holding all sub-systems |
| `window.modUtils`          | Public API for mod authors                   |
| `window.jsPreloader`       | Runs preload-stage scripts after data merge  |

## How to Help the User

### When the user wants to CREATE a new mod

1. **Determine what the mod does** — passages, scripts, CSS, images, or a combination
2. **Choose the right script stage(s)** — read `references/script-stages.md` if needed to pick the appropriate stage
3. **Generate the boot.json** — use `references/boot-json-reference.md` for field details; use `assets/boot-json-template.json` as a starting point
4. **Scaffold the mod directory** — create the standard structure:

```
MyMod/
├── boot.json
├── readme.txt
├── MyMod_style.css          (if CSS needed)
├── MyMod_script.js          (main scripts)
├── MyMod_passage.twee       (twee passages)
├── MyMod_Image/             (if images needed)
│   └── category/
│       └── image.png
└── scriptFileList_earlyload/ or scriptFileList_preload/  (if early stages needed)
```

5. **Write the content files** — twee passages, JS scripts, CSS
6. **Help with packaging** — explain manual zip or automated `packModZip.js`

### When the user needs to use an ADDON

1. Check `references/bundled-mods.md` for the right addon (ImageLoaderHook, TweeReplacer, ReplacePatch, etc.)
2. Add `addonPlugin` to boot.json:

```json
{
  "addonPlugin": [
    {
      "modName": "AddonModName",
      "addonName": "pluginName",
      "modVersion": "1.0.0",
      "params": []
    }
  ]
}
```

3. If the user is CREATING an addon, guide them to register during earlyload via `window.modAddonPluginManager.registerAddonPlugin()`

### When the user needs API help

Read `references/api-reference.md` for ModUtils, lifecycle hooks, and inter-mod communication patterns. Key APIs:

- `window.modUtils.getModListName()` — list all loaded mods
- `window.modUtils.getMod(name)` — get mod info object
- `window.modUtils.getNowRunningModName()` — get current mod name
- `modInfo.modRef = { ... }` — expose API for other mods
- jQuery events: `:storyready`, `:passageinit`, `:passagestart`, `:passagerender`, `:passagedisplay`, `:passageend`

### When the user has a LOADING or DEPENDENCY issue

1. Check `boot.json` has all required fields (even empty arrays)
2. Verify paths are relative to zip root
3. Check `dependenceInfo` version constraints
4. Remember load priority: local → remote → localStorage → IndexedDB (later overrides earlier)
5. Safe mode: 3 consecutive failures auto-disables all mods

### When the user wants to MODIFY game content

- **Passage replacement**: Use TweeReplacer addon with `addonPlugin` dependency
- **String replacement (JS/CSS/Passage)**: Use ReplacePatch addon
- **Image replacement**: Use ImageLoaderHook addon; list images in `imgFileList`
- **Custom hooks**: Use TweePrefixPostfixAddon for before/after passage rendering

## Script Stage Selection Guide

This is one of the most important decisions. Use this table to choose:

| Need                                                | Stage          | boot.json field               |
| --------------------------------------------------- | -------------- | ----------------------------- |
| Register an addon, set modRef, synchronous init     | `inject_early` | `scriptFileList_inject_early` |
| Async init, read raw game data, decrypt content     | `earlyload`    | `scriptFileList_earlyload`    |
| Read merged data, modify passages before SC2 starts | `preload`      | `scriptFileList_preload`      |
| Normal game scripts, macros, game logic             | Main           | `scriptFileList`              |

Important: `earlyload` and `preload` scripts use `JsPreloader.JsRunner()` which wraps code as `(async () => { return ${jsCode} })()`. Always use an IIFE pattern:

```js
(async () => {
  // Your code here
})();
```

## boot.json Essentials

Required fields (must exist, even if empty):

- `name` — mod name (string)
- `version` — semver version
- `styleFileList` — CSS files array
- `scriptFileList` — main JS files array
- `tweeFileList` — twee passage files array
- `imgFileList` — image files array

All paths are **relative to zip root**. `boot.json` must be at the zip root.

For version constraints in `dependenceInfo`, use `^x.y.z` for compatible ranges or `=x.y.z` for exact matches.

## Twee File Format

Twee files use SugarCube's passage format:

```
:: PassageName [tag1 tag2]
Passage content here.
Links use [[display text->Target Passage]] syntax.
```

Passage names that match the base game **override** game content. Multiple mods with the same passage name: later-loaded mod wins.

## Packaging Checklist

1. Ensure `boot.json` is at the zip root (not inside a subfolder)
2. All files referenced in boot.json must be in the zip
3. All paths must match exactly (case-sensitive)
4. Rename to `ModName.mod.zip`
5. Test: upload via Mod manager, enable, refresh game, verify

## Common Pitfalls

- **boot.json not at zip root**: Package files directly, not the folder containing them
- **Path mismatch**: Paths in boot.json must exactly match the zip layout
- **Wrong script format for earlyload/preload**: Must use IIFE async pattern
- **Sync operations in inject_early**: Don't use async — it won't be awaited
- **Calling other mod's modRef too early**: Use preload or later for inter-mod calls
- **Image paths colliding**: Use unique, namespaced paths in imgFileList

## Reference Files

Read these as needed:

- `references/boot-json-reference.md` — Complete boot.json field documentation
- `references/script-stages.md` — Detailed stage comparison with examples
- `references/api-reference.md` — ModUtils, hooks, lifecycle, inter-mod communication
- `references/bundled-mods.md` — Available addons and their usage
- `assets/boot-json-template.json` — Template for scaffolding new mods
