# Maplebirch Framework Skill

This skill helps AI assistants build mods using **maplebirchFramework** for Degrees of Lewdity (DoL). The framework provides stable, additive interfaces for injecting content without modifying vanilla game files.

## Trigger Scenarios

This skill activates automatically when you need to:

- Configure boot.json with maplebirchAddon
- Register named NPCs (appearance, stats, schedule, sidebar)
- Add combat action buttons
- Manage audio playback
- Register dynamic events (time/state/weather)
- Use language macros (`<<language>>`, `<<lanSwitch>>`, etc.)
- Register character rendering layers
- Use the tool collection (traits, location, bodywriting, foodstuff, antiques)
- Extend the module system

## Quick Start

### 1. Create Mod Directory Structure

```
MyMaplebirchMod/
├── boot.json
├── mymod.js
├── translations/
│   ├── cn.json
│   └── en.json
├── audio/          (optional)
│   └── bgm.mp3
└── img/            (optional)
    └── face/
```

### 2. Write boot.json

```json
{
  "name": "MyMaplebirchMod",
  "version": "1.0.0",
  "scriptFileList": [],
  "styleFileList": [],
  "tweeFileList": [],
  "imgFileList": [],
  "additionFile": [],
  "dependenceInfo": [
    { "modName": "GameVersion", "version": ">=0.5.9.7" },
    { "modName": "maplebirch", "version": ">=3.2.5" }
  ],
  "addonPlugin": [
    {
      "modName": "maplebirch",
      "addonName": "maplebirchAddon",
      "modVersion": "^3.2.0",
      "params": {
        "script": ["mymod.js"],
        "language": true
      }
    }
  ]
}
```

### 3. Verify Framework Load

```js
if (window.maplebirch) {
  console.log("maplebirch version:", window.maplebirch.meta.version);
} else {
  console.error("maplebirch framework not loaded");
}
```

## addonPlugin Parameters

| Parameter   | Type                            | Description                                                          |
| ----------- | ------------------------------- | -------------------------------------------------------------------- |
| `script`    | `string[]`                      | Main scripts (recommended, runs after full framework init)           |
| `module`    | `string[]`                      | Early scripts (runs right after inject_early, use with caution)      |
| `language`  | `boolean \| string[] \| object` | Translation file configuration                                       |
| `audio`     | `boolean \| string[]`           | Audio file configuration                                             |
| `npc`       | `object`                        | NPC registration (NamedNPC, Stats, Sidebar)                          |
| `framework` | `object \| object[]`            | Traits, location, bodywriting, foodstuff, antiques, region injection |

See [AddonPlugin System](../maplebirch/addon-plugin).

## Core API Quick Reference

### Module Access Paths

| Access Path          | Description                                        |
| -------------------- | -------------------------------------------------- |
| `maplebirch.tool`    | Tool collection (rand, macros, HTML, zones, Patch) |
| `maplebirch.var`     | Variable management and migration                  |
| `maplebirch.char`    | Character rendering layer system                   |
| `maplebirch.npc`     | Named NPC system                                   |
| `maplebirch.audio`   | Audio playback and management                      |
| `maplebirch.combat`  | Combat system                                      |
| `maplebirch.dynamic` | Dynamic events (time/state/weather)                |

### Services

| Access Path         | Description          |
| ------------------- | -------------------- |
| `maplebirch.tracer` | Event bus            |
| `maplebirch.logger` | Logger service       |
| `maplebirch.lang`   | Internationalization |

### Event System

```js
maplebirch.on(eventName, callback, description?)
maplebirch.off(eventName, identifier)
maplebirch.once(eventName, callback, description?)
maplebirch.after(eventName, callback)
maplebirch.trigger(eventName, ...args)
```

Common events: `:passagestart`, `:passageend`, `:storyready`, `:onSave`, `:onLoad`, `:language`

### Logging

```js
maplebirch.log(message, level?)  // level: "DEBUG" | "INFO" | "WARN" | "ERROR"
const log = maplebirch.tool.createlog("mymod")
log("message", "INFO")  // [maplebirch][INFO] [mymod] message
```

See [Core Services](../maplebirch/services), [Event Emitter](../maplebirch/event-emitter), [Module System](../maplebirch/module-system).

## NPC Registration

### JS API

```js
maplebirch.npc.add(
  { nam: "Luna", gender: "f", title: "Moon Witch", age: 25, ... },
  { love: { maxValue: 100 }, important: true },
  translations,  // optional Map
);
```

### boot.json Declarative

```json
{
  "npc": {
    "NamedNPC": [
      [
        { "nam": "Luna", "gender": "f", "title": "Moon Witch" },
        { "love": { "maxValue": 100 }, "important": true },
        { "Luna": { "EN": "Luna", "CN": "露娜" } }
      ]
    ]
  }
}
```

See [NPC Registration](../maplebirch/named-npc/), [NPC Stats](../maplebirch/named-npc/npc-stats), [NPC Schedule](../maplebirch/named-npc/npc-schedule), [NPC Clothes](../maplebirch/named-npc/npc-clothes).

## Combat Actions

```js
maplebirch.combat.CombatAction.reg({
  id: "fireball",
  actionType: "rightaction",
  cond: (ctx) => V.player.mana >= 25,
  display: (ctx) => `Fireball (25 mana)`,
  value: "fireball",
  color: (ctx) => (V.player.mana >= 25 ? "orange" : "gray"),
  difficulty: "High fire damage",
  combatType: "Default",
  order: 1,
});
```

**actionType**: `leftaction`, `rightaction`, `feetaction`, `mouthaction`, `penisaction`, `vaginaaction`, `anusaction`, `chestaction`, `thighaction`

See [Combat Actions](../maplebirch/combat/actions).

## Audio System

```js
const am = maplebirch.audio;
await am.modPlay("myMod", "track_name");
am.Volume = 0.8;
am.PlayMode = "shuffle";
```

boot.json config: `"audio": true` (import `audio/` directory) or `"audio": ["bgm", "sfx"]`

Supported formats: mp3, wav, ogg, m4a, flac, webm

See [Audio Management](../maplebirch/audio).

## Language Macros

| Macro                           | Purpose                                   |
| ------------------------------- | ----------------------------------------- |
| `<<language>>`                  | Show different content blocks by language |
| `<<lanSwitch>>` / `lanSwitch()` | Inline language switching                 |
| `<<lanButton>>`                 | Language-aware button                     |
| `<<lanLink>>`                   | Language-aware link                       |
| `<<lanListbox>>`                | Language-aware dropdown                   |

Translation API: `maplebirch.t(key)` — lookup by key; `maplebirch.auto(text)` — reverse translation

See [SugarCube Macro Extensions](../maplebirch/sugar-cube-macro), [Language Manager](../maplebirch/language-manager).

## Variables Namespace

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

See [Variables and Game State](../maplebirch/variables).

## Common Pitfalls

- **Using `module` instead of `script`** — `module` runs when the framework may not be fully initialized; use `script` unless necessary
- **Missing GameVersion dependency** — `dependenceInfo` must include `GameVersion >= 0.5.9.7`
- **Modifying `V.maplebirch.player.clothing` directly** — It's a read-only proxy of `V.worn`; use `V.worn` to modify equipment
- **Calling framework APIs before Init** — Use `maplebirch.on(":passagestart", ...)` to ensure readiness
- **Circular module dependencies** — ModuleSystem uses topological sort; circular dependencies are rejected at registration
- **Audio files not in additionFile** — Audio paths must be listed in `additionFile` in boot.json
