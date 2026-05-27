# Traits Registration

Register custom traits via `maplebirch.tool.patch.addTraits()`.

_Access via **`maplebirch.tool.patch.addTraits()`**._

## Trait Interface

| Field    | Type               | Description                 |
| -------- | ------------------ | --------------------------- |
| `title`  | string             | Trait title / category      |
| `name`   | string             | Trait identifier (required) |
| `colour` | string             | Display color               |
| `has`    | Function \| string | Ownership condition         |
| `text`   | string             | Trait description text      |

## Example

```js
const other = maplebirch.tool.patch;

other.addTraits({
  title: "General Traits",
  name: "brave",
  colour: "green",
  has: () => V.brave >= 1,
  text: "Character shows courage",
});

other.applyLocation();
```

## Note

The framework resolves and deduplicates trait registration internally to avoid duplicate or incorrect overwrites. The `maplebirch.tool.patch.addTraits` API is unchanged.

## boot.json

Traits can also be registered via the `framework` field in `boot.json`:

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

External `.json`, `.yaml`, or `.yml` files are also supported:

```json
{
  "framework": {
    "traits": "data/traits.yaml"
  }
}
```
