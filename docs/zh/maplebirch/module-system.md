# ModuleSystem 模块系统

## 基本介绍

`ModuleSystem` 是框架的模块化加载与依赖管理系统。它负责模块的注册、依赖解析和生命周期初始化，确保模块按正确顺序加载和执行。

整体架构与初始化流程参见 [核心架构](./architecture)。

---

## 核心 API

### register(name, module, dependencies?)

在 `maplebirch` 上注册模块（代理到 `ModuleSystem.register`）。

- **@param** `name` (string): 模块名称。
- **@param** `module` (object): 模块对象，可含 `preInit` / `Init` / `loadInit` / `postInit` 等生命周期方法；若需**暴露到 `maplebirch` 根上**供脚本访问，需设置 `exposed: true`（见下例）。
- **@param** `dependencies` (string[]): 依赖模块列表，默认 `[]`。亦可将依赖写在 `module.dependencies` 数组中，二者会合并。
- **@return** `boolean`: 是否成功注册（同名已存在时返回 `false`）。

**来源标识 `source`（v3.2.3）**：`register` 不再接受第四个参数。扩展模块所属 Mod 名由 **`maplebirch.modules.runWithSource(modName, callback)`** 在加载你的脚本时自动压栈，回调内的 `register` 会把 `source` 记为当前 Mod，用于 GUI 中的启禁与依赖展示。

```js
// 普通模块
maplebirch.register("myModule", {
  Init() {
    console.log("模块初始化");
  },
});

// 带依赖
maplebirch.register(
  "myModule2",
  {
    Init() {
      console.log("依赖 var 与 tool");
    },
  },
  ["var", "tool"],
);

// 在 Addon 脚本上下文中注册扩展（由 AddonPlugin 包在 runWithSource 内执行时，source 自动为当前 modName）
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

获取已注册模块实例（`ModuleSystem.registry`）。

- **@param** `name` (string): 模块名称。
- **@return** 模块对象或 `undefined`。

```js
const addon = maplebirch.get("addon");
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
console.log("addon 的依赖:", graph.addon.dependencies);
console.log("依赖 addon 的模块:", graph.addon.dependents);
```

---

## 模块状态说明

每个模块在生命周期中可能处于以下状态：

| 状态常量     | 值  | 说明                                 |
| ------------ | --- | ------------------------------------ |
| `REGISTERED` | 0   | 已注册，尚未完成主初始化             |
| `MOUNTED`    | 1   | 主初始化流程已完成                   |
| `ERROR`      | 2   | 初始化过程中发生错误                 |
| `EXPOSED`    | 3   | 暴露模块，已挂到 `maplebirch` 根属性 |
| `DISABLED`   | 4   | 已被禁用                             |

---

## 模块初始化方法

模块可定义以下生命周期方法：

### preInit()

在 `afterInjectEarlyLoad` 阶段调用。**每个模块只会执行一次**，用于资源预加载和基础设置。此时没有 setup 变量和 V 变量。

```js
preInit() {
  this.cache = new Map();
}
```

### Init()

在 `:passageinit` 事件后调用。**每个模块只会执行一次**，用于模块主初始化。此时已有 setup 变量和 V 变量。

```js
Init() {
  this.setupEventListeners();
  this.loadConfig();
}
```

### loadInit()

**仅在读取存档时调用**。每次读取存档时都会执行，用于恢复存档状态。此时有存档中的 V 变量。

```js
loadInit() {
  if (V.myData) {
    this.data = V.myData;
  }
}
```

### postInit()

在每个段落开始时调用，在 `Init` 和 `loadInit` 之后执行。**每个段落都会执行一次**，此时有当前 V 变量。

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
    console.log("MyModule 预初始化");
    this.cache = new Map();
  }

  Init() {
    console.log("MyModule 主初始化");
    this.setup();
  }

  loadInit() {
    console.log("MyModule 存档初始化");
    if (V.myModuleData) {
      this.data = V.myModuleData;
    }
  }

  postInit() {
    console.log("MyModule 后初始化");
    this.cleanup();
  }

  setup() {
    // 设置逻辑
  }

  cleanup() {
    // 清理逻辑
  }

  myFunction() {
    return "Hello from MyModule";
  }
}

// 注册模块
maplebirch.register("myModule", new MyModule(maplebirch), ["addon", "dynamic"]);
```

---

## 依赖管理

### 声明依赖

```js
// 在注册时声明
maplebirch.register("myModule", myModuleInstance, ["var", "tool"]);
```

### 依赖规则

1. 模块会在其所有依赖初始化完成后才初始化。
2. 支持传递依赖（A 依赖 B，B 依赖 C，则 A 间接依赖 C）。
3. 循环依赖会被自动检测并阻止。

### 依赖图查询

```js
const graph = maplebirch.dependencyGraph;
console.log("addon 模块的依赖:", graph.addon.dependencies);
console.log("依赖 addon 的模块:", graph.addon.dependents);
```

---

## 注意事项

1. **模块命名**：避免使用保留名称，如 `core`、`modules`。
2. **初始化顺序**：依赖解析基于拓扑排序，需理解排序逻辑。
3. **错误处理**：单个模块初始化失败不会影响其他模块。
4. **禁用机制**：模块可从模组加载器配置中禁用。
5. **扩展模块**：设置 `exposed: true` 且注册成功后会挂到 `maplebirch` 根属性；需在 `runWithSource` 提供的上下文中注册以便记录 `source`，并可通过 GUI 启禁。
