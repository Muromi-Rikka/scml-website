# SugarCube Macro Extensions

## Overview

The framework provides a set of enhanced SugarCube macros focused on multi-language support and UI optimization. These macros let your game text follow the current language setting and offer flexible interface components.

---

## Language-related macros

### `<<language>>`

Shows different content blocks based on the current game language.

**Syntax**:

```javascript
<<language>>
  <<option "EN">>English content<</option>>
  <<option "CN">>中文内容<</option>>
<</language>>
```

**Notes**:

- Content is chosen by `maplebirch.Language`
- Supports all languages supported by the framework
- Blocks may contain any valid SugarCube code

**Example**:

```javascript
<<language>>
  <<option "EN">>
    Welcome to the game!
    <<link "Continue">>
      <<goto "NextPassage">>
    <</link>>
  <</option>>
  <<option "CN">>
    欢迎来到游戏！
    <<link "继续">>
      <<goto "NextPassage">>
    <</link>>
  <</option>>
<</language>>
```

---

### `lanSwitch`

Returns different text by language; usable as a function or macro.

**As a function**:

```javascript
<<= lanSwitch("Hello", "你好")>>  // Returns text for current language
<<= lanSwitch({EN: "Hello", CN: "你好"})>>  // Object form
```

**As a macro**:

```javascript
<<lanSwitch "Hello" "你好">>  // Outputs text inline
<<lanSwitch {EN: "Hello", CN: "你好"}>>
<<lanSwitch [[Hello|你好]]>>
```

**Parameters**:

- Multiple string arguments: pass in framework language order
- Object argument: `{ languageCode: text }`

**Example**:

```javascript
<<= lanSwitch("Good morning", "早上好")>>
<<= lanSwitch({EN: "Welcome back!", CN: "欢迎回来！"})>>
```

---

### `<<lanButton>>`

Creates a multi-language button; label updates with the current language.

**Syntax**:

```javascript
<<lanButton "translation_key">>Actions on click<</lanButton>>
<<lanButton "translation_key" "style_params">>Actions on click<</lanButton>>
```

**Parameters**:

- First argument: translation key (string)
- Optional: format mode `'title'`, `'upper'`, `'lower'`, `'capitalize'`, `'camel'`, `'pascal'`, `'snake'`, `'kebab'`, `'constant'`
- `class:className`: CSS class
- `style:inline_style`: inline style

**Features**:

- Button label is translated automatically
- Text format conversion
- Custom styling
- Label updates when language changes

**Example**:

```javascript
<<lanButton "start_game">>
  <<goto "CharacterCreation">>
<</lanButton>>

<<lanButton "settings" "title" "class:btn-primary" "style:margin-right:10px">>
  <<replace "#settingsPanel">><<include "Settings">><</replace>>
<</lanButton>>

<<lanButton "save_game" "upper">>
  <<save>>
<</lanButton>>
```

---

### `<<lanLink>>`

Creates a multi-language link; text updates with the current language.

**Syntax**:

```javascript
<<lanLink "translation_key" "passageName">>Tooltip<</lanLink>>
<<lanLink "translation_key" "style_params">>Tooltip<</lanLink>>
<<lanLink "translation_key" "passageName" "style_params">>Tooltip<</lanLink>>
<<lanLink [[translation_key|passageName]]>>Tooltip<</lanLink>>
```

**Parameters**:

- First argument: translation key (string)
- Second (optional): target passage name
- Optional: format mode (same as `convert`), `class:className`, `style:inline_style`

**SugarCube link compatibility**:

- Supports `[[text|passage]]` form: `<<lanLink [[translation_key|passage]]>>`

**Features**:

- Link text translated automatically
- Visited link styling
- Invalid link detection
- Updates on language change
- Tooltip support
- Compatible with native SugarCube link syntax

**Example**:

```javascript
<<lanLink "go_town" "TownSquare">>Go to town square<</lanLink>>

<<lanLink "close">>
  <<replace "#panel">><</replace>>
<</lanLink>>

<<lanLink [[view_items|Inventory]]>>View your items<</lanLink>>
```

---

### `<<lanListbox>>`

Creates a multi-language dropdown; option labels update with the current language.

**Syntax**:

```javascript
<<lanListbox "$variableName">>
  <<option "option1_key" "value1">>Actions when option 1 selected<</option>>
  <<option "option2_key" "value2">>Actions when option 2 selected<</option>>
  <<optionsfrom "$arrayVariable">>Actions after options generated<</optionsfrom>>
<</lanListbox>>
```

**Parameters**:

- First argument: variable name for selected value (starts with `$` or `_`)
- Options: `<<option "translation_key" "value">>`, `<<optionsfrom "expression">>`
- Optional: `autoselect`, `class:className`, `style:inline_style`

**Option types**:

1. **Static**: `<<option>>`
2. **Dynamic**: `<<optionsfrom>>` — expression may return array, object, Map, Set; re-evaluated on language change

**Example**:

```javascript
<<lanListbox "$difficulty">>
  <<option "easy" 1>>Difficulty set to easy<</option>>
  <<option "normal" 2 selected>>Difficulty set to normal<</option>>
  <<option "hard" 3>>Difficulty set to hard<</option>>
<</lanListbox>>

<<lanListbox "$characterClass" autoselect>>
  <<option "warrior" "warrior">>Class set to warrior<</option>>
  <<option "mage" "mage">>Class set to mage<</option>>
  <<option "archer" "archer">>Class set to archer<</option>>
<</lanListbox>>

<<lanListbox "$selectedItem">>
  <<optionsfrom "V.inventory.map(item => item.name)">>
    Selected: <<print $selectedItem>>
  <</optionsfrom>>
<</lanListbox>>
```

---

### `<<radiobuttonsfrom>>`

Creates a set of multi-language radio buttons from a data source.

**Syntax**:

```javascript
<<radiobuttonsfrom "$variableName" option_data [separator]>>
  Actions when an option is selected
<</radiobuttonsfrom>>
```

**Parameters**:

- First argument: variable for selected value
- Second: option data (multiple formats supported)
- Third (optional): separator between options, default `" | "`

**Data formats**:

1. **Array**: `[ ["Label", value], ... ]`
2. **String**: `"Option1[value1] | Option2[value2]"`
3. **Multi-language**: `[ ["English", ["中文", value]], ... ]`
4. **Multi-language key-value**: `[ {EN: "English", CN: "中文"}, value ]`

**Example**:

```javascript
<<radiobuttonsfrom "$gender" [["Male", "m"], ["Female", "f"]]>>
  Gender set to: <<print $gender>>
<</radiobuttonsfrom>>

<<radiobuttonsfrom "$language" [["English", ["英语", "en"]], ["Chinese", ["中文", "zh"]]] "  ">>
  Language set to: <<print $language>>
<</radiobuttonsfrom>>
```

---

### `<<maplebirchReplace>>`

Internal macro for replacing custom overlay content.

**Notes**:

- Replaces overlay title and content
- Handles overlay show/hide

**Example**:

```javascript
<<maplebirchReplace "SettingsOverlay">>
<<maplebirchReplace "SettingsOverlay" "title">>
<<maplebirchReplace "SettingsOverlay" "customize">>
```

---

## Stat and grace display macros

These are provided by `maplebirch.tool.macro` (defineMacros) for outputting stat changes or Grace as coloured fragments. Typically used in custom widgets or scripts.

### statChange

Outputs a coloured fragment for a stat change (e.g. "+ 5", "- 3"), often used in combat or events.

**Signature**: `statChange(statType, amount, colorClass, condition)`

| Parameter    | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| `statType`   | Stat name (e.g. `"Health"`, `"Arousal"`)                                |
| `amount`     | Delta; converted with `Math.trunc` first                                |
| `colorClass` | CSS class for colour (e.g. `"green"`, `"red"`)                          |
| `condition`  | Optional `() => boolean`; when `false`, no output; default `() => true` |

**Behaviour**:

- `amount` is truncated to integer; if result is not finite (e.g. `NaN`) or `0`, returns an empty document fragment.
- If `V.settings.blindStatsEnabled` is true or `condition()` is `false`, also returns an empty fragment.

**Returns**: `DocumentFragment` (can be inserted into DOM or output by a widget).

---

### grace

Outputs a coloured fragment for Grace changes, used with the temple rank system.

**Signature**: `grace(amount, expectedRank?)`

| Parameter      | Description                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `amount`       | Grace delta; truncated like statChange; no output if not finite or 0                                                                       |
| `expectedRank` | Optional. One of: `prospective`, `initiate`, `monk`, `priest`, `bishop`. Controls when to show (e.g. only when player rank is below this). |

**Behaviour**:

- Same truncation rules as `statChange`; no output in blind mode.
- If the player is not in the temple or the `expectedRank` comparison fails, returns an empty fragment; otherwise outputs a coloured fragment similar to `statChange('Grace', amount, ...)`.

**Returns**: `DocumentFragment`.
