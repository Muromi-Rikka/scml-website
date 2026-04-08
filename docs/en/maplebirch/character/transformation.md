# Transformation System

## Overview

The Transformation system allows mod authors to add custom form changes to the game, such as beast, divine, or demon transformations. You can define appearance, traits, conditions, and effects for each transformation stage.

_Register via `maplebirch.char.transformation.add` or `maplebirchFrameworks.addTransform`._

---

## Adding a Custom Transformation

### Basic Structure

```javascript
// Add transformation during mod initialization
maplebirch.tool.onInit(() => {
  maplebirch.char.transformation.add("dragon", "physical", {
    // Required: list of transformation parts
    parts: [
      { name: "horns", tfRequired: 1, default: "default" },
      { name: "tail", tfRequired: 2, default: "default" },
      { name: "wings", tfRequired: 3, default: "default" },
      { name: "scales", tfRequired: 4, default: "default" },
      { name: "claws", tfRequired: 5, default: "default" },
      { name: "fangs", tfRequired: 6, default: "default" },
    ],

    // Optional: list of transformation traits
    traits: [
      { name: "fire_breath", tfRequired: 4, default: "default" },
      { name: "dragon_sight", tfRequired: 3, default: "default" },
    ],

    // Transformation config
    build: 100, // Max build value
    level: 6, // Max level
    update: [20, 40, 60, 80, 95, 100], // Level-up build thresholds

    // Optional: icon
    icon: "img/ui/dragon_icon.png",

    // Optional: transformation messages
    message: {
      EN: {
        up: [
          "Your back itches...",
          "Scales begin to grow...",
          "Dragon wings burst forth...",
          "Your claws sharpen...",
          "You feel draconic power...",
          "Fully transformed into a dragon!",
        ],
        down: [
          "Scales begin to shed...",
          "Wings wither...",
          "Claws dull...",
          "Draconic traits fade...",
          "Almost human again...",
          "Fully human again.",
        ],
      },
      CN: {
        up: [
          "你感到背部发痒...",
          "鳞片开始生长...",
          "龙翼破体而出...",
          "龙爪变得锋利...",
          "你感到龙的力量...",
          "完全转化为龙！",
        ],
        down: [
          "鳞片开始脱落...",
          "龙翼萎缩...",
          "龙爪变钝...",
          "龙的特征减弱...",
          "几乎恢复人形...",
          "完全恢复人形",
        ],
      },
    },

    // Optional: allow natural decay
    decay: true,

    // Optional: decay conditions
    decayConditions: [
      () => V.maplebirch.transformation.dragon.build >= 1,
      () => V.worn.neck.name !== "dragon_amulet",
      () => playerNormalPregnancyType() !== "dragon",
    ],

    // Optional: suppress other transformations
    suppress: true,

    // Optional: suppress conditions
    suppressConditions: [
      (sourceName) => sourceName !== "dragon",
      () => V.worn.neck.name !== "dragon_amulet",
    ],

    // Optional: pre-processing function
    pre: (options) => {
      if (V.maplebirch?.transformation?.dragon?.level >= 3) {
        options.scale_factor = 1.1;
        options.color_tint = "#d4a017"; // Golden dragon scales
      }
    },

    // Optional: post-processing function
    post: (options) => {
      if (V.maplebirch?.transformation?.dragon?.level >= 6) {
        addDragonAura(options.canvas);
      }
    },

    // Optional: transformation layer definitions
    layers: {
      dragon_horns: {
        srcfn: (options) => {
          const level = V.maplebirch?.transformation?.dragon?.level || 0;
          if (level < 1) return null;
          return `img/transformations/dragon/horns_${level}.png`;
        },
        showfn: () => V.maplebirch?.transformation?.dragon?.level >= 1,
        zfn: () => maplebirch.char.ZIndices.effects,
      },
      dragon_wings: {
        srcfn: (options) => {
          const level = V.maplebirch?.transformation?.dragon?.level || 0;
          if (level < 3) return null;
          return `img/transformations/dragon/wings_${level}.png`;
        },
        showfn: () => V.maplebirch?.transformation?.dragon?.level >= 3,
        zfn: () => maplebirch.char.ZIndices.effects + 1,
      },
    },

    // Optional: translations
    translations: {
      dragon: { EN: "Dragon", CN: "龙" },
      fire_breath: { EN: "Fire Breath", CN: "火焰吐息" },
      dragon_sight: { EN: "Dragon Sight", CN: "龙之视觉" },
    },
  });
});
```

---

## Configuration Reference

### Required Parameters

| Parameter | Type   | Description                                            |
| --------- | ------ | ------------------------------------------------------ |
| `name`    | string | Unique identifier for the transformation               |
| `type`    | string | Type: `'physical'` (physical transformation) or custom |
| `parts`   | Array  | Array of transformation part definitions               |

### Transformation Parts (parts)

Each part object contains:

- `name`: Part name (must be unique)
- `tfRequired`: Minimum level required to enable this part
- `default`: Default value (optional)

```javascript
parts: [
  { name: "tail", tfRequired: 2, default: "default" },
  { name: "horns", tfRequired: 1, default: "curved" },
  { name: "wings", tfRequired: 3, default: "leathery" },
];
```

### Transformation Traits (traits)

```javascript
traits: [
  { name: "night_vision", tfRequired: 2, default: "default" },
  { name: "enhanced_senses", tfRequired: 4, default: "default" },
];
```

### Level Configuration

| Parameter | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| `build`   | number   | Max build value (0–100)            |
| `level`   | number   | Max level (typically 6)            |
| `update`  | number[] | Build thresholds for each level up |

```javascript
build: 100,
level: 6,
update: [20, 40, 60, 80, 95, 100]  // 20 build = level 1, 40 = level 2, ...
```

### Decay System

| Parameter         | Type       | Description                        |
| ----------------- | ---------- | ---------------------------------- |
| `decay`           | boolean    | Whether natural decay is allowed   |
| `decayConditions` | Function[] | Array of decay condition functions |

```javascript
decay: true,
decayConditions: [
  () => V.maplebirch.transformation.dragon.build >= 1,
  () => V.worn.neck.name !== 'dragon_amulet',
  () => !Weather.bloodMoon
]
```

### Suppress System

| Parameter            | Type       | Description                               |
| -------------------- | ---------- | ----------------------------------------- |
| `suppress`           | boolean    | Whether to suppress other transformations |
| `suppressConditions` | Function[] | Array of suppress condition functions     |

```javascript
suppress: true,
suppressConditions: [
  (sourceName) => sourceName !== 'dragon',  // Do not suppress self
  () => V.worn.neck.name !== 'dragon_amulet'
]
```

### Transformation Messages

```javascript
message: {
  EN: {
    up: ['Level 1 message', 'Level 2 message', 'Level 3 message', 'Level 4 message', 'Level 5 message', 'Level 6 message'],
    down: ['Level 5->4 message', 'Level 4->3 message', 'Level 3->2 message', 'Level 2->1 message', 'Level 1->0 message', 'Fully reverted message']
  },
  CN: {
    up: ['等级1消息', '等级2消息', '等级3消息', '等级4消息', '等级5消息', '等级6消息'],
    down: ['等级5->4消息', '等级4->3消息', '等级3->2消息', '等级2->1消息', '等级1->0消息', '完全消失消息']
  }
}
```

### Pre/Post Processing Functions

```javascript
pre: (options) => {
  // Runs before character render
  const level = V.maplebirch?.transformation?.dragon?.level || 0;
  if (level >= 4) {
    options.glow_effect = true;
    options.glow_color = '#ff6b00';
  }
},

post: (options) => {
  // Runs after character render
  if (options.glow_effect) {
    addGlowEffect(options.canvas, options.glow_color);
  }
}
```

---

## Transformation Data Storage

### Variable Structure

```javascript
V.maplebirch.transformation = {
  dragon: {
    level: 0, // Current level
    build: 0, // Current build value
  },
  // Other custom transformations...
};

V.transformationParts = {
  dragon: {
    horns: "disabled", // or 'default' or custom value
    tail: "disabled",
    wings: "disabled",
  },
  traits: {
    fire_breath: "disabled",
    dragon_sight: "disabled",
  },
};
```

---

## Full Examples

### Example 1: Simple Fairy Transformation

```javascript
maplebirch.char.transformation.add("fairy", "physical", {
  parts: [
    { name: "wings", tfRequired: 1, default: "delicate" },
    { name: "glow", tfRequired: 2, default: "default" },
    { name: "pointed_ears", tfRequired: 3, default: "default" },
  ],
  build: 100,
  level: 3,
  update: [33, 66, 100],
  decay: true,
  decayConditions: [
    () => V.maplebirch.transformation.fairy.build >= 1,
    () => !V.worn.earrings?.name?.includes("fairy"),
  ],
  layers: {
    fairy_wings: {
      srcfn: () => "img/transformations/fairy/wings.png",
      showfn: () => V.maplebirch?.transformation?.fairy?.level >= 1,
      zfn: () => maplebirch.char.ZIndices.effects + 2,
    },
  },
});
```

### Example 2: Elemental Transformation

```javascript
maplebirch.char.transformation.add("fire_elemental", "elemental", {
  parts: [
    { name: "aura", tfRequired: 1, default: "flickering" },
    { name: "embers", tfRequired: 2, default: "default" },
    { name: "flame_body", tfRequired: 4, default: "default" },
    { name: "fire_crown", tfRequired: 6, default: "default" },
  ],
  traits: [
    { name: "heat_aura", tfRequired: 3, default: "default" },
    { name: "fire_immunity", tfRequired: 5, default: "default" },
  ],
  build: 100,
  level: 6,
  update: [20, 40, 60, 80, 95, 100],
  suppress: false, // Elemental does not suppress other transformations

  pre: (options) => {
    const level = V.maplebirch?.transformation?.fire_elemental?.level || 0;
    if (level >= 2) {
      options.color_tint = "#ff3300";
      options.brightness = 1.1;
    }
    if (level >= 4) {
      options.heat_distortion = true;
    }
  },
});
```
