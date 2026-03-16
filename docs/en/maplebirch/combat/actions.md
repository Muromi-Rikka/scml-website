# Combat Actions

## Overview

The combat action system lets mod authors add custom combat actions to the combat UI: attacks, defence, special skills, and interactions. Each action can have its own display condition, effect, colour, and difficulty hint.

_Register via `maplebirch.combat.CombatAction.reg` or `maplebirchFrameworks.addAction`._

---

## Constraints

### actionType

`actionType` must be one of these presets:

| Type            | Description   | Slot     |
| ---------------- | ------------- | -------- |
| `leftaction`     | Left hand     | Left hand |
| `rightaction`    | Right hand    | Right hand |
| `feetaction`     | Feet          | Feet      |
| `mouthaction`    | Mouth         | Mouth     |
| `penisaction`    | Penis         | Penis     |
| `vaginaaction`   | Vagina        | Vagina    |
| `anusaction`     | Anus          | Anus      |
| `chestaction`    | Chest         | Chest     |
| `thighaction`    | Thighs        | Thighs    |

`actionType` can be a **single string** or an **array** (e.g. `['leftaction','rightaction']`); the same action is then shown in multiple slots.

### combatType

`combatType` must be one of:

| Type       | Description        |
| ---------- | ------------------ |
| `Default`  | Default combat     |
| `Self`     | Self combat (e.g. masturbation) |
| `Struggle` | Struggle           |
| `Swarm`    | Swarm              |
| `Vore`     | Vore               |
| `Machine`  | Machine            |
| `Tentacle` | Tentacle           |

---

## Registering Actions

### Basic Syntax

```javascript
// Single action
maplebirch.combat.CombatAction.reg({
  id: "custom_attack",
  actionType: "leftaction",
  cond: (ctx) => V.player.health > 0 && V.player.hasWeapon,
  display: (ctx) => (V.player.weaponType === "sword" ? "Strike" : "Attack"),
  value: "customAttack",
  color: "white",
  difficulty: "Easy",
  combatType: "Default",
  order: 0,
});

// Same button in multiple slots: use array for actionType
maplebirch.combat.CombatAction.reg({
  id: "dual_strike",
  actionType: ["leftaction", "rightaction"],
  cond: (ctx) => V.player.health > 0,
  display: "Dual Strike",
  value: "dualStrike",
  color: "red",
  difficulty: "Attack with both hands",
  combatType: "Default",
  order: 0,
});

// Multiple actions
maplebirch.combat.CombatAction.reg(
  {
    id: "defensive_stance",
    actionType: "rightaction",
    cond: (ctx) => V.player.stamina >= 20,
    display: "Defensive Stance",
    value: "defensiveStance",
    color: "blue",
    difficulty: "Medium",
    combatType: "Default",
  },
  {
    id: "healing_potion",
    actionType: "mouthaction",
    cond: (ctx) => V.player.inventory.healing_potion > 0,
    display: (ctx) => `Healing Potion (${V.player.inventory.healing_potion} left)`,
    value: "useHealingPotion",
    color: "green",
    difficulty: "Easy",
    combatType: "Default",
  },
);
```

### Config Shape

```javascript
{
  id: string,                          // Unique id
  actionType: string | string[],      // Preset(s); array = show in multiple slots
  cond: (ctx) => boolean,             // When to show
  display: string | (ctx) => string,   // Label
  value: any,                         // Value passed when chosen
  color?: string | (ctx) => string,    // Colour
  difficulty?: string | (ctx) => string, // Difficulty hint
  combatType?: string | (ctx) => string, // Must be a preset combatType
  order?: number | (ctx) => number    // Sort order
}
```

### CombatAction Helpers

| Method                                         | Description                                         |
| ---------------------------------------------- | --------------------------------------------------- |
| `action(optionsTable, actionType, combatType)` | Inject custom actions into the combat options table |
| `difficulty(action, combatType)`               | Return the difficulty hint macro for custom actions |
| `color(action, encounterType)`                 | Return the colour for custom actions                 |

---

## Colours

### Built-in

- `white`, `red`, `green`, `blue`, `yellow`, `orange`, `purple`, `pink`
- `gray`, `silver`, `gold`
- `def` (defence), `meek`, `sub`, `brat`

### Dynamic Colour

```javascript
maplebirch.combat.CombatAction.reg({
  id: "desperate_escape",
  actionType: "anusaction",
  cond: (ctx) => V.player.health <= 30,
  display: "Desperate Escape",
  value: "desperateEscape",
  color: (ctx) => {
    if (V.player.health <= 10) return "red";
    if (V.player.health <= 20) return "orange";
    return "yellow";
  },
  difficulty: "Higher success at lower health",
  combatType: "Default",
  order: 0,
});
```

---

## Combat Buttons (Framework)

The framework registers `generateCombatAction` and `combatButtonAdjustments` macros:

- Supports list mode (`lists`, `limitedLists`) and radio mode (`radio`, `columnRadio`)
- Colour highlighting for custom actions
- Difficulty hint updates when selecting from dropdowns

---

## Example: Mage Actions

```javascript
maplebirch.tool.onInit(() => {
  maplebirch.combat.CombatAction.reg({
    id: "fireball",
    actionType: "rightaction",
    cond: (ctx) => V.player.class === "mage" && V.player.mana >= 25,
    display: (ctx) => `Fireball (25 mana)`,
    value: "fireball",
    color: (ctx) => (V.player.mana >= 25 ? "orange" : "gray"),
    difficulty: "High fire damage to one enemy",
    combatType: "Default",
    order: 1,
  });

  maplebirch.combat.CombatAction.reg({
    id: "frost_nova",
    actionType: "leftaction",
    cond: (ctx) => V.player.class === "mage" && V.player.mana >= 40,
    display: (ctx) => `Frost Nova (40 mana)`,
    value: "frostNova",
    color: (ctx) => (V.player.mana >= 40 ? "lightblue" : "gray"),
    difficulty: "Freeze all enemies for one turn",
    combatType: "Default",
    order: 2,
  });

  maplebirch.combat.CombatAction.reg({
    id: "magic_shield",
    actionType: "chestaction",
    cond: (ctx) => V.player.class === "mage" && V.player.mana >= 20,
    display: (ctx) => `Magic Shield (20 mana)`,
    value: "magicShield",
    color: (ctx) => (V.player.mana >= 20 ? "blue" : "gray"),
    difficulty: "Absorb damage from the next three attacks",
    combatType: "Default",
    order: 0,
  });
});
```
