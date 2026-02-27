# EventEmitter Event Bus

## Overview

`EventEmitter` is a lightweight event publish/subscribe system built into the framework. It allows different modules inside the framework, as well as developer code, to execute custom logic at specific moments (e.g. game initialization, passage load, save load). The system uses a publish-subscribe pattern, supports built-in and custom events, and ensures synchronous/asynchronous callback execution with error handling.

`EventEmitter` is accessible via `maplebirch.tracer`. `MaplebirchCore` proxies its methods, so you can call them directly on `maplebirch`.

---

## Core API

### on(eventName, callback, description?)

Registers a persistent event listener.

- **@param** `eventName` (string): Event name. Use framework built-in events (e.g. `:passagestart`) or any custom string.
- **@param** `callback` (function): Callback to run when the event fires. May accept any arguments.
- **@param** `description` (string, optional): Description for the listener; useful for removing it later.
- **@return** `boolean`: `true` if the listener was registered; `false` if a listener with the same function reference already exists.

```js
// Listen for passage start
maplebirch.on(":passagestart", () => console.log("New passage started!"), "my passage listener");
```

### off(eventName, identifier)

Removes an existing event listener.

- **@param** `eventName` (string): Event name from which to remove the listener.
- **@param** `identifier` (Function | string): Identifies the listener. May be the `callback` function reference, the `description` string passed to `on`, or the system-generated `internalId`.
- **@return** `boolean`: `true` if the listener was removed.

```js
const handler = () => console.log("Handler");
maplebirch.on(":passagestart", handler, "my handler");
maplebirch.off(":passagestart", handler); // or maplebirch.off(':passagestart', 'my handler');
```

### once(eventName, callback, description?)

Registers a one-time listener that is removed after the first trigger.

- Parameters are the same as `on`.
- Useful for one-off initialization tasks.

```js
maplebirch.once(
  ":storyready",
  () => {
    console.log("Game ready, initializing once");
  },
  "one-time init",
);
```

### trigger(eventName, ...args)

Fires the given event and runs all associated callbacks in registration order. Supports async callbacks (`async/await` or returning a `Promise`).

- **@param** `eventName` (string): Event name to trigger.
- **@param** `...args` (any): Arguments passed to each callback.

```js
await maplebirch.trigger(":myCustomEvent", { key: "value" });
```

### after(eventName, callback)

Registers a callback that runs **once** after the **next** time the event fires. Used for “run this after that event happens” logic.

- **@param** `eventName` (string): Event name.
- **@param** `callback` (function): Callback to run.

```js
maplebirch.after(":passagestart", () => {
  console.log("Passage started, doing follow-up work");
});
```

---

## on vs once vs after

| Method  | When it runs                                                   | After execution  |
| ------- | -------------------------------------------------------------- | ---------------- |
| `on`    | Every time the event fires                                     | Stays registered |
| `once`  | First time the event fires                                     | Removed          |
| `after` | Once, after the next event fire (including all `on` callbacks) | Removed          |

---

## Built-in Events

The framework defines these lifecycle events for hooking into key moments:

| Event Name        | Trigger Timing                 |
| ----------------- | ------------------------------ |
| `:IndexedDB`      | Before database initialization |
| `:import`         | During data import             |
| `:allModule`      | All modules registered         |
| `:variable`       | When variables are injectable  |
| `:onSave`         | Game save                      |
| `:onLoad`         | Game load                      |
| `:onLoadSave`     | After save loaded              |
| `:language`       | Language switch                |
| `:storyready`     | Story fully initialized        |
| `:passageinit`    | Passage initialization         |
| `:passagestart`   | Passage start                  |
| `:passagerender`  | Passage render                 |
| `:passagedisplay` | Passage display                |
| `:passageend`     | Passage end                    |
| `:sugarcube`      | SugarCube object available     |
| `:modLoaderEnd`   | ModLoader load complete        |

---

## Custom Events

You can register and trigger custom events:

```js
maplebirch.on(
  ":myCustomEvent",
  (data) => {
    console.log("Received:", data);
  },
  "my custom handler",
);

await maplebirch.trigger(":myCustomEvent", { key: "value" });
```
