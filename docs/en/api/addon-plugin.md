# AddonPlugin System

Addons are special Mods that act as an extension layer. By centralizing common functionality in one Mod for others to call, Addons keep ModLoader lean and make updates easier.

## Design Rationale

Similar to RimWorld "Body Extension" or "Combat Extension" Mods, Addons inject and modify the game and expose new functionality for other Mods.

Benefits of Addons:
- Keeps ModLoader core small and generic
- Separates game-specific features from SC2-tied ModLoader
- Enables fast iteration and upgrades
- Mod authors can fork and extend Addons without touching ModLoader

## Registering an Addon

Addon Mods must register during **EarlyLoad** (or **InjectEarlyLoad**):

```js
window.modAddonPluginManager.registerAddonPlugin(
  'AddonModName',   // Mod providing the plugin
  'addonName',      // Plugin name
  addonInstance     // Plugin instance (object implementing AddonPluginHookPointEx)
);
```

## Using an Addon

Regular Mods declare the dependency in `boot.json` via `addonPlugin`:

```json
{
  "addonPlugin": [
    {
      "modName": "AddonModName",
      "addonName": "addonName",
      "modVersion": "1.0.0",
      "params": []
    }
  ]
}
```

After EarlyLoad and before PatchModToGame, ModLoader registers all Mods that declare `addonPlugin` with their Addon Mods.

## Registration Flow

```
1. Addon Mod calls registerAddonPlugin() during EarlyLoad
     ↓
2. ModLoader calls registerMod2Addon() to register regular Mods with Addons
     ↓
3. Addon Mod receives registerMod callback
     ↓
4. Addon Mod records or performs actions as needed
```

## Addon Examples

### ImageLoaderHook

[ImageLoaderHook](https://github.com/Lyoko-Jeremie/DoL_ImgLoaderHooker) hooks DoL's image loader (`Renderer.ImageLoader`) so images from Mod zips are loaded into the game. Image loads are automatically replaced by Mod content.

### ReplacePatch / TweeReplacer

[ReplacePatch](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_ReplacePatch) and [TweeReplacer](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_TweeReplacer) provide Passage and JS/CSS string replacement. Most Mods that need to change game logic can use them without writing custom patch code.

### CheckDoLCompressorDictionaries

[CheckDoLCompressorDictionaries](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_CheckDoLCompressorDictionaries) checks DoL's compression dictionary structure and warns when it changes so developers and users can avoid save corruption.
