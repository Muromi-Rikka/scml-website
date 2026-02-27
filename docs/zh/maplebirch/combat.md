# 战斗系统

CombatManager 模块为 Mod 提供战斗相关的扩展能力，包括战斗动作注册、反应系统和战斗语音。

## 战斗动作

通过 `CombatAction` 子模块注册自定义战斗动作：

```js
const CombatAction = maplebirch.combat.CombatAction;

// 注册战斗动作
CombatAction.register({
  action: "myAction",
  type: "Default",
  name: "自定义动作",
  color: "green",
  difficulty: "<<myDifficultyWidget>>",
});
```

`CombatAction` 提供以下方法：

| 方法                                           | 说明                         |
| ---------------------------------------------- | ---------------------------- |
| `action(optionsTable, actionType, combatType)` | 向战斗选项表中注入自定义动作 |
| `difficulty(action, combatType)`               | 返回自定义动作的难度提示宏   |
| `color(action, encounterType)`                 | 返回自定义动作的颜色         |

## 反应系统

`Reaction` 子模块管理战斗中的 NPC 反应：

```js
const Reaction = maplebirch.combat.Reaction;

Reaction.init();
```

## 战斗语音

`Speech` 子模块处理战斗中的 NPC 语音：

```js
const Speech = maplebirch.combat.Speech;

Speech.init();
```

## 战斗按钮

框架自动注册 `generateCombatAction` 和 `combatButtonAdjustments` 宏，增强游戏的战斗按钮系统：

- 支持列表模式（`lists`、`limitedLists`）和单选按钮模式（`radio`、`columnRadio`）
- 自定义动作的颜色标注
- 下拉列表选择时自动更新难度提示

## 射精事件

`ejaculation()` 方法为命名 NPC 提供自定义射精事件宏：

```js
const macro = maplebirch.combat.ejaculation(npcIndex, "args");
// 返回如 "<<ejaculation-robin args>>" 的宏字符串
```
