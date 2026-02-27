# Core Services

This document introduces the three core services of maplebirchFramework: EventEmitter event bus, Logger logging service, and LanguageManager internationalization service.

## EventEmitter Event Bus

`EventEmitter` (accessible via `maplebirch.tracer`) provides a publish/subscribe event mechanism and is the foundation for inter-module communication within the framework. For full API reference, see [EventEmitter](./event-emitter).

### API

| Method | Signature | Description |
|--------|-----------|-------------|
| `on` | `on(eventName, callback, description?)` | Register event listener |
| `off` | `off(eventName, identifier)` | Remove listener (by function reference or description) |
| `once` | `once(eventName, callback, description?)` | Register one-time listener |
| `after` | `after(eventName, callback)` | Register callback to run after event fires |
| `trigger` | `trigger(eventName, ...args)` | Trigger event (async) |

### Convenience Methods

`MaplebirchCore` proxies the event bus methods, which can be called directly on `maplebirch`:

```js
maplebirch.on(':passageend', () => {
  // 每次 Passage 结束时执行
}, 'my handler');

maplebirch.once(':storyready', () => {
  // 游戏启动后执行一次
});

maplebirch.off(':passageend', 'my handler');
```

### Built-in Events

| Event Name | Trigger Timing |
|------------|-----------------|
| `:IndexedDB` | IDB store registration time |
| `:import` | Data import (language files, etc.) |
| `:allModule` | All modules registered |
| `:variable` | Variables injectable |
| `:onSave` | On save |
| `:onLoad` | On load |
| `:onLoadSave` | Load save complete |
| `:language` | Language switch |
| `:storyready` | Game fully started |
| `:passageinit` | Passage initialization |
| `:passagestart` | Passage start rendering |
| `:passagerender` | Passage render complete |
| `:passagedisplay` | Passage ready to display |
| `:passageend` | Passage processing complete |
| `:sugarcube` | SugarCube object available |
| `:modLoaderEnd` | ModLoader load complete |

### `on` vs `once` vs `after`

- **`on`** — Executes every time the event fires
- **`once`** — Executes once then auto-removes
- **`after`** — Executes after all `on` callbacks complete, then removes

### Custom Events

Besides built-in events, you can register arbitrary custom events:

```js
// 注册自定义事件监听
maplebirch.on(':myCustomEvent', (data) => {
  console.log('收到数据:', data);
}, 'my custom handler');

// 触发自定义事件
await maplebirch.trigger(':myCustomEvent', { key: 'value' });
```

## Logger Logging Service

`Logger` (accessible via `maplebirch.logger`) provides a tiered logging system.

### Log Levels

| Level | Value | Tag | Color |
|-------|-------|-----|-------|
| DEBUG | 0 | `[调试]` | Gray |
| INFO | 1 | `[信息]` | Green |
| WARN | 2 | `[警告]` | Orange |
| ERROR | 3 | `[错误]` | Red |

Default level is `INFO`. Set to `DEBUG` to see all debug logs.

### Usage

```js
// 通过 maplebirch 便捷方法
maplebirch.log('这是一条信息', 'INFO');
maplebirch.log('调试数据', 'DEBUG', someObject);
maplebirch.log('出现警告', 'WARN');
maplebirch.log('发生错误', 'ERROR');

// 设置日志级别
maplebirch.LogLevel = 'DEBUG';  // 显示所有日志
maplebirch.LogLevel = 'WARN';   // 仅显示警告和错误
```

### Creating Module Logs

Use `createlog()` to create log functions with a prefix:

```js
const log = maplebirch.tool.createlog('mymod');
log('初始化完成');       // [maplebirch][信息] [mymod] 初始化完成
log('详细信息', 'DEBUG'); // [maplebirch][调试] [mymod] 详细信息
```

### IDB Configuration

Log level is read from the IndexedDB `settings.DEBUG` key. If `DEBUG` is `true`, log level is automatically set to `DEBUG`.

## LanguageManager Internationalization

`LanguageManager` (accessible via `maplebirch.lang`) provides multi-language translation support. For full API reference and configuration options, see [LanguageManager](./language-manager).

### Supported Languages

- `EN` — English
- `CN` — Chinese

### Translation API

```js
// 按键翻译
const text = maplebirch.t('greeting');  // Returns translation for current language

// 自动翻译（反向查找）
const translated = maplebirch.auto('Hello');  // If current is CN, returns "你好"
```

### `t()` Method

```js
maplebirch.t(key, space?)
```

- `key` — Translation key
- `space` — If `true` and current language is EN, append space to result

Lookup order: Memory cache → Current language → EN fallback → First available translation → `[key]`

### `auto()` Method

Reverse translation: Finds translation key by text content, then returns translation for current language.

Lookup order: Cache → Full search in memory translation table → IndexedDB async lookup

### Translation File Format

Supports JSON and YAML formats:

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

### Switching Language

```js
maplebirch.Language = 'CN';  // Switch to Chinese
maplebirch.Language = 'EN';  // Switch to English
```

Switching language will:
1. Update `LanguageManager.language`
2. Clear translation cache
3. Trigger `:language` event

### Data Persistence

Translation data is stored in IndexedDB:

- `language-translations` — Translation key-value pairs (indexed by mod and language)
- `language-metadata` — File hash (for incremental update detection)
- `language-text_index` — Text reverse index (for `auto()` lookup)

Translation files compute SHA-256 hash on import; import is skipped if file unchanged.
