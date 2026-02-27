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

The NPCSidebar submodule handles NPC sidebar model rendering with multi-layer configuration:

- `base_layers` — Base body layers
- `face_layers` — Face layers
- `head_layers` — Head layers
- `upper_layers` — Upper body layers
- `lower_layers` — Lower body layers
- `legs_layers` — Leg layers
- `feet_layers` — Feet layers
- `hands_layers` — Hand layers
- `handheld_layers` — Handheld item layers
- `neck_layers` — Neck layers

### Loading Layer Images from Mods

Load via `boot.json` `npc.Sidebar` configuration:

```json
{
  "npc": {
    "Sidebar": {
      "image": ["img/npc/sidebar/"],
      "config": ["npc/sidebar_config.json"],
      "clothes": ["npc/clothes_config.json"]
    }
  }
}
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
