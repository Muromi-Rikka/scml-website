# Bundled Mods and Addons Reference

SCML ships with several built-in mods and provides addon plugins for common operations.

## Core Infrastructure

| Mod               | Description                                            |
| ----------------- | ------------------------------------------------------ |
| ModLoaderGui      | Mod manager UI — load order, enable/disable, load logs |
| ConflictChecker   | Detects mod conflicts with additional constraints      |
| SweetAlert2Mod    | Alert/prompt dialogs via SweetAlert2                   |
| ModSubUiAngularJs | Reusable AngularJS-based UI components                 |

## Twee Content Operations

| Mod                    | Addon Name   | When to Use                                                   |
| ---------------------- | ------------ | ------------------------------------------------------------- |
| TweeReplacer           | tweeReplacer | Replace passage content with regex or file-based strings      |
| I18nTweeReplacer       | —            | i18n support for TweeReplacer                                 |
| TweeReplacerLinker     | —            | Links TweeReplacer and I18nTweeReplacer, shares replace order |
| ReplacePatch           | replacePatch | Simple string replacement for JS/CSS/Passage                  |
| TweePrefixPostfixAddon | —            | Hooks before/after Passage/Widget execution                   |
| Diff3WayMerge          | —            | Git-style three-way merge for passages (developing)           |

### TweeReplacer Usage

Add to boot.json:

```json
{
  "addonPlugin": [
    {
      "modName": "TweeReplacer",
      "addonName": "tweeReplacer",
      "modVersion": "1.0.0",
      "params": []
    }
  ]
}
```

### ReplacePatch Usage

Simple string replacement for JS/CSS/Passage content. Add to boot.json:

```json
{
  "addonPlugin": [
    {
      "modName": "ReplacePatch",
      "addonName": "replacePatch",
      "modVersion": "1.0.0",
      "params": []
    }
  ]
}
```

## Images and UI

| Mod                 | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| ImageLoaderHook     | Intercepts image requests, replaces images from mod zip      |
| BeautySelectorAddon | Multiple beauty image sets in one mod, switchable at runtime |

### ImageLoaderHook Usage

Add images to `imgFileList` in boot.json. Images matching base game paths are replaced automatically.

```json
{
  "imgFileList": ["MyMod_Image/character/avatar.png", "MyMod_Image/backgrounds/room.jpg"],
  "addonPlugin": [
    {
      "modName": "ImageLoaderHook",
      "addonName": "imgLoaderHook",
      "modVersion": "1.0.0",
      "params": []
    }
  ]
}
```

> Some DoL images created by custom `Macro.add("icon", ...)` are not intercepted.

## i18n Internationalization

| Mod            | Description                       |
| -------------- | --------------------------------- |
| I18nTweeList   | i18n support for `tweeFileList`   |
| I18nScriptList | i18n support for `scriptFileList` |

## Game Content Plugins

| Mod                | Description                     |
| ------------------ | ------------------------------- |
| ModdedClothesAddon | Quick clothing addition tool    |
| ModdedFeatsAddon   | Quick achievement addition tool |
| ModdedHairAddon    | Quick hairstyle addition tool   |

## DoL-Specific

| Mod                            | Description                                      |
| ------------------------------ | ------------------------------------------------ |
| CheckGameVersion               | Game version check for dependency system         |
| CheckDoLCompressorDictionaries | Warns on compression dictionary changes          |
| DoLHookWidgetMod               | Patches DoL custom Widgets for TweePrefixPostfix |

## External Tools and Templates

| Mod                    | Type     | Description                                |
| ---------------------- | -------- | ------------------------------------------ |
| PhoneDebugToolsEruda   | Debug    | Mobile debug tools (Eruda wrapper)         |
| DoLModWebpackExampleTs | Template | Mod template with Webpack + TypeScript     |
| DoLModWebpackExampleJs | Template | Mod template with Webpack + JavaScript     |
| SimpleCryptWrapper     | Tool     | Simple mod encryption wrapper              |
| CryptoI18n             | Example  | v2.0.0 mod encryption demo                 |
| ExampleModModifyMod    | Example  | Shows how Mod B reads/changes Mod A's data |

## Creating Your Own Addon

If none of the built-in addons fit, you can create a custom addon:

1. Create a mod that registers during earlyload:

```js
(async () => {
  const addonInstance = {
    registerMod(modName, modZip, params) {
      console.log(`Mod ${modName} registered with my addon`);
      // Record or act on registration
    },
    // Implement other AddonPluginHookPointEx methods as needed
  };

  window.modAddonPluginManager.registerAddonPlugin("MyCustomAddon", "customPlugin", addonInstance);
})();
```

2. Consumer mods declare dependency in their boot.json `addonPlugin` field
3. After all mods load, ModLoader calls your `registerMod` for each consumer
