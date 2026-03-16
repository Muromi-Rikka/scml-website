# Combat Speech

## Overview

The combat speech system lets mod authors register dialogue that triggers during combat. Each line can have a condition and a cooldown so it does not repeat too often.

_Access via `maplebirch.combat.Speech`._

---

## Registering Combat Speech

### Basic Syntax

```javascript
// Single line
maplebirch.combat.Speech.reg(
  "Luna",
  () => V.player.health < 30,
  '"You look badly hurt. Need help?"',
  3, // Cooldown (turns)
);

// Multiple lines
maplebirch.combat.Speech.reg(
  "Draven",
  () => V.combatTurn === 1,
  '"Let\'s make this quick!"',
  5,
);
maplebirch.combat.Speech.reg(
  "Draven",
  () => V.player.attackCount >= 3,
  '"Not bad, but not good enough!"',
  2,
);
```

### Method Signature

```javascript
reg(
  npc: string,           // NPC name
  cond: () => boolean,   // Condition
  speech: string | () => string,  // Dialogue (or function returning it)
  cd: number             // Cooldown in turns
): void
```

---

## Basic Examples

```javascript
// By health
maplebirch.combat.Speech.reg(
  "Merlin",
  () => V.player.health < 20,
  '"You could use a healing spell!"',
  4,
);

// By turn
maplebirch.combat.Speech.reg(
  "Elara",
  () => V.combatTurn === 3,
  '"Three turns in. Let\'s end this."',
  6,
);

// By status
maplebirch.combat.Speech.reg(
  "DarkKnight",
  () => V.player.status?.poisoned,
  '"Poison is eating you. Give up."',
  3,
);
```

---

## Dynamic Speech

```javascript
// Random line
maplebirch.combat.Speech.reg(
  "TavernBrawler",
  () => V.player.drunkenness >= 50,
  () => {
    const insults = [
      '"Had a few too many? Can\'t even stand straight!"',
      '"A drunk trying to fight?"',
      '"Need another drink for courage?"',
    ];
    return _.sample(insults);
  },
  2,
);

// With variables
maplebirch.combat.Speech.reg(
  "GoblinChief",
  () => V.combatTurn % 5 === 0,
  () => {
    const remaining = V.NPCList.length;
    return `"I still have ${remaining} goblins. You can\'t win!"`;
  },
  5,
);

// By language
maplebirch.combat.Speech.reg(
  "ElvenGuard",
  () => V.player.race === "human",
  () => {
    if (maplebirch.Language === "CN") {
      return '"人类，你不该踏足精灵的领地！"';
    } else {
      return '"Human, you should not trespass on elven lands!"';
    }
  },
  4,
);
```

---

## Ejaculation Events

The framework provides custom ejaculation macros for named NPCs:

```js
const macro = maplebirch.combat.ejaculation(npcIndex, "args");
// Returns a macro string like "<<ejaculation-robin args>>"
```

### Ejaculation Dialogue (SugarCube)

Define a macro named `ejaculation-<npc_name>` (NPC name in lowercase) to customise dialogue when that NPC ejaculates.

```javascript
// In passage (widget)
<<widget "ejaculation-luna">>
  <<if _args.length>>
    Luna <<print _args[0]>> ejaculates.
  <<else>>
    Luna ejaculates.
  <</if>>
<</widget>>

// In JavaScript
Macro.add("ejaculation-merlin", {
  handler() {
    const output = this.args[0] ? ` ${this.args[0]}` : "";
    return `Merlin${output} ejaculates.`;
  },
});
```

### Notes

1. Macro name must be `ejaculation-<npc_name>`.
2. NPC name must be lowercase.
3. The macro can take one optional argument for context.
4. If no macro is defined for an NPC, the game uses default behaviour.
