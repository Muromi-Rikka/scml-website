# Named NPC System

The NPCManager module provides complete named NPC registration, data management, sidebar rendering, clothing system, and schedule functionality.

## NPC Registration

### Basic Registration

Register a named NPC via `maplebirch.npc.add()`:

```js
maplebirch.npc.add(
  // NPCData - NPC base data
  {
    nam: "MyNPC",
    gender: "f",
    title: "shopkeeper",
    description: "Shop owner",
    type: "human",
    adult: 1,
    eyeColour: "green",
    hairColour: "brown",
    breastsize: 3,
    outfits: ["femaleDefault"],
  },
  // NPCConfig - NPC configuration
  {
    love: { maxValue: 100 },
    loveAlias: ["好感", "Affection"],
    important: true,
    loveInterest: true,
    romance: [() => V.mynpcRomance === 1],
  },
  // Translations - Translation data (optional)
  {
    MyNPC: { EN: "MyNPC", CN: "我的NPC" },
  },
);
```

### NPCData Interface

| Field            | Type                                 | Description         |
| ---------------- | ------------------------------------ | ------------------- |
| `nam`            | `string`                             | NPC name (required) |
| `gender`         | `'m' \| 'f' \| 'h' \| 'n' \| 'none'` | Gender              |
| `pronoun`        | `'m' \| 'f' \| 'i' \| 'n' \| 't'`    | Pronoun type        |
| `title`          | `string`                             | Title               |
| `description`    | `string`                             | Description         |
| `type`           | `string`                             | Race type           |
| `adult` / `teen` | `number`                             | Adult/teen marker   |
| `eyeColour`      | `string`                             | Eye colour          |
| `hairColour`     | `string`                             | Hair colour         |
| `breastsize`     | `number`                             | Breast size         |
| `penissize`      | `number`                             | Penis size          |
| `bottomsize`     | `number`                             | Bottom size         |
| `ballssize`      | `number`                             | Testicles size      |
| `outfits`        | `string[]`                           | Outfit list         |
| `pregnancy`      | `object`                             | Pregnancy data      |

Unspecified fields will use random or default values.

### NPCConfig Interface

| Field          | Type                               | Description                            |
| -------------- | ---------------------------------- | -------------------------------------- |
| `love`         | `{ maxValue: number }`             | Love/Like max value                    |
| `loveAlias`    | `[string, string] \| () => string` | Love/Like alias (CN/EN)                |
| `important`    | `boolean \| () => boolean`         | Whether the NPC is important           |
| `special`      | `boolean \| () => boolean`         | Whether the NPC is special             |
| `loveInterest` | `boolean \| () => boolean`         | Whether the NPC can be a love interest |
| `romance`      | `(() => boolean)[]`                | Romance condition function list        |

## Pronoun System

The framework has built-in complete pronoun mapping, supporting both Chinese and English:

| Pronoun Type | Description | he(EN) | he(CN) |
| ------------ | ----------- | ------ | ------ |
| `m`          | Male        | he     | 他     |
| `f`          | Female      | she    | 她     |
| `i`          | Non-person  | it     | 它     |
| `n`          | Neuter      | they   | 她     |
| `t`          | Plural      | they   | 他们   |

Each pronoun type includes complete mappings for `he`, `his`, `hers`, `him`, `himself`, `man`, `boy`, `men`, etc.

When used with ModI18N, the framework corrects pronoun (his/hers) display for some vanilla NPCs.

## Custom Attributes

Register custom NPC attributes via `addStats()`:

```js
maplebirch.npc.addStats({
  trust: {
    maxValue: 100,
    position: "last", // 'first', 'last', or numeric index
  },
});
```

Custom attributes are automatically added to all NPCs (default value is 0).

## Pregnancy System

The framework automatically handles NPC pregnancy system initialization. Based on NPC name and type, the system will:

- Infertile NPCs (such as Bailey, Leighton) will not be initialized
- Supported race types: `human`, `wolf`, `wolfboy`, `wolfgirl`, `hawk`, `harpy`
- Specific NPCs (Alex, Black Wolf, Great Hawk) are pregnant by default

## NPC Sidebar

The NPCSidebar submodule handles NPC sidebar rendering with two modes:

1. **Static image mode** — Displays pre-drawn NPC static images
2. **Dynamic model mode** — Renders NPC model based on in-game clothing system

### Static Image Mode

Place images at `img/ui/nnpc/[npc_name]/[image_name].[png|jpg|gif]`:

- `[npc_name]`: NPC name (lowercase, e.g. luna, draven)
- `[image_name]`: Image name, shown as display options in game

Example:

```
img/ui/nnpc/luna/default.png
img/ui/nnpc/luna/happy.png
img/ui/nnpc/luna/angry.png
```

After registering `luna` in `boot.json`, these images are automatically available as sidebar options.

### boot.json Configuration

```json
{
  "params": {
    "npc": {
      "Sidebar": {
        "image": ["Elara", "Merlin", "Draven"],
        "clothes": ["data/npc/elven_clothes.yaml", "data/npc/wizard_wardrobe.json"],
        "config": ["data/npc/elara_sidebar.yaml", "data/npc/merlin_sidebar.json"]
      }
    }
  }
}
```

| Field     | Type     | Description                                                     |
| --------- | -------- | --------------------------------------------------------------- |
| `image`   | string[] | Static sidebar NPCs; reads images from `img/ui/nnpc/<npcName>/` |
| `clothes` | string[] | NPC clothing config for dynamic model mode                      |
| `config`  | string[] | Dynamic model layer config (YAML/JSON)                          |

### Layer Configuration (YAML)

```yaml
# data/npc/elara_sidebar.yaml
- name: "Elara" # Must match NPC system ID
  body: "img/npc/elara/body.png" # Base body, foundation for all layers

  head:
    - { img: "img/npc/elara/hair.png", zIndex: auto } # auto = auto-compute order
    - { img: "img/npc/elara/ears.png", zIndex: 7 }

  face:
    - { img: "img/npc/elara/face_default.png", zIndex: 10 }
    - {
        img: "img/npc/elara/blush.png",
        zIndex: 12,
        cond: "C.npc.Elara.mood === 'shy' || C.npc.Elara.mood === 'happy'",
      }

  upper:
    - {
        img: "img/npc/elara/top_default.png",
        zIndex: 15,
        cond: "maplebirch.npc.Clothes.worn('Elara').upper.name === 'elven_robe'",
      }

  lower:
    - {
        img: "img/npc/elara/skirt_default.png",
        zIndex: 10,
        cond: "maplebirch.npc.Clothes.worn('Elara').lower.name === 'elven_skirt'",
      }
```

- `body` — Base layer
- `head` / `face` / `upper` / `lower` — Logical layer groups
- `zIndex` — Layer order; use `auto` for auto-computed order
- `cond` — Condition expression; layer renders only when it evaluates to `true`

### Layer Configuration (JSON)

```json
[
  {
    "name": "Elara",
    "body": "img/npc/elara/body.png",
    "head": [
      { "img": "img/npc/elara/hair.png", "zIndex": "auto" },
      { "img": "img/npc/elara/ears.png", "zIndex": 7 }
    ],
    "face": [
      { "img": "img/npc/elara/face_default.png", "zIndex": 10 },
      {
        "img": "img/npc/elara/blush.png",
        "zIndex": 12,
        "cond": "C.npc.Elara.mood === 'shy' || C.npc.Elara.mood === 'happy'"
      }
    ],
    "upper": [
      {
        "img": "img/npc/elara/top_default.png",
        "zIndex": 15,
        "cond": "maplebirch.npc.Clothes.worn('Elara').upper.name === 'elven_robe'"
      }
    ],
    "lower": [
      {
        "img": "img/npc/elara/skirt_default.png",
        "zIndex": 10,
        "cond": "maplebirch.npc.Clothes.worn('Elara').lower.name === 'elven_skirt'"
      }
    ]
  }
]
```

Images are automatically registered to the BeautySelectorAddon image pipeline.

## NPC Clothing

The NPCClothes submodule manages the NPC clothing system:

```js
maplebirch.npc.addClothes({
  name: "customOutfit",
  // Clothing configuration...
});
```

Clothing configuration can be loaded from JSON files; specify the path in `npc.Sidebar.clothes` in `boot.json`.

## NPC Schedules

The NPCSchedules submodule manages NPC location schedules:

```js
maplebirch.npc.addSchedule(
  "MyNPC", // NPC name
  { hour: 8, minute: 0, endHour: 17, endMinute: 0 }, // Time condition
  "shop", // Location
  "work_schedule", // Schedule ID
  { priority: 10 }, // Options
);
```

The schedule system supports:

- Time-based schedules
- Condition-based schedules
- Special schedules (with priority)
- Enable/disable via `V.options.maplebirch.npcschedules`
