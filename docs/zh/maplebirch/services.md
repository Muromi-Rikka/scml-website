# 核心服务

本文介绍 maplebirchFramework 的三个核心服务：EventEmitter 事件总线、Logger 日志服务和 LanguageManager 国际化服务。

## EventEmitter 事件总线

`EventEmitter`（通过 `maplebirch.tracer` 访问）提供事件发布/订阅机制，是框架内部模块间通信的基础。完整 API 参考见 [EventEmitter](./event-emitter)。

### API

| 方法      | 签名                                      | 说明                           |
| --------- | ----------------------------------------- | ------------------------------ |
| `on`      | `on(eventName, callback, description?)`   | 注册事件监听器                 |
| `off`     | `off(eventName, identifier)`              | 移除监听器（按函数引用或描述） |
| `once`    | `once(eventName, callback, description?)` | 注册一次性监听器               |
| `after`   | `after(eventName, callback)`              | 注册事件触发后的回调           |
| `trigger` | `trigger(eventName, ...args)`             | 触发事件（异步）               |

### 便捷方法

`MaplebirchCore` 代理了事件总线的方法，可直接在 `maplebirch` 上调用：

```js
maplebirch.on(
  ":passageend",
  () => {
    // 每次 Passage 结束时执行
  },
  "my handler",
);

maplebirch.once(":storyready", () => {
  // 游戏启动后执行一次
});

maplebirch.off(":passageend", "my handler");
```

### 内置事件

| 事件名            | 触发时机               |
| ----------------- | ---------------------- |
| `:IndexedDB`      | IDB 存储注册时机       |
| `:import`         | 数据导入（语言文件等） |
| `:allModule`      | 所有模块注册完成       |
| `:variable`       | 变量可注入时机         |
| `:onSave`         | 存档时                 |
| `:onLoad`         | 读档时                 |
| `:onLoadSave`     | 加载存档完成           |
| `:language`       | 语言切换时             |
| `:storyready`     | 游戏完全启动           |
| `:passageinit`    | Passage 初始化         |
| `:passagestart`   | Passage 开始渲染       |
| `:passagerender`  | Passage 渲染结束       |
| `:passagedisplay` | Passage 准备显示       |
| `:passageend`     | Passage 处理完成       |
| `:sugarcube`      | SugarCube 对象可用     |
| `:modLoaderEnd`   | ModLoader 加载结束     |

### `on` vs `once` vs `after`

- **`on`** — 每次事件触发都执行
- **`once`** — 仅执行一次后自动移除
- **`after`** — 在事件所有 `on` 回调执行完成后执行，执行一次后移除

### 自定义事件

除内置事件外，可以注册任意自定义事件：

```js
// 注册自定义事件监听
maplebirch.on(
  ":myCustomEvent",
  (data) => {
    console.log("收到数据:", data);
  },
  "my custom handler",
);

// 触发自定义事件
await maplebirch.trigger(":myCustomEvent", { key: "value" });
```

## Logger 日志服务

`Logger`（通过 `maplebirch.logger` 访问）提供分级日志系统。

### 日志级别

| 级别  | 值  | 标签     | 颜色 |
| ----- | --- | -------- | ---- |
| DEBUG | 0   | `[调试]` | 灰色 |
| INFO  | 1   | `[信息]` | 绿色 |
| WARN  | 2   | `[警告]` | 橙色 |
| ERROR | 3   | `[错误]` | 红色 |

默认级别为 `INFO`。设置为 `DEBUG` 后可以看到所有调试日志。

### 使用方式

```js
// 通过 maplebirch 便捷方法
maplebirch.log("这是一条信息", "INFO");
maplebirch.log("调试数据", "DEBUG", someObject);
maplebirch.log("出现警告", "WARN");
maplebirch.log("发生错误", "ERROR");

// 设置日志级别
maplebirch.LogLevel = "DEBUG"; // 显示所有日志
maplebirch.LogLevel = "WARN"; // 仅显示警告和错误
```

### 创建模块日志

使用 `createlog()` 创建带前缀的日志函数：

```js
const log = maplebirch.tool.createlog("mymod");
log("初始化完成"); // [maplebirch][信息] [mymod] 初始化完成
log("详细信息", "DEBUG"); // [maplebirch][调试] [mymod] 详细信息
```

### IDB 配置

日志级别从 IndexedDB 的 `settings.DEBUG` 键读取。如果 `DEBUG` 为 `true`，日志级别自动设为 `DEBUG`。

## LanguageManager 国际化

`LanguageManager`（通过 `maplebirch.lang` 访问）提供多语言翻译支持。完整 API 与配置说明见 [LanguageManager](./language-manager)。

### 支持的语言

- `EN` — 英语
- `CN` — 中文

### 翻译 API

```js
// 按键翻译
const text = maplebirch.t("greeting"); // 返回当前语言的翻译

// 自动翻译（反向查找）
const translated = maplebirch.auto("Hello"); // 如果当前是 CN，返回 "你好"
```

### `t()` 方法

```js
maplebirch.t(key, space?)
```

- `key` — 翻译键
- `space` — 如果为 `true` 且当前语言为 EN，在结果后添加空格

查找顺序：内存缓存 → 当前语言 → EN 回退 → 第一个可用翻译 → `[key]`

### `auto()` 方法

反向翻译：根据文本内容查找对应的翻译键，然后返回当前语言的翻译。

查找顺序：缓存 → 内存翻译表全量搜索 → IndexedDB 异步查找

### 翻译文件格式

支持 JSON 和 YAML 格式：

```json
{
  "greeting": "你好",
  "farewell": "再见",
  "shop.welcome": "欢迎光临"
}
```

```yaml
greeting: 你好
farewell: 再见
shop.welcome: 欢迎光临
```

### 切换语言

```js
maplebirch.Language = "CN"; // 切换到中文
maplebirch.Language = "EN"; // 切换到英文
```

切换语言会：

1. 更新 `LanguageManager.language`
2. 清除翻译缓存
3. 触发 `:language` 事件

### 数据持久化

翻译数据存储在 IndexedDB 中：

- `language-translations` — 翻译键值对（按模组和语言索引）
- `language-metadata` — 文件哈希（用于增量更新检测）
- `language-text_index` — 文本反向索引（用于 `auto()` 查找）

翻译文件在导入时会计算 SHA-256 哈希，如果文件未变更则跳过导入。
