# API Reference

## ModUtils — `window.modUtils`

Primary public API for mod authors.

### Mod Queries

```js
// List all loaded mod names
const names = window.modUtils.getModListName(); // string[]

// Get mod info by name
const info = window.modUtils.getMod("MyMod"); // ModInfo | undefined

// Get mod zip reader
const zip = window.modUtils.getModZip("MyMod"); // ModZipReader | undefined

// Get current mod's name (while its script runs)
const myName = window.modUtils.getNowRunningModName(); // string | undefined
```

### ModLoader Query APIs (via `window.modSC2DataManager`)

```js
const loader = window.modSC2DataManager.getModLoader();

// Look up mod info
loader.getModByNameOne("MyMod");

// Look up mod zip
loader.getModZip("MyMod");

// Safe snapshot during earlyload
loader.getModEarlyLoadCache();

// Read-only mod map
loader.getModCacheMap(); // Map<string, ModInfo>

// Array for traversal (mutation doesn't affect internals)
loader.getModCacheOneArray(); // ModInfo[]
```

> Since v2.0.0, direct access to `modOrder` is not allowed. Use the APIs above.

## Inter-Mod Communication

### ModInfo.modRef

Mods expose APIs by setting `modRef` on their ModInfo object.

**Mod A (provider) — in inject_early or earlyload:**

```js
const myName = window.modUtils.getNowRunningModName();
const myInfo = window.modUtils.getMod(myName);
myInfo.modRef = {
  getConfig: () => ({ enabled: true, count: 42 }),
  doAction: (target) => {
    /* ... */
  },
};
```

**Mod B (consumer) — in preload or later:**

```js
const modAInfo = window.modUtils.getMod("Mod A Name");
if (modAInfo?.modRef) {
  const config = modAInfo.getConfig();
  modAInfo.doAction("something");
}
```

> In earlyload, ensure the target mod has already loaded and set modRef. Preload or later is usually safer.

### AddonPlugin System

For structured extension points, use the addon system:

**Addon registration (in inject_early or earlyload):**

```js
window.modAddonPluginManager.registerAddonPlugin(
  "MyAddonMod", // mod providing the plugin
  "myPlugin", // plugin name
  addonInstance, // implements AddonPluginHookPointEx
);
```

**Consumer declaration (in boot.json):**

```json
{
  "addonPlugin": [
    {
      "modName": "MyAddonMod",
      "addonName": "myPlugin",
      "modVersion": "1.0.0",
      "params": []
    }
  ]
}
```

**Registration flow:**

1. Addon calls `registerAddonPlugin()` during earlyload
2. ModLoader calls `registerMod2Addon()` to register consumers
3. Addon receives `registerMod` callback

## Lifecycle Hooks

### AddonPluginHookPoint

| Hook                     | When                             | Async |
| ------------------------ | -------------------------------- | ----- |
| `afterInjectEarlyLoad`   | After each mod's inject_early    | Yes   |
| `afterModLoad`           | After each mod loads             | Yes   |
| `afterEarlyLoad`         | After all earlyload complete     | Yes   |
| `afterRegisterMod2Addon` | After mod-to-addon registration  | Yes   |
| `beforePatchModToGame`   | Before merging into tw-storydata | Sync  |
| `afterPatchModToGame`    | After merge (replacers run here) | Sync  |
| `afterPreload`           | After preload scripts complete   | Yes   |

### ModLoadControllerCallback

| Callback           | When                           | Description                           |
| ------------------ | ------------------------------ | ------------------------------------- |
| `canLoadThisMod`   | Before each mod's inject_early | Return boolean to allow/block loading |
| `afterModLoad`     | After each mod loads           | Notification                          |
| `ModLoaderLoadEnd` | After ModLoader finishes       | Last hook — final setup               |

### Safe Mode

ModLoaderGui uses `canLoadThisMod` for safe mode. After 3 consecutive load failures, it blocks all mod loading so users can open the mod manager and remove faulty mods.

### Full Hook Order

```
For each mod:
  canLoadThisMod → check if loading allowed
  [Run inject_early]
  afterInjectEarlyLoad → inject_early done
  afterModLoad (Controller + Addon) → mod loaded
  [Run earlyload]
  [Check lazy-loaded mods]

afterEarlyLoad → all earlyload done
[registerMod2Addon]
  registerMod → addon receives registration
afterRegisterMod2Addon → registration done

beforePatchModToGame → about to merge
[Merge style/script/twee]
afterPatchModToGame → merge done

[Run preload]
afterPreload → preload done
ModLoaderLoadEnd → ModLoader fully done

[SugarCube2 starts]
```

## Image Loading — HtmlTagSrcHook

ModLoader intercepts image requests so images load from mod zips without a server.

### Async image request:

```js
const imageData = await window.modSC2DataManager
  .getHtmlTagSrcHook()
  .requestImageBySrc("path/to/image");
```

### Sync HTMLImageElement interception:

```js
const el = document.createElement("img");
el.src = "MyMod_Image/character/avatar.png";

if (window.modSC2DataManager?.getHtmlTagSrcHook?.()?.doHook) {
  if (
    el.tagName === "img" &&
    !el.hasAttribute("ML-src") &&
    !el.getAttribute("src")?.startsWith("data:")
  ) {
    el.setAttribute("ML-src", el.getAttribute("src"));
    el.removeAttribute("src");
    window.modSC2DataManager.getHtmlTagSrcHook().doHook(el).catch(console.error);
  }
}
```

For most mods, use the ImageLoaderHook addon instead — list images in `imgFileList` and matching game images are replaced automatically.
