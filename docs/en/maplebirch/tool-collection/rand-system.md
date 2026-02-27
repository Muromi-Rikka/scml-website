# Random System (randSystem)

The `randSystem` provides various random number generation utilities including weighted random, range random, and more.

_Access via `maplebirch.tool.rand` or shortcut `maplebirchFrameworks.rand()`._

## Usage

```js
const rand = maplebirch.tool.rand;
```

## Core Methods

| Method / Property | Description                         |
| ----------------- | ----------------------------------- |
| `create()`        | Create a new RNG instance           |
| `Seed`            | Get or set seed for reproducibility |
| `get(max)`        | Random integer 0 to max (inclusive) |
| `rng`             | Random integer 1–100 (percentile)   |
| `backtrack(n)`    | Roll back n random values           |
| `history`         | History of generated values         |
| `pointer`         | Current position in history         |

## Example

```js
const rng = maplebirch.tool.rand.create();
rng.Seed = 42;

const num1 = rng.get(10); // 0–10
const num2 = rng.rng; // 1–100
```
