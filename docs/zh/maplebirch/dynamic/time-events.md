# 时间事件

时间事件模块 (`TimeEvents`) 是动态管理系统的一部分，用于处理游戏中的时间相关事件。支持按特定时间点或时间间隔（如每小时、每天、每月）以及时间旅行时触发。

_可通过 `maplebirch.dynamic.Time` 或快捷接口 `maplebirchFrameworks.addTimeEvent()` 访问。_

## 核心 API

### regTimeEvent(type, eventId, options)

注册一个新的时间事件。

- **@param** `type` (string): 事件类型 — `onSec`、`onMin`、`onHour`、`onDay`、`onWeek`、`onMonth`、`onYear`、`onTimeTravel`
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
