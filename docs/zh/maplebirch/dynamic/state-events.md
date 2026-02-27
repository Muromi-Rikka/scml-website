# 状态事件

状态事件模块 (`StateEvents`) 是动态管理系统的一部分，用于处理游戏中的状态触发事件。框架会自动在段落开始和结束时检查并触发相应的事件。

_可通过 `maplebirch.dynamic.State` 或快捷接口 `maplebirchFrameworks.addStateEvent()` 访问。_

## 核心 API

### regStateEvent(type, eventId, options)

注册一个新的状态事件。

- **@param** `type` (string): 事件类型，支持 `'interrupt'`（中断）或 `'overlay'`（覆盖）
- **@param** `eventId` (string): 事件唯一标识符
- **@param** `options` (StateEventOptions): 事件配置选项
- **@return** `boolean`: 是否成功注册

```js
// 注册一个中断事件
maplebirch.dynamic.regStateEvent("interrupt", "encounterBandit", {
  output: "banditEncounter",
  cond: () => V.location === "forest" && V.time === "night",
  priority: 5,
  once: true,
});
```

### delStateEvent(type, eventId)

注销已注册的状态事件。

```js
maplebirch.dynamic.delStateEvent("interrupt", "encounterBandit");
```

### trigger(type)

手动触发状态事件：

```js
const result = maplebirch.dynamic.trigger("interrupt");
```

## 事件配置选项

| 参数            | 类型     | 说明                                       |
| --------------- | -------- | ------------------------------------------ |
| `output`        | string   | 触发时调用的 widget 宏名称                 |
| `cond`          | function | 触发条件函数，返回布尔值                   |
| `priority`      | number   | 优先级，数字越大优先级越高                 |
| `once`          | boolean  | 是否只触发一次                             |
| `forceExit`     | boolean  | 是否强制阻断当前段落剩余内容（仅中断事件） |
| `extra.passage` | string[] | 仅在这些段落中触发                         |
| `extra.exclude` | string[] | 在这些段落中不触发                         |

## 事件类型

| 类型        | 说明                                         |
| ----------- | -------------------------------------------- |
| `interrupt` | 段落开始时检查；第一个满足条件的事件中断执行 |
| `overlay`   | 段落结束时检查；可同时触发多个，内容叠加     |
