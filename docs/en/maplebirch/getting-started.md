# Getting Started

This guide explains how to add maplebirchFramework as a dependency to your Mod and use it.

## Installing the Framework

1. Download the framework from [GitHub Releases](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/releases) (current recommended asset: **`maplebirch-0.5.10.8-v4.0.2.modpack`** or the matching `.mod.zip`)
2. Install it via ModLoader's Mod manager. Ensure the framework and all its dependencies (ModLoader, ModLoaderGui, BeautySelectorAddon, etc.) are loaded correctly

:::tip Coexisting with “Simple Frameworks”

The framework declares the alias `Simple Frameworks`. If players still have the legacy Simple Framework mod installed, maplebirch **disables it at startup** to avoid conflicts.

From **v4.0.2** onward (on **game version >= 0.5.10.8**) only two compatibility globals remain: **`window.simpleFrameworks.addto`** (mapped to `maplebirch.tool.addTo`) and the **`TimeEvent`** helper class (internally bridged to `maplebirch.dynamic.regTimeEvent`). Other legacy shortcut globals were removed—new mods should call the `maplebirch` APIs directly.

The framework also pins **`GameVersion` to `>=0.5.10.8`**. Mirror both `GameVersion` and `maplebirch` constraints in your own `boot.json` (prefer **`>=4.0.2`**).

The framework itself is not encrypted. Package your mod as `.modpack` with [dol-mod-protection-tools](https://github.com/MaplebirchLeaf/dol-mod-protection-tools)—see [Mod protection & credentials](./mod-protection).

:::

## Declaring Dependencies

Declare the version constraint for maplebirch in your Mod's `boot.json` through `dependenceInfo`:

```json
{
  "name": "MyMod",
  "version": "1.0.0",
  "dependenceInfo": [
    {
      "modName": "GameVersion",
      "version": ">=0.5.10.8"
    },
    {
      "modName": "maplebirch",
      "version": ">=4.0.2"
    }
  ]
}
```

ModLoader will check the version constraint when loading; if it is not satisfied, the Mod will not be loaded.

## Registering with the Framework

Register your Mod with maplebirch's AddonPlugin system via the `addonPlugin` field in `boot.json`:

```json
{
  "addonPlugin": [
    {
      "modName": "maplebirch",
      "addonName": "maplebirchAddon",
      "modVersion": "^4.0.0",
      "params": {
        "script": ["mymod_framework.js"]
      }
    }
  ]
}
```

The following configuration options are supported in `params`:

| Parameter   | Type                            | Description                                                                                    |
| ----------- | ------------------------------- | ---------------------------------------------------------------------------------------------- |
| `module`    | `string[]`                      | JS files executed immediately after `inject_early` completes; not recommended unless necessary |
| `script`    | `string[]`                      | JS files executed after AddonPlugin processing completes (recommended)                         |
| `language`  | `boolean \| string[] \| object` | Language file configuration; see [AddonPlugin System](./addon-plugin) for details              |
| `audio`     | `boolean \| string[]`           | Audio file configuration                                                                       |
| `npc`       | `object`                        | NPC configuration (named NPCs, sidebar, clothing, etc.)                                        |
| `framework` | `object \| object[]`            | Framework-level configuration (traits, bodywriting, foodstuff, antiques, region parts, etc.)   |

## Minimal Example

The following is a complete `boot.json` example that depends on maplebirch:

```json
{
  "name": "MyFirstMod",
  "version": "1.0.0",
  "scriptFileList": [],
  "styleFileList": [],
  "tweeFileList": [],
  "imgFileList": [],
  "additionFile": ["readme.txt"],
  "dependenceInfo": [
    {
      "modName": "GameVersion",
      "version": ">=0.5.10.8"
    },
    {
      "modName": "maplebirch",
      "version": ">=4.0.2"
    }
  ],
  "addonPlugin": [
    {
      "modName": "maplebirch",
      "addonName": "maplebirchAddon",
      "modVersion": "^4.0.0",
      "params": {
        "script": ["mymod.js"],
        "language": true
      }
    }
  ]
}
```

:::info
`language: true` means all language files under the `translations/` directory are imported automatically. Place your translation files in the following structure:

```tree
MyFirstMod/
├── boot.json
├── mymod.js
└── translations/
    ├── cn.json
    └── en.json
```

:::

## Difference Between `module` and `script`

- **`module`** — Files are executed immediately after the `inject_early` phase completes. The framework itself may not be fully initialized at this point. Use for scenarios that require very early module registration
- **`script`** — Files are executed after all Mods have registered with AddonPlugin. The framework is fully initialized at this point. Recommended for most use cases

## Verifying Framework Load

Check whether the framework is available in your script:

```js
if (window.maplebirch) {
  console.log("maplebirch framework version:", window.maplebirch.meta.version);
  // Framework is ready, you can use its API
} else {
  console.error("maplebirch framework not loaded");
}
```

## Next Steps

- [Changelog](./changelog) — v4.0.2 and earlier release summaries
- [Core Architecture](./architecture) — Deep dive into MaplebirchCore and module system
- [AddonPlugin System](./addon-plugin) — Detailed usage of each params configuration option
- [Variables and Game State](./variables) — Managing the `V.maplebirch` namespace
