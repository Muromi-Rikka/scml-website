# NPC 日程

## 基本介绍

NPC 日程系统允许模组制作者为 NPC 定义详细的日常活动安排，包括固定时间、条件触发、特殊事件等。系统支持时间范围、条件判断、优先级控制和复杂依赖关系。

_可通过 `maplebirch.npc.addSchedule` 或 `maplebirch.npc.addNPCSchedule` 来注册 NPC 日程。_

---

## 基本概念

### 日程类型

1. **固定时间日程**：在特定时间或时间段出现在特定地点
2. **条件日程**：根据游戏状态、时间、天气等条件决定出现地点
3. **特殊日程**：有依赖关系和优先级控制的复杂日程

### 核心组件

- **ScheduleTime**: 时间定义(小时或时间段)
- **ScheduleCondition**: 条件函数
- **ScheduleLocation**: 地点定义(字符串或函数)
- **SpecialSchedule**: 特殊日程配置

---

## 添加日程 (addSchedule 方法)

### 基本语法

```javascript
// 添加固定时间日程
maplebirch.npc.addSchedule("Luna", 9, "school"); // 9点到学校
maplebirch.npc.addSchedule("Luna", [14, 16], "library"); // 14-16点在图书馆

// 添加条件日程
maplebirch.npc.addSchedule(
  "Luna",
  (date) => date.weekEnd && date.hour >= 10,
  "park",
  "weekend_park",
);

// 添加带选项的特殊日程
maplebirch.npc.addSchedule(
  "Luna",
  (date) => date.weather === "rain" && date.hour >= 18,
  "home",
  "rainy_night_home",
  { override: true, before: "night_club" },
);
```

### 方法签名

```javascript
addSchedule(
  npcName: string,                     // NPC名称
  scheduleConfig: ScheduleTime | ScheduleCondition,  // 时间或条件
  location: string | ScheduleLocation, // 地点
  id?: string | number,               // 日程ID(可选)
  options?: Partial<SpecialSchedule>  // 特殊选项
): Schedule
```

---

## 1. 固定时间日程

### 单个时间点

```javascript
// NPC在指定小时出现在指定地点
maplebirch.npc.addSchedule("Robin", 8, "school"); // 8点到学校
maplebirch.npc.addSchedule("Robin", 12, "cafeteria"); // 12点到食堂
maplebirch.npc.addSchedule("Robin", 18, "home"); // 18点到家
```

### 时间段

```javascript
// NPC在时间段内出现在指定地点
maplebirch.npc.addSchedule("Kylar", [9, 12], "library"); // 9-12点在图书馆
maplebirch.npc.addSchedule("Whitney", [13, 15], "gym"); // 13-15点在体育馆
maplebirch.npc.addSchedule("Sydney", [19, 22], "dormitory"); // 19-22点在宿舍
```

---

## 2. 条件日程

### 时间条件

```javascript
// 基于时间的条件
maplebirch.npc.addSchedule(
  "Eden",
  (date) => date.isHour(6, 18), // 6点或18点
  "forest_clearing",
);

maplebirch.npc.addSchedule(
  "Black Wolf",
  (date) => date.isBetween([20, 0], [6, 0]), // 20:00-6:00
  "wolf_cave",
);
```

### 日期条件

```javascript
// 基于星期、季节、天气的条件
maplebirch.npc.addSchedule(
  "Alex",
  (date) => date.weekEnd && date.weather === "sunny", // 周末晴天
  "farm_field",
);

maplebirch.npc.addSchedule(
  "River",
  (date) => date.schoolDay && date.isHourBetween(8, 15), // 上学日8-15点
  "clinic",
);
```

### 游戏状态条件

```javascript
// 基于游戏变量和NPC状态的条件
maplebirch.npc.addSchedule(
  "Bailey",
  (date) => {
    return (
      date.day === 1 && // 每月1号
      date.hour === 10 && // 10点
      V.rentDue
    ); // 租金到期
  },
  "orphanage_office",
);

maplebirch.npc.addSchedule(
  "Whitney",
  (date) => {
    return (
      C.npc.Whitney?.love >= 30 && // 好感度≥30
      date.weekEnd && // 周末
      date.hour >= 18
    ); // 18点后
  },
  "arcade",
);
```

---

## 3. 动态地点

### 函数返回地点

```javascript
// 动态决定地点
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

## 日程选项

### 优先级控制

```javascript
// override: 覆盖其他所有日程
maplebirch.npc.addSchedule(
  "EmergencyDoctor",
  (date) => V.emergency,
  "hospital_emergency_room",
  "emergency_call",
  { override: true },
);

// insteadOf: 替代特定日程
maplebirch.npc.addSchedule(
  "RobinSick",
  (date) => C.npc.Robin?.health < 30,
  "hospital",
  "robin_sick",
  { insteadOf: "school_day" },
);
```

### 依赖关系

```javascript
// before: 在某个日程之前执行
maplebirch.npc.addSchedule(
  "MorningRoutine",
  (date) => date.isHour(7),
  "bathroom",
  "morning_routine",
  { before: "school" },
);

// after: 在某个日程之后执行
maplebirch.npc.addSchedule("EveningStudy", (date) => date.isHour(20), "library", "evening_study", {
  after: "dinner",
});
```

---

## 日程管理

### 获取日程

```javascript
// 获取NPC的日程对象
const robinSchedule = maplebirch.npc.Schedule.get("Robin");

// 获取当前地点
const currentLocation = robinSchedule.location;
```

### 更新日程

```javascript
// 更新已有日程的条件
maplebirch.npc.Schedule.update("Robin", "school_day", {
  condition: (date) => date.schoolDay && !date.holiday,
  location: "school_classroom",
});
```

### 删除日程

```javascript
// 删除特定日程
maplebirch.npc.Schedule.remove("Robin", "weekend_mall");

// 清空NPC的所有日程
maplebirch.npc.Schedule.clear("Robin");
```
