# Utilities

## Overview

The framework provides a complete set of utility functions, globally mounted on `window`, available anywhere in mod development.  
These functions cover data handling, random generation, conditionals, string conversion, numeric clamping, image loading, and more, to reduce boilerplate and improve mod development efficiency.

All utilities can be called directly:

```javascript
const result = clone({ a: 1 });
const value = number("12.5");
const text = convert("Hello World", "snake");
```

---

## Function List

| Function     | Category    | Description                                      |
| :----------- | :---------- | :----------------------------------------------- |
| `clone`      | Data        | Deep clone objects, supports multiple data types |
| `equal`      | Data        | Deep compare two values                          |
| `merge`      | Data        | Recursively merge objects, supports merge modes  |
| `contains`   | Array       | Check if array contains element(s)               |
| `random`     | Random      | Generate random numbers (int or float)           |
| `either`     | Random      | Randomly pick from options, supports weights     |
| `SelectCase` | Conditional | Chainable conditional selector API               |
| `convert`    | String      | Convert string to specified format               |
| `number`     | Numeric     | Clamp input to valid number; range, round, step  |
| `loadImage`  | Resource    | Check and load image resources                   |

---

## Data Utilities

### Deep Clone (clone)

Deep clones common objects, including:

- Plain objects, arrays
- `Date`, `RegExp`
- `Map`, `Set`
- `ArrayBuffer`, `DataView`, TypedArray

**Params**: `source`, `opt.deep` (default `true`), `opt.proto` (default `true`)

**Returns**: Cloned object

```javascript
const original = { a: 1, b: { c: 2 } };
const cloned = clone(original);
// Shallow clone array
const shallowArr = clone(arr, { deep: false });
```

---

### Deep Compare (equal)

Deep compares two values; uses lodash deep-equal logic internally.

**Params**: `a`, `b`

**Returns**: `true` or `false`

```javascript
equal({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }); // true
equal([1, 2], [1, 2]); // true
```

---

### Recursive Merge (merge)

Mutates the target object and recursively merges sources.

**Modes**: `replace` (replace arrays, default), `concat` (concatenate arrays), `merge` (merge by index)

**Params**: `target`, `...sources`, `mode`, `filterFn`

**Returns**: Merged `target`

```javascript
const target = { a: 1 };
merge(target, { b: 2 }, { c: 3 }); // { a: 1, b: 2, c: 3 }
merge(target, source, "concat"); // concat arrays when merging
```

---

### Array Contains (contains)

Supports single/multiple values, deep compare, case-insensitive, custom comparator.

**Modes**: `all` (all exist), `any` (any exists), `none` (none exist)

**Params**: `arr`, `value` (single value or array), `mode`, `opt.case`, `opt.compare`, `opt.deep`

**Returns**: Boolean

```javascript
contains([1, 2, 3], 2); // true
contains([1, 2, 3], [1, 2], "all"); // true
contains([1, 2, 3], [1, 4], "any"); // true
contains([1, 2, 3], [4, 5], "none"); // true
contains([1, 2, 3], 4, "none"); // true
```

---

## Random Utilities

### Random Number (random)

Generates random integers or floats.

**Params**: `min`, `max`, `float`; or config object `{ min, max, float }`

**Returns**: Random number

```javascript
random(); // 0-1 float
random(10); // 0-10 integer
random(5, 10); // 5-10 integer
random({ min: 5, max: 10, float: true }); // config object
```

---

### Random Pick (either)

Supports array/args form, weights, and `null` option.

**Params**: `itemsOrA` (array or first item), `...rest`, `weights`, `null` (allow null)

**Returns**: Randomly selected value

```javascript
either(["A", "B", "C"]); // random one
either("A", "B", "C"); // args form
either(["A", "B"], { weights: [0.8, 0.2] }); // 80% chance 'A'
either(["A", "B"], { null: true }); // ~1/(length+1) chance null
```

---

## Conditional Utilities

### SelectCase

For multi-branch conditions, range matching, regex, and custom predicates.

**Methods**: `.case()`, `.casePredicate()`, `.caseRange()`, `.caseIn()`, `.caseIncludes()`, `.caseRegex()`, `.caseCompare()`, `.else()`, `.match()`

**Returns**: `match()` returns first matching result; otherwise `else()` default

```javascript
const selector = new SelectCase()
  .case(1, "One")
  .case(2, "Two")
  .caseRange(3, 5, "Three to Five")
  .caseIn(["admin", "root"], "Admin")
  .caseIncludes(["error", "fail"], "Error state")
  .caseRegex(/^\d+$/, "Digits only")
  .casePredicate((x) => x > 10, ">10")
  .else("Unknown");

selector.match(3); // 'Three to Five'
selector.match("admin"); // 'Admin'
selector.match("test"); // 'Unknown'
```

---

## String Utilities

### Convert (convert)

Supports common naming style conversion; `title` mode can preserve acronyms.

**Modes**: `lower`, `upper`, `capitalize`, `title`, `camel`, `pascal`, `snake`, `kebab`, `constant`

**Params**: `str`, `mode` (default `'lower'`), `opt.delimiter`, `opt.acronym`

**Returns**: Converted string

```javascript
convert("Hello World", "snake"); // 'hello_world'
convert("Hello World", "kebab"); // 'hello-world'
convert("Hello World", "camel"); // 'helloWorld'
convert("HTTP API", "title", { acronym: true }); // 'HTTP API'
convert("HTTP API", "title", { acronym: false }); // 'Http Api'
```

---

## Numeric Utilities

### Clamp / Round (number)

Converts any input to a valid number with:

- Fallback for invalid values
- Min/max range
- Rounding modes (floor, ceil, round, trunc)
- Step snapping
- Percent output
- Loop/cyclic range

**Params**: `value`, `fallback` (default `0`), `min`, `max`, `mode`, `opt.step`, `opt.percent`, `opt.loop`

**Returns**: Clamped number; when `opt.percent` is true, returns 0–100 percent

```javascript
number("12.5"); // 12.5
number(undefined, 10); // 10
number(120, 0, 0, 100); // 100
number(5.8, 0, 0, 10, "floor"); // 5
number(17, 0, 0, 100, "round", { step: 5 }); // 15
number(370, 0, 0, 360, "none", { loop: true }); // 10
number(75, 0, 0, 200, "none", { percent: true }); // 37.5
```

---

## Resource Utilities

### Load Image (loadImage)

Checks if image exists and returns loadable result.

**Params**: `src` (image path)

**Returns**: Sync: `string` or `boolean`; async: `Promise`

```javascript
// Sync check
const exists = loadImage("character.png");
if (exists) {
  // use exists
}

// Async load
loadImage("character.png").then((data) => {
  if (typeof data === "string") {
    document.getElementById("avatar").src = data;
  }
});
```
