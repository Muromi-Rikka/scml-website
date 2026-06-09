# Changelog

This site documents **[maplebirch-release-v4.0.2](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/releases/tag/maplebirch-release-v4.0.2)** as the current recommended minimum framework version. Full history lives in upstream [UPDATE.md](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/blob/main/UPDATE.md).

## v4.0.2

Release tag: [maplebirch-release-v4.0.2](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/releases/tag/maplebirch-release-v4.0.2)
Recommended asset: `maplebirch-0.5.10.8-v4.0.2.modpack`

:::tip
v4.0.0 accumulates changes since v3.1.14. Framework version bumped to 4.0.0, highest game version dependency updated to 0.5.10.8.
:::

### Types & Core

- Added publishable `@scml-maplebirch/types` package with `maplebirch`, `SugarCube`, and global type declarations

### Time & DateTime

- Rewrote time/date patching logic to reduce conflicts between time progression, time events, and `DoLTimeWrapperAddon`—see [Time events](./dynamic/time-events)
- Fixed `TimeEvent` compatibility interface and cross-passage time rollback issues

### Database

- Fixed load hang when IndexedDB version is lower than the existing database; automatic reset on version downgrade

### Legacy Compatibility

- Simplified legacy compatibility layer, keeping only `addto` and `TimeEvent`

### Module Management

- Optimized registration, dependency execution, and enable/disable logic—see [Module system](./module-system)
- Added **reset framework defaults** in mod settings—see [GUI control](./gui-settings)

### Food & Antique Registration

- Added **foodstuff registration** (game version 0.5.9.x+) and **antiques registration**—see [Foodstuff](./tool-collection/foodstuff), [Antiques](./tool-collection/antiques)

### Combat System Overhaul

- Refactored combat buttons to `maplebirch.combat.CombatAction`, added `effect` field supporting Twine text/function injection via `effectsman`—see [Combat actions](./combat/actions)
- Legacy combat reaction, ejaculation, and crossdress dialogue modules no longer maintained independently

### NPC System

- Fixed NPC descriptions, gender pronouns, and body-part descriptions
- Optimized NPC schedule registration—see [NPC schedule](./named-npc/npc-schedule)
- Updated NPC clothing documentation; extra wardrobe files should use `loadWardrobe`—see [NPC clothing](./named-npc/npc-clothes)
- Fixed NPC sidebar character models, masks, and hat close-up issues—see [NPC sidebar](./named-npc/npc-sidebar)
- Added **NPC transformation**—see [NPC transformation](./named-npc/npc-transformation)
- Added **NPC fluid layers**—see [NPC fluids](./named-npc/npc-fluids)
- Added **NPC pregnancy** (with race registration, per-NPC config, child birth, and transformation data)—see [NPC pregnancy](./named-npc/npc-pregnancy)

### Model & Sidebar

- Masks now support rotation angle
- PC transformation registration can target a specific canvas (e.g. combat canvas)—see [Character rendering](./character/), [Transformation system](./character/transformation)

### Time Travel Cheats

- Added/enhanced **time travel cheats** with year/month/day/hour/minute jump; confirmation refreshes the current page

### SugarCube Macros

- Refactored macro implementations; `<<lanButton>>`/`<<lanLink>>` now support `class:`/`style:` parameters—see [SugarCube macros](./sugar-cube-macro)

### Utility Functions

- Recommended prototype/static methods: `source.clone()`, `Object.merge()`, `list.contains()`, `Math.clamp()`, etc.—see [Utility functions](./tool-collection/utils)
- Legacy global functions still mounted on `window`

### Audio Module

- Split internal structures for `Track`, `Playlist`, and `AudioBufferPlayer`—see [Audio management](./audio)

### Mod Protection

- Provides **mod encryption** functionality—see [Mod protection & credentials](./mod-protection)

### Cloud Saves

- Added **cloud save** client and server examples (Go + SQLite / Cloudflare R2+WebDAV)—see [Cloud saves](./cloud-save)

### Documentation

- [NPC pregnancy](./named-npc/npc-pregnancy) — new pregnancy system documentation
- [NPC transformation](./named-npc/npc-transformation) — new transformation system documentation
- [NPC fluids](./named-npc/npc-fluids) — new fluid layers documentation
- [Cloud saves](./cloud-save) — new cloud save service documentation
- [Combat actions](./combat/actions) — added `effect` field and `effectsman` injection docs
- [Audio management](./audio) — rewritten API docs, split internal structures
- [Utility functions](./tool-collection/utils) — rewritten in prototype/static method style
- [Foodstuff](./tool-collection/foodstuff), [Antiques](./tool-collection/antiques) — added sidebar entry points

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
