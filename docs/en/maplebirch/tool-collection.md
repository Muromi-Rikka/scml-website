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

## Console

Console tools provide developers with quick testing and debugging capabilities.

```js
const console = maplebirch.tool.console;
```

## migration (Data Migration)

The data migration tool handles save data changes during version upgrades. Used directly by the Variables module.

```js
const Migration = maplebirch.tool.migration;

// 创建迁移实例
const m = new Migration();

// 注册迁移规则
m.add("1.0.0", "2.0.0", (data) => {
  // 从 1.0.0 迁移到 2.0.0 的逻辑
});

// 执行迁移
m.run(targetData, targetVersion);
```

## randSystem (Random System)

Provides various random number generation utilities:

```js
const rand = maplebirch.tool.rand;
```

Includes weighted random, range random, and other features for use by other modules and Mods.

## defineMacros (Macro Definitions)

Used to define and manage SugarCube2 macros:

```js
const macro = maplebirch.tool.macro;

// 定义一个自定义宏
macro.define("myMacro", function () {
  // 宏实现
  this.output.textContent = "Hello from macro";
});
```

The framework registers combat-related macros such as `generateCombatAction` and `combatButtonAdjustments` through this module.

## htmlTools (HTML Tools)

Provides HTML text processing and manipulation tools:

```js
const text = maplebirch.tool.text;
```

## zonesManager (Zones Manager)

The zones manager handles widget registration and rendering for game interface areas. It is one of the framework's most important tools, allowing Mods to inject content into various areas of the game.

### Adding Widgets to Zones

```js
const zone = maplebirch.tool.zone;

// 添加简单的 Twee 部件
zone.addTo("sidebar", "<<myWidget>>");

// 添加带条件的部件
zone.addTo("sidebar", {
  widget: "<<myWidget>>",
  exclude: ["Combat"], // 在这些 Passage 中排除
  match: ["Home", "Shop"], // 仅在这些 Passage 中显示
  passage: "MyPassage", // 指定 Passage
});

// 添加带优先级的部件（数字越小越靠前）
zone.addTo("sidebar", [5, "<<myWidget>>"]);
```

### Shortcut Methods

ToolCollection provides two shortcut methods for direct access to common zones manager functionality:

```js
// 等价于 maplebirch.tool.zone.addTo(...)
maplebirch.tool.addTo("sidebar", "<<myWidget>>");

// 注册初始化函数
maplebirch.tool.onInit(() => {
  // 在每次初始化时执行
});
```

### Built-in Initialization

The framework registers the following initialization logic during the `preInit` phase:

- `applyLocation()` — Apply location-related logic
- `applyBodywriting()` — Apply bodywriting-related logic

## applyLinkZone (Link Zone)

Handles the application logic for link zones in the game:

```js
const link = maplebirch.tool.link;
```

## otherTools (Other Tools)

Contains trait management, location application, bodywriting registration, and other miscellaneous tools:

```js
const other = maplebirch.tool.other;

// 添加自定义特质
other.addTraits({
  title: "勇敢",
  name: "brave",
  colour: "green",
  has: () => V.brave >= 1,
  text: "角色展现出勇气",
});

// 应用位置逻辑
other.applyLocation();

// 应用身体文字逻辑
other.applyBodywriting();
```

### Traits Registration

Register custom traits via `other.addTraits()`; see the Trait Interface below.

### Location Config

Apply in-game location logic via `other.applyLocation()`.

### Bodywriting

Add custom bodywriting patterns via `maplebirch.tool.other.addBodywriting()`; `other.applyBodywriting()` applies bodywriting-related logic.

### Trait Interface

| Field    | Type                 | Description                                         |
| -------- | -------------------- | --------------------------------------------------- |
| `title`  | `string`             | Trait title                                         |
| `name`   | `string`             | Trait identifier (required)                         |
| `colour` | `string`             | Display color                                       |
| `has`    | `Function \| string` | Ownership condition (function or expression string) |
| `text`   | `string`             | Trait description text                              |
