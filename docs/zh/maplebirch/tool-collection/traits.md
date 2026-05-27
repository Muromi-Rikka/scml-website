# 特质注册

通过 `maplebirch.tool.patch.addTraits()` 注册自定义特质。

_请使用 **`maplebirch.tool.patch.addTraits()`**。_

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
const other = maplebirch.tool.patch;

other.addTraits({
  title: "一般特质",
  name: "brave",
  colour: "green",
  has: () => V.brave >= 1,
  text: "角色展现出勇气",
});

other.applyLocation();
```

## 说明

框架对特质添加做了内部解析与去重，避免重复或错误覆盖。`maplebirch.tool.patch.addTraits` 的用法保持不变。

## boot.json

也可以通过 `boot.json` 的 `framework` 字段注册特质：

```json
{
  "framework": {
    "traits": [
      {
        "title": "General Traits",
        "name": "brave",
        "colour": "green",
        "has": "V.brave >= 1",
        "text": "Character shows courage"
      }
    ]
  }
}
```

也可以引用 `.json`、`.yaml` 或 `.yml` 文件：

```json
{
  "framework": {
    "traits": "data/traits.yaml"
  }
}
```
