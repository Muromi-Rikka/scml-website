# State Events

The StateEvents module is part of the dynamic management system. It handles game state-triggered events. The framework automatically checks and triggers events at passage start and end.

_Access via `maplebirch.dynamic.State` or shortcut `maplebirchFrameworks.addStateEvent()`._

## Core API

### regStateEvent(type, eventId, options)

Register a new state event.

- **@param** `type` (string): Event type, `'interrupt'` or `'overlay'`
- **@param** `eventId` (string): Unique event identifier
- **@param** `options` (StateEventOptions): Event configuration
- **@return** `boolean`: Whether registration succeeded

```js
// Register an interrupt event
maplebirch.dynamic.regStateEvent("interrupt", "encounterBandit", {
  output: "banditEncounter",
  cond: () => V.location === "forest" && V.time === "night",
  priority: 5,
  once: true,
});
```

### delStateEvent(type, eventId)

Unregister a state event.

```js
maplebirch.dynamic.delStateEvent("interrupt", "encounterBandit");
```

### trigger(type)

Trigger state events manually:

```js
const result = maplebirch.dynamic.trigger("interrupt");
```

## Event Options

| Option          | Type     | Description                                  |
| --------------- | -------- | -------------------------------------------- |
| `output`        | string   | Widget macro name to call when triggered     |
| `cond`          | function | Trigger condition, returns boolean           |
| `priority`      | number   | Higher runs first                            |
| `once`          | boolean  | Trigger only once                            |
| `forceExit`     | boolean  | Force abort current passage (interrupt only) |
| `extra.passage` | string[] | Only trigger in these passages               |
| `extra.exclude` | string[] | Do not trigger in these passages             |

## Event Types

| Type        | Description                                                 |
| ----------- | ----------------------------------------------------------- |
| `interrupt` | Checked at passage start; first match interrupts execution  |
| `overlay`   | Checked at passage end; multiple may fire, content appended |
