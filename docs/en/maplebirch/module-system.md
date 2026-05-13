# ModuleSystem API

## Overview

`ModuleSystem` is the framework’s module loading and dependency management system. It handles module registration, dependency resolution, and lifecycle initialization, so modules load and run in the correct order.

For the overall architecture and initialization flow, see [Core Architecture](./architecture).

---

## Core API

### register(name, module, dependencies?)

Registers a module (delegates to `ModuleSystem.register`).

- **@param** `name` (string): Module name.
- **@param** `module` (object): Module object with optional lifecycle methods (`preInit`, `Init`, `loadInit`, `postInit`, …). Set **`exposed: true`** if the module should be attached as a property on the `maplebirch` root.
- **@param** `dependencies` (string[]): Dependency list, default `[]`. Values from `module.dependencies` are merged in.
- **@return** `boolean`: `true` on success; `false` if the name is already registered.

**Source / owning mod (v3.2.3):** `register` no longer takes a fourth `source` argument. While AddonPlugin executes your script it wraps the body in **`await maplebirch.modules.runWithSource(modName, …)`**, so nested `register` calls automatically record the owning mod name for GUI enable/disable and graph metadata.

```js
maplebirch.register("myModule", {
  Init() {
    console.log("initialized");
  },
});

maplebirch.register(
  "myModule2",
  {
    Init() {
      console.log("depends on var and tool");
    },
  },
  ["var", "tool"],
);

await maplebirch.modules.runWithSource("MyCoolMod", async () => {
  maplebirch.register(
    "myExtension",
    {
      exposed: true,
      sayHello() {
        return "Hello";
      },
      Init() {},
    },
    [],
  );
});
```

### get(name)

Returns a registered module instance.

- **@param** `name` (string): Module name.
- **@return** Module object or `undefined`.

```js
const addon = maplebirch.get("addon");
```

### dependencyGraph

Returns the module dependency graph. Each entry includes:

- `dependencies` — Direct dependencies
- `dependents` — Modules that depend on this one
- `state` — Current state (e.g. `'MOUNTED'`)
- `allDependencies` — All transitive dependencies
- `source` — Source identifier (for extension modules)

```js
const graph = maplebirch.dependencyGraph;
console.log(graph.addon);
// Output: {
//   dependencies: [],
//   dependents: ['dynamic', 'tool', ...],
//   state: 'MOUNTED',
//   allDependencies: [],
//   source: null
// }

// Query dependencies
console.log("addon dependencies:", graph.addon.dependencies);
console.log("Modules depending on addon:", graph.addon.dependents);
```

---

## Module States

Each module can be in one of these states:

| State constant | Value | Description                                      |
| -------------- | ----- | ------------------------------------------------ |
| `REGISTERED`   | 0     | Registered, main init not finished               |
| `MOUNTED`      | 1     | Main initialization finished                     |
| `ERROR`        | 2     | Error during initialization                      |
| `EXPOSED`      | 3     | Exposed module mounted on `maplebirch` root      |
| `DISABLED`     | 4     | Module disabled                                  |

---

## Lifecycle Methods

A module can define these lifecycle methods:

### preInit()

Runs during pre-initialization, after the `:allModule` event. Use for lightweight setup or resource loading.

```js
preInit() {
  this.cache = new Map();
}
```

### Init()

Main initialization, called on `:passagestart` (first run only). Usually required for core module logic.

```js
Init() {
  this.setupEventListeners();
  this.loadConfig();
}
```

### loadInit()

Called only when a save is loaded. Use to restore state from save data.

```js
loadInit() {
  if (V.myData) {
    this.data = V.myData;
  }
}
```

### postInit()

Runs after `Init` or `loadInit` finishes. Use for cleanup or final setup.

```js
postInit() {
  this.cleanupTemporaryData();
  this.finalizeSetup();
}
```

---

## Full Module Example

```js
class MyModule {
  constructor(maplebirch) {
    this.maplebirch = maplebirch;
  }

  preInit() {
    console.log("MyModule preInit");
    this.cache = new Map();
  }

  Init() {
    console.log("MyModule Init");
    this.setup();
  }

  loadInit() {
    console.log("MyModule loadInit");
    if (V.myModuleData) {
      this.data = V.myModuleData;
    }
  }

  postInit() {
    console.log("MyModule postInit");
    this.cleanup();
  }

  setup() {
    // Setup logic
  }

  cleanup() {
    // Cleanup logic
  }

  myFunction() {
    return "Hello from MyModule";
  }
}

// Register module
maplebirch.register("myModule", new MyModule(maplebirch), ["addon", "dynamic"]);
```

---

## Dependency Management

### Declaring Dependencies

```js
// When registering
maplebirch.register("myModule", myModuleInstance, ["var", "tool"]);
```

### Dependency Rules

1. A module initializes only after all its dependencies have initialized.
2. Transitive dependencies are supported (if A depends on B and B on C, A depends on C).
3. Circular dependencies are detected and rejected.

### Querying the Dependency Graph

```js
const graph = maplebirch.dependencyGraph;
console.log("addon dependencies:", graph.addon.dependencies);
console.log("Modules depending on addon:", graph.addon.dependents);
```

---

## Notes

1. **Naming** — Avoid reserved names such as `core`, `modules`.
2. **Initialization order** — Dependencies are resolved via topological sort; understand how this affects order.
3. **Error handling** — A failed module does not block others.
4. **Disabling** — Modules can be disabled via ModLoader config.
5. **Extension modules** — Use `exposed: true` and register inside the `runWithSource` context so `source` is tracked; exposed modules appear on the `maplebirch` root and can be toggled from the GUI.
