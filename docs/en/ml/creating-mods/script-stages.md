# Four Script Loading Stages

ModLoader provides four script stages, each running at a different point in startup with different data access and capabilities.

## Stage Overview

| Stage        | boot.json Field               | When it Runs                        | Async     | Accessible Data     |
| ------------ | ----------------------------- | ----------------------------------- | --------- | ------------------- |
| inject_early | `scriptFileList_inject_early` | Immediately after Mod load          | Sync only | Raw unmodified data |
| earlyload    | `scriptFileList_earlyload`    | After inject_early                  | Async OK  | Raw unmodified data |
| preload      | `scriptFileList_preload`      | After data merged into tw-storydata | Async OK  | Merged final data   |
| Main scripts | `scriptFileList`              | Merged into game                    | With SC2  | Runtime game data   |

## inject_early

**Field**: `scriptFileList_inject_early`

Scripts are injected into HTML as `<script>` **immediately** after the Mod loads and run by the browser.

**Characteristics**:

- Can call ModLoader APIs
- Can read unmodified SC2 data (including raw Passages)
- **Synchronous only**; async operations are not awaited
- Use for Mod initialization (register Addon, set modRef, etc.)

**Typical uses**:

- Register Addon plugin (`registerAddonPlugin`)
- Register load control callbacks (`canLoadThisMod`)
- Set `modRef` to expose API

## earlyload

**Field**: `scriptFileList_earlyload`

Runs after all inject_early scripts for the current Mod are injected, via ModLoader.

**Characteristics**:

- Can call ModLoader APIs
- Supports async (remote data, etc.)
- Can read unmodified SC2 data (raw Passages)
- Uses `JsPreloader.JsRunner()` for execution

:::warning Script Format
`JsPreloader.JsRunner()` wraps code as `(async () => { return ${jsCode} })()`. Because it adds `return` before the first line, only the first line or an IIFE from the first line runs by JS semantics.

Recommended pattern:

```js
(async () => {
  // Your earlyload code
  const modName = window.modUtils.getNowRunningModName();
  console.log(`${modName} earlyload`);
})();
```

:::

**Typical uses**:

- Async initialization (remote data, etc.)
- Reading and analyzing raw game data
- Decrypting and releasing lazily-loaded Mods

## preload

**Field**: `scriptFileList_preload`

Runs after all Mod data (CSS/JS/Twee) is merged into `tw-storydata`, before the SC2 engine starts.

**Characteristics**:

- Can call ModLoader APIs
- Supports async
- Can read post-merge SC2 data (merged final data)
- Can dynamically modify and override Passage content

:::warning Script Format
Same as earlyload: preload scripts use `JsPreloader.JsRunner()` and follow the same format rules.
:::

**Typical uses**:

- Operations that need merged data
- Dynamically modifying merged Passages
- Final validation and adjustments

## scriptFileList (Main Scripts)

**Field**: `scriptFileList`

Merged directly into `tw-storydata` as part of the game scripts and executed with the game when the SC2 engine runs.

**Characteristics**:

- Behaves like base game JS
- Runs via standard SC2 execution
- Identical JS filenames across Mods have their contents concatenated

**Typical uses**:

- Extending game logic
- Adding new features
- Macro definitions

## Execution Order Summary

All of this happens during the loading screen; SC2 starts the game afterward:

```
1. [inject_early]  → Sync injection, initialization
2. [earlyload]     → Async run, read raw data
3. [Data merge]    → CSS/JS/Twee merged into tw-storydata
4. [preload]       → Async run, read merged data
5. [SC2 start]     → scriptFileList runs with game
```
