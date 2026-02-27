# ModuleSystem API

## Overview

`ModuleSystem` is the framework’s module loading and dependency management system. It handles module registration, dependency resolution, and lifecycle initialization, so modules load and run in the correct order.

For the overall architecture and initialization flow, see [Core Architecture](./architecture).

---

## Core API

### register(name, module, dependencies?, source?)

Registers a module with the system.

- **@param** `name` (string): Module name.
- **@param** `module` (object): Module object; must implement the initialization methods described below.
- **@param** `dependencies` (string[]): List of module names this module depends on. Default `[]`.
- **@param** `source` (string): Optional source identifier; used for extension modules.
- **@return** `boolean`: `true` if registration succeeded.

```js
// Register a basic module
maplebirch.register("myModule", {
  Init() {
    console.log("Module initialized");
  },
});

// Register with dependencies
maplebirch.register(
  "myModule2",
  {
    Init() {
      console.log("Depends on var and tool");
    },
  },
  ["var", "tool"],
);

// Register an extension module
maplebirch.register(
  "myExtension",
  {
    sayHello() {
      return "Hello World";
    },
  },
  [],
  "my-mod-name",
);
```

Extension modules are mounted onto `maplebirch` and can be enabled/disabled via the GUI panel.

### getModule(name)

Returns the registered module instance.

- **@param** `name` (string): Module name.
- **@return** Module object or `undefined`.

```js
const addonModule = maplebirch.getModule("addon");
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

| State constant | Value | Description                                     |
| -------------- | ----- | ----------------------------------------------- |
| `REGISTERED`   | 0     | Registered but not yet initialized              |
| `LOADED`       | 1     | Pre-initialization complete                     |
| `MOUNTED`      | 2     | Main initialization complete                    |
| `EXTENSION`    | 3     | Extension module, mounted on framework instance |
| `ERROR`        | 4     | Error during initialization                     |

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
  if (State.variables.myData) {
    this.data = State.variables.myData;
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
    if (State.variables.myModuleData) {
      this.data = State.variables.myModuleData;
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
5. **Extension modules** — Extension modules are mounted on `maplebirch` for global access.
