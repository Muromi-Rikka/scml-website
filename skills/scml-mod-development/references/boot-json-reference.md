# boot.json Field Reference

Complete reference for the mod manifest file.

## Required Fields

These fields must exist in every boot.json (use empty arrays if not needed):

```json
{
  "name": "MyMod",
  "version": "1.0.0",
  "styleFileList": [],
  "scriptFileList": [],
  "tweeFileList": [],
  "imgFileList": []
}
```

## Optional Fields

### Display Name

```json
"nickName": "My Mod Display Name"
// Or multi-language:
"nickName": { "cn": "中文名称", "en": "English Name" }
```

### Aliases

```json
"alias": ["OldModName", "AlternateName"]
```

Used when renaming a mod — old name remains compatible for dependency resolution.

### Early Script Stages

```json
"scriptFileList_inject_early": ["init.js"],
"scriptFileList_earlyload": ["early.js"],
"scriptFileList_preload": ["pre.js"]
```

### Additional Files

```json
"additionFile": ["readme.txt", "changelog.md"],
"additionBinaryFile": ["data.zip"],
"additionDir": ["extra_data"]
```

Files starting with "readme" (case-insensitive) are shown as mod description in the manager.

### Addon Plugin Dependencies

```json
"addonPlugin": [
  {
    "modName": "ImageLoaderHook",
    "addonName": "imgLoaderHook",
    "modVersion": "1.0.0",
    "params": []
  }
]
```

### Dependency Constraints

```json
"dependenceInfo": [
  { "modName": "SomeMod", "version": "^2.0.0" },
  { "modName": "ModLoader", "version": "^1.6.0" },
  { "modName": "GameVersion", "version": "=0.4.2.7" }
]
```

## Version Constraint Syntax

| Format    | Meaning                         | Example                |
| --------- | ------------------------------- | ---------------------- |
| `^x.y.z`  | Compatible within major version | `^2.0.0` matches 2.x.x |
| `=x.y.z`  | Exact match                     | `=1.2.3`               |
| `>x.y.z`  | Greater than                    | `>1.0.0`               |
| `>=x.y.z` | Greater or equal                | `>=1.0.0`              |
| `<x.y.z`  | Less than                       | `<2.0.0`               |
| `<=x.y.z` | Less or equal                   | `<=2.0.0`              |

For `GameVersion`, only the main version is compared; anything after the first `-` is ignored.

## Path Rules

- All paths are **relative to the zip root** (the directory containing boot.json)
- File names within the same mod must be unique
- Avoid naming conflicts with base game and other mods
- Duplicate Passage names **override** game content
- Identical CSS/JS filenames across mods are **concatenated**, not overwritten
- Image paths should be unique to avoid unintended string replacement
