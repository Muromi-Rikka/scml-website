# Combat System

The CombatManager module provides combat-related extension capabilities for Mods, including combat action registration, reaction system, and combat speech.

## Combat Actions

Register custom combat actions through `CombatAction.reg()`. Use `maplebirch.combat.CombatAction.reg` or `maplebirchFrameworks.addAction`.

**Registration** — pass one or more config objects:

```js
maplebirch.combat.CombatAction.reg({
  id: "custom_attack",
  actionType: "leftaction",           // or ['leftaction','rightaction'] for multiple slots
  cond: (ctx) => V.player.health > 0 && V.player.hasWeapon,
  display: (ctx) => (V.player.weaponType === "sword" ? "Strike" : "Attack"),
  value: "customAttack",
  color: "white",
  difficulty: "Easy",
  combatType: "Default",
  order: 0,
});
```

- **actionType**: a single preset string (e.g. `leftaction`, `rightaction`) or an **array** of such strings; when using an array, the same button is shown in multiple body slots.
- **combatType**: one of `Default`, `Self`, `Struggle`, `Swarm`, `Vore`, `Machine`, `Tentacle`.

The `CombatAction` submodule also provides:

| Method                                         | Description                                         |
| ---------------------------------------------- | --------------------------------------------------- |
| `action(optionsTable, actionType, combatType)` | Inject custom actions into the combat options table |
| `difficulty(action, combatType)`               | Return the difficulty hint macro for custom actions |
| `color(action, encounterType)`                 | Return the color for custom actions                 |

## Reaction System

The `Reaction` submodule manages NPC reactions during combat:

```js
const Reaction = maplebirch.combat.Reaction;

Reaction.init();
```

## Combat Speech

The `Speech` submodule handles NPC speech during combat:

```js
const Speech = maplebirch.combat.Speech;

Speech.init();
```

## Combat Buttons

The framework automatically registers `generateCombatAction` and `combatButtonAdjustments` macros to enhance the game's combat button system:

- Supports list mode (`lists`, `limitedLists`) and radio button mode (`radio`, `columnRadio`)
- Color highlighting for custom actions
- Difficulty hint auto-updates when selecting from dropdown lists

## Ejaculation Events

The `ejaculation()` method provides custom ejaculation event macros for named NPCs:

```js
const macro = maplebirch.combat.ejaculation(npcIndex, "args");
// Returns macro string like "<<ejaculation-robin args>>"
```
