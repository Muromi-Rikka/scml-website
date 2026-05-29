# boot.json Configuration Guide for maplebirchFramework

This is the complete reference for configuring a mod's `boot.json` to use with maplebirchFramework.

## Minimal boot.json

```json
{
  "name": "MyMod",
  "version": "1.0.0",
  "scriptFileList": [],
  "styleFileList": [],
  "tweeFileList": [],
  "imgFileList": [],
  "additionFile": [],
  "dependenceInfo": [
    { "modName": "GameVersion", "version": ">=0.5.9.7" },
    { "modName": "maplebirch", "version": ">=3.2.5" }
  ],
  "addonPlugin": [
    {
      "modName": "maplebirch",
      "addonName": "maplebirchAddon",
      "modVersion": "^3.2.0",
      "params": {
        "script": ["mymod.js"]
      }
    }
  ]
}
```

---

## addonPlugin params Reference

### `script` (recommended)

JS files executed after all mods have registered with AddonPlugin. The framework is fully initialized at this point.

```json
{ "params": { "script": ["mymod.js", "events.js"] } }
```

Scripts can be disabled via the GUI panel. Key format: `[ModName]:filePath`.

### `module` (advanced)

JS files executed immediately after `inject_early` phase. The framework may NOT be fully initialized.

```json
{ "params": { "module": ["early-init.js"] } }
```

Use only for custom module registration that must happen before normal script loading.

### `language`

Three formats supported:

**Auto-import all translations from `translations/` directory:**
```json
{ "language": true }
```

**Specify language list:**
```json
{ "language": ["CN", "EN"] }
```

**Custom path:**
```json
{
  "language": {
    "CN": { "file": "i18n/chinese.json" },
    "EN": { "file": "i18n/english.yml" }
  }
}
```

Translation files are simple key-value JSON or YAML:
```json
{
  "greeting": "你好",
  "farewell": "再见"
}
```

### `audio`

**Default path import (all audio from `audio/` directory):**
```json
{ "audio": true }
```

**Custom paths:**
```json
{ "audio": ["bgm", "sfx/weapons", "sfx/ui"] }
```

Supported formats: mp3, wav, ogg, m4a, flac, webm.

**Important:** Audio file paths must also be listed in `additionFile` in boot.json.

### `npc`

NPC configuration with sub-items:

```json
{
  "npc": {
    "NamedNPC": [
      [
        {
          "nam": "MyNPC",
          "gender": "f",
          "title": "My Title",
          "description": "Description text",
          "age": 25,
          "hairColour": "black",
          "eyeColour": "green"
        },
        {
          "love": { "maxValue": 100 },
          "important": true,
          "loveInterest": true
        },
        {
          "MyNPC": { "EN": "MyNPC", "CN": "我的NPC" },
          "My Title": { "EN": "My Title", "CN": "我的称号" }
        }
      ]
    ],
    "Stats": {
      "trust": { "maxValue": 100 },
      "fear": { "maxValue": 50 }
    },
    "Sidebar": {
      "clothes": ["npc/clothes.json"],
      "image": ["img/npc/"],
      "config": ["npc/config.json"]
    }
  }
}
```

Each `NamedNPC` entry is a triple: `[NPCData, NPCConfig, Translations]`.

**NPCData fields:**

| Field | Type | Description |
|-------|------|-------------|
| `nam` | string | **Required.** Unique NPC name |
| `gender` | 'm'/'f'/'h'/'n'/'none' | Gender |
| `title` | string | Title / epithet |
| `description` | string | Description text |
| `type` | string | NPC type (default: 'human') |
| `adult` | number | Adult (1/0) |
| `teen` | number | Teen (1/0) |
| `age` | number | Age |
| `insecurity` | string | 'weak'/'looks'/'ethics'/'skill' |
| `hairColour` | string | Red, black, brown, lightbrown, blond, platinumblond, strawberryblond, ginger |
| `eyeColour` | string | Purple, darkblue, lightblue, amber, hazel, green, red, pink, grey, lightgrey, lime |
| `hairlength` | number | Hair length |
| `breastsize` | number | Breast size |
| `penissize` | number | Penis size |
| `ballssize` | number | Testicles size |
| `outfits` | string[] | Outfit list |

**NPCConfig fields:**

| Field | Type | Description |
|-------|------|-------------|
| `love` | `{ maxValue: number }` | Love/Like max value |
| `loveAlias` | `[string, string]` or function | Love/Like label |
| `important` | boolean or function | Whether NPC is important |
| `special` | boolean or function | Whether NPC is special |
| `loveInterest` | boolean or function | Whether NPC can be love interest |
| `romance` | `(() => boolean)[]` | Romance condition functions |

### `framework`

Framework-level configuration. Supports multiple formats:

**Register traits:**
```json
{
  "framework": {
    "traits": [
      {
        "title": "Brave",
        "name": "brave",
        "colour": "green",
        "has": "V.brave >= 1",
        "text": "Character shows courage"
      }
    ]
  }
}
```

**Add region widget:**
```json
{
  "framework": {
    "addto": "sidebar",
    "widget": "<<myWidget>>"
  }
}
```

**Conditional widget:**
```json
{
  "framework": {
    "addto": "sidebar",
    "widget": {
      "widget": "<<myWidget>>",
      "exclude": ["Combat"],
      "match": ["Home"],
      "passage": "MyPassage"
    }
  }
}
```

**Array form (multiple configs):**
```json
{
  "framework": [
    { "traits": [...] },
    { "addto": "sidebar", "widget": "..." }
  ]
}
```

---

## dependenceInfo

Always declare both `GameVersion` and `maplebirch`:

```json
{
  "dependenceInfo": [
    { "modName": "GameVersion", "version": ">=0.5.9.7" },
    { "modName": "maplebirch", "version": ">=3.2.5" }
  ]
}
```

---

## additionFile

List additional files that should be included in the mod package but are not referenced by other fields. Required for audio files:

```json
{
  "additionFile": ["audio/bgm.mp3", "audio/sfx/click.wav", "readme.txt"]
}
```

---

## Complete Example

```json
{
  "name": "MyFullMod",
  "version": "1.0.0",
  "scriptFileList": [],
  "styleFileList": ["mymod.css"],
  "tweeFileList": [],
  "imgFileList": [],
  "additionFile": ["audio/bgm.mp3"],
  "dependenceInfo": [
    { "modName": "GameVersion", "version": ">=0.5.9.7" },
    { "modName": "maplebirch", "version": ">=3.2.5" }
  ],
  "addonPlugin": [
    {
      "modName": "maplebirch",
      "addonName": "maplebirchAddon",
      "modVersion": "^3.2.0",
      "params": {
        "script": ["mymod.js"],
        "language": true,
        "audio": true,
        "npc": {
          "NamedNPC": [
            [
              {
                "nam": "Luna",
                "gender": "f",
                "title": "Moon Witch",
                "description": "A mysterious witch",
                "age": 25,
                "hairColour": "platinumblond",
                "eyeColour": "purple"
              },
              { "love": { "maxValue": 100 }, "important": true }
            ]
          ]
        },
        "framework": {
          "traits": [
            {
              "title": "Brave",
              "name": "brave",
              "colour": "green",
              "has": "V.brave >= 1",
              "text": "Shows courage"
            }
          ]
        }
      }
    }
  ]
}
```
