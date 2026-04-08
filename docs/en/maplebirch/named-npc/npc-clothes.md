# NPC Clothes

## Overview

The NPC clothing system has three related subsystems for different use cases:

1. **Vanilla NPC clothes** (`addClothes`) — In-game interaction (undress, inspect, damage, etc.)
2. **NPC sidebar default clothes** (`Sidebar.config`) — What the NPC wears in the sidebar
3. **NPC Wardrobe** — Outfit changes by location and conditions

_Register vanilla NPC clothes via `maplebirch.npc.addClothes` or `maplebirchFrameworks.addNPCClothes`._

---

## Vanilla NPC Clothes (VanillaClothes)

### Purpose

Handles in-game clothing interactions (undress, inspect, damage). These outfits are used in NPC dialogue, events, and interactions.

### Usage

```javascript
maplebirch.npc.addClothes({
  name: "school_uniform",
  type: "uniform",
  gender: "f",
  upper: {
    name: "school_shirt",
    word: "a",
    action: "lift",
    integrity_max: 100,
  },
  lower: {
    name: "pleated_skirt",
    word: "a",
    action: "lift",
    integrity_max: 100,
  },
  desc: "Standard school uniform: white shirt and pleated skirt",
});
```

### Storage

```javascript
// Stored in setup.npcClothesSets
setup.npcClothesSets = [
  {
    name: 'school_uniform',
    type: 'uniform',
    gender: 'f',
    outfit: 0,
    clothes: {
      upper: { name: 'school_shirt', ... },
      lower: { name: 'pleated_skirt', ... }
    },
    desc: 'Standard school uniform...'
  }
];
```

---

## NPC Sidebar Default Clothes (Sidebar.config)

### Purpose

Defines how the NPC looks in the sidebar: body, head, face, neck, upper, lower, legs, feet, hands, etc.

### Format

JSON and YAML are supported:

```yaml
# Sidebar clothes config (YAML)
- name: "Luna"
  body: "img/npc/luna/body.png"

  head:
    - { img: "img/npc/luna/hair_back.png", zIndex: 5 }
    - { img: "img/npc/luna/face_base.png", zIndex: 10 }
    - { img: "img/npc/luna/hat.png", zIndex: 20, cond: "V.weather === 'rain'" }

  upper:
    - {
        img: "img/npc/luna/top_casual.png",
        zIndex: 15,
        cond: "C.npc.Luna.worn.upper.name === 'casual_top'",
      }
    - {
        img: "img/npc/luna/top_formal.png",
        zIndex: 15,
        cond: "C.npc.Luna.worn.upper.name === 'formal_top'",
      }
```

### boot.json

```json
{
  "params": {
    "npc": {
      "Sidebar": {
        "config": ["data/npc/luna_sidebar.yaml", "data/npc/draven_sidebar.json"]
      }
    }
  }
}
```

### Conditions

```yaml
cond: true                              # Always show
cond: "V.time.hour >= 18"               # String expression
cond: ["C.npc.Luna.mood === 'happy'", "V.weather === 'sunny'"]  # AND
cond: () => C.npc.Luna.magic_affinity >= 50   # Function
```

---

## NPC Wardrobe

### Purpose

Switches NPC outfit by location, time, or events (e.g. school uniform at school, casual at cafe after work).

### Concepts

- **Outfit definition**: A full set of clothes.
- **Location registration**: Wear a given outfit at a given location.
- **Conditions**: Optional extra conditions.
- **Priority**: Location-specific overrides global default.

### boot.json

```json
{
  "params": {
    "npc": {
      "Sidebar": {
        "clothes": ["wardrobe.yaml", "wardrobe.json"]
      }
    }
  }
}
```

### In Code

```javascript
// 1. Load wardrobe config
await maplebirch.npc.Clothes.load("myMod", "data/wardrobe.yaml");

// 2. Register outfits by location
maplebirch.npc.Clothes.register("Luna", "school", "school_uniform");

maplebirch.npc.Clothes.register(
  "Luna",
  "cafe",
  "casual_outfit",
  () => V.time.hour >= 18 || V.time.hour <= 8,
);

maplebirch.npc.Clothes.register("Luna", "*", "casual_outfit"); // Default

// 3. Get current outfit
const currentOutfit = maplebirch.npc.Clothes.worn("Luna");
```
