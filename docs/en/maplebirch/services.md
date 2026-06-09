# Core Services

This document introduces the core services of maplebirchFramework: EventEmitter event bus, Logger logging service, LanguageManager internationalization service, and CloudSaveService cloud save service.

## EventEmitter Event Bus

`EventEmitter` (accessible via `maplebirch.tracer`) provides a publish/subscribe event mechanism and is the foundation for inter-module communication within the framework. For full API reference, see [EventEmitter](./event-emitter).

### API

| Method    | Signature                                 | Description                                            |
| --------- | ----------------------------------------- | ------------------------------------------------------ |
| `on`      | `on(eventName, callback, description?)`   | Register event listener                                |
| `off`     | `off(eventName, identifier)`              | Remove listener (by function reference or description) |
| `once`    | `once(eventName, callback, description?)` | Register one-time listener                             |
| `after`   | `after(eventName, callback)`              | Register callback to run after event fires             |
| `trigger` | `trigger(eventName, ...args)`             | Trigger event (async)                                  |

### Convenience Methods

`MaplebirchCore` proxies the event bus methods, which can be called directly on `maplebirch`:

```js
maplebirch.on(
  ":passageend",
  () => {
    // Run on each passage end
  },
  "my handler",
);

maplebirch.once(":storyready", () => {
  // Run once after game starts
});

maplebirch.off(":passageend", "my handler");
```

### Built-in Events

| Event Name        | Trigger Timing                     |
| ----------------- | ---------------------------------- |
| `:IndexedDB`      | IDB store registration time        |
| `:import`         | Data import (language files, etc.) |
| `:allModule`      | All modules registered             |
| `:variable`       | Variables injectable               |
| `:onSave`         | On save                            |
| `:onLoad`         | On load                            |
| `:onLoadSave`     | Load save complete                 |
| `:language`       | Language switch                    |
| `:storyready`     | Game fully started                 |
| `:passageinit`    | Passage initialization             |
| `:passagestart`   | Passage start rendering            |
| `:passagerender`  | Passage render complete            |
| `:passagedisplay` | Passage ready to display           |
| `:passageend`     | Passage processing complete        |
| `:sugarcube`      | SugarCube object available         |
| `:modLoaderEnd`   | ModLoader load complete            |

### `on` vs `once` vs `after`

- **`on`** — Executes every time the event fires
- **`once`** — Executes once then auto-removes
- **`after`** — Executes after all `on` callbacks complete, then removes

### Custom Events

Besides built-in events, you can register arbitrary custom events:

```js
// Register custom event listener
maplebirch.on(
  ":myCustomEvent",
  (data) => {
    console.log("Received data:", data);
  },
  "my custom handler",
);

// Trigger custom event
await maplebirch.trigger(":myCustomEvent", { key: "value" });
```

## Logger Logging Service

`Logger` (accessible via `maplebirch.logger`) provides a tiered logging system.

### Log Levels

| Level | Value | Tag       | Color  |
| ----- | ----- | --------- | ------ |
| DEBUG | 0     | `[DEBUG]` | Gray   |
| INFO  | 1     | `[INFO]`  | Green  |
| WARN  | 2     | `[WARN]`  | Orange |
| ERROR | 3     | `[ERROR]` | Red    |

Default level is `INFO`. Set to `DEBUG` to see all debug logs.

### Usage

```js
// Via maplebirch convenience methods
maplebirch.log("Info message", "INFO");
maplebirch.log("Debug data", "DEBUG", someObject);
maplebirch.log("Warning message", "WARN");
maplebirch.log("Error message", "ERROR");

// Set log level
maplebirch.LogLevel = "DEBUG"; // Show all logs
maplebirch.LogLevel = "WARN"; // Show warnings and errors only
```

### Creating Module Logs

Use `createlog()` to create log functions with a prefix:

```js
const log = maplebirch.tool.createlog("mymod");
log("Init complete"); // [maplebirch][INFO] [mymod] Init complete
log("Details", "DEBUG"); // [maplebirch][DEBUG] [mymod] Details
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
// Lookup by key
const text = maplebirch.t("greeting"); // Returns translation for current language

// Auto translation (reverse lookup)
const translated = maplebirch.auto("Hello"); // If current is CN, returns "你好"
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
maplebirch.Language = "CN"; // Switch to Chinese
maplebirch.Language = "EN"; // Switch to English
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

## CloudSaveService Cloud Save

`CloudSaveService` (accessible via `maplebirch.cloudSave`) provides cloud save management with two backend modes: self-hosted server (Go+SQLite) and WebDAV (e.g. Cloudflare R2). Save data is encrypted with AES-256-GCM, with keys derived via PBKDF2.

### Backend Modes

| Mode     | Auth Method                    | Description                           |
| -------- | ------------------------------ | ------------------------------------- |
| `server` | Username/password + Bearer Token | Self-hosted Go+SQLite server        |
| `webdav` | Basic Auth                     | Generic WebDAV (e.g. Cloudflare R2)   |

Auto-detection on connect: sends a request to `/health`; if JSON is returned, uses `server` mode, otherwise falls back to `webdav`.

### Configuration

```js
maplebirch.cloudSave.configure({
  mode: 'server',       // optional, auto-detected on connect
  endpoint: 'https://your-server.example.com',
  username: 'user',
  password: 'pass',
  passphrase: 'pass'    // encryption passphrase, optional (defaults to password)
});
```

### Account Management (server mode)

| Method         | Signature                                              | Description            |
| -------------- | ------------------------------------------------------ | ---------------------- |
| `register`     | `register(username, password, passphrase?)`            | Register a new account |
| `login`        | `login(username, password, passphrase?)`               | Log in                 |
| `deleteAccount`| `deleteAccount(password)`                              | Delete account         |

### Save Slot Operations

| Method         | Signature                                   | Description                                      |
| -------------- | ------------------------------------------- | ------------------------------------------------ |
| `exportSlot`   | `exportSlot(slot)`                          | Export local slot from vanilla IndexedDB         |
| `importSlot`   | `importSlot(record, targetSlot?)`           | Write cloud record back to vanilla IndexedDB     |
| `upload`       | `upload(slot)`                              | Encrypt and upload local slot to cloud           |
| `download`     | `download(slot, targetSlot?)`               | Download and decrypt from cloud to local slot    |
| `listRemote`   | `listRemote()`                              | List all remote save slots                       |
| `deleteRemote` | `deleteRemote(slot)`                        | Delete a remote save slot                        |

### Save Code Operations

| Method           | Signature                   | Description                                |
| ---------------- | --------------------------- | ------------------------------------------ |
| `exportCode`     | `exportCode()`              | Export current SugarCube save code         |
| `exportSlotCode` | `exportSlotCode(slot)`      | Convert local slot to a copyable save code |
| `importCode`     | `importCode(code)`          | Import save from save code                 |
| `uploadCode`     | `uploadCode(code?)`         | Upload save code to cloud                  |
| `downloadCode`   | `downloadCode()`            | Download save code from cloud              |

### Panel Integration

| Method        | Signature                              | Description                                    |
| ------------- | -------------------------------------- | ---------------------------------------------- |
| `mountPanel`  | `mountPanel()`                         | Mount cloud save UI panel, restores last config|
| `panelAction` | `panelAction(action, slot?)`           | Execute a panel action (connectRemote, etc.)   |

Supported panel actions (`PanelAction`):

| Action                  | Description                      |
| ----------------------- | -------------------------------- |
| `connectRemote`         | Connect to remote service        |
| `registerServer`        | Register on server               |
| `deleteServerAccount`   | Delete server account            |
| `uploadSlot`            | Upload save slot                 |
| `downloadSlot`          | Download save slot               |
| `refreshRemoteList`     | Refresh remote list              |
| `deleteRemoteSlot`      | Delete remote slot               |
| `exportCurrentCode`     | Export current save code         |
| `exportSlotCode`        | Export slot save code            |
| `uploadCode`            | Upload save code                 |
| `downloadCode`          | Download save code               |
| `importCode`            | Import save code                 |

### Encryption

- Algorithm: AES-256-GCM
- Key derivation: PBKDF2 (150,000 iterations, SHA-256)
- Compression: gzip (only when compressed size is smaller)
- Random salt and IV per encryption
