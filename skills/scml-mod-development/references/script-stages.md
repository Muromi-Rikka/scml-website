# Script Loading Stages Reference

SCML provides four script stages, each running at a different point during startup with different data access and capabilities.

## Stage Comparison

| Stage | boot.json Field | When | Async | Data Access |
|-------|----------------|------|-------|-------------|
| inject_early | `scriptFileList_inject_early` | Immediately after mod load | Sync only | Raw unmodified |
| earlyload | `scriptFileList_earlyload` | After inject_early | Async OK | Raw unmodified |
| preload | `scriptFileList_preload` | After data merge into tw-storydata | Async OK | Merged final |
| Main scripts | `scriptFileList` | With SC2 engine | With SC2 | Runtime game |

## Execution Order

```
1. [inject_early]  → Sync injection, initialization
2. [earlyload]     → Async run, read raw data
3. [Data merge]    → CSS/JS/Twee merged into tw-storydata
4. [preload]       → Async run, read merged data
5. [SC2 start]     → scriptFileList runs with game
```

## inject_early — Synchronous Initialization

Scripts are injected as `<script>` tags immediately after the mod loads.

Use for:
- Registering addon plugins (`registerAddonPlugin`)
- Registering load control callbacks (`canLoadThisMod`)
- Setting `modRef` to expose API
- Synchronous-only — async operations are NOT awaited

```js
// Register an addon
window.modAddonPluginManager.registerAddonPlugin(
  "MyAddonMod",
  "myPlugin",
  myPluginInstance
);

// Expose API for other mods
const myName = window.modUtils.getNowRunningModName();
const myInfo = window.modUtils.getMod(myName);
myInfo.modRef = { doThing: () => console.log("done") };
```

## earlyload — Async Initialization with Raw Data

Runs via `JsPreloader.JsRunner()` which wraps code as `(async () => { return ${jsCode} })()`.

Because `return` is injected before the first line, only the first line or an IIFE from the first line executes. Always use an IIFE:

```js
(async () => {
  const modName = window.modUtils.getNowRunningModName();
  console.log(`${modName} earlyload started`);

  // Can do async work — fetch, decrypt, etc.
  const data = await fetch("https://example.com/data.json");
  const json = await data.json();

  console.log(`${modName} earlyload done`);
})();
```

Use for:
- Async initialization (remote data fetch)
- Reading and analyzing raw game data
- Decrypting and releasing lazily-loaded mods

## preload — Async with Merged Data

Same IIFE format as earlyload. Runs after all mod data is merged into `tw-storydata`.

```js
(async () => {
  // Can read the final merged passage data
  // Can dynamically modify passages before SC2 starts
  console.log("Preload: merged data is ready");
})();
```

Use for:
- Operations that need merged data
- Dynamically modifying merged passages
- Final validation and adjustments

## scriptFileList (Main Scripts) — Normal Game Scripts

Merged directly into `tw-storydata` as part of the game. Executes normally with SugarCube-2.

```js
// Define SugarCube macros
Macro.add("myMacro", {
  handler() {
    const text = this.args[0] || "default";
    $(document.createElement("span")).wiki(text).appendTo(this.output);
  },
});

// Listen to SC2 events
$(document).one(":storyready", () => {
  console.log("Game started!");
});

$(document).on(":passageend", () => {
  console.log("Passage rendered");
});
```

Use for:
- Extending game logic
- Adding SugarCube macros
- Listening to game events
- Normal runtime code

## SugarCube-2 jQuery Events

After SC2 starts, these events fire during gameplay:

| Event | When |
|-------|------|
| `:storyready` | Game fully started |
| `:passageinit` | New passage context initializing |
| `:passagestart` | New passage starting to render |
| `:passagerender` | New passage render complete |
| `:passagedisplay` | New passage ready to insert into HTML |
| `:passageend` | New passage handling complete |

```js
$(document).one(":storyready", () => {
  // One-time post-start setup
});

$(document).on(":passageend", () => {
  // Runs after every passage render
});
```

## Choosing the Right Stage

| I need to... | Use this stage |
|-------------|----------------|
| Register an addon | `inject_early` |
| Set up modRef for other mods | `inject_early` |
| Fetch remote data | `earlyload` |
| Read raw passage data before merge | `earlyload` |
| Read merged passage data | `preload` |
| Modify passages before game starts | `preload` |
| Add SugarCube macros | `scriptFileList` |
| Extend game logic at runtime | `scriptFileList` |
| Listen to passage events | `scriptFileList` |
