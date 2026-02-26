# Developer API Overview

ModLoader exposes a public API to Mod developers via global objects for querying Mod info, inter-Mod communication, image loading, and more.

## Global Objects

| Global Object | Description |
|---------------|-------------|
| `window.modUtils` | Main API entry for Mod authors |
| `window.modSC2DataManager` | Core data manager; low-level access |
| `window.jsPreloader` | Script preloader |
| `window.modAddonPluginManager` | Addon plugin manager |

## API Categories

- [modUtils Reference](./mod-utils) — Mod queries, current Mod name, common utilities
- [AddonPlugin System](./addon-plugin) — Addon registration, exposing and calling Mod APIs
- [Image Loading](./image-loading) — Intercepting and replacing images via HtmlTagSrcHook
- [Lifecycle Hooks](./lifecycle-hooks) — Load-phase callbacks and hooks

## SugarCube2 Events

SC2 emits these jQuery events during gameplay. Mods can listen for them to react to game state:

| Event | When Fired |
|-------|------------|
| `:storyready` | Game fully started |
| `:passageinit` | New Passage context initializing |
| `:passagestart` | New Passage starting to render |
| `:passagerender` | New Passage render complete |
| `:passagedisplay` | New Passage ready to insert into HTML |
| `:passageend` | New Passage handling complete |

### Listening Example

```js
// One-shot
$(document).one(":storyready", () => {
  // Post-game-start logic
});

// Every time
$(document).on(":passageend", () => {
  // Logic after each Passage render
});
```
