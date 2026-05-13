# HTML 工具（htmlTools）

提供 HTML 文本处理和操作工具，支持自动翻译、Wiki 语法解析，并集成 SugarCube 宏系统。

_请使用 **`maplebirch.tool.text`**。简易框架兼容层仍提供 **`simpleFrameworks.addto`**（见 [快速开始](/maplebirch/getting-started)）。_

## 使用方式

```js
const text = maplebirch.tool.text;
```

## 核心方法

| 方法            | 说明                 |
| --------------- | -------------------- |
| `reg(key, fn)`  | 注册文本处理器       |
| `delete(key)`   | 删除已注册的处理器   |
| `replaceText()` | 在段落中替换文本     |
| `replaceLink()` | 在段落中替换链接文本 |

## 示例

```js
maplebirch.tool.text.reg("gameStatus", (tools) => {
  tools.text("状态:", "header").line(`生命: ${V.health}/${V.maxHealth}`).line(`金币: ${V.gold}`);
});
```
