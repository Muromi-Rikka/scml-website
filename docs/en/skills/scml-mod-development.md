# SCML Mod Development Skill

This skill helps AI assistants create and debug mods for SugarCube-2 ModLoader (SCML) games. It applies to all SC2-based games, primarily targeting Degrees of Lewdity (DoL).

## Trigger Scenarios

This skill activates automatically when you need to:

- Create a new mod and generate `boot.json`
- Choose the appropriate script loading stage
- Use AddonPlugin to depend on other mods
- Use ModUtils API for inter-mod communication
- Replace Passage or image content
- Package `.mod.zip` files
- Troubleshoot mod loading issues

## Quick Start

### 1. Create Mod Directory Structure

```
MyMod/
├── boot.json
├── readme.txt
├── MyMod_style.css          (styles)
├── MyMod_script.js          (main script)
├── MyMod_passage.twee       (Passage)
└── MyMod_Image/             (images)
    └── character/
        └── avatar.png
```

### 2. Write boot.json

```json
{
  "name": "MyMod",
  "version": "1.0.0",
  "styleFileList": ["MyMod_style.css"],
  "scriptFileList": ["MyMod_script.js"],
  "tweeFileList": ["MyMod_passage.twee"],
  "imgFileList": ["MyMod_Image/character/avatar.png"],
  "additionFile": ["readme.txt"],
  "dependenceInfo": [],
  "addonPlugin": []
}
```

### 3. Package

Compress all files (without the outer folder) into `.mod.zip` format. `boot.json` must be at the zip root.

:::tip
See [Creating Mods](../ml/creating-mods) for the full tutorial.
:::

## Script Stage Selection

| Need                                     | Stage          | boot.json Field               |
| ---------------------------------------- | -------------- | ----------------------------- |
| Register addon, expose modRef, sync init | `inject_early` | `scriptFileList_inject_early` |
| Async init, read raw data, decrypt       | `earlyload`    | `scriptFileList_earlyload`    |
| Read merged data, modify passages        | `preload`      | `scriptFileList_preload`      |
| Normal game scripts, macros, game logic  | Main           | `scriptFileList`              |

:::warning
`earlyload` and `preload` scripts use IIFE format:

```js
(async () => {
  // Your code
})();
```

See [Script Loading Stages](../ml/creating-mods/script-stages).
:::

## boot.json Essentials

**Required fields** (must exist even if empty):

| Field            | Type     | Description           |
| ---------------- | -------- | --------------------- |
| `name`           | string   | Mod name              |
| `version`        | string   | Semver version        |
| `styleFileList`  | string[] | CSS file list         |
| `scriptFileList` | string[] | Main script file list |
| `tweeFileList`   | string[] | Twee file list        |
| `imgFileList`    | string[] | Image file list       |

**AddonPlugin dependency:**

```json
{
  "addonPlugin": [
    {
      "modName": "TweeReplacer",
      "addonName": "tweeReplacer",
      "modVersion": "1.0.0",
      "params": []
    }
  ]
}
```

See [boot.json Complete Reference](../ml/creating-mods/boot-json).

## Bundled Mods & Addons

| Addon               | Purpose                           | boot.json Config             |
| ------------------- | --------------------------------- | ---------------------------- |
| TweeReplacer        | Passage replacement               | `addonName: "tweeReplacer"`  |
| ReplacePatch        | JS/CSS/Passage string replacement | `addonName: "replacePatch"`  |
| ImageLoaderHook     | Image replacement                 | `addonName: "imgLoaderHook"` |
| BeautySelectorAddon | Multiple beauty image sets        | `addonName: "bsaAddon"`      |

See [Bundled Mods](../ml/guide/bundled-mods).

## API Quick Reference

### ModUtils (`window.modUtils`)

```js
// Query mods
window.modUtils.getModListName(); // All loaded mod names
window.modUtils.getMod("MyMod"); // Get mod info
window.modUtils.getNowRunningModName(); // Current running mod name

// Expose API
const info = window.modUtils.getMod(myName);
info.modRef = { doThing: () => {} };
```

### Lifecycle Hooks

| Hook                     | Timing                          |
| ------------------------ | ------------------------------- |
| `afterInjectEarlyLoad`   | After inject_early script       |
| `afterEarlyLoad`         | After all earlyload complete    |
| `afterRegisterMod2Addon` | After mod-to-addon registration |
| `beforePatchModToGame`   | Before data merge to game       |
| `afterPatchModToGame`    | After data merge to game        |
| `ModLoaderLoadEnd`       | ModLoader fully loaded          |

See [ModUtils Reference](../ml/api/mod-utils), [Lifecycle Hooks](../ml/api/lifecycle-hooks), [AddonPlugin System](../ml/api/addon-plugin).

## Twee File Format

```
:: PassageName [tag1 tag2]
Passage content here.
Links use [[display text->Target Passage]] syntax.
```

Same-name Passages **override** base game content. Multiple mods with the same passage name: later-loaded mod wins.

## Common Pitfalls

- **boot.json not at zip root** — Package files directly, not the folder containing them
- **Path case mismatch** — Paths in boot.json must exactly match zip layout (case-sensitive)
- **Missing IIFE for earlyload/preload** — Must use `(async () => { ... })()` format
- **Async operations in inject_early** — This stage doesn't support async, operations won't be awaited
- **Calling other mod's modRef too early** — Use preload or later for inter-mod calls
- **Image path collisions** — Use unique, namespaced paths
