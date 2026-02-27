# Core Loading System

## Loading Flow Overview

Mod loading starts when `SC2DataManager.startInit()` calls `ModLoader.loadMod()`, with the following stages:

1. Read Mod zip files from the configured sources
2. Run `scriptFileList_inject_early` and `scriptFileList_earlyload` and related load triggers
3. Register Mods with Addons
4. Rebuild the `tw-storydata` node
5. Run `scriptFileList_preload`
6. Start SugarCube2 as usual

## Loading Sources and Priority

ModLoader loads Mods from four sources, in this order:

| Order | Source                | Description                                              |
| ----- | --------------------- | -------------------------------------------------------- |
| 1     | HTML-embedded (local) | Mods packed into HTML via `insert2html`                  |
| 2     | Remote server         | Mods specified by `modList.json` on the web server       |
| 3     | localStorage          | Side-loaded via browser localStorage (size limited)      |
| 4     | IndexedDB             | Side-loaded via IndexedDB (main path for player uploads) |

**Override rule**: If the same Mod exists in multiple sources, the later-loaded one wins. So remote overrides local, IndexedDB overrides remote and local.

## Detailed Loading Steps

Full Mod loading flow (21 steps):

### Phase 1: Read and Inject

**1.** Load Mods in order: local → remote → localStorage → IndexDB. Call `DependenceChecker.checkFor()` for dependency checking (see [Dependency Checking](./dependency-checking)).

**2.** Use `ModZipReader` to read each Mod's `boot.json` and parse its structure.

**3.** Call `initModInjectEarlyLoadInDomScript()` to inject all `scriptFileList_inject_early` JS files into HTML; the browser executes them as normal `<script>` tags. Mods should perform their own initialization here.

:::warning
The `inject_early` stage supports only synchronous operations; async operations are not awaited.
:::

During this, loaded Mods can register the `ModLoadControllerCallback.canLoadThisMod` hook to decide whether later Mods may load (ModLoaderGui uses this for safe mode).

**4.** Fire these hooks to notify all Mods that the current Mod has loaded:

- `AddonPluginHookPoint.afterInjectEarlyLoad`
- `ModLoadControllerCallback.afterModLoad`
- `AddonPluginHookPoint.afterModLoad`

These hooks support async and will wait for promises to resolve.

### Phase 2: EarlyLoad Execution

**5.** Call `initModEarlyLoadScript()` to run all `scriptFileList_earlyload` scripts. Execution uses `JsPreloader.JsRunner()`, which wraps code as `(async () => { return ${jsCode} })()` and waits for completion.

:::tip
Because of the injected `return`, only the first line or an immediately-invoked closure from the first line runs. It is recommended to structure earlyload scripts as an IIFE async closure.
:::

**6.** During `initModEarlyLoadScript()`, `tryInitWaitingLazyLoadMod()` is called repeatedly to pick up any lazily-loaded Mods. Encrypted Mods use this to decrypt and inject Mods in earlyload.

**7.** Lazily loaded Mods read their zip, then their `scriptFileList_inject_early` and `scriptFileList_earlyload` run, and `canLoadThisMod` is triggered.

**8.** After all Mod JS has loaded and run, fire `AddonPluginHookPoint.afterEarlyLoad`.

### Phase 3: Addon Registration

**9.** Call `registerMod2Addon()` to register Mods that declare `addonPlugin` in `boot.json` with their Addon Mods.

:::info
Addon Mods must register themselves via `AddonPluginManager.registerAddonPlugin` before this (during EarlyLoad or earlier).
:::

**10.** Addon Mods receive registration via `AddonPluginHookPointExMustImplement.registerMod` and can record or act accordingly.

**11.** Fire `AddonPluginHookPoint.afterRegisterMod2Addon`.

**12.** At this point, Mod JS loading is complete.

### Phase 4: Data Merging

**13.** Fire `AddonPluginHookPoint.beforePatchModToGame`.

**14.** Merge all Mods' `styleFileList`, `scriptFileList`, and `tweeFileList` into `tw-storydata` and rebuild the node.

**15.** Fire `AddonPluginHookPoint.afterPatchModToGame`. `TweeReplacer`, `ReplacePatch`, and similar Mods run their replacements here.

### Phase 5: Preload and Start

**16.** `ModLoader.loadMod()` finishes and returns SC2 code.

**17.** SC2 code calls `JsPreloader.startLoad()`.

**18.** Run `scriptFileList_preload` scripts.

**19.** Fire `AddonPluginHookPoint.afterPreload`.

**20.** Fire `ModLoadControllerCallback.ModLoaderLoadEnd`—the **last** hook in the load process. Mods can do final setup here before SC2 starts.

**21.** Mod loading completes, ModLoader is ready, and SugarCube2 runs normally. All further ModLoader actions are triggered by SugarCube2.

## Mod Data Merge Rules

During merging:

1. Mods are loaded in list order; later Mods **override** earlier ones for the same Passage name.
2. Identical CSS/JS files across Mods are **concatenated**, not overwritten.
3. Inter-Mod merge results are computed first, then the result overrides the original game's Passage/JS/CSS.
