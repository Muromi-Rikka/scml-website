# 工具集合

ToolCollection 模块以门面模式聚合了 8 个子工具模块，通过 `maplebirch.tool` 访问。

## 子模块概览

| 访问路径                    | 子模块        | 说明              |
| --------------------------- | ------------- | ----------------- |
| `maplebirch.tool.console`   | Console       | 控制台作弊工具    |
| `maplebirch.tool.migration` | migration     | 数据迁移工具      |
| `maplebirch.tool.rand`      | randSystem    | 随机数系统        |
| `maplebirch.tool.macro`     | defineMacros  | SugarCube2 宏定义 |
| `maplebirch.tool.text`      | htmlTools     | HTML 文本工具     |
| `maplebirch.tool.zone`      | zonesManager  | 区域管理器        |
| `maplebirch.tool.link`      | applyLinkZone | 链接区域处理      |
| `maplebirch.tool.other`     | otherTools    | 其他工具          |

此外还有便捷属性：

| 属性                        | 说明                 |
| --------------------------- | -------------------- |
| `maplebirch.tool.createlog` | 创建带前缀的日志函数 |
| `maplebirch.tool.utils`     | 框架内部工具函数集   |

## Console（控制台）

控制台工具为开发者提供快速测试和调试能力。

```js
const console = maplebirch.tool.console;
```

## defineMacros（宏定义）

用于定义和管理 SugarCube2 宏：

```js
const macro = maplebirch.tool.macro;

// 定义一个自定义宏
macro.define("myMacro", function () {
  this.output.textContent = "Hello from macro";
});
```

框架通过此模块注册了 `generateCombatAction` 和 `combatButtonAdjustments` 等战斗相关宏。

## applyLinkZone（链接区域）

处理游戏中链接区域的应用逻辑：

```js
const link = maplebirch.tool.link;
```
