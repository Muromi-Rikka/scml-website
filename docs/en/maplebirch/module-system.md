# ModuleSystem API

## Overview

`ModuleSystem` handles module registration, dependency ordering, and lifecycle scheduling. **Most content mods should not register framework modules**—use `addonPlugin` **`script`** entries instead. Only use `maplebirch.register` when you intentionally extend internal framework capabilities.

For architecture and boot flow see [Core Architecture](./architecture).

---

## Registering modules

### register(name, module, dependencies?)

Registers a module (delegates to `ModuleSystem.register`).

| Parameter      | Description                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------------- |
| `name`         | Module name                                                                                         |
| `module`       | Module object with optional lifecycle methods; `module.dependencies` merges with the third argument |
| `dependencies` | Optional dependency name array                                                                      |

- **@return** `boolean` — `true` on success; `false` if the name already exists.

Extension modules get a **`source`** (owning mod name) recorded automatically when AddonPlugin loads your **`module`** scripts—**no** fourth `source` argument or `runWithSource` wrapper required.

```js
maplebirch.register("myModule", {
  Init() {
    console.log("initialized");
  },
});

maplebirch.register(
  "myModule2",
  {
    dependencies: ["tool"],
    Init() {
      console.log("depends on tool and npc");
    },
  },
  ["npc"],
);
```

### get(name)

Returns a registered module instance.

```js
const npcModule = maplebirch.get("npc");
```

### dependencyGraph

Dependency metadata per module:

| Field             | Description                                               |
| ----------------- | --------------------------------------------------------- |
| `protected`       | Protected module (cannot be turned off in the disable UI) |
| `mounted`         | Part of the core mount list                               |
| `early`           | Mounted during pre-initialization                         |
| `dependencies`    | Direct dependencies                                       |
| `dependents`      | Modules that depend on this one                           |
| `allDependencies` | Transitive dependencies                                   |
| `state`           | Current state (e.g. `'MOUNTED'`)                          |
| `source`          | Owning mod name (extension modules)                       |

```js
const graph = maplebirch.dependencyGraph;
console.log(graph.npc);
```

---

## Exposed modules (EXPOSED)

Set **`exposed: true`** on the module object. After registration the state is **`EXPOSED`** and the object is mounted at **`maplebirch[name]`**.

```js
maplebirch.register("myApi", {
  exposed: true,
  hello() {
    return "Hello";
  },
});

maplebirch.myApi.hello();
```

:::warning EXPOSED behavior
Exposed modules **do not** run the normal lifecycle (`preInit` / `Init` / `loadInit` / `postInit`) and **do not** appear in the disable UI. The dependency graph treats `EXPOSED` modules as satisfied dependencies. Registration fails if `maplebirch[name]` is already taken.
:::

---

## Module states

| State        | Value | Description                      |
| ------------ | ----- | -------------------------------- |
| `REGISTERED` | 0     | Registered, waiting for init     |
| `MOUNTED`    | 1     | Main initialization finished     |
| `ERROR`      | 2     | Initialization failed            |
| `EXPOSED`    | 3     | Exposed on the `maplebirch` root |
| `DISABLED`   | 4     | Disabled, skipped                |

Pre-init completion is tracked separately in an internal `preInitialized` set; modules move to `MOUNTED` after main init.

---

## Lifecycle methods

| Method       | When                                                  | Purpose                               |
| ------------ | ----------------------------------------------------- | ------------------------------------- |
| `preInit()`  | After `afterInjectEarlyLoad`, IndexedDB/logging ready | Early setup (no `setup` / `V` yet)    |
| `Init()`     | First normal-game **`:passagestart`**                 | Main init (`setup` and `V` available) |
| `loadInit()` | After loading a save                                  | Restore save-related state            |
| `postInit()` | Every passage start, after `Init` or `loadInit`       | Per-passage refresh                   |

```js
class MyModule {
  dependencies = ["tool"];

  async preInit() {
    this.cache = new Map();
  }

  async Init() {
    this.setup();
  }

  async loadInit() {
    this.restoreFromSave();
  }

  async postInit() {
    this.refreshPassageState();
  }

  setup() {}
  restoreFromSave() {}
  refreshPassageState() {}
}

maplebirch.register("myModule", new MyModule(), ["npc"]);
```

---

## Dependency rules

1. A module initializes only after all dependencies are satisfied (transitive closure applies).
2. **`EXPOSED`** modules count as satisfied dependencies.
3. If a dependency is **`ERROR`** or **`DISABLED`**, dependents do not initialize.
4. Circular dependencies are detected at registration time.

---

## Notes

1. Prefer **`script`** over framework module registration for content mods (**v3.2.5** simplified registration—see [changelog](./changelog)).
2. Use mod-prefixed names to avoid clashes with built-ins or other mods.
3. A failed module does not block others.
4. Protected modules (`protected`) cannot be disabled from the UI; extension modules remain toggleable when `source` is tracked by the framework.
