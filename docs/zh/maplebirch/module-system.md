# ModuleSystem 模块系统

## 基本介绍

`ModuleSystem` 是框架的模块注册、依赖排序与生命周期调度系统。**一般内容模组不需要直接注册框架模块**；优先使用 `addonPlugin` 的 `script` 加载普通脚本。只有在你明确要扩展框架内部能力时，才使用 `maplebirch.register`。

整体架构与初始化流程参见 [核心架构](./architecture)。

---

## 注册模块

### register(name, module, dependencies?)

在 `maplebirch` 上注册模块（代理到 `ModuleSystem.register`）。

| 参数 | 说明 |
| ---- | ---- |
| `name` | 模块名称 |
| `module` | 模块对象，可含生命周期方法；`module.dependencies` 会与第三个参数合并 |
| `dependencies` | 依赖模块名称数组，可选 |

- **@return** `boolean`：成功为 `true`；同名已存在为 `false`。

扩展模块的 **`source`**（来源 Mod 名）由框架在 AddonPlugin 加载 `module` 脚本时自动记录，**无需**手动传入第四个参数或调用 `runWithSource`。

```js
maplebirch.register("myModule", {
  Init() {
    console.log("模块初始化");
  },
});

maplebirch.register(
  "myModule2",
  {
    dependencies: ["tool"],
    Init() {
      console.log("依赖 tool 与 npc");
    },
  },
  ["npc"],
);
```

### get(name)

获取已注册模块实例。

```js
const npcModule = maplebirch.get("npc");
```

### dependencyGraph

返回每个模块的依赖关系。常见字段：

| 字段 | 说明 |
| ---- | ---- |
| `protected` | 是否为受保护模块（不可被禁用界面关闭） |
| `mounted` | 是否属于框架核心挂载列表 |
| `early` | 是否会在预初始化阶段提前挂载 |
| `dependencies` | 直接依赖 |
| `dependents` | 依赖该模块的模块 |
| `allDependencies` | 传递依赖 |
| `state` | 当前状态（如 `'MOUNTED'`） |
| `source` | 来源 Mod 名（扩展模块） |

```js
const graph = maplebirch.dependencyGraph;
console.log(graph.npc);
```

---

## 暴露模块（EXPOSED）

若模块对象带有 **`exposed: true`**，注册成功后状态为 **`EXPOSED`**，并直接挂载到 **`maplebirch[name]`**。

```js
maplebirch.register("myApi", {
  exposed: true,
  hello() {
    return "Hello";
  },
});

maplebirch.myApi.hello();
```

:::warning EXPOSED 行为
暴露模块**不参与**普通初始化流程（不调用 `preInit` / `Init` / `loadInit` / `postInit`），也**不会**出现在禁用界面的可禁用模块列表中；依赖图会把 `EXPOSED` 模块视为已满足的依赖。若 `maplebirch[name]` 已被占用，注册会失败。
:::

---

## 模块状态

| 状态 | 值 | 说明 |
| ---- | -- | ---- |
| `REGISTERED` | 0 | 已注册，等待初始化 |
| `MOUNTED` | 1 | 主初始化已完成 |
| `ERROR` | 2 | 初始化失败 |
| `EXPOSED` | 3 | 暴露模块，已挂到 `maplebirch` 根属性 |
| `DISABLED` | 4 | 被禁用，跳过初始化 |

预初始化完成不会改变模块状态，而是记录在内部的 `preInitialized` 集合；主初始化完成后才进入 `MOUNTED`。

---

## 生命周期方法

| 方法 | 调用时机 | 用途 |
| ---- | -------- | ---- |
| `preInit()` | `afterInjectEarlyLoad` 后，IndexedDB 与日志准备完成 | 提前准备资源、配置、缓存（无 `setup` / `V`） |
| `Init()` | 首次进入正常游戏段落的 **`:passagestart`** | 主初始化，可使用 `setup` 与 `V` |
| `loadInit()` | 读档后进入段落时 | 从存档恢复状态 |
| `postInit()` | 每次段落开始，在 `Init` 或 `loadInit` 之后 | 刷新段落级逻辑 |

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

## 依赖规则

1. 模块会在所有依赖满足后再初始化；会做传递收集（A→B→C 则 A 等待 C）。
2. **`EXPOSED`** 模块视为已满足依赖。
3. 依赖进入 **`ERROR`** 或 **`DISABLED`** 时，依赖它的模块不会继续初始化。
4. 循环依赖会在注册时被检测并阻止。

---

## 注意事项

1. **内容型模组**应优先使用 `script`，而不是注册框架模块（**v3.2.5** 起注册方式已简化，见 [更新日志](./changelog)）。
2. **模块命名**：建议带 Mod 前缀，避免与内置模块或其它 Mod 冲突。
3. **错误处理**：单个模块初始化失败不会阻塞其它模块。
4. **禁用机制**：受保护模块（`protected`）不会被禁用界面关闭；扩展模块可通过 GUI 启禁（`source` 由框架记录）。
