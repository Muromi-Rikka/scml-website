# Time Events

The TimeEvents module handles time-related events. It allows registering events that trigger at specific times or intervals (e.g. hourly, daily, monthly) and on time travel.

_Access via `maplebirch.dynamic.Time` or shortcut `maplebirchFrameworks.addTimeEvent()`._

## Core API

### regTimeEvent(type, eventId, options)

Register a new time event.

- **@param** `type` (string): Event type — `onSec`, `onMin`, `onHour`, `onDay`, `onWeek`, `onMonth`, `onYear`, `onTimeTravel`
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
