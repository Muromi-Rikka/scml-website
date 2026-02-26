# 工具集合

ToolCollection 模块以门面模式聚合了 8 个子工具模块，通过 `maplebirch.tool` 访问。

## 子模块概览

| 访问路径 | 子模块 | 说明 |
|---------|--------|------|
| `maplebirch.tool.console` | Console | 控制台作弊工具 |
| `maplebirch.tool.migration` | migration | 数据迁移工具 |
| `maplebirch.tool.rand` | randSystem | 随机数系统 |
| `maplebirch.tool.macro` | defineMacros | SugarCube2 宏定义 |
| `maplebirch.tool.text` | htmlTools | HTML 文本工具 |
| `maplebirch.tool.zone` | zonesManager | 区域管理器 |
| `maplebirch.tool.link` | applyLinkZone | 链接区域处理 |
| `maplebirch.tool.other` | otherTools | 其他工具 |

此外还有便捷属性：

| 属性 | 说明 |
|------|------|
| `maplebirch.tool.createlog` | 创建带前缀的日志函数 |
| `maplebirch.tool.utils` | 框架内部工具函数集 |

## Console（控制台）

控制台工具为开发者提供快速测试和调试能力。

```js
const console = maplebirch.tool.console;
```

## migration（数据迁移）

数据迁移工具用于处理版本升级时的存档数据变更。被 Variables 模块直接使用。

```js
const Migration = maplebirch.tool.migration;

// 创建迁移实例
const m = new Migration();

// 注册迁移规则
m.add('1.0.0', '2.0.0', (data) => {
  // 从 1.0.0 迁移到 2.0.0 的逻辑
});

// 执行迁移
m.run(targetData, targetVersion);
```

## randSystem（随机系统）

提供各类随机数生成工具：

```js
const rand = maplebirch.tool.rand;
```

包含加权随机、范围随机等功能，供其他模块和 Mod 使用。

## defineMacros（宏定义）

用于定义和管理 SugarCube2 宏：

```js
const macro = maplebirch.tool.macro;

// 定义一个自定义宏
macro.define('myMacro', function() {
  // 宏实现
  this.output.textContent = 'Hello from macro';
});
```

框架通过此模块注册了 `generateCombatAction` 和 `combatButtonAdjustments` 等战斗相关宏。

## htmlTools（HTML 工具）

提供 HTML 文本处理和操作工具：

```js
const text = maplebirch.tool.text;
```

## zonesManager（区域管理器）

区域管理器负责游戏界面区域的部件注册和渲染。这是框架最重要的工具之一，允许 Mod 向游戏的各个区域注入内容。

### 添加部件到区域

```js
const zone = maplebirch.tool.zone;

// 添加简单的 Twee 部件
zone.addTo('sidebar', '<<myWidget>>');

// 添加带条件的部件
zone.addTo('sidebar', {
  widget: '<<myWidget>>',
  exclude: ['Combat'],       // 在这些 Passage 中排除
  match: ['Home', 'Shop'],   // 仅在这些 Passage 中显示
  passage: 'MyPassage'       // 指定 Passage
});

// 添加带优先级的部件（数字越小越靠前）
zone.addTo('sidebar', [5, '<<myWidget>>']);
```

### 快捷方法

ToolCollection 提供了两个快捷方法直接访问区域管理器的常用功能：

```js
// 等价于 maplebirch.tool.zone.addTo(...)
maplebirch.tool.addTo('sidebar', '<<myWidget>>');

// 注册初始化函数
maplebirch.tool.onInit(() => {
  // 在每次初始化时执行
});
```

### 内置初始化

框架在 `preInit` 阶段注册了以下初始化逻辑：

- `applyLocation()` — 应用位置相关逻辑
- `applyBodywriting()` — 应用身体文字相关逻辑

## applyLinkZone（链接区域）

处理游戏中链接区域的应用逻辑：

```js
const link = maplebirch.tool.link;
```

## otherTools（其他工具）

包含特质管理、位置应用等杂项工具：

```js
const other = maplebirch.tool.other;

// 添加自定义特质
other.addTraits({
  title: '勇敢',
  name: 'brave',
  colour: 'green',
  has: () => V.brave >= 1,
  text: '角色展现出勇气'
});

// 应用位置逻辑
other.applyLocation();

// 应用身体文字逻辑
other.applyBodywriting();
```

### 特质接口

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | `string` | 特质标题 |
| `name` | `string` | 特质标识名（必须） |
| `colour` | `string` | 显示颜色 |
| `has` | `Function \| string` | 拥有条件（函数或表达式字符串） |
| `text` | `string` | 特质描述文本 |
