# NPC 日程

## 基本介绍

NPC 日程用于描述命名 NPC 在一天中各小时出现的地点，以及基于条件的特殊覆盖规则。底层由 `Schedule` 实例与 `maplebirch.npc.Schedule` 静态方法管理；**v3.2.3** 起优化了特殊日程的依赖解析与拓扑排序，请与 **`GameVersion >= 0.5.9.7`** 一并使用以保证时间系统一致。

_通过 **`maplebirch.npc.addSchedule(npcName, config)`** 注册；`config` 为配置对象（`ScheduleConfig`）或建造函数（接收 `Schedule` 并链式调用 `at` / `when`）。等价于内部调用 `maplebirch.npc.Schedule.set`。_

---

## API 概览

### addSchedule(npcName, config)

| 参数      | 类型                                                         | 说明                                    |
| --------- | ------------------------------------------------------------ | --------------------------------------- |
| `npcName` | `string`                                                     | 与 `maplebirch.npc.add` 等一致的 NPC 名 |
| `config`  | `ScheduleConfig \| (schedule: Schedule) => void \| Schedule` | 对象式配置或建造函数                    |

### ScheduleConfig

```ts
interface ScheduleConfig {
  daily?: Array<{ time: number | [number, number?]; location: string }>;
  special?: SpecialScheduleConfig[];
}
```

`daily`：`time` 为整点小时，或 `[起始小时, 结束小时]` 闭区间；该区间内每个整点写入同一 `location`。

`special`：条件日程数组，元素含 `condition`、`location`，以及可选的 `id`、`before`、`after`、`insteadOf`、`override` 等字段（与框架 `SpecialScheduleConfig` 一致）。

### 配置对象示例

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

### 建造函数示例

```javascript
maplebirch.npc.addSchedule("Luna", (s) =>
  s
    .at(9, "school")
    .at([14, 16], "library")
    .when((date) => date.weekEnd && date.hour >= 10, "park", { id: "weekend_park" }),
);
```

### EnhancedDate 提示

`condition` / `location` 回调中的 `date` 为增强时间对象（`EnhancedDate`），除原版 `DateTime` 字段外，还提供如 `weekEnd`、`schoolDay`、季节布尔、`dawn` / `daytime` / `dusk` / `night`，以及 `isAt`、`isBetween`、`isHourBetween` 等辅助方法。需要读取天气或剧情变量时，可直接访问游戏全局（如 `V`、`Weather` 等），框架未在 `date` 上挂载全部游戏状态。

---

## 特殊日程选项

- **`override: true`**：在拓扑排序中优先于非 override 条目评估。
- **`before` / `after` / `insteadOf`**：在多个特殊条目之间声明相对顺序；若依赖成环，框架会记录警告并回退为原始顺序。

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

## 查询与维护

### 获取实例与当前地点

```javascript
const schedule = maplebirch.npc.Schedule.get("Robin");
const loc = schedule.location; // 当前游戏时间下解析出的地点键
```

### 更新 / 删除特殊条目

```javascript
maplebirch.npc.Schedule.update("Robin", "weekend_park", {
  location: "mall",
});

maplebirch.npc.Schedule.remove("Robin", "weekend_park");
```

### 清空

```javascript
maplebirch.npc.Schedule.clear("Robin");
// maplebirch.npc.Schedule.clearAll(); // 清空全部 NPC 日程，谨慎使用
```

### 批量快照

只读 getter `maplebirch.npc.Schedule.location` 返回 `{ [npcName: string]: string }` 形式的当前地点映射。
