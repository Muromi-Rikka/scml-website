# boot.json Reference

`boot.json` is the Mod manifest file and must be at the root of the zip archive. It declares basic info, file lists, and dependencies.

## Field Reference

```json5
{
  // (required) Mod name
  name: "MyMod",

  // (optional) User-friendly display name shown in Mod manager
  nickName: "A Example Mod",
  // Alternative: multi-language
  // "nickName": {
  //   "cn": "中文名称",
  //   "en": "English Name"
  // },

  // (optional) Mod aliases for compatibility
  // e.g. retain old name after rename for other Mods; declare equivalent when migrating across games
  alias: ["OldModName"],

  // (required) Mod version
  version: "1.0.0",

  // (optional) Early-injected JS scripts
  // Injected into DOM as <script> immediately after Mod loads, run by browser
  scriptFileList_inject_early: ["MyMod_script_inject_early.js"],

  // (optional) Early-load JS scripts
  // Run by ModLoader after inject_early; supports async
  // Can read unmodified raw Passage data
  scriptFileList_earlyload: ["MyMod_script_earlyload.js"],

  // (optional) Preload JS scripts
  // Run after Mod data is merged into tw-storydata; supports async
  // Can read merged final Passage data
  scriptFileList_preload: ["MyMod_script_preload.js"],

  // (required) CSS file list
  styleFileList: ["MyMod_style_1.css", "MyMod_style_2.css"],

  // (required) JS script list (merged as part of game)
  scriptFileList: ["MyMod_script_1.js", "MyMod_script_2.js"],

  // (required) Twee script file list
  tweeFileList: ["MyMod_Passage1.twee", "MyMod_Passage2.twee"],

  // (required) Image file list
  // Paths should avoid colliding with other strings in files
  imgFileList: [
    "MyMod_Image/typeA/111.jpg",
    "MyMod_Image/typeA/222.png",
    "MyMod_Image/typeB/333.gif",
  ],

  // (optional) Additional file list
  // Not loaded; stored as extra files, read/written in UTF-8
  additionFile: [
    "readme.txt", // First file starting with readme (case-insensitive) shown in Mod manager as description
  ],

  // (optional) Additional binary files
  additionBinaryFile: ["data.zip"],

  // (optional) Additional directories; all files saved as binary
  additionDir: ["extra_data"],

  // (optional) Addon plugin dependencies
  addonPlugin: [
    {
      modName: "AddonModName", // Mod providing the plugin
      addonName: "pluginName", // Plugin name in that Mod
      modVersion: "1.0.0", // Version of Mod providing the plugin
      params: [], // (optional) Plugin params
    },
  ],

  // (optional) Mod dependencies
  dependenceInfo: [
    {
      modName: "SomeMod", // Dependent Mod name
      version: "^2.0.0", // Version constraint
    },
    {
      modName: "ModLoader", // ModLoader version dependency
      version: "^1.6.0",
    },
    {
      modName: "GameVersion", // Game version dependency
      version: "=0.4.2.7", // Prefix with = for exact version match
    },
  ],
}
```

## Required Fields

These fields **must exist** (even if empty arrays):

- `name` — Mod name
- `version` — Version
- `styleFileList` — CSS file list
- `scriptFileList` — JS script list
- `tweeFileList` — Twee file list
- `imgFileList` — Image file list

## Path Rules

- All paths in `boot.json` are **relative to the zip root** (the directory containing `boot.json`).
- Image paths in `imgFileList` are resolved relative to the zip root. Avoid paths that might collide with other strings in game files, or image replacement may unexpectedly overwrite content.
- File names within the same Mod must be unique. Avoid naming conflicts with the base game or other Mods where possible; overlapping paths will overwrite the original.

## Changelog / Notes

- **Removed**: `imgFileReplaceList` — Image replacement is now handled by ImageHookLoader, which intercepts image requests. Images that match base game paths are replaced automatically when listed in `imgFileList`.
- **Added** `addonPlugin` — Declare Addon plugin dependencies; unsatisfied dependencies produce warnings in the load log.
- **Added** `dependenceInfo` — Declare Mod/ModLoader/game version dependencies; unsatisfied dependencies produce warnings in the load log.

## Version Constraint Syntax

`dependenceInfo` `version` supports:

| Format              | Meaning                                            | Example                |
| ------------------- | -------------------------------------------------- | ---------------------- |
| `^x.y.z`            | Compatible within same major version (recommended) | `^2.0.0` matches 2.x.x |
| `=x.y.z` or `x.y.z` | Exact match                                        | `=1.2.3`               |
| `>x.y.z`            | Greater than                                       | `>1.0.0`               |
| `>=x.y.z`           | Greater or equal                                   | `>=1.0.0`              |
| `<x.y.z`            | Less than                                          | `<2.0.0`               |
| `<=x.y.z`           | Less or equal                                      | `<=2.0.0`              |

Versions follow [Semantic Versioning](https://semver.org/lang/en/), validated with [semver](https://www.npmjs.com/package/semver).

:::tip
For `GameVersion`, only the main version is compared; anything after the first `-` is ignored.
:::

## Minimal boot.json

```json
{
  "name": "EmptyMod",
  "version": "1.0.0",
  "styleFileList": [],
  "scriptFileList": [],
  "tweeFileList": [],
  "imgFileList": [],
  "additionFile": ["readme.txt"]
}
```
