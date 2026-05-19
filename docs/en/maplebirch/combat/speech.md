# Combat speech (removed)

Starting with **v3.2.5**, **`maplebirch.combat.Speech`**, **`maplebirch.combat.ejaculation`** (**combat ejaculation** macro helpers), and related combat dialogue APIs were removed from the combat module; the base game can cover these flows directly (see the [v3.2.5 release notes](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/releases/tag/maplebirch-release-v3.2.5)).

**Combat reaction** and **crossdress dialogue** were removed in the same release—see [Combat reaction](./reaction).

## Migration

- General combat lines: output conditions in the relevant passage or widget with SugarCube.
- Named NPC ejaculation lines: register `<<widget "ejaculation-<npc>">>` macros per vanilla conventions, or inject via TweeReplacer / ReplacePatcher, instead of framework combat wrappers.
