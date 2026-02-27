# HTML Tools (htmlTools)

The `htmlTools` module provides HTML text processing and manipulation tools, with support for auto-translation, Wiki syntax parsing, and SugarCube macro integration.

_Access via `maplebirch.tool.text` or shortcut `maplebirchFrameworks.addText()`._

## Usage

```js
const text = maplebirch.tool.text;
```

## Core Methods

| Method          | Description                   |
| --------------- | ----------------------------- |
| `reg(key, fn)`  | Register a text processor     |
| `delete(key)`   | Remove a registered processor |
| `replaceText()` | Replace text in passage       |
| `replaceLink()` | Replace link text in passage  |

## Example

```js
maplebirch.tool.text.reg("gameStatus", (tools) => {
  tools
    .text("Status:", "header")
    .line(`Health: ${V.health}/${V.maxHealth}`)
    .line(`Gold: ${V.gold}`);
});
```
