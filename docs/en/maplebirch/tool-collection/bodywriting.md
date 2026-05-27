# Bodywriting

Add custom bodywriting patterns via `maplebirch.tool.patch.addBodywriting()`. Use `patch.applyBodywriting()` to apply bodywriting-related logic.

_Access via `maplebirch.tool.patch.addBodywriting()`._

## Example

```js
maplebirch.tool.patch.addBodywriting("dragon_tattoo", {
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

## boot.json

Object-map form, recommended for registering multiple entries:

```json
{
  "framework": {
    "bodywriting": {
      "my_mod_rune_text": {
        "writing": "Rune",
        "writ_cn": "Rune",
        "type": "text",
        "gender": "n",
        "degree": 1
      }
    }
  }
}
```

External `.json`, `.yaml`, or `.yml` files are supported:

```json
{
  "framework": {
    "bodywriting": "data/bodywriting.yaml"
  }
}
```

Array form is also supported. Each item must include `key`:

```yaml
- key: my_mod_rune_text
  writing: Rune
  writ_cn: Rune
  type: text
  gender: n
  degree: 1
```
