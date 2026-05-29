---
name: maplebirch-framework
description: Develop mods using the maplebirchFramework for SugarCube-2 ModLoader (SCML) games. Use when the user is building a mod that depends on maplebirchFramework — including writing boot.json with addonPlugin params, registering NPCs, adding combat actions, playing audio, managing dynamic events, using language macros, registering character layers, using the tool collection (traits, location, bodywriting, foodstuff, antiques), extending the module system, or troubleshooting framework integration. Also triggers when the user mentions maplebirch, maplebirchFramework, maplebirchAddon, DOL framework mods, or uses APIs like `maplebirch.npc`, `maplebirch.combat`, `maplebirch.audio`, `maplebirch.dynamic`, `maplebirch.char`, `maplebirch.tool`.
---

# maplebirchFramework Skill

You are helping a developer build mods using the **maplebirchFramework** — a modding framework built on SugarCube-2 ModLoader (SCML) for Degrees of Lewdity (DoL). The framework provides stable, additive interfaces for injecting content without modifying vanilla game files.

## Quick Context

- **Global entry point:** `window.maplebirch`
- **Framework version:** 3.2.5 (latest)
- **Dependency:** Requires `GameVersion >= 0.5.9.7` and `maplebirch >= 3.2.5`
- **Build toolchain:** Bun + Rspack + SWC + tsup
- **Type support:** TypeScript declarations available at `dist/maplebirch.d.ts`

**Layer hierarchy:** DOL → ModLoader → maplebirchFramework → Your Mod

The framework follows a **four-phase initialization** lifecycle:

```
preInit → Init → loadInit → postInit
```

## How to Help the User

### When the user wants to CREATE a new maplebirch mod

1. **Scaffold the mod directory:**

```
MyMod/
├── boot.json
├── mymod.js              (main script)
├── translations/
│   ├── cn.json
│   └── en.json
├── audio/                (if audio needed)
│   └── bgm.mp3
└── img/                  (if images needed)
    └── face/             (for facial styles)
```

2. **Generate the boot.json** — use `references/boot-json-guide.md` for field details; use `assets/boot-json-template.json` as a starting point

3. **Write the main script** — access all framework APIs via `window.maplebirch`

4. **Verify framework load:**

```js
if (window.maplebirch) {
  console.log("maplebirch version:", window.maplebirch.meta.version);
} else {
  console.error("maplebirch framework not loaded");
}
```

### When the user needs to configure boot.json

The `addonPlugin` params field is the primary configuration surface. Read `references/boot-json-guide.md` for the complete reference. Key params:

| Param       | Type                            | Purpose                                                            |
| ----------- | ------------------------------- | ------------------------------------------------------------------ |
| `script`    | `string[]`                      | JS files executed after AddonPlugin processing (recommended)       |
| `module`    | `string[]`                      | JS files executed immediately after `inject_early` (advanced)      |
| `language`  | `boolean \| string[] \| object` | Translation file configuration                                     |
| `audio`     | `boolean \| string[]`           | Audio file configuration                                           |
| `npc`       | `object`                        | NPC registration (NamedNPC, Stats, Sidebar)                        |
| `framework` | `object \| object[]`            | Traits, location, bodywriting, foodstuff, antiques, region widgets |

**`module` vs `script`:** Use `script` for most cases. `module` runs very early when the framework may not be fully initialized — only use for advanced framework extension.

### When the user needs to register an NPC

Read `references/api-reference.md` section "NPC System". Key pattern:

```js
maplebirch.npc.add(
  { nam: "Luna", gender: "f", title: "Moon Witch", ... },  // NPCData
  { love: { maxValue: 100 }, important: true },             // NPCConfig
  translations,                                               // Optional Map
);
```

Also configure in boot.json `params.npc.NamedNPC` for declarative registration.

### When the user needs combat actions

Register via `maplebirch.combat.CombatAction.reg()`. Action types: `leftaction`, `rightaction`, `feetaction`, `mouthaction`, `penisaction`, `vaginaaction`, `anusaction`, `chestaction`, `thighaction`. See `references/api-reference.md` section "Combat System".

### When the user needs audio

Configure in boot.json `params.audio` or use the JS API:

- `maplebirch.audio.modPlay(modName, trackName)` — play a track
- `maplebirch.audio.Volume`, `.Mute`, `.PlayMode` — control playback
- Supports: mp3, wav, ogg, m4a, flac, webm

### When the user needs dynamic events

Three event types via `maplebirch.dynamic`:

- **Time events** — triggered at specific game times
- **State events** — triggered by game state changes
- **Weather events** — weather-related triggers and custom weather types

### When the user needs multi-language support

Use framework macros and APIs:

- `<<language>>` macro — show content blocks by language
- `<<lanSwitch>>` / `lanSwitch()` — inline language switching
- `<<lanButton>>`, `<<lanLink>>`, `<<lanListbox>>` — language-aware UI components
- `maplebirch.t(key)` — translation lookup
- `maplebirch.auto(text)` — reverse translation

### When the user needs to extend the module system

Register extension modules via `maplebirch.register(name, module, dependencies, source)`. Lifecycle methods: `preInit()`, `Init()`, `loadInit()`, `postInit()`. Use exposed modules (`exposed: true`) to mount APIs on `maplebirch[name]`. See `references/api-reference.md` section "Module System".

## Core API Quick Reference

### Global Object: `window.maplebirch`

| Access Path          | Purpose                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| `maplebirch.addon`   | ModLoader lifecycle hooks, processes boot.json config                                              |
| `maplebirch.tool`    | Facade for rand, macros, HTML tools, zones, patch (traits/location/bodywriting/foodstuff/antiques) |
| `maplebirch.var`     | Manages `V.maplebirch` game state and data migration                                               |
| `maplebirch.char`    | Body/face/clothing layer system, hair gradients, transformation                                    |
| `maplebirch.npc`     | Named NPC registration, schedules, sidebar rendering                                               |
| `maplebirch.audio`   | Audio playback (Howler.js) with IndexedDB caching                                                  |
| `maplebirch.combat`  | Combat action button and speech registration                                                       |
| `maplebirch.dynamic` | Time, State, and Weather event management                                                          |

### Services

| Access Path         | Purpose                              |
| ------------------- | ------------------------------------ |
| `maplebirch.tracer` | EventEmitter pub/sub event bus       |
| `maplebirch.logger` | Logger service                       |
| `maplebirch.lang`   | LanguageManager internationalization |

### Convenience Methods (proxied from EventEmitter)

```js
maplebirch.on(eventName, callback, description?)
maplebirch.off(eventName, identifier)
maplebirch.once(eventName, callback, description?)
maplebirch.after(eventName, callback)
maplebirch.trigger(eventName, ...args)
```

### Logging

```js
maplebirch.log(message, level?)  // level: "DEBUG" | "INFO" | "WARN" | "ERROR"
maplebirch.LogLevel = "DEBUG"
const log = maplebirch.tool.createlog("mymod")
log("message", "INFO")  // [maplebirch][INFO] [mymod] message
```

### Tool Collection Patch API

```js
maplebirch.tool.patch.addTraits(...)
maplebirch.tool.patch.injectTraits()
maplebirch.tool.patch.configureLocation(...)
maplebirch.tool.patch.applyLocation()
maplebirch.tool.patch.addBodywriting(...)
maplebirch.tool.patch.applyBodywriting()
maplebirch.tool.patch.addFoodstuff(...)
maplebirch.tool.patch.applyFoodstuff()
maplebirch.tool.patch.addAntiques(...)
maplebirch.tool.patch.injectAntiques()
```

### Built-in Events

| Event                                 | Timing                     |
| ------------------------------------- | -------------------------- |
| `:allModule`                          | All modules registered     |
| `:modLoaderEnd`                       | ModLoader load complete    |
| `:passagestart`                       | Passage start              |
| `:passageend`                         | Passage end                |
| `:storyready`                         | Game fully initialized     |
| `:onSave` / `:onLoad` / `:onLoadSave` | Save/Load lifecycle        |
| `:language`                           | Language switch            |
| `:import`                             | Data import                |
| `:sugarcube`                          | SugarCube object available |

### Variables Namespace

Game state stored at `V.maplebirch`:

```js
{
  player: { clothing: {} },  // Read-only proxy of V.worn
  npc: {},
  transformation: {},
  version: "3.2.5"
}
```

Options at `V.options.maplebirch` (persists across saves).

## Common Pitfalls

- **Using `module` instead of `script`:** `module` runs very early — framework APIs may not be available. Use `script` unless you specifically need early execution.
- **Not declaring GameVersion dependency:** Always include `GameVersion >= 0.5.9.7` in `dependenceInfo`.
- **Modifying `V.maplebirch.player.clothing` directly:** It's a read-only proxy of `V.worn`. Use `V.worn` to modify equipment.
- **Calling framework APIs before Init:** Some APIs require the framework to be in `MOUNTED` state. Use lifecycle methods or `maplebirch.on(":passagestart", ...)` to ensure readiness.
- **Circular module dependencies:** The ModuleSystem uses topological sort; circular dependencies are rejected at registration time.
- **Missing `additionFile` for audio:** Audio paths must be listed in `additionFile` in boot.json.
- **Not using IIFE for earlyload/preload scripts:** If using SCML's `scriptFileList_earlyload`/`preload`, wrap code in `(async () => { ... })()`.

## Reference Files

Read these as needed:

- `references/boot-json-guide.md` — Complete boot.json configuration with all params
- `references/api-reference.md` — Full API reference for all modules (NPC, combat, audio, character, dynamic, tools, events)
- `assets/boot-json-template.json` — Template for scaffolding new mods

## External Resources

- **GitHub:** https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework
- **DeepWiki:** https://deepwiki.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework
- **Releases:** https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/releases
- **Type declarations:** Available at `dist/maplebirch.d.ts` in the release package
