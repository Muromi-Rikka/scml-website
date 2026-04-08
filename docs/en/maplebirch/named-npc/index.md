# NPC Registration

## Overview

The NPC system allows mod authors to add custom non-player characters (NPCs) to the game. You can define appearance, personality, relationship state, schedule, and special abilities.

_Register mod NPCs via `maplebirch.npc.add` or `maplebirchFrameworks.addNPC`._

When used with ModI18N, the framework corrects pronoun (his/hers) display for some vanilla NPCs.

---

## Basic Syntax

```javascript
maplebirch.npc.add(
  npcData, // NPC base data
  npcConfig, // NPC configuration
  translations, // Translation data (optional)
);
```

## NPC Base Data (NPCData)

| Field              | Type                   | Description                   | Default   |
| ------------------ | ---------------------- | ----------------------------- | --------- |
| `nam`              | string                 | **Required.** Unique NPC name | —         |
| `gender`           | 'm'/'f'/'h'/'n'/'none' | Gender                        | random    |
| `title`            | string                 | Title / epithet               | 'none'    |
| `description`      | string                 | Description text              | NPC name  |
| `type`             | string                 | NPC type                      | 'human'   |
| `adult`            | number                 | Adult (1/0)                   | random    |
| `teen`             | number                 | Teen (1/0)                    | random    |
| `age`              | number                 | Age                           | 0         |
| `insecurity`       | string                 | Insecurity type               | random    |
| `chastity`         | object                 | Chastity state                | {}        |
| `virginity`        | object                 | Virginity state               | intact    |
| `hair_side_type`   | string                 | Side hair type                | 'default' |
| `hair_fringe_type` | string                 | Fringe type                   | 'default' |
| `hair_position`    | string                 | Hair position                 | 'back'    |
| `hairlength`       | number                 | Hair length                   | random    |
| `eyeColour`        | string                 | Eye colour                    | random    |
| `hairColour`       | string                 | Hair colour                   | random    |
| `bottomsize`       | number                 | Bottom size                   | random    |
| `skincolour`       | number                 | Skin colour                   | 0         |
| `init`             | number                 | Init state                    | 0         |
| `intro`            | number                 | Intro state                   | 0         |
| `penis`            | string                 | Penis state                   | by gender |
| `penissize`        | number                 | Penis size                    | by gender |
| `vagina`           | string                 | Vagina state                  | by gender |
| `breastsize`       | number                 | Breast size                   | by gender |
| `ballssize`        | number                 | Testicles size                | by gender |
| `outfits`          | string[]               | Outfit list                   | default   |
| `pregnancy`        | any                    | Pregnancy state               | null      |

### Gender

- `'m'`: Male
- `'f'`: Female
- `'h'`: Herm
- `'n'`: Neuter
- `'none'`: None

### Random Weights

- Male: 47%, Female: 47%, Herm: 5%, Neuter: 1%

### Insecurity Types

- `'weak'`, `'looks'`, `'ethics'`, `'skill'`

### Eye Colours

Purple, dark blue, light blue, amber, hazel, green, red, pink, grey, light grey, lime.

### Hair Colours

Red, black, brown, light brown, blond, platinum blond, strawberry blond, ginger.

---

## Basic NPC Creation

```javascript
// Simple NPC
maplebirch.npc.add(
  {
    nam: "Luna",
    gender: "f",
    title: "Moon Witch",
    description: "A mysterious witch who lives deep in the forest",
    age: 25,
    hairColour: "platinumblond",
    eyeColour: "purple",
    breastsize: 3,
    outfits: ["witch_robes", "casual_dress"],
  },
  {
    love: { maxValue: 100 },
    important: true,
    loveInterest: true,
  },
);
```

### Complex NPC

```javascript
maplebirch.npc.add(
  {
    nam: "Draven",
    gender: "m",
    title: "Mercenary Captain",
    description: "A seasoned mercenary with a prominent scar over his right eye",
    adult: 1,
    insecurity: "skill",
    chastity: { penis: "chastity_belt", vagina: "", anus: "" },
    virginity: { penile: false, vaginal: true, anal: false },
    hair_side_type: "short",
    hair_fringe_type: "messy",
    hairlength: 300,
    eyeColour: "light grey",
    hairColour: "black",
    penissize: 4,
    breastsize: 0,
    ballssize: 3,
    outfits: ["mercenary_armor", "casual_clothes", "formal_wear"],
  },
  {
    love: { maxValue: 150 },
    important: true,
    special: true,
    romance: [() => V.completedDravenQuest, () => V.dravenTrust >= 50],
    loveAlias: ["Loyalty", "Loyalty"],
  },
);
```

### With Translations

```javascript
const translations = new Map();
translations.set("Luna", { EN: "Luna", CN: "露娜" });
translations.set("Moon Witch", { EN: "Moon Witch", CN: "月光女巫" });

maplebirch.npc.add(
  { nam: "Luna", description: "A mysterious witch who lives deep in the forest" },
  { love: { maxValue: 100 } },
  translations,
);
```

---

## boot.json Configuration

### Structure

```json
{
  "modName": "maplebirch",
  "addonName": "maplebirchAddon",
  "modVersion": "^3.1.0",
  "params": {
    "npc": {
      "NamedNPC": [
        [
          { "/* npcData */" },
          { "/* npcConfig */" },
          { "/* translations */" }
        ]
      ]
    }
  }
}
```

### Full Example

```json
{
  "params": {
    "npc": {
      "NamedNPC": [
        [
          {
            "nam": "Elara",
            "gender": "f",
            "title": "Elven Archer",
            "description": "Guardian of the forest, skilled with the bow",
            "age": 120,
            "eyeColour": "green",
            "hairColour": "lightbrown",
            "breastsize": 2,
            "outfits": ["elven_armor", "hunting_gear"]
          },
          {
            "love": { "maxValue": 120 },
            "important": true,
            "loveInterest": false
          },
          {
            "Elara": { "EN": "Elara", "CN": "伊拉娜" },
            "Elven Archer": { "EN": "Elven Archer", "CN": "精灵弓箭手" }
          }
        ],
        [
          {
            "nam": "Kael",
            "gender": "m",
            "title": "Dwarven Smith",
            "description": "A gruff but skilled dwarven blacksmith",
            "adult": 1,
            "hairColour": "ginger",
            "penissize": 2,
            "ballssize": 3
          },
          { "love": { "maxValue": 80 }, "special": true }
        ]
      ]
    }
  }
}
```

---

## NPC Config (NPCConfig)

| Field          | Type                           | Description                      |
| -------------- | ------------------------------ | -------------------------------- |
| `love`         | `{ maxValue: number }`         | Love/Like max value              |
| `loveAlias`    | `[string, string]` or function | Love/Like alias (e.g. CN/EN)     |
| `important`    | boolean or function            | Whether NPC is important         |
| `special`      | boolean or function            | Whether NPC is special           |
| `loveInterest` | boolean or function            | Whether NPC can be love interest |
| `romance`      | `(() => boolean)[]`            | Romance condition functions      |

### Example

```javascript
{
  love: { maxValue: 100 },
  loveAlias: ['Affection', 'Affection'],
  loveAlias: () => (V.playerTrust > 50 ? ['Trust', 'Trust'] : ['Affection', 'Affection']),
  important: true,
  important: () => V.hasCompletedMainQuest === true,
  special: false,
  loveInterest: true,
  romance: [
    () => V.npcMet >= 5,
    () => V.npcTrust >= 30,
    () => !V.npcBetrayed,
  ],
}
```

---

## Pronoun System

The framework provides pronoun mapping for English and Chinese:

| Type | Description | he (EN) | he (CN) |
| ---- | ----------- | ------- | ------- |
| `m`  | Male        | he      | 他      |
| `f`  | Female      | she     | 她      |
| `i`  | Non-person  | it      | 它      |
| `n`  | Neuter      | they    | 她      |
| `t`  | Plural      | they    | 他们    |

Each type includes mappings for `he`, `his`, `hers`, `him`, `himself`, `man`, `boy`, `men`, etc.

---

## Related Systems

- **Custom stats** (e.g. trust, favour): see [NPC Stats](npc-stats).
- **Schedules and locations**: see [NPC Schedule](npc-schedule).
- **Clothing and wardrobe**: see [NPC Clothes](npc-clothes).
- **Sidebar display** (static images or dynamic model): see [NPC Sidebar](npc-sidebar).

---

## Pregnancy System

The framework initializes the NPC pregnancy system by NPC name and type:

- Infertile NPCs (e.g. Bailey, Leighton) are not initialized.
- Supported types: `human`, `wolf`, `wolfboy`, `wolfgirl`, `hawk`, `harpy`.
- Specific NPCs (Alex, Black Wolf, Great Hawk) are pregnant by default.
