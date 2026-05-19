# Combat reaction (removed)

Starting with framework **v3.2.5**, the combat module no longer includes (see the [v3.2.5 release notes](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/releases/tag/maplebirch-release-v3.2.5)):

- **`maplebirch.combat.Reaction`** — combat reaction registration
- **Crossdress / herm dialogue** — reaction dialogue built on Reaction
- **Combat ejaculation helpers** — see [Combat speech](./speech) (`ejaculation`, etc.)

`CombatManager` now only covers **[combat actions](./actions)** (`maplebirch.combat.CombatAction`).

## Migration

- For combat dialogue or conditional text, use vanilla combat passages, SugarCube macros, or `<<run>>` / `<<print>>` at the appropriate hooks.
- For named NPCs, dynamic events, and other framework features, continue using `maplebirch.npc`, `maplebirch.dynamic`, etc.—they are unrelated to the removed reaction APIs.
