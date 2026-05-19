# NPC Schedules

## Overview

Schedules describe where a named NPC should be for each hour of the day, plus optional conditional overrides. Internally this is backed by `Schedule` instances and the `maplebirch.npc.Schedule` helpers. **v3.2.5** improves NPC schedule registration and special-schedule dependency resolution; pair it with **`GameVersion >= 0.5.9.7`** so time handling matches the supported game build.

_Register with **`maplebirch.npc.addSchedule(npcName, config)`**, where `config` is either a **`ScheduleConfig` object** or a **builder function** `(schedule) => …` chaining `at` / `when`. This delegates to `maplebirch.npc.Schedule.set`._

---

## API summary

### addSchedule(npcName, config)

| Argument  | Type                                                         | Description                                   |
| --------- | ------------------------------------------------------------ | --------------------------------------------- |
| `npcName` | `string`                                                     | NPC name consistent with `maplebirch.npc.add` |
| `config`  | `ScheduleConfig \| (schedule: Schedule) => void \| Schedule` | Object config or builder                      |

### ScheduleConfig

```ts
interface ScheduleConfig {
  daily?: Array<{ time: number | [number, number?]; location: string }>;
  special?: SpecialScheduleConfig[];
}
```

`daily`: `time` is an hour index, or `[startHour, endHour]` inclusive; each hour in the range gets the same `location`.

`special`: array of conditional rows with `condition`, `location`, and optional `id`, `before`, `after`, `insteadOf`, `override` (same shape as `SpecialScheduleConfig` in the framework).

### Object-style example

```javascript
maplebirch.npc.addSchedule("Robin", {
  daily: [
    { time: 8, location: "school" },
    { time: 12, location: "cafeteria" },
    { time: [14, 16], location: "library" },
    { time: 18, location: "home" },
  ],
  special: [
    {
      id: "weekend_park",
      condition: (date) => date.weekEnd && date.hour >= 10,
      location: "park",
    },
    {
      id: "night_study",
      condition: (date) => date.schoolDay && date.isHourBetween(19, 21),
      location: "library",
      override: false,
    },
  ],
});
```

### Builder example

```javascript
maplebirch.npc.addSchedule("Luna", (s) =>
  s
    .at(9, "school")
    .at([14, 16], "library")
    .when((date) => date.weekEnd && date.hour >= 10, "park", { id: "weekend_park" }),
);
```

### EnhancedDate hints

Callbacks receive an `EnhancedDate` with helpers such as `weekEnd`, `schoolDay`, season flags, `dawn` / `daytime` / `dusk` / `night`, and `isAt` / `isBetween` / `isHourBetween`. For weather or story flags, read normal game globals (`V`, `Weather`, …); not every game field is mirrored on `date`.

---

## Special schedule options

- **`override: true`**: evaluated ahead of non-override specials after sorting.
- **`before` / `after` / `insteadOf`**: declare ordering between specials. Cycles log a warning and fall back to the original order.

```javascript
maplebirch.npc.addSchedule("Demo", {
  special: [
    {
      id: "emergency",
      condition: (date) => !!V.emergency,
      location: "hospital",
      override: true,
    },
    {
      id: "morning",
      condition: (date) => date.isHour(7),
      location: "bathroom",
      before: "school_block",
    },
  ],
});
```

---

## Query & maintenance

### Instance and current location

```javascript
const schedule = maplebirch.npc.Schedule.get("Robin");
const loc = schedule.location;
```

### Update / remove specials

```javascript
maplebirch.npc.Schedule.update("Robin", "weekend_park", {
  location: "mall",
});

maplebirch.npc.Schedule.remove("Robin", "weekend_park");
```

### Clear

```javascript
maplebirch.npc.Schedule.clear("Robin");
// maplebirch.npc.Schedule.clearAll(); // clears every NPC — use with care
```

### Bulk snapshot

Read-only getter `maplebirch.npc.Schedule.location` returns `{ [npcName: string]: string }`.
