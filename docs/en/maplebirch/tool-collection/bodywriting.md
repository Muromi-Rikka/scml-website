# Bodywriting

Add custom bodywriting patterns via `maplebirch.tool.other.addBodywriting()`. Use `other.applyBodywriting()` to apply bodywriting-related logic.

_Access via `maplebirch.tool.other.addBodywriting()`._

## Example

```js
maplebirch.tool.other.addBodywriting("dragon_tattoo", {
  writing: "Dragon",
  writ_cn: "龙纹",
  type: "text",
  gender: "n",
  lewd: 0,
});
```

## Config Options

| Option    | Type   | Description                   |
| --------- | ------ | ----------------------------- |
| `writing` | string | English name                  |
| `writ_cn` | string | Chinese name                  |
| `type`    | string | `'text'` or `'object'`        |
| `gender`  | string | `'n'` / `'f'` / `'m'` / `'h'` |
| `lewd`    | number | 0 or 1                        |
| `degree`  | number | Intensity level               |
