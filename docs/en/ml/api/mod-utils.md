# modUtils Reference

`window.modUtils` is ModLoader's main public API for Mod authors.

## Mod Queries

### getModListName()

Returns names of all loaded Mods.

```js
// Returns string[]
const modNames = window.modUtils.getModListName();
```

### getMod(modName)

Returns the Mod info object for the given name.

```js
// Returns ModInfo if found, undefined otherwise
const modInfo = window.modUtils.getMod('MyMod');
```

### getModZip(modName)

Returns the zip reader for the given Mod.

```js
// Returns ModZipReader if found, undefined otherwise
const zip = window.modUtils.getModZip('MyMod');
```

### getNowRunningModName()

Returns the name of the Mod whose script is currently running. Useful for reusable Mod templates that need to know their own name.

```js
// Returns current Mod name string when Mod JS is running, undefined otherwise
const myName = window.modUtils.getNowRunningModName();
```

## ModLoader Query APIs

These are query methods on the ModLoader instance, accessed via `window.modSC2DataManager`.

### ModLoader.getModByNameOne(modName)

Look up Mod info by name.

### ModLoader.getModZip(modName)

Look up Mod zip by name.

### ModLoader.getModEarlyLoadCache()

Read a safe snapshot of loaded Mods during **EarlyLoad**.

:::warning
These methods **cannot** be used during EarlyLoad.
:::

### ModLoader.getModCacheMap()

Returns a read-only Map of Mod names to info.

### ModLoader.getModCacheOneArray()

Returns an Array for traversal; mutating it does not affect ModLoader internals.

### ModLoader.getModCacheArray()

Returns the Mod cache array.

### ModLoader.getModCacheByNameOne(modName)

Look up cache by Mod name.

### ModLoader.checkModCacheUniq()

Verify uniqueness. Call after manually changing Mod data.

### ModLoader.checkModCacheData()

Verify internal consistency. Call after manually changing Mod data.

## Inter-Mod Communication: ModInfo.modRef

ModLoader uses `ModInfo.modRef` to expose APIs between Mods.

### Mod A (loads first) — Expose API

```js
const modAName = window.modUtils.getNowRunningModName();
const modAInfo = window.modUtils.getMod(modAName);

// modRef defaults to undefined; set to a custom object to expose API
modAInfo.modRef = {
  funcA: () => {
    console.log('modA funcA');
  },
  objA: {
    a: 1,
    b: 2,
  }
};
```

### Mod B (loads later) — Call API

```js
const modAInfo = window.modUtils.getMod('Mod A Name');

// Must check Mod A exists and has modRef registered
if (modAInfo && modAInfo.modRef) {
  modAInfo.modRef.funcA();
  console.log(modAInfo.modRef.objA);
}
```

:::tip
Because of load order, when calling another Mod's `modRef` in earlyload, ensure the target Mod has already loaded and set `modRef`. Preload or later is usually safer for inter-Mod calls.
:::
