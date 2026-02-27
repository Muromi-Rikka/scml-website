# ModuleSystem 模块系统

## 基本介绍

`ModuleSystem` 是框架的模块化加载与依赖管理系统。它负责模块的注册、依赖解析和生命周期初始化，确保模块按正确顺序加载和执行。

整体架构与初始化流程参见 [核心架构](./architecture)。

---

## 核心 API

### register(name, module, dependencies?, source?)

注册一个模块到系统中。

- **@param** `name` (string): 模块名称。
- **@param** `module` (object): 模块对象，需包含初始化方法。
- **@param** `dependencies` (string[]): 依赖模块列表，默认空数组。
- **@param** `source` (string): 可选，模块来源标识，用于扩展模块。
- **@return** `boolean`: 是否成功注册。

```js
// 注册普通模块
maplebirch.register('myModule', {
  Init() {
    console.log('模块初始化');
  }
});

// 注册带依赖的模块
maplebirch.register(
  'myModule2',
  {
    Init() {
      console.log('依赖 var 和 tool 模块');
    }
  },
  ['var', 'tool']
);

// 注册扩展模块
maplebirch.register(
  'myExtension',
  {
    sayHello() {
      return 'Hello World';
    }
  },
  [],
  'my-mod-name'
);
```

扩展模块会直接挂载到 `maplebirch` 实例上，可通过 GUI 面板启用/禁用。

### getModule(name)

获取已注册的模块实例。

- **@param** `name` (string): 模块名称。
- **@return** 模块对象或 `undefined`。

```js
const addonModule = maplebirch.getModule('addon');
```

### dependencyGraph

获取所有模块的依赖关系图。每个条目包含：

- `dependencies` — 直接依赖
- `dependents` — 依赖该模块的模块
- `state` — 当前状态（如 `'MOUNTED'`）
- `allDependencies` — 所有传递依赖
- `source` — 来源标识（扩展模块）

```js
const graph = maplebirch.dependencyGraph;
console.log(graph.addon);
// 输出: {
//   dependencies: [],
//   dependents: ['dynamic', 'tool', ...],
//   state: 'MOUNTED',
//   allDependencies: [],
//   source: null
// }

// 查询依赖关系
console.log('addon 的依赖:', graph.addon.dependencies);
console.log('依赖 addon 的模块:', graph.addon.dependents);
```

---

## 模块状态说明

每个模块在生命周期中可能处于以下状态：

| 状态常量 | 值 | 说明 |
|----------|---|------|
| `REGISTERED` | 0 | 已注册，但未初始化 |
| `LOADED` | 1 | 预初始化已完成 |
| `MOUNTED` | 2 | 主初始化已完成 |
| `EXTENSION` | 3 | 扩展模块，已挂载到框架实例 |
| `ERROR` | 4 | 初始化过程中发生错误 |

---

## 模块初始化方法

模块可定义以下生命周期方法：

### preInit()

预初始化方法，在 `:allModule` 事件后调用。用于轻量级初始化或资源预加载。

```js
preInit() {
  this.cache = new Map();
}
```

### Init()

主初始化方法，在 `:passagestart` 事件时调用（仅首次）。用于模块主要功能初始化。

```js
Init() {
  this.setupEventListeners();
  this.loadConfig();
}
```

### loadInit()

存档初始化方法，仅在加载存档时调用。用于恢复存档状态。

```js
loadInit() {
  if (State.variables.myData) {
    this.data = State.variables.myData;
  }
}
```

### postInit()

后初始化方法，在 `Init` 或 `loadInit` 完成后调用。用于清理或最终设置。

```js
postInit() {
  this.cleanupTemporaryData();
  this.finalizeSetup();
}
```

---

## 完整模块示例

```js
class MyModule {
  constructor(maplebirch) {
    this.maplebirch = maplebirch;
  }

  preInit() {
    console.log('MyModule 预初始化');
    this.cache = new Map();
  }

  Init() {
    console.log('MyModule 主初始化');
    this.setup();
  }

  loadInit() {
    console.log('MyModule 存档初始化');
    if (State.variables.myModuleData) {
      this.data = State.variables.myModuleData;
    }
  }

  postInit() {
    console.log('MyModule 后初始化');
    this.cleanup();
  }

  setup() {
    // 设置逻辑
  }

  cleanup() {
    // 清理逻辑
  }

  myFunction() {
    return 'Hello from MyModule';
  }
}

// 注册模块
maplebirch.register('myModule', new MyModule(maplebirch), ['addon', 'dynamic']);
```

---

## 依赖管理

### 声明依赖

```js
// 在注册时声明
maplebirch.register('myModule', myModuleInstance, ['var', 'tool']);
```

### 依赖规则

1. 模块会在其所有依赖初始化完成后才初始化。
2. 支持传递依赖（A 依赖 B，B 依赖 C，则 A 间接依赖 C）。
3. 循环依赖会被自动检测并阻止。

### 依赖图查询

```js
const graph = maplebirch.dependencyGraph;
console.log('addon 模块的依赖:', graph.addon.dependencies);
console.log('依赖 addon 的模块:', graph.addon.dependents);
```

---

## 注意事项

1. **模块命名**：避免使用保留名称，如 `core`、`modules`。
2. **初始化顺序**：依赖解析基于拓扑排序，需理解排序逻辑。
3. **错误处理**：单个模块初始化失败不会影响其他模块。
4. **禁用机制**：模块可从模组加载器配置中禁用。
5. **扩展模块**：扩展模块会挂载到 `maplebirch` 实例上，便于全局访问。
