# HTML 工具（htmlTools）

提供 HTML 文本处理和操作工具，支持自动翻译、Wiki 语法解析，并集成 SugarCube 宏系统。

_可通过 `maplebirch.tool.text` 或快捷接口 `maplebirchFrameworks.addText()` 访问。_

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
