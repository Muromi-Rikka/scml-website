# Changelog

This site documents **[maplebirch-release-v3.2.5](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/releases/tag/maplebirch-release-v3.2.5)** as the current recommended minimum framework version. Full history lives in upstream [UPDATE.md](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/blob/main/UPDATE.md).

## v3.2.5

Release tag: [maplebirch-release-v3.2.5](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/releases/tag/maplebirch-release-v3.2.5)  
Recommended asset: `maplebirch-0.5.9.7-v3.2.5.modpack`

### Highlights

- Fix **NPC sidebar** character model and related issues
- Remove **combat reaction**, **combat ejaculation**, and **crossdress dialogue** from the combat module (vanilla can cover these)—see [Combat reaction](./combat/reaction) and [Combat speech](./combat/speech)
- Simplify **Simple Frameworks** compatibility on **game version 0.5.9.7** (keep `addto` and `TimeEvent`)—see [Getting started](./getting-started)
- Improve **module registration and usage**—see [Module system](./module-system)
- Fix **time events** on 0.5.9.7—see [Time events](./dynamic/time-events)
- Improve **NPC schedule** registration—see [NPC schedule](./named-npc/npc-schedule)
- Add **reset framework defaults** in mod settings—see [GUI control](./gui-settings)
- Ship **mod encryption** collaboration (`.modpack` + `maplebirch.credential`)—see [Mod protection](./mod-protection)
- Add **Foodstuff** registration (`maplebirch.tool.patch.addFoodstuff`, requires game version 0.5.9.x+) and **Antiques** registration (`maplebirch.tool.patch.addAntiques`) — see [Foodstuff](./tool-collection/foodstuff), [Antiques](./tool-collection/antiques)
- Refactor `maplebirch.tool.other` to `maplebirch.tool.patch` — existing traits, location, and bodywriting API paths updated accordingly
- `boot.json` `framework` field now supports external file references for `foodstuff`, `antiques`, and `bodywriting`

### Documentation

- [Mod protection](./mod-protection) — aligned with upstream README encryption flow
- [Module system](./module-system) — lifecycle, `dependencyGraph`, EXPOSED modules
- [Foodstuff](./tool-collection/foodstuff) — new foodstuff registration API documentation
- [Antiques](./tool-collection/antiques) — new antiques registration API documentation
- [Bodywriting](./tool-collection/bodywriting) — added boot.json configuration section

## Earlier releases

See [UPDATE.md](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/blob/main/UPDATE.md) for v3.1.x, v3.0.x, and older entries. This site no longer documents per-patch compatibility for those versions in the main guides.
