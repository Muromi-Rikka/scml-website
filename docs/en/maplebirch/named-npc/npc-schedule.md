# NPC Schedules

## Overview

The NPC schedule system lets mod authors define when and where NPCs appear: fixed times, condition-based locations, and special schedules with priority and dependencies.

_Register schedules via `maplebirch.npc.addSchedule` or `maplebirch.npc.addNPCSchedule`._

---

## Concepts

### Schedule Types

1. **Fixed-time**: NPC is at a given location at a specific time or time range.
2. **Condition-based**: Location depends on game state, time, weather, etc.
3. **Special**: Schedules with dependencies and priority (e.g. override, before/after).

### Core Components

- **ScheduleTime**: Time (hour or range).
- **ScheduleCondition**: Condition function.
- **ScheduleLocation**: Location (string or function).
- **SpecialSchedule**: Options for override, before, after, etc.

---

## addSchedule

### Basic Syntax

```javascript
// Fixed time
maplebirch.npc.addSchedule("Luna", 9, "school");              // at 9:00
maplebirch.npc.addSchedule("Luna", [14, 16], "library");      // 14:00–16:00

// Condition-based
maplebirch.npc.addSchedule(
  "Luna",
  (date) => date.weekEnd && date.hour >= 10,
  "park",
  "weekend_park",
);

// Special schedule with options
maplebirch.npc.addSchedule(
  "Luna",
  (date) => date.weather === "rain" && date.hour >= 18,
  "home",
  "rainy_night_home",
  { override: true, before: "night_club" },
);
```

### Method Signature

```javascript
addSchedule(
  npcName: string,                          // NPC name
  scheduleConfig: ScheduleTime | ScheduleCondition,  // time or condition
  location: string | ScheduleLocation,       // location
  id?: string | number,                     // schedule ID (optional)
  options?: Partial<SpecialSchedule>       // special options
): Schedule
```

---

## 1. Fixed-Time Schedules

### Single Time

```javascript
maplebirch.npc.addSchedule("Robin", 8, "school");     // 8:00 at school
maplebirch.npc.addSchedule("Robin", 12, "cafeteria"); // 12:00 at cafeteria
maplebirch.npc.addSchedule("Robin", 18, "home");      // 18:00 at home
```

### Time Range

```javascript
maplebirch.npc.addSchedule("Kylar", [9, 12], "library");   // 9–12 at library
maplebirch.npc.addSchedule("Whitney", [13, 15], "gym");     // 13–15 at gym
maplebirch.npc.addSchedule("Sydney", [19, 22], "dormitory"); // 19–22 at dormitory
```

---

## 2. Condition-Based Schedules

### Time Conditions

```javascript
maplebirch.npc.addSchedule(
  "Eden",
  (date) => date.isHour(6, 18),
  "forest_clearing",
);

maplebirch.npc.addSchedule(
  "Black Wolf",
  (date) => date.isBetween([20, 0], [6, 0]),  // 20:00–06:00
  "wolf_cave",
);
```

### Date / Weather Conditions

```javascript
maplebirch.npc.addSchedule(
  "Alex",
  (date) => date.weekEnd && date.weather === "sunny",
  "farm_field",
);

maplebirch.npc.addSchedule(
  "River",
  (date) => date.schoolDay && date.isHourBetween(8, 15),
  "clinic",
);
```

### Game State Conditions

```javascript
maplebirch.npc.addSchedule(
  "Bailey",
  (date) => date.day === 1 && date.hour === 10 && V.rentDue,
  "orphanage_office",
);

maplebirch.npc.addSchedule(
  "Whitney",
  (date) =>
    C.npc.Whitney?.love >= 30 && date.weekEnd && date.hour >= 18,
  "arcade",
);
```

---

## 3. Dynamic Location

```javascript
maplebirch.npc.addSchedule(
  "Robin",
  (date) => date.weekEnd,
  (date) => {
    if (date.weather === "rain") return "home";
    if (date.money >= 100) return "mall";
    return "park";
  },
  "robin_weekend",
);
```

---

## Schedule Options

### Priority

```javascript
// override: overrides all other schedules
maplebirch.npc.addSchedule(
  "EmergencyDoctor",
  (date) => V.emergency,
  "hospital_emergency_room",
  "emergency_call",
  { override: true },
);

// insteadOf: replaces a specific schedule
maplebirch.npc.addSchedule(
  "RobinSick",
  (date) => C.npc.Robin?.health < 30,
  "hospital",
  "robin_sick",
  { insteadOf: "school_day" },
);
```

### Dependencies

```javascript
// before: runs before another schedule
maplebirch.npc.addSchedule(
  "MorningRoutine",
  (date) => date.isHour(7),
  "bathroom",
  "morning_routine",
  { before: "school" },
);

// after: runs after another schedule
maplebirch.npc.addSchedule(
  "EveningStudy",
  (date) => date.isHour(20),
  "library",
  "evening_study",
  { after: "dinner" },
);
```

---

## Schedule Management

### Get Schedule

```javascript
const robinSchedule = maplebirch.npc.Schedule.get("Robin");
const currentLocation = robinSchedule.location;
```

### Update Schedule

```javascript
maplebirch.npc.Schedule.update("Robin", "school_day", {
  condition: (date) => date.schoolDay && !date.holiday,
  location: "school_classroom",
});
```

### Remove Schedule

```javascript
maplebirch.npc.Schedule.remove("Robin", "weekend_mall");
maplebirch.npc.Schedule.clear("Robin");
```
