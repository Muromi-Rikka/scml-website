# Built-in Mods and Submodules

ModLoader splits non-core functionality into separate Mods and ships common ones as built-ins. These Mods are defined in `modList.json`, live as Git submodules under `mod/`, and are embedded as **local** type into the game HTML via `insert2html`. This list is aligned with the [sugarcube-2-ModLoader README](https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader).

## Core Infrastructure

| Mod                                                                       | Status | Description                                                            |
| ------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------- |
| [ModLoaderGui](https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoaderGui) | Usable | Mod manager UI; manage load order, enable/disable Mods, view load logs |
| [ConflictChecker](https://github.com/Lyoko-Jeremie/ConflictCheckerAddon)  | Stable | Conflict checker; additional constraints for Mod conflicts             |
| [SweetAlert2Mod](https://github.com/Lyoko-Jeremie/SweetAlert2Mod)         | Stable | Alert/prompt dialogs via [SweetAlert2](https://sweetalert2.github.io)  |
| [ModSubUiAngularJs](https://github.com/Lyoko-Jeremie/ModSubUiAngularJs)   | Stable | Reusable AngularJS-based UI components                                 |

## Twee Content Operations

| Mod                                                                                  | Status     | Description                                                       |
| ------------------------------------------------------------------------------------ | ---------- | ----------------------------------------------------------------- |
| [TweeReplacer](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_TweeReplacer) | Stable     | Passage replacement with regex and file-based replacement strings |
| [I18nTweeReplacer](https://github.com/Lyoko-Jeremie/I18nTweeReplacerMod)             | Stable     | Native i18n support for TweeReplacer                              |
| [TweeReplacerLinker](https://github.com/Lyoko-Jeremie/TweeReplacerLinkerAddon)       | Stable     | Links TweeReplacer and I18nTweeReplacer, shares replace order     |
| [ReplacePatch](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_ReplacePatch) | Stable     | Simple string replacement for JS/CSS/Passage                      |
| [TweePrefixPostfixAddon](https://github.com/Lyoko-Jeremie/TweePrefixPostfixAddonMod) | Developing | Hooks before/after Passage/Widget execution                       |
| [Diff3WayMerge](https://github.com/Lyoko-Jeremie/Mod_Diff3WayMerge)                  | Developing | Passage merge using Git Diff3Way algorithm                        |

## Images and UI

| Mod                                                                                | Status     | Description                                                  |
| ---------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------ |
| [ImageLoaderHook](https://github.com/Lyoko-Jeremie/DoL_ImgLoaderHooker)            | Stable     | Intercepts image requests, replaces images from Mod zip      |
| [BeautySelectorAddon](https://github.com/Lyoko-Jeremie/DoL_BeautySelectorAddonMod) | Stable     | Multiple beauty image sets in one Mod, switchable at runtime |
| [ModuleCssReplacer](https://github.com/Lyoko-Jeremie/DoL_ModuleCssReplacerAddon)   | Deprecated | CSS replacer (serious performance issues; do not use)        |

## i18n Internationalization

| Mod                                                                       | Status | Description                       |
| ------------------------------------------------------------------------- | ------ | --------------------------------- |
| [I18nTweeList](https://github.com/Lyoko-Jeremie/I18nTweeListAddonMod)     | Stable | i18n support for `tweeFileList`   |
| [I18nScriptList](https://github.com/Lyoko-Jeremie/I18nScriptListAddonMod) | Stable | i18n support for `scriptFileList` |

## DoL-Specific Hooks

| Mod                                                                                                                      | Status | Description                                                    |
| ------------------------------------------------------------------------------------------------------------------------ | ------ | -------------------------------------------------------------- |
| [CheckGameVersion](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_CheckGameVersion)                             | Stable | Game version check for dependency system (DoL)                 |
| [CheckDoLCompressorDictionaries](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_CheckDoLCompressorDictionaries) | Stable | Checks DoL data compression dictionary changes and warns users |
| [DoLHookWidgetMod](https://github.com/Lyoko-Jeremie/DoLHookWidgetMod)                                                    | Stable | Patches DoL custom Widgets for TweePrefixPostfix               |
| DoLTimeWrapperAddon                                                                                                      | —      | DoL time wrapper hook                                          |
| DoLLinkButtonFilter                                                                                                      | —      | DoL link/button filter                                         |

## Game Content Plugins

| Mod                                                                           | Status | Description                    |
| ----------------------------------------------------------------------------- | ------ | ------------------------------ |
| [ModdedClothesAddon](https://github.com/Lyoko-Jeremie/DoL_ModdedClothesAddon) | Stable | DoL quick clothing add tool    |
| [ModdedFeatsAddon](https://github.com/Lyoko-Jeremie/DoL_ModdedFeatsAddon)     | Stable | DoL quick achievement add tool |
| [ModdedHairAddon](https://github.com/Lyoko-Jeremie/DoL_ModdedHairAddon)       | Stable | DoL quick hairstyle add tool   |

## External Mods and Tools

| Mod                                                                               | Type     | Status | Description                                                                   |
| --------------------------------------------------------------------------------- | -------- | ------ | ----------------------------------------------------------------------------- |
| [PhoneDebugToolsEruda](https://github.com/Lyoko-Jeremie/PhoneDebugToolsErudaMod)  | External | Stable | Mobile debug tools, wrapper around [Eruda](https://github.com/liriliri/eruda) |
| [i18n](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_i18nMod)           | External | Stable | i18n Chinese translation Mod                                                  |
| [CryptoI18n](https://github.com/Lyoko-Jeremie/CryptoI18nMod)                      | Example  | Demo   | v2.0.0 Mod encryption demo                                                    |
| [ExampleModModifyMod](https://github.com/Lyoko-Jeremie/ExampleModModifyMod)       | Example  | Demo   | Shows how Mod B reads and modifies Mod A's data and behavior                  |
| [SimpleCryptWrapper](https://github.com/Lyoko-Jeremie/SimpleCryptWrapperMod)      | Tools    | Stable | Simple Mod encryption wrapper                                                 |
| [DoLModWebpackExampleTs](https://github.com/Lyoko-Jeremie/DoLModWebpackExampleTs) | Template | Demo   | Mod template with Webpack + TypeScript                                        |
| [DoLModWebpackExampleJs](https://github.com/Lyoko-Jeremie/DoLModWebpackExampleJs) | Template | Demo   | Mod template with Webpack + JavaScript                                        |

:::info
For detailed usage of each Mod, see the corresponding Mod project's README.md.
:::
