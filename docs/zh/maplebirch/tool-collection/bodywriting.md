# 纹身注册（Bodywriting）

通过 `maplebirch.tool.other.addBodywriting()` 添加自定义纹身图案；`other.applyBodywriting()` 用于应用身体文字相关逻辑。

_可通过 `maplebirch.tool.other.addBodywriting()` 访问。_

## 示例

```js
maplebirch.tool.other.addBodywriting("dragon_tattoo", {
  writing: "Dragon",
  writ_cn: "龙纹",
  type: "text",
  gender: "n",
  lewd: 0,
});
```

## 配置选项

| 选项      | 类型   | 说明                          |
| --------- | ------ | ----------------------------- |
| `writing` | string | 英文名称                      |
| `writ_cn` | string | 中文名称                      |
| `type`    | string | `'text'` 或 `'object'`        |
| `gender`  | string | `'n'` / `'f'` / `'m'` / `'h'` |
| `lewd`    | number | 0 或 1                        |
| `degree`  | number | 纹身程度 / 强度               |
