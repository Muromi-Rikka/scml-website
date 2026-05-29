# maplebirchFramework API Reference

Complete API reference for all maplebirchFramework modules.

---

## Module System

### Registering Extension Modules

```js
maplebirch.register(name, module, dependencies?)
```

| Parameter      | Description                                           |
| -------------- | ----------------------------------------------------- |
| `name`         | Module name (use mod-prefixed names to avoid clashes) |
| `module`       | Module object with optional lifecycle methods         |
| `dependencies` | Optional dependency name array                        |

Returns `boolean` — `true` on success, `false` if name already exists.

```js
maplebirch.register("myModule", {
  dependencies: ["tool"],
  async preInit() {
    this.cache = new Map();
  },
  async Init() {
    this.setup();
  },
  async loadInit() {
    this.restoreFromSave();
  },
  async postInit() {
    this.refresh();
  },
  setup() {},
  restoreFromSave() {},
  refresh() {},
});
```

### Exposed Modules

Set `exposed: true` to mount the module on `maplebirch[name]` directly:

```js
maplebirch.register("myApi", {
  exposed: true,
  hello() {
    return "Hello";
  },
});
maplebirch.myApi.hello();
```

Exposed modules skip lifecycle methods and don't appear in the disable UI.

### Getting a Module

```js
const npcModule = maplebirch.get("npc");
```

### Dependency Graph

```js
const graph = maplebirch.dependencyGraph;
// Fields per module: protected, mounted, early, dependencies, dependents, allDependencies, state, source
```

### Module States

| State        | Value | Description                  |
| ------------ | ----- | ---------------------------- |
| `REGISTERED` | 0     | Waiting for init             |
| `MOUNTED`    | 1     | Main initialization finished |
| `ERROR`      | 2     | Initialization failed        |
| `EXPOSED`    | 3     | Exposed on maplebirch root   |
| `DISABLED`   | 4     | Disabled, skipped            |

### Core Module Dependency Graph

```
addon → dynamic → tool → audio
                    tool → var → char → npc → combat
```

| Module         | Name      | Dependencies |
| -------------- | --------- | ------------ |
| AddonPlugin    | `addon`   | None         |
| DynamicManager | `dynamic` | `addon`      |
| ToolCollection | `tool`    | `dynamic`    |
| AudioManager   | `audio`   | `tool`       |
| Variables      | `var`     | `tool`       |
| Character      | `char`    | `var`        |
| NPCManager     | `npc`     | `char`       |
| CombatManager  | `combat`  | `npc`        |

---

## NPC System

### Registration

```js
maplebirch.npc.add(npcData, npcConfig, translations?)
```

### NPCData Fields

| Field         | Type                   | Default      |
| ------------- | ---------------------- | ------------ |
| `nam`         | string                 | **Required** |
| `gender`      | 'm'/'f'/'h'/'n'/'none' | random       |
| `title`       | string                 | 'none'       |
| `description` | string                 | NPC name     |
| `type`        | string                 | 'human'      |
| `adult`       | number                 | random       |
| `teen`        | number                 | random       |
| `age`         | number                 | 0            |
| `insecurity`  | string                 | random       |
| `hairColour`  | string                 | random       |
| `eyeColour`   | string                 | random       |
| `hairlength`  | number                 | random       |
| `breastsize`  | number                 | by gender    |
| `penissize`   | number                 | by gender    |
| `ballssize`   | number                 | by gender    |
| `outfits`     | string[]               | default      |
| `pregnancy`   | any                    | null         |

### NPCConfig Fields

| Field          | Type                           | Description        |
| -------------- | ------------------------------ | ------------------ |
| `love`         | `{ maxValue: number }`         | Love max value     |
| `loveAlias`    | `[string, string]` or function | Love label         |
| `important`    | boolean or function            | Important NPC flag |
| `special`      | boolean or function            | Special NPC flag   |
| `loveInterest` | boolean or function            | Love interest flag |
| `romance`      | `(() => boolean)[]`            | Romance conditions |

### Related Systems

- **NPC Stats:** custom stats (trust, favour, etc.)
- **NPC Schedule:** schedule definitions for NPC behaviors
- **NPC Sidebar:** sidebar rendering with static images or dynamic model
- **NPC Clothes:** clothing and wardrobe configuration

---

## Combat System

### Registering Combat Actions

```js
maplebirch.combat.CombatAction.reg(config)
maplebirch.combat.CombatAction.reg(config1, config2, ...)
```

### Config Shape

```js
{
  id: string,                           // Unique ID
  actionType: string | string[],       // Slot(s)
  cond: (ctx) => boolean,              // Display condition
  display: string | (ctx) => string,   // Button label
  value: any,                          // Value passed when chosen
  color?: string | (ctx) => string,    // Button color
  difficulty?: string | (ctx) => string, // Difficulty hint
  combatType?: string | (ctx) => string, // Combat type
  order?: number | (ctx) => number     // Sort order
}
```

### Combat Types

`Default`, `Self`, `Struggle`, `Swarm`, `Vore`, `Machine`, `Tentacle`

### Action Types

`leftaction`, `rightaction`, `feetaction`, `mouthaction`, `penisaction`, `vaginaaction`, `anusaction`, `chestaction`, `thighaction`

### Built-in Colors

`white`, `red`, `green`, `blue`, `yellow`, `orange`, `purple`, `pink`, `gray`, `silver`, `gold`, `def`, `meek`, `sub`, `brat`

### Example

```js
maplebirch.combat.CombatAction.reg({
  id: "fireball",
  actionType: "rightaction",
  cond: (ctx) => V.player.mana >= 25,
  display: (ctx) => `Fireball (25 mana)`,
  value: "fireball",
  color: (ctx) => (V.player.mana >= 25 ? "orange" : "gray"),
  difficulty: "High fire damage to one enemy",
  combatType: "Default",
  order: 1,
});
```

---

## Audio System

### Playback Control

```js
const am = maplebirch.audio;

await am.modPlay("myMod", "track_name"); // Play mod audio
await am.play(track); // Play track
am.pause(); // Pause
am.resume(); // Resume
am.stop(); // Stop
am.togglePlayPause(); // Toggle
await am.next(); // Next track
await am.previous(); // Previous track
am.seek(50); // Seek to 50%
am.seekTo(30); // Seek to 30 seconds
```

### Volume Control

```js
am.Volume = 0.8; // 0.0 - 1.0
am.Mute = true; // Mute
am.Mute = false; // Unmute
```

### Playback Modes

```js
am.PlayMode = "sequential"; // Play in order
am.PlayMode = "loop_all"; // Loop playlist
am.PlayMode = "loop_one"; // Loop single track
am.PlayMode = "shuffle"; // Shuffle
```

### Audio Import

```js
await am.importAllAudio("myMod");
await am.importAllAudio("myMod", "custom/audio/path");
await am.addAudioFromFile(file, "modName");
await am.deleteAudio("track_key", "modName");
await am.modAudioClearAll("modName");
```

### Properties

| Property       | Type    | Description              |
| -------------- | ------- | ------------------------ |
| `Volume`       | number  | Current volume (0.0-1.0) |
| `Mute`         | boolean | Muted state              |
| `PlayMode`     | string  | Playback mode            |
| `currentTime`  | number  | Current time (seconds)   |
| `duration`     | number  | Track duration (seconds) |
| `currentTrack` | Track   | Current track            |

---

## Character System

### Layer Extension

```js
maplebirch.char.use({
  my_layer: {
    srcfn(options) {
      return `img/custom/${options.variant}.png`;
    },
    showfn(options) {
      return options.show_custom;
    },
    zfn() {
      return 10;
    },
  },
});
```

Layer properties: `srcfn`, `showfn`, `zfn`, `masksrcfn`, `filtersfn`, `animation`.

### Pre/Post Processing

```js
maplebirch.char.use("pre", (options) => {
  /* modify before render */
});
maplebirch.char.use("post", (options) => {
  /* process after render */
});
```

### Facial Styles

Auto-discovered from `img/face/` directory in mod zips. Resolution priority:

1. `img/face/{facestyle}/{facevariant}/{image}.png`
2. `img/face/{facestyle}/{image}.png`
3. `img/face/default/{facevariant}/{image}.png`
4. `img/face/default/{image}.png`
5. `img/face/default/default/{image}.png`

### Mask Generator

```js
maplebirch.char.mask(x?, rotation?, swap?, width?, height?)
```

| Parameter  | Default | Description                                     |
| ---------- | ------- | ----------------------------------------------- |
| `x`        | 0       | Mask split position offset (pixels from center) |
| `rotation` | 0       | Rotation angle (-90 to 90)                      |
| `swap`     | false   | Swap left/right masks                           |
| `width`    | 256     | Canvas width                                    |
| `height`   | 256     | Canvas height                                   |

### Transformation System

```js
maplebirch.char.transformation.add(type, category, config);
```

### Z-Index Constants

```js
const z = maplebirch.char.ZIndices;
// z.backhair, z.hairforwards, z.front_hair, etc.
```

---

## Dynamic Events

### Sub-managers

| Manager | Description                    |
| ------- | ------------------------------ |
| Time    | Time-based event management    |
| State   | State-based event triggers     |
| Weather | Weather-based event conditions |

Initialized on first `:passagestart`.

---

## Tool Collection

Access via `maplebirch.tool`.

### Submodules

| Access Path                 | Description                                                        |
| --------------------------- | ------------------------------------------------------------------ |
| `maplebirch.tool.console`   | Console cheat tools                                                |
| `maplebirch.tool.migration` | Data migration tools                                               |
| `maplebirch.tool.rand`      | Random number system                                               |
| `maplebirch.tool.macro`     | SugarCube2 macro definitions                                       |
| `maplebirch.tool.text`      | HTML text tools                                                    |
| `maplebirch.tool.zone`      | Zones manager                                                      |
| `maplebirch.tool.link`      | Link zone handling                                                 |
| `maplebirch.tool.patch`     | Patch toolkit (traits, location, bodywriting, foodstuff, antiques) |

### Patch API

```js
maplebirch.tool.patch.addTraits(traitConfig);
maplebirch.tool.patch.injectTraits();
maplebirch.tool.patch.configureLocation(locationConfig);
maplebirch.tool.patch.applyLocation();
maplebirch.tool.patch.addBodywriting(config);
maplebirch.tool.patch.applyBodywriting();
maplebirch.tool.patch.addFoodstuff(config);
maplebirch.tool.patch.applyFoodstuff();
maplebirch.tool.patch.addAntiques(config);
maplebirch.tool.patch.injectAntiques();
```

### Convenience Properties

```js
maplebirch.tool.createlog("mymod"); // Create prefixed log function
maplebirch.tool.utils; // Internal utility function set
```

---

## Event System

### API

```js
maplebirch.on(eventName, callback, description?)
maplebirch.off(eventName, identifier)
maplebirch.once(eventName, callback, description?)
maplebirch.after(eventName, callback)
maplebirch.trigger(eventName, ...args)
```

### `on` vs `once` vs `after`

| Method  | Runs                           | After execution  |
| ------- | ------------------------------ | ---------------- |
| `on`    | Every time event fires         | Stays registered |
| `once`  | First time only                | Removed          |
| `after` | Once, after all `on` callbacks | Removed          |

### Built-in Events

| Event             | Timing                     |
| ----------------- | -------------------------- |
| `:IndexedDB`      | IDB store registration     |
| `:import`         | Data import                |
| `:allModule`      | All modules registered     |
| `:variable`       | Variables injectable       |
| `:onSave`         | Game save                  |
| `:onLoad`         | Game load                  |
| `:onLoadSave`     | Save loaded                |
| `:language`       | Language switch            |
| `:storyready`     | Game fully started         |
| `:passageinit`    | Passage initialization     |
| `:passagestart`   | Passage start              |
| `:passagerender`  | Passage render             |
| `:passagedisplay` | Passage display            |
| `:passageend`     | Passage end                |
| `:sugarcube`      | SugarCube object available |
| `:modLoaderEnd`   | ModLoader load complete    |

### Custom Events

```js
maplebirch.on(
  ":myEvent",
  (data) => {
    console.log(data);
  },
  "my handler",
);
await maplebirch.trigger(":myEvent", { key: "value" });
```

---

## Variables System

### V.maplebirch Namespace

```js
{
  player: { clothing: {} },  // Read-only proxy of V.worn
  npc: {},
  transformation: {},
  version: "3.2.5"
}
```

**Important:** `V.maplebirch.player.clothing` is a read-only proxy. Use `V.worn` to modify equipment.

### V.options.maplebirch

Options persist across saves. Validated on every `:passageend` and save load with deep merge + type validation.

### Migration API

```js
const migration = maplebirch.var.migration;

migration.add("3.0.0", "3.1.0", (data) => {
  if (!data.newField) data.newField = "defaultValue";
});

migration.run(V.maplebirch, "3.2.5");
```

### Hair Gradients

```js
const gradients = maplebirch.var.hairgradients();
// Returns { fringe: { styleName: [colors] }, sides: { ... } }
```

---

## Language System

### Translation Lookup

```js
maplebirch.t(key, space?)       // Lookup by key
maplebirch.auto(text)            // Reverse translation
maplebirch.Language = "CN"       // Switch language
maplebirch.Language = "EN"       // Switch language
```

### SugarCube Macros

| Macro                           | Purpose                         |
| ------------------------------- | ------------------------------- |
| `<<language>>`                  | Show content blocks by language |
| `<<lanSwitch>>` / `lanSwitch()` | Inline language switching       |
| `<<lanButton>>`                 | Language-aware button           |
| `<<lanLink>>`                   | Language-aware link             |
| `<<lanListbox>>`                | Language-aware dropdown         |
| `<<radiobuttonsfrom>>`          | Multi-language radio buttons    |

### Logger

```js
maplebirch.log(message, level?)  // "DEBUG" | "INFO" | "WARN" | "ERROR"
maplebirch.LogLevel = "DEBUG"
const log = maplebirch.tool.createlog("mymod")
log("message", "INFO")  // [maplebirch][INFO] [mymod] message
```

### Global Utilities

Mounted on `window`:

`clone`, `merge`, `equal`, `contains`, `random`, `either`, `SelectCase`, `convert`, `number`, `loadImage`
