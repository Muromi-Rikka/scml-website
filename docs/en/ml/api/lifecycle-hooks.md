# Lifecycle Hooks Reference

ModLoader provides hooks during load so Mods can register callbacks for specific events.

## AddonPluginHookPoint

These hooks come from the AddonPlugin system. Addon Mods register to respond to load events.

| Hook                     | When Fired                                   | Description                                 |
| ------------------------ | -------------------------------------------- | ------------------------------------------- |
| `afterInjectEarlyLoad`   | After each Mod's `inject_early` scripts run  | Addon notified that early injection is done |
| `afterModLoad`           | After each Mod loads                         | Addon notified that a Mod has loaded        |
| `afterEarlyLoad`         | After all Mods' `earlyload` scripts complete | All Mod JS loading and execution done       |
| `afterRegisterMod2Addon` | After all Mods are registered with Addons    | Mod-to-Addon registration complete          |
| `beforePatchModToGame`   | Before merging into `tw-storydata`           | About to merge Mod data into the game       |
| `afterPatchModToGame`    | After merge into `tw-storydata`              | Mod data merged; TweeReplacer etc. run here |
| `afterPreload`           | After `preload` scripts run                  | Preload stage complete                      |

## AddonPluginHookPointExMustImplement

Addon Mods **must implement** these interface methods.

| Method        | Description                                                              |
| ------------- | ------------------------------------------------------------------------ |
| `registerMod` | Callback when a regular Mod registers; Addon records or acts accordingly |

## ModLoadController

`ModLoadController` coordinates Mod loading and lets Mods influence load decisions. Via `ModLoadControllerCallback`:

- **Control whether a Mod loads**: Use `canLoadThisMod` before inject_early to allow or block loading
- **React when ModLoader finishes**: Use `ModLoaderLoadEnd` after load completes for final setup

### Safe Mode

ModLoaderGui implements safe mode via `canLoadThisMod`. After three consecutive load failures, it returns `false` to block all Mod loading so users can open the Mod manager and remove faulty Mods.

### Lazy Loading and tryInitWaitingLazyLoadMod

During earlyload, ModLoader repeatedly calls `tryInitWaitingLazyLoadMod()` to handle **lazily-loaded Mods**. Encrypted Mods use this: after decrypting in earlyload, they inject the decrypted zip via the SideLazyLoad API, and ModLoader immediately loads those Mods and runs their inject_early and earlyload scripts.

## ModLoadControllerCallback

Callbacks from `ModLoadController` for controlling load behavior.

| Callback           | When                             | Description                                                 |
| ------------------ | -------------------------------- | ----------------------------------------------------------- |
| `canLoadThisMod`   | Before each Mod's `inject_early` | Return whether loading that Mod is allowed (e.g. safe mode) |
| `afterModLoad`     | After each Mod loads             | Controller notified that Mod loaded                         |
| `ModLoaderLoadEnd` | After ModLoader finishes loading | **Last hook**; Mods can do final setup here                 |

## Hook Order

Full hook order aligned with the 21 load steps:

```
For each Mod:
  canLoadThisMod           → Check if load allowed
  [Run inject_early]
  afterInjectEarlyLoad     → inject_early done
  afterModLoad (Controller) → Mod load done (controller)
  afterModLoad (Addon)      → Mod load done (Addon)
  [Run earlyload]
  [Check lazy-loaded Mods]
}

afterEarlyLoad             → All Mod earlyload done
[registerMod2Addon]        → Register Mods to Addons
  registerMod              → Addon receives registration
afterRegisterMod2Addon     → Registration done

beforePatchModToGame       → About to merge data
[Merge style/script/twee]
afterPatchModToGame        → Merge done (replacers run here)

[Run preload]
afterPreload               → Preload done
ModLoaderLoadEnd           → ModLoader fully done

[SugarCube2 normal start]
```

## Async Support

These hooks **support async** (awaits Promise completion):

- `afterInjectEarlyLoad`
- `afterModLoad`
- `afterEarlyLoad`
- `afterPreload`
- `ModLoaderLoadEnd`

These hooks are **sync only**:

- `canLoadThisMod` (must return a boolean immediately)

:::tip
For very early async setup, use `afterInjectEarlyLoad` or `afterModLoad`. For something that must run last among all Mods, use `ModLoaderLoadEnd`.
:::
