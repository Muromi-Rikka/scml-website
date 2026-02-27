# LanguageManager Internationalization

## Overview

`LanguageManager` is the framework’s internationalization/localization system. It provides translation support for mod authors, with multi-language switching, automatic translation lookup, and efficient queries.

`LanguageManager` is accessible via `maplebirch.lang`. Translation keys and the `Language` property are also exposed on `maplebirch` for convenience.

---

## Core API

### t(key, space?)

Get the translated text for a key in the current language.

- **@param** `key` (string): Translation key.
- **@param** `space` (boolean): If `true` and the current language is EN, append a space to the result. Default `false`.
- **@return** (string): Translation for the current language, or `[key]` if the key is not found.

```js
// Basic usage
maplebirch.t('ui_title'); // Returns 'Map Editor' when current language is CN

// Append space in English
maplebirch.t('game_start', true); // Returns 'Start ' when current language is EN

// Missing key
maplebirch.t('nonexistent_key'); // Returns '[nonexistent_key]'
```

### auto(text)

Auto-detect the given text and return its translation in the current language.

- **@param** `text` (string): Source text to translate.
- **@return** (string): Translation in the current language, or the original text if no translation exists.

```js
// Auto-translate from English to Chinese
maplebirch.Language = 'CN';
maplebirch.auto('Welcome to the game.'); // Returns '欢迎来到游戏。'

// Auto-translate from Chinese to English
maplebirch.Language = 'EN';
maplebirch.auto('欢迎来到游戏。'); // Returns 'Welcome to the game.'

// No translation available
maplebirch.auto('Some unique untranslated text.'); // Returns original text
```

### Language property

Get or set the current system language. Setting the language triggers the `:language` event and clears the cache.

```js
// Get current language
const currentLang = maplebirch.Language;

// Switch language (triggers page re-render)
maplebirch.Language = 'JA';

// Listen for language switch
maplebirch.on(':language', () => {
  console.log('Language switched to:', maplebirch.Language);
});
```

---

## Configuration

Language files are configured through [AddonPlugin](./addon-plugin). Set `params.language` in your mod’s `addonPlugin` entry in `boot.json`. Three modes are supported:

### Mode 1: Auto-import all languages

Scans and imports all supported language files from the mod’s `translations/` directory.

- **Value**: `true`
- **Supported formats**: `{language_code}.json`, `{language_code}.yml`, `{language_code}.yaml` (e.g. `en`, `cn`, `ja`, case-insensitive)
- **Priority**: `json > yml > yaml` for the same language code

```json
{
  "addonPlugin": [
    {
      "modName": "maplebirch",
      "addonName": "maplebirchAddon",
      "params": {
        "language": true
      }
    }
  ]
}
```

**Directory structure example:**

```
my-mod/
├── boot.json (or addonPlugin config)
└── translations/
    ├── en.json
    ├── cn.json
    ├── ja.yml
    └── ko.yaml
```

### Mode 2: Import specified languages

Imports only the listed languages; files are looked up in that order.

- **Value**: Array of language codes, e.g. `["EN", "CN", "JA"]`
- Each language tries: `json`, `yml`, `yaml` in turn
- Skips a language and logs a warning if its file is not found

```json
{
  "params": {
    "language": ["EN", "CN", "JA"]
  }
}
```

### Mode 3: Custom file paths

Define explicit paths per language.

- **Value**: Object with language codes as keys and `{ "file": "path" }` as values

```json
{
  "params": {
    "language": {
      "EN": { "file": "lang/english.json" },
      "CN": { "file": "lang/chinese_simple.yml" },
      "JA": { "file": "locales/japanese.yaml" },
      "FR": { "file": "translations/french.json" }
    }
  }
}
```

**Directory structure example:**

```
my-mod/
├── addonPlugin config
├── lang/
│   ├── english.json
│   └── chinese_simple.yml
├── locales/
│   └── japanese.yaml
└── translations/
    └── french.json
```

---

## Translation File Formats

### JSON (recommended)

```json
{
  "ui_menu_start": "Start Game",
  "ui_menu_load": "Load Game",
  "ui_menu_settings": "Settings",
  "character_player_name": "Alice",
  "dialogue_merchant_greeting": "Look at my wares, traveler!",
  "item_potion_health_name": "Health Potion",
  "system_save_success": "Game saved."
}
```

### YAML / YML

```yaml
ui_menu_start: 'Start Game'
ui_menu_load: 'Load Game'
ui_menu_settings: 'Settings'
character_player_name: 'Alice'
dialogue_merchant_greeting: 'Look at my wares, traveler!'
item_potion_health_name: 'Health Potion'
system_save_success: 'Game saved.'
```
