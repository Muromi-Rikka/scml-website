# EventEmitter 事件发射器

## 基本介绍

`EventEmitter` 是框架内置的轻量级事件发布/订阅系统。它允许框架内部的不同模块以及开发者编写的代码，在特定时刻（如游戏初始化、段落加载、存档读取时）执行自定义逻辑。系统采用订阅-发布模式，支持内置事件与自定义事件，并确保事件的同步/异步回调执行与错误处理。

`EventEmitter` 通过 `maplebirch.tracer` 访问。`MaplebirchCore` 代理了其方法，因此可直接在 `maplebirch` 上调用。

---

## 核心 API

### on(eventName, callback, description?)

注册一个持续有效的事件监听器。

- **@param** `eventName` (string): 事件名称。可使用框架内置事件（如 `:passagestart`）或自定义字符串。
- **@param** `callback` (function): 事件触发时执行的回调函数，可接受任意参数。
- **@param** `description` (string, 可选): 对该监听器的描述，可用于后续移除监听器。
- **@return** `boolean`: 若成功注册则返回 `true`；若已存在相同函数引用的监听器则返回 `false`。

```js
// 监听段落开始事件
maplebirch.on(":passagestart", () => console.log("新段落开始了！"), "我的段落监听器");
```

### off(eventName, identifier)

移除已注册的事件监听器。

- **@param** `eventName` (string): 要移除监听器的事件名称。
- **@param** `identifier` (Function | string): 标识要移除的监听器。可以是注册时传入的 `callback` 函数本身、注册时提供的 `description` 字符串，或系统自动生成的 `internalId`。
- **@return** `boolean`: 是否成功移除监听器。

```js
const handler = () => console.log("Handler");
maplebirch.on(":passagestart", handler, "我的监听器");
maplebirch.off(":passagestart", handler); // 或 maplebirch.off(':passagestart', '我的监听器');
```

### once(eventName, callback, description?)

注册一个单次监听器，在事件触发**一次**后自动移除。

- 参数与 `on` 相同。
- 常用于只需执行一次的初始化任务。

```js
maplebirch.once(
  ":storyready",
  () => {
    console.log("游戏就绪，仅初始化一次");
  },
  "一次性初始化",
);
```

### trigger(eventName, ...args)

触发指定名称的事件，并按注册顺序同步执行所有关联的回调函数。支持异步回调（`async/await` 或返回 `Promise`）。

- **@param** `eventName` (string): 要触发的事件名称。
- **@param** `...args` (any): 传递给每个回调函数的参数。

```js
await maplebirch.trigger(":myCustomEvent", { key: "value" });
```

### after(eventName, callback)

注册一个回调，它将在**下一次**对应事件被触发**之后**执行，且**仅执行一次**。通常用于“某件事完成后执行后续操作”的逻辑。

- **@param** `eventName` (string): 事件名称。
- **@param** `callback` (function): 要执行的回调函数。

```js
maplebirch.after(":passagestart", () => {
  console.log("段落已开始，执行后续工作");
});
```

---

## on / once / after 对比

| 方法    | 执行时机                                             | 执行后   |
| ------- | ---------------------------------------------------- | -------- |
| `on`    | 每次事件触发                                         | 保持注册 |
| `once`  | 首次事件触发                                         | 自动移除 |
| `after` | 下一次事件触发后（包括所有 `on` 回调完成后）执行一次 | 自动移除 |

---

## 内置事件列表

框架预定义了多个生命周期事件，便于在关键节点注入逻辑：

| 事件名称          | 触发时机            |
| ----------------- | ------------------- |
| `:IndexedDB`      | 数据库初始化前      |
| `:import`         | 数据导入时          |
| `:allModule`      | 所有模块注册完成    |
| `:variable`       | 变量注入时机        |
| `:onSave`         | 游戏存档时          |
| `:onLoad`         | 游戏读档时          |
| `:onLoadSave`     | 加载存档后          |
| `:language`       | 游戏语言切换时      |
| `:storyready`     | 故事初始化完成      |
| `:passageinit`    | 段落初始化          |
| `:passagestart`   | 段落开始            |
| `:passagerender`  | 段落渲染            |
| `:passagedisplay` | 段落显示            |
| `:passageend`     | 段落结束            |
| `:sugarcube`      | 获取 SugarCube 对象 |
| `:modLoaderEnd`   | 模组加载器结束      |

---

## 自定义事件

除内置事件外，可注册和触发任意自定义事件：

```js
maplebirch.on(
  ":myCustomEvent",
  (data) => {
    console.log("收到数据:", data);
  },
  "我的自定义监听器",
);

await maplebirch.trigger(":myCustomEvent", { key: "value" });
```
