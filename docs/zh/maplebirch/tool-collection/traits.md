# 特质注册

通过 `maplebirch.tool.other.addTraits()` 注册自定义特质。

_可通过 `maplebirch.tool.other.addTraits()` 或快捷接口 `maplebirchFrameworks.addTraits()` 访问。_

## 特质接口

| 字段     | 类型               | 说明                           |
| -------- | ------------------ | ------------------------------ |
| `title`  | string             | 特质标题 / 分类                |
| `name`   | string             | 特质标识名（必须）             |
| `colour` | string             | 显示颜色                       |
| `has`    | Function \| string | 拥有条件（函数或表达式字符串） |
| `text`   | string             | 特质描述文本                   |

## 示例

```js
const other = maplebirch.tool.other;

other.addTraits({
  title: "一般特质",
  name: "brave",
  colour: "green",
  has: () => V.brave >= 1,
  text: "角色展现出勇气",
});

other.applyLocation();
```
