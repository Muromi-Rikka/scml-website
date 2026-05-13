# Combat Speech (Removed)

Starting with **v3.2.3**, **`maplebirch.combat.Speech`**, **`maplebirch.combat.ejaculation`**, and related combat dialogue helpers were removed from the combat module; the base game can cover these flows directly (see the [v3.2.3 release notes](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/releases/tag/maplebirch-release-v3.2.3)).

## Migration

- General combat lines: output them from the relevant passage/widget with normal SugarCube conditionals.
- Named NPC ejaculation lines: register vanilla-style widgets such as `<<widget "ejaculation-<npc>">>` yourself, or inject them via TweeReplacer / ReplacePatcher—there is no longer a framework combat wrapper for this.
