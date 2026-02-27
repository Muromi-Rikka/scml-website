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

## output 参数说明

`output` 字符串对应您在 SugarCube 中自定义的 widget 宏名称。当事件触发时，框架会调用对应的 widget 宏。

**Widget 定义示例**:

```js
<<widget 'banditEncounter'>>
  你突然听到灌木丛中传来沙沙声...
  一群盗贼跳了出来！<<link "战斗" "CombatBandit">> | <<link "逃跑" "RunAway">>
<</widget>>
```

## 完整示例：中断事件

```js
// 1. 注册事件
maplebirch.dynamic.regStateEvent('interrupt', 'forestBandit', {
  output: 'banditEncounter',
  cond: () => V.location === 'forest',
  priority: 10,
  once: false
});

// 2. 在游戏中定义对应的 widget
<<widget 'banditEncounter'>>
  <div class="encounter">
    <strong>遭遇盗贼！</strong>
    <p>一群凶恶的盗贼挡住了你的去路。</p>
    <<link "战斗" "CombatBandit">>
    <<link "谈判" "NegotiateBandit">>
    <<link "逃跑" "RunFromBandit">>
  </div>
<</widget>>
```

## 完整示例：覆盖事件（状态提示）

```js
maplebirch.dynamic.regStateEvent('overlay', 'wetStatus', {
  output: 'showWetStatus',
  cond: () => V.wetness > 70,
  priority: 3
});

<<widget 'showWetStatus'>>
  <div class="status-overlay wet">你的衣服湿透了，行动变得迟缓。</div>
<</widget>>
```

## 事件类型

| 类型        | 说明                                         |
| ----------- | -------------------------------------------- |
| `interrupt` | 段落开始时检查；第一个满足条件的事件中断执行 |
| `overlay`   | 段落结束时检查；可同时触发多个，内容叠加     |

## 注意事项

1. **Widget 定义**：必须在游戏中定义与 `output` 同名的 widget
2. **性能考虑**：widget 内容不应过于复杂，避免影响游戏性能
3. **稳定性**：确保 widget 在各种情况下都能正确显示
4. **错误处理**：如果找不到对应的 widget，框架会记录错误日志
