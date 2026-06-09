# Time Events

The TimeEvents module handles time-related events. It allows registering events that trigger at specific times or intervals (e.g. per second, per minute, hourly, daily, monthly) and on time travel.

_Use **`maplebirch.dynamic.regTimeEvent`** (the underlying manager is **`maplebirch.dynamic.Time`**). For legacy “Simple Frameworks” scripts, the global **`TimeEvent`** class still bridges to `regTimeEvent` (see [Getting Started](/maplebirch/getting-started))._

:::tip Game version & v3.2.5

The framework pins **`GameVersion` to `>=0.5.9.7`**. **v3.2.5** includes time-event fixes targeting that line; mirror the same constraint in your mod’s `dependenceInfo` when you rely on these APIs.

:::

:::info v4.0.2 Time System Improvements

v4.0.2 rewrote portions of the time-advance and time-travel logic:

- **Reduced time-advance conflicts**: `handleTimePass` no longer saves the original `Time.pass` locally. The `Time` module now owns `vanillaTime` references, preventing conflicts with addons like `DoLTimeWrapperAddon`.
- **`MIN_DATE` validation**: Both `handleTimePass` and `handleTimeTravel` now validate that the target timestamp falls within `[MIN_DATE, MAX_DATE]`. `timeTravel` throws an error on invalid targets instead of silently failing.
- **Exposed manual patch methods**: `TimeManager` now exposes `patchDateTime(DateTimeClass)` and `patchTime(TimeObject)`, letting advanced use-cases control when DateTime/Time are patched.
- **`TimeConstants` public**: `maplebirch.dynamic.Time.TimeConstants` is now accessible externally, including `MAX_DATE` and `MIN_DATE`.
- **Cross-passage time rollback**: `handleTimeTravel` no longer calls the vanilla `timeTravel`; it sets the target date directly and then fires events, reducing conflicts with DoL’s built-in time-travel logic.

:::

## Core API

### regTimeEvent(type, eventId, options)

Register a new time event.

- **@param** `type` (string): Event type — `onSec`, `onMin`, `onHour`, `onDay`, `onWeek`, `onMonth`, `onYear`, `onBefore`, `onThread`, `onAfter`, `onTimeTravel`
- **@param** `eventId` (string): Unique event identifier
- **@param** `options` (TimeEventOptions): Event configuration
- **@return** `boolean`: Whether registration succeeded

```js
// Register a daily event
maplebirch.dynamic.regTimeEvent("onDay", "dailyCheck", {
  action: (data) => {
    V.dayCounter = (V.dayCounter || 0) + 1;
  },
  cond: (data) => data.currentDate.hour >= 6 && data.currentDate.hour < 18,
  priority: 5,
  once: false,
});
```

### delTimeEvent(type, eventId)

Unregister a time event.

```js
maplebirch.dynamic.delTimeEvent("onDay", "dailyCheck");
```

### timeTravel(options)

Jump game time forward or backward.

```js
// Jump to specific date
maplebirch.dynamic.timeTravel({
  year: 2025,
  month: 3,
  day: 15,
  hour: 12,
});

// Jump forward by duration
maplebirch.dynamic.timeTravel({
  addDays: 7,
  addHours: 6,
});
```

## Event Options

| Option       | Type     | Description                              |
| ------------ | -------- | ---------------------------------------- |
| `action`     | function | Called when triggered, receives TimeData |
| `cond`       | function | Condition function, returns boolean      |
| `priority`   | number   | Higher runs first                        |
| `once`       | boolean  | Trigger only once                        |
| `accumulate` | object   | Accumulate trigger config                |
| `exact`      | boolean  | Trigger at exact time boundary           |
