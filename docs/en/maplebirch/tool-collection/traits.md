# Traits Registration

Register custom traits via `maplebirch.tool.other.addTraits()`.

_Access via `maplebirch.tool.other.addTraits()` or shortcut `maplebirchFrameworks.addTraits()`._

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
const other = maplebirch.tool.other;

other.addTraits({
  title: "General Traits",
  name: "brave",
  colour: "green",
  has: () => V.brave >= 1,
  text: "Character shows courage",
});

other.applyLocation();
```
