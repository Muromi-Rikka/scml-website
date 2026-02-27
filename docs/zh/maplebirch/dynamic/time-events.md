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

| 参数         | 类型     | 说明                                 |
| ------------ | -------- | ------------------------------------ |
| `action`     | function | 触发时执行的动作，接收 TimeData      |
| `cond`       | function | 触发条件，返回布尔值                 |
| `priority`   | number   | 优先级，数字越大越先执行             |
| `once`       | boolean  | 是否只触发一次                       |
| `accumulate` | object   | 累积触发配置                         |
| `exact`      | boolean  | 是否在精确时间点触发（如整点、午夜） |
