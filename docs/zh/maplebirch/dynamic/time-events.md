# 时间事件

时间事件模块 (`TimeEvents`) 是动态管理系统的一部分，用于处理游戏中的时间相关事件。支持按特定时间点或时间间隔（如每秒、每分、每小时、每天等）以及时间旅行时触发。

_请使用 **`maplebirch.dynamic.regTimeEvent`**（底层管理器为 **`maplebirch.dynamic.Time`**）。若需兼容仍引用旧「简易框架」的脚本，可使用全局 **`TimeEvent`** 类：其内部会桥接到 `regTimeEvent`（见 [快速开始](/maplebirch/getting-started)）。_

:::tip 游戏版本与 v3.2.5

框架 `boot.json` 将 **`GameVersion` 依赖设为 `>=0.5.9.7`**。**v3.2.5** 在该版本线上修复了时间事件相关缺陷；编写跨版本 Mod 时请在自身 `dependenceInfo` 中与之一致，避免在未支持的游戏构建上运行。

:::

:::info v4.0.2 时间系统改进

v4.0.2 重写了时间推进与时间旅行的底层逻辑，主要变更：

- **减少时间推进冲突**：`handleTimePass` 不再自行保存原始 `Time.pass`，改为由 `Time` 模块统一管理 `vanillaTime` 引用，避免与 `DoLTimeWrapperAddon` 等插件互相覆盖。
- **新增 `MIN_DATE` 校验**：`handleTimePass` 和 `handleTimeTravel` 均会校验目标时间戳是否在 `[MIN_DATE, MAX_DATE]` 范围内；`timeTravel` 在目标无效时会抛出错误而非静默失败。
- **暴露手动 Patch 方法**：`TimeManager` 新增 `patchDateTime(DateTimeClass)` 和 `patchTime(TimeObject)` 公开方法，允许高级用例自行控制 DateTime / Time 的 patch 时机。
- **`TimeConstants` 公开**：`maplebirch.dynamic.Time.TimeConstants` 现在可在外部访问，包含 `MAX_DATE` 和 `MIN_DATE` 等常量。
- **跨段落时间回退改善**：`handleTimeTravel` 不再调用原始 `timeTravel`，直接设置目标日期后再触发事件，减少与 DoL 内置时间旅行逻辑的冲突。

:::

## 核心 API

### regTimeEvent(type, eventId, options)

注册一个新的时间事件。

- **@param** `type` (string): 事件类型 — `onSec`、`onMin`、`onHour`、`onDay`、`onWeek`、`onMonth`、`onYear`、`onBefore`、`onThread`、`onAfter`、`onTimeTravel`
- **@param** `eventId` (string): 事件唯一标识符
- **@param** `options` (TimeEventOptions): 事件配置选项
- **@return** `boolean`: 是否成功注册

```js
// 注册每天触发的事件
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

注销已注册的时间事件。

```js
maplebirch.dynamic.delTimeEvent("onDay", "dailyCheck");
```

### timeTravel(options)

将游戏时间向前或向后跳跃。

```js
// 跳转到特定日期
maplebirch.dynamic.timeTravel({
  year: 2025,
  month: 3,
  day: 15,
  hour: 12,
});

// 向前跳跃一段时间
maplebirch.dynamic.timeTravel({
  addDays: 7,
  addHours: 6,
});
```

## 事件配置选项

| 参数                | 类型     | 说明                                                     |
| ------------------- | -------- | -------------------------------------------------------- |
| `action`            | function | 触发时执行的动作，接收 TimeData                          |
| `cond`              | function | 触发条件，返回布尔值                                     |
| `priority`          | number   | 优先级，数字越大越先执行                                 |
| `once`              | boolean  | 是否只触发一次                                           |
| `accumulate`        | object   | 累积触发配置：`{ unit, target }`                         |
| `accumulate.unit`   | string   | 累积单位：'sec','min','hour','day','week','month','year' |
| `accumulate.target` | number   | 累积目标值（达到多少单位后触发）                         |
| `exact`             | boolean  | 是否在精确时间点触发（如整点、午夜）                     |

## 时间数据对象 (TimeData)

事件回调函数接收的 `data` 参数包含：

| 属性                                                 | 类型             | 说明                                  |
| ---------------------------------------------------- | ---------------- | ------------------------------------- |
| `prevDate`                                           | DateTime         | 时间变化前的日期时间                  |
| `currentDate`                                        | DateTime         | 时间变化后的日期时间                  |
| `passed`                                             | number           | 经过的秒数                            |
| `sec`, `min`, `hour`, `day`, `week`, `month`, `year` | number           | 经过的时间单位                        |
| `weekday`                                            | [number, number] | [变化前星期, 变化后星期]              |
| `direction`                                          | string           | 时间旅行方向：'forward' 或 'backward' |

## 完整示例：每日任务刷新

```js
maplebirch.dynamic.regTimeEvent("onDay", "dailyQuestRefresh", {
  action: (data) => {
    V.dailyQuests = generateDailyQuests();
    V.lastQuestRefresh = data.currentDate.timeStamp;
    Wikifier.wikifyEval('<<notify "每日任务已刷新！">>');
  },
  cond: (data) => data.currentDate.hour === 0 && data.currentDate.minute === 0,
  priority: 10,
  once: false,
  exact: true,
});
```

## 完整示例：累积时间事件

```js
maplebirch.dynamic.regTimeEvent("onHour", "tenHourReward", {
  action: (data) => {
    const rewardCount = data.triggeredByAccumulator?.count || 1;
    for (let i = 0; i < rewardCount; i++) giveRewardToPlayer();
    Wikifier.wikifyEval(`<<notify "获得累计 ${rewardCount * 10} 小时在线奖励！">>`);
  },
  accumulate: { unit: "hour", target: 10 },
  priority: 5,
});
```

## 完整示例：时间旅行事件

```js
maplebirch.dynamic.regTimeEvent("onTimeTravel", "timeTravelEffects", {
  action: (data) => {
    if (data.direction === "forward") applyAgingEffects(data.diffSeconds);
    else if (data.direction === "backward") applyRejuvenationEffects(data.diffSeconds);

    V.timeTravelHistory = V.timeTravelHistory || [];
    V.timeTravelHistory.push({
      from: data.prevDate,
      to: data.currentDate,
      timestamp: Date.now(),
    });
  },
  priority: 15,
});
```
