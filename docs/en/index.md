---
pageType: home

hero:
  name: ModLoader
  text: SugarCube-2 Mod Loading Framework
  tagline: Mod loading and management framework designed for the SugarCube2 interactive fiction engine
  actions:
    - theme: brand
      text: Getting Started
      link: /en/ml/guide/
    - theme: alt
      text: GitHub
      link: https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader
features:
  - title: Multi-Source Mod Loading
    details: Load Mods from four sources—HTML-embedded, remote servers, localStorage, and IndexedDB. Later-loaded Mods with the same name automatically override earlier ones.
    icon: 📦
  - title: Four-Stage Script Loading
    details: Four script loading stages—inject_early, earlyload, preload, and scriptFileList—let Mod authors precisely control game data at different moments.
    icon: ⚡
  - title: Passage / Style / Script Merging
    details: Mod's tweeFileList, styleFileList, and scriptFileList are merged into the tw-storydata node before SugarCube2 reads the data.
    icon: 🔀
  - title: Inter-Mod Communication
    details: Via the AddonPlugin system and ModInfo.modRef mechanism, Mods can expose APIs to each other and interact.
    icon: 🔗
  - title: Dependency Checking
    details: Mods can declare dependencies on other Mods, ModLoader version, and game version in boot.json; they are validated automatically during load.
    icon: ✅
  - title: Safe Mode
    details: After three consecutive load failures, safe mode is entered automatically, disabling all Mods for recovery and preventing broken Mods from blocking game startup.
    icon: 🛡️
---

## Quick Links

- [Example Mod Tutorial](/en/ml/creating-mods/example-walkthrough) — Complete steps to build a functional Mod from scratch
- [ModPack Format](/en/ml/creating-mods/modpack-format) — Understanding the .modpack binary format
