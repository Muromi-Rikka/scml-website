# NPC Stats

## Overview

The NPC stats system allows mod authors to add custom numeric attributes to NPCs, such as favour, trust, stress, or special ability level. These stats are shown in the NPC sidebar and can be modified by game logic.

_Register stats via `maplebirch.npc.addStats` or `maplebirchFrameworks.addNPCStats`._

---

## Basic Syntax

```javascript
// Add a single stat
maplebirch.npc.addStats({
  magic_affinity: {
    min: 0,
    max: 100,
    default: 0,
    position: 3,
  },
});

// Add multiple stats
maplebirch.npc.addStats({
  strength: { min: 1, max: 20, default: 1 },
  intelligence: { min: 1, max: 20, default: 1 },
  charisma: { min: 1, max: 20, default: 1 },
});
```

## Stat Configuration Structure

```javascript
{
  [statName]: {
    min: number,                        // Minimum value
    max: number,                        // Maximum value
    default: number,                    // Default value
    position?: number | 'first' | 'last',  // Display position
    [key: string]: any                 // Other custom properties
  }
}
```

## Stat Properties

| Property   | Type                     | Description                    | Required |
| ---------- | ------------------------ | ------------------------------ | -------- |
| `min`      | number                   | Minimum value                  | Yes      |
| `max`      | number                   | Maximum value                  | Yes      |
| `default`  | number                   | Default initial value          | Yes      |
| `position` | number / 'first' / 'last' | Index in the stats list       | No       |

### Position

- `number`: Insert at that index (0 = first).
- `'first'`: Insert at the beginning.
- `'last'`: Insert at the end.

---

## Basic Stat Definitions

```javascript
// Add a favour stat
maplebirch.npc.addStats({
  favor: {
    min: 0,
    max: 100,
    default: 0,
    position: 1,
  },
});

// Add multiple stats
maplebirch.npc.addStats({
  trust: {
    min: 0,
    max: 50,
    default: 0,
    position: 2,
  },
  corruption: {
    min: 0,
    max: 100,
    default: 0,
    position: 3,
  },
});
```

## boot.json Configuration

### Structure

```json
{
  "params": {
    "npc": {
      "Stats": {
        "stat_name_1": {
          "min": 0,
          "max": 100,
          "default": 0,
          "position": 5
        },
        "stat_name_2": {
          "min": 0,
          "max": 20,
          "default": 1,
          "position": 6
        }
      }
    }
  }
}
```

### Full Example

```json
{
  "params": {
    "npc": {
      "Stats": {
        "magic_affinity": {
          "min": 0,
          "max": 100,
          "default": 0,
          "position": 5
        },
        "combat_skill": {
          "min": 0,
          "max": 20,
          "default": 1,
          "position": 6
        },
        "loyalty": {
          "min": 0,
          "max": 100,
          "default": 10,
          "position": 7
        }
      }
    }
  }
}
```

---

## Integration with NPC Data

```javascript
// Define stats first
maplebirch.npc.addStats({
  arcane_knowledge: {
    min: 0,
    max: 100,
    default: 25,
    position: 4,
  },
  spell_resistance: {
    min: 0,
    max: 50,
    default: 10,
    position: 5,
  },
});

// Create an NPC that uses these stats
maplebirch.npc.add(
  {
    nam: "Merlin",
    gender: "m",
    title: "Archmage",
    description: "An ancient mage who holds forbidden knowledge",
    age: 300,
  },
  { love: { maxValue: 200 } },
);

// Set initial stat values
const merlinIndex = setup.NPCNameList.indexOf("Merlin");
V.NPCName[merlinIndex].arcane_knowledge = 85;
V.NPCName[merlinIndex].spell_resistance = 40;
```
