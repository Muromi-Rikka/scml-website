# Tool Collection

The ToolCollection module aggregates 8 sub-tool modules in a facade pattern, accessible via `maplebirch.tool`.

## Submodule Overview

| Access Path                 | Submodule     | Description                  |
| --------------------------- | ------------- | ---------------------------- |
| `maplebirch.tool.console`   | Console       | Console cheat tools          |
| `maplebirch.tool.migration` | migration     | Data migration tools         |
| `maplebirch.tool.rand`      | randSystem    | Random number system         |
| `maplebirch.tool.macro`     | defineMacros  | SugarCube2 macro definitions |
| `maplebirch.tool.text`      | htmlTools     | HTML text tools              |
| `maplebirch.tool.zone`      | zonesManager  | Zones manager                |
| `maplebirch.tool.link`      | applyLinkZone | Link zone handling           |
| `maplebirch.tool.other`     | otherTools    | Other tools                  |

Additionally, there are convenience properties:

| Property                    | Description                             |
| --------------------------- | --------------------------------------- |
| `maplebirch.tool.createlog` | Create log functions with prefix        |
| `maplebirch.tool.utils`     | Framework internal utility function set |

## Global Utilities

The framework mounts a set of utility functions on `window` for direct use: `clone`, `merge`, `equal`, `contains`, `random`, `either`, `SelectCase`, `convert`, `number`, `loadImage`, etc. See [Utilities](./utils) for details.

## Console

Console tools provide developers with quick testing and debugging capabilities.

```js
const console = maplebirch.tool.console;
```

## defineMacros (Macro Definitions)

Used to define and manage SugarCube2 macros:

```js
const macro = maplebirch.tool.macro;

// Define a custom macro
macro.define("myMacro", function () {
  this.output.textContent = "Hello from macro";
});
```

The framework registers combat-related macros such as `generateCombatAction` and `combatButtonAdjustments` through this module.

## applyLinkZone (Link Zone)

Handles the application logic for link zones in the game:

```js
const link = maplebirch.tool.link;
```
