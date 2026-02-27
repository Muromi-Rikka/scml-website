# Variables and Game State

The Variables module manages the framework's data storage in the SugarCube2 save system, including the `V.maplebirch` namespace and `V.options.maplebirch` option configuration.

## V.maplebirch Namespace

The framework uses `V.maplebirch` as a unified variable namespace to avoid conflicts with the base game and other Mods.

### Default Variable Structure

When starting a new game (`Start2` Passage), `V.maplebirch` is initialized as:

```js
{
  player: {
    clothing: {}  // Read-only mirror of V.worn
  },
  npc: {},
  transformation: {},
  version: "3.2.0"
}
```

:::tip
`V.maplebirch.player.clothing` is a read-only proxy for `V.worn`. Modifying it directly will trigger a warning; please use `V.worn` to modify player equipment.
:::

## V.options.maplebirch

Option configuration is stored in `V.options.maplebirch` and remains consistent across saves.

### Default Options

```js
{
  character: {
    mask: 0,
    charArt: {
      type: 'fringe',
      select: 'low-ombre',
      value: { fringe: {}, sides: {} }  // Hair colour gradient positions
    },
    closeUp: {
      type: 'fringe',
      select: 'low-ombre',
      value: { fringe: {}, sides: {} }
    }
  },
  npcsidebar: {
    show: false,
    model: false,
    position: 'back',
    dxfn: -48,
    dyfn: -8,
    skin_type: 'light',
    tan: 0,
    facestyle: 'default',
    facevariant: 'default',
    freckles: false,
    ears: 'back',
    mask: 0,
    nnpc: false,
    display: {}
  },
  relationcount: 4,
  npcschedules: false
}
```

### Option Validation and Merge

The framework performs option validation on every `:passageend` and save load. The merge strategy is deep merge with type validation—if the value type in the save does not match the default, the default value will be used.

## Variable Migration System

The Variables module integrates the `migration` utility to handle data migration during version upgrades.

### Migration Trigger Timing

- **New Game**: Initialize default variables when the `Start2` Passage runs
- **Every Passage**: Check and run migrations during the `Init()` phase
- **Save Load**: Check and run migrations during the `loadInit()` phase
- **Post-initialization**: Run migrations again if version is inconsistent

### Using Migration

```js
const migration = maplebirch.var.migration;

// Register migration rule: migrate from old version to new version
migration.add("3.0.0", "3.1.0", (data) => {
  // Migration logic
  if (!data.newField) {
    data.newField = "defaultValue";
  }
});

// Run migration manually
migration.run(V.maplebirch, "3.2.0");
```

## Hair Colour Gradients

The Variables module provides the `hairgradients()` function to extract available hair colour gradient data from the game's `setup.colours.hairgradients_prototypes`:

```js
const gradients = maplebirch.var.hairgradients();
// Returns { fringe: { styleName: [color1, color2, ...] }, sides: { ... } }
```

This data is used for hair colour gradient configuration in the character rendering system.
