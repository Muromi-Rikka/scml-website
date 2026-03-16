# SugarCube 宏扩展

## 基本介绍

框架提供了一系列增强的 SugarCube 宏，特别专注于多语言支持和用户界面优化。这些宏可以让您的游戏文本自动适应当前语言设置，并提供更灵活的界面组件。

---

## 语言相关宏

### `<<language>>`

根据当前游戏语言显示不同的内容块。

**语法**:

```javascript
<<language>>
  <<option "EN">>英文内容<</option>>
  <<option "CN">>中文内容<</option>>
<</language>>
```

**说明**:

- 根据 `maplebirch.Language` 自动显示对应语言的内容
- 支持所有框架支持的语言
- 内容块中可包含任意合法的 SugarCube 代码

**示例**:

```javascript
<<language>>
  <<option "EN">>
    Welcome to the game!
    <<link "Continue">>
      <<goto "NextPassage">>
    <</link>>
  <</option>>
  <<option "CN">>
    欢迎来到游戏！
    <<link "继续">>
      <<goto "NextPassage">>
    <</link>>
  <</option>>
<</language>>
```

---

### `lanSwitch`

根据语言返回不同的文本值，可作为函数或宏使用。

**作为函数使用**:

```javascript
<<= lanSwitch("Hello", "你好")>>  // 返回当前语言对应的文本
<<= lanSwitch({EN: "Hello", CN: "你好"})>>  // 使用对象形式
```

**作为宏使用**:

```javascript
<<lanSwitch "Hello" "你好">>  // 在段落中直接输出文本
<<lanSwitch {EN: "Hello", CN: "你好"}>>
<<lanSwitch [[Hello|你好]]>>
```

**参数**:

- 多个字符串参数：按框架支持的语言顺序传入
- 对象参数：`{语言代码: 文本}` 格式

**示例**:

```javascript
<!-- 显示当前语言对应的问候语 -->
<<= lanSwitch("Good morning", "早上好")>>

<!-- 使用对象形式 -->
<<= lanSwitch({EN: "Welcome back!", CN: "欢迎回来！"})>>
```

---

### `<<lanButton>>`

创建支持多语言的按钮，按钮文本会根据当前语言自动更新。

**语法**:

```javascript
<<lanButton "translation_key">>点击后的动作<</lanButton>>
<<lanButton "translation_key" "样式参数">>点击后的动作<</lanButton>>
```

**参数**:

- 第一个参数：翻译键(字符串)
- 可选参数：
  - 格式模式：`'title'`, `'upper'`, `'lower'`, `'capitalize'`, `'camel'`, `'pascal'`, `'snake'`, `'kebab'`, `'constant'`
  - `class:样式类名`：添加 CSS 类
  - `style:内联样式`：添加内联样式

**特性**:

- 按钮文本自动翻译
- 支持文本格式转换
- 支持自定义样式
- 语言切换时自动更新按钮文本

**示例**:

```javascript
<!-- 基本用法 -->
<<lanButton "start_game">>
  <<goto "CharacterCreation">>
<</lanButton>>

<!-- 添加样式和格式 -->
<<lanButton "settings" "title" "class:btn-primary" "style:margin-right:10px">>
  <<replace "#settingsPanel">><<include "Settings">><</replace>>
<</lanButton>>

<!-- 带格式转换 -->
<<lanButton "save_game" "upper">>
  <<save>>
<</lanButton>>
```

---

### `<<lanLink>>`

创建支持多语言的链接，链接文本会根据当前语言自动更新。

**语法**:

```javascript
<<lanLink "translation_key" "passageName">>鼠标悬停提示<</lanLink>>
<<lanLink "translation_key" "样式参数">>鼠标悬停提示<</lanLink>>
<<lanLink "translation_key" "passageName" "样式参数">>悬停提示<</lanLink>>
<<lanLink [[translation_key|passageName]]>>鼠标悬停提示<</lanLink>>
```

**参数**:

- 第一个参数：翻译键(字符串)
- 第二个参数(可选)：目标段落名称
- 可选参数：
  - 格式模式：支持所有 `convert` 函数可用的格式
  - `class:样式类名`
  - `style:内联样式`

**SugarCube 链接语法兼容**:

- 支持原生的 `[[文本|段落]]` 语法格式
- 格式：`<<lanLink [[翻译键|段落]]>>`

**特性**:

- 链接文本自动翻译
- 支持已访问链接样式
- 支持无效链接检测
- 语言切换时自动更新链接文本
- 支持鼠标悬停提示
- 兼容 SugarCube 原生链接语法

**示例**:

```javascript
<!-- 基本链接(两个参数) -->
<<lanLink "go_town" "TownSquare">>前往城镇广场<</lanLink>>

<!-- 无段落链接(用作按钮) -->
<<lanLink "close">>
  <<replace "#panel">><</replace>>
<</lanLink>>

<!-- 链接语法 -->
<<lanLink [[查看物品|Inventory]]>>查看你的物品<</lanLink>>
```

---

### `<<lanListbox>>`

创建支持多语言的下拉选择框，选项文本会根据当前语言自动更新。

**语法**:

```javascript
<<lanListbox "$variableName">>
  <<option "option1_key" "value1">>选项1选择后的动作<</option>>
  <<option "option2_key" "value2">>选项2选择后的动作<</option>>
  <<optionsfrom "$arrayVariable">>选项生成后的动作<</optionsfrom>>
<</lanListbox>>
```

**参数**:

- 第一个参数：保存选中值的变量名(以 `$` 或 `_` 开头)
- 选项参数：
  - `<<option "翻译键" "值">>`
  - `<<optionsfrom "表达式">>`
- 可选参数：
  - `autoselect`：自动选中与变量当前值匹配的选项
  - `class:样式类名`
  - `style:内联样式`

**选项类型**:

1. **静态选项**：使用 `<<option>>` 定义
2. **动态选项**：使用 `<<optionsfrom>>` 从表达式生成
   - 表达式可返回：数组、对象、Map、Set
   - 表达式会在语言切换时重新计算

**示例**:

```javascript
<!-- 基本下拉框 -->
<<lanListbox "$difficulty">>
  <<option "easy" 1>>难度已设置为简单<</option>>
  <<option "normal" 2 selected>>难度已设置为普通<</option>>
  <<option "hard" 3>>难度已设置为困难<</option>>
<</lanListbox>>

<!-- 自动选中当前值 -->
<<lanListbox "$characterClass" autoselect>>
  <<option "warrior" "warrior">>职业已切换为战士<</option>>
  <<option "mage" "mage">>职业已切换为法师<</option>>
  <<option "archer" "archer">>职业已切换为射手<</option>>
<</lanListbox>>

<!-- 动态选项 -->
<<lanListbox "$selectedItem">>
  <<optionsfrom "V.inventory.map(item => item.name)">>
    已选择：<<print $selectedItem>>
  <</optionsfrom>>
<</lanListbox>>
```

---

### `<<radiobuttonsfrom>>`

从数据源创建一组支持多语言的单选按钮。

**语法**:

```javascript
<<radiobuttonsfrom "$variableName" 选项数据 [分隔符]>>
  选中选项后的动作
<</radiobuttonsfrom>>
```

**参数**:

- 第一个参数：保存选中值的变量名
- 第二个参数：选项数据，支持多种格式
- 第三个参数(可选)：选项之间的分隔符，默认为 `" | "`

**数据格式**:

1. **数组格式**：`[ ["显示文本", 值], ... ]`
2. **字符串格式**：`"选项1[值1] | 选项2[值2]"`
3. **多语言对象**：`[ ["英文", ["中文", 值]], ... ]`
4. **多语言键值对**：`[ {EN: "English", CN: "中文"}, 值 ]`

**示例**:

```javascript
<!-- 数组格式 -->
<<radiobuttonsfrom "$gender" [["Male", "m"], ["Female", "f"]]>>
  性别已设置为：<<print $gender>>
<</radiobuttonsfrom>>

<!-- 多语言支持 -->
<<radiobuttonsfrom "$language" [["English", ["英语", "en"]], ["Chinese", ["中文", "zh"]]] "  ">>
  语言已切换为：<<print $language>>
<</radiobuttonsfrom>>
```

---

### `<<maplebirchReplace>>`

用于替换自定义覆盖层(overlay)内容的内部宏。

**说明**:

这是一个用于打开覆盖层的宏。

**功能**:

- 替换自定义覆盖层的标题和内容
- 处理覆盖层的显示/隐藏

**示例**:

```javascript
<<maplebirchReplace "SettingsOverlay">>
<<maplebirchReplace "SettingsOverlay" "title">>
<<maplebirchReplace "SettingsOverlay" "customize">>
```

---

## 数值与状态显示宏

以下宏由框架的 `maplebirch.tool.macro`（defineMacros）提供，用于在界面中输出属性变化或恩惠等数值片段。通常在自定义 widget 或脚本中调用。

### statChange

输出属性变化的带色文本片段（如「+ 5」「- 3」），常用于战斗、事件等场景的数值反馈。

**签名**：`statChange(statType, amount, colorClass, condition)`

| 参数         | 说明 |
| ------------ | ---- |
| `statType`   | 属性类型名称（如 `"Health"`、`"Arousal"`） |
| `amount`     | 变化量，会先经 `Math.trunc` 取整 |
| `colorClass` | 颜色类名（如 `"green"`、`"red"`），正负通常用不同颜色 |
| `condition`  | 可选，函数 `() => boolean`；为 `false` 时不输出片段，默认 `() => true` |

**行为**：

- `amount` 会先被转为整数；若结果非有限数（如 `NaN`）或为 `0`，返回空文档片段，不输出任何内容。
- 若 `V.settings.blindStatsEnabled` 为真（盲人模式）或 `condition()` 为 `false`，同样返回空片段。

**返回值**：`DocumentFragment`，可插入 DOM 或由 widget 输出。

---

### grace

输出恩惠（Grace）变化的带色片段，与庙宇等级系统配合使用。

**签名**：`grace(amount, expectedRank?)`

| 参数           | 说明 |
| -------------- | ---- |
| `amount`       | 恩惠变化量，会先取整；非有限数或为 0 时不输出 |
| `expectedRank` | 可选。庙宇等级之一：`prospective`、`initiate`、`monk`、`priest`、`bishop`。用于控制显示条件（例如仅在玩家等级低于该等级时显示） |

**行为**：

- `amount` 取整规则同 `statChange`；盲人模式不显示。
- 若玩家未加入庙宇或 `expectedRank` 与当前庙宇等级比较后不满足显示条件，则返回空片段；否则输出与 `statChange('Grace', amount, ...)` 类似的带色片段。

**返回值**：`DocumentFragment`。
