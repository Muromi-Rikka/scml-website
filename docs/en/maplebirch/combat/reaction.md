# Combat Reaction (Removed)

Starting with framework **v3.2.3**, **`maplebirch.combat.Reaction`** and the related reaction dialogue APIs (including crossdress / herm style registrations) were removed from the combat module, matching the upstream [v3.2.3 release notes](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/releases/tag/maplebirch-release-v3.2.3). `CombatManager` now only covers **[combat actions](./actions)** (`maplebirch.combat.CombatAction`).

## Migration

- For in-combat dialogue or conditional text, use vanilla combat passages, SugarCube macros, or `<<run>>` / `<<print>>` wired to the appropriate game hooks.
- Other framework features (`maplebirch.npc`, `maplebirch.dynamic`, etc.) are unchanged and do not depend on the removed reaction APIs.
