# NPC Sidebar

## Overview

The NPC sidebar system lets mod authors add sidebar display for custom NPCs, either as static images or as a dynamic model driven by the in-game clothing system.

---

## Display Modes

1. **Static image mode**: Pre-drawn static images.
2. **Dynamic model mode**: Rendered from the in-game clothing system.

---

## Static Image Mode

### Image Paths

```
img/ui/nnpc/[npc_name]/[image_name].[png|jpg|gif]
```

- `[npc_name]`: NPC name (lowercase, e.g. luna, draven).
- `[image_name]`: Image name; becomes a selectable option in-game.

Example:

```
img/ui/nnpc/luna/default.png
img/ui/nnpc/luna/happy.png
img/ui/nnpc/luna/angry.png
```

Once `luna` is registered in `boot.json`, these images are available as sidebar options.

---

## boot.json Configuration

### Basic Structure

```json
{
  "params": {
    "npc": {
      "Sidebar": {
        "image": ["luna", "draven"]
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
      "Sidebar": {
        "image": ["Elara", "Merlin", "Draven"],
        "clothes": ["data/npc/elven_clothes.yaml", "data/npc/wizard_wardrobe.json"],
        "config": ["data/npc/elara_sidebar.yaml", "data/npc/merlin_sidebar.json"]
      }
    }
  }
}
```

### Field Reference

| Field     | Type     | Description                                                |
| --------- | -------- | ---------------------------------------------------------- |
| `image`   | string[] | Static sidebar NPCs; images from `img/ui/nnpc/<npcName>/`  |
| `clothes` | string[] | Clothing config for dynamic model mode                     |
| `config`  | string[] | Dynamic model layer config (YAML/JSON)                      |

---

## Layer Configuration Examples

### Sidebar Layers (YAML)

```yaml
# data/npc/elara_sidebar.yaml
- name: "Elara"   # Must match NPC system ID
  body: "img/npc/elara/body.png"

  head:
    - { img: "img/npc/elara/hair.png", zIndex: auto }
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

- `body`: Base layer.
- `head` / `face` / `upper` / `lower`: Logical layer groups.
- `zIndex`: Order; `auto` for auto-computed order.
- `cond`: Expression; layer is shown only when it evaluates to `true`.

### Sidebar Layers (JSON)

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

Images are registered with the BeautySelectorAddon image pipeline.

### Clothing Config (YAML) — Simplified

```yaml
# data/npc/elven_clothes.yaml
elven_robes:
  upper: { name: "elven_robe", colour: "silver" }
  lower: { name: "elven_skirt", colour: "forest_green" }
  head: { name: "silver_tiara" }

hunting_gear:
  upper: { name: "leather_vest", colour: "brown" }
  lower: { name: "riding_pants", colour: "dark_brown" }
  head: { name: "leather_hood" }

Elara:
  forest: "elven_robes"
  hunting_grounds:
    key: "hunting_gear"
    cond: "V.time.hour >= 6 && V.time.hour <= 18"
  "*": "elven_robes"
```

Full dynamic model clothing follows the game’s vanilla clothing structure (all slots such as `over_upper`, `upper`, `lower`, etc.).

---

## Example Layout

```
fantasyMod/
├── img/
│   └── ui/
│       └── nnpc/
│           ├── elara/
│           │   ├── portrait.png
│           │   ├── casual.png
│           │   └── formal.png
│           └── draven/
│               ├── default.png
│               └── armored.png
├── data/
│   └── npc/
│       ├── elara_sidebar.yaml
│       ├── draven_sidebar.yaml
│       └── elven_clothes.yaml
└── boot.json
```
