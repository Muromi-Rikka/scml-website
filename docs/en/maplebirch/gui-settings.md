# GUI Control & Settings

The GUIControl service manages the framework's settings panel, implemented through the ModLoaderGui AngularJS component system. Settings data is persisted to IndexedDB.

## Settings Panel

The framework registers an AngularJS component `maplebirch-control-component` via `ModSubUiAngularJs`, displayed on the ModLoader settings page.

### Panel Features

- **Language Switch** — Toggle framework language between EN/CN
- **Debug Mode** — Enable/disable DEBUG log level
- **Module Management** — Enable/disable extension modules (visible only in debug mode)
- **Script Management** — Enable/disable Mod scripts (visible only in debug mode)
- **Clear Database** — Reset IndexedDB (visible only in debug mode)

### Operation Instructions

| Operation       | Description                                                                         |
| --------------- | ----------------------------------------------------------------------------------- |
| Switch language | Select language from dropdown menu, takes effect immediately and persists           |
| Enable debug    | Click "Enable debug mode" to set log level to DEBUG                                 |
| Disable debug   | Click "Disable debug mode" to restore log level to INFO                             |
| Disable module  | Select module from enabled list, click "Disable module", takes effect after restart |
| Enable module   | Select module from disabled list, click "Enable module", takes effect after restart |

### Cascade Dependencies

When disabling a module, other modules that depend on it will be cascade-disabled. When enabling a module, other disabled modules that this module depends on will be cascade-enabled.

## IndexedDB Persistence

The framework uses IndexedDB as the settings storage backend, with database name `maplebirch`.

### Core Service

`IndexedDBService` (accessible via `maplebirch.idb`) provides the following functionality:

#### Register Store

```js
maplebirch.idb.register("my-store", { keyPath: "id" }, [
  { name: "indexName", keyPath: "field", options: { unique: false } },
]);
```

Store registration should be completed in the `:IndexedDB` event:

```js
maplebirch.once(":IndexedDB", () => {
  maplebirch.idb.register("my-store", { keyPath: "id" });
});
```

#### Transaction Operations

```js
// Read data
const value = await maplebirch.idb.withTransaction(["my-store"], "readonly", async (tx) => {
  return await tx.objectStore("my-store").get("key");
});

// Write data
await maplebirch.idb.withTransaction(["my-store"], "readwrite", async (tx) => {
  await tx.objectStore("my-store").put({ id: "key", value: "data" });
});
```

#### Other Methods

| Method             | Description                                                     |
| ------------------ | --------------------------------------------------------------- |
| `init()`           | Initialize database (automatically called on first transaction) |
| `clearStore(name)` | Clear specified store                                           |
| `deleteDatabase()` | Delete entire database                                          |
| `resetDatabase()`  | Delete and rebuild database (refreshes page)                    |
| `checkStore()`     | Check if all registered stores exist                            |

### Built-in Stores

The framework registers the following IndexedDB stores:

| Store Name              | Purpose                                                         | Registrant      |
| ----------------------- | --------------------------------------------------------------- | --------------- |
| `settings`              | Global settings (language, debug, module/script enable/disable) | GUIControl      |
| `audio-buffers`         | Audio file cache                                                | AudioManager    |
| `language-metadata`     | Translation file metadata (hash, timestamp)                     | LanguageManager |
| `language-translations` | Translation key-value pairs                                     | LanguageManager |
| `language-text_index`   | Translation text reverse index                                  | LanguageManager |

### settings Store Keys

| Key         | Default                            | Description                           |
| ----------- | ---------------------------------- | ------------------------------------- |
| `DEBUG`     | `false`                            | Whether debug mode is enabled         |
| `Language`  | Auto-detected                      | Current language (EN/CN)              |
| `Extension` | `{ enabled: [...], disabled: [] }` | Extension module enable/disable state |
| `Script`    | `{ enabled: [...], disabled: [] }` | Script enable/disable state           |
