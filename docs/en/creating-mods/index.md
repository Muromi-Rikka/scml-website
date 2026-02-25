# Creating Mods

This chapter explains how to create ModLoader-compatible Mods for SugarCube2-based games.

## Quick Start

Three steps to create a Mod:

1. Write the `boot.json` manifest
2. Prepare Mod content (twee, JS, CSS, images, etc.)
3. Package everything as a `.mod.zip` archive

## Mod Package Format

Each Mod is distributed as a `.mod.zip` archive (or `.modpack` binary format) containing:

- **`boot.json`** (must be at zip root) — Mod manifest: name, version, file lists, dependencies
- **Script files** — JS files split by stage: inject_early / earlyload / preload / main scripts
- **Style files** — CSS
- **Twee files** — Passage script files
- **Image files** — Game assets
- **Extra files** — README, etc.

## Minimal Mod Example

A minimal Mod structure:

```
MyMod/
  boot.json
  readme.txt
```

Minimal `boot.json`:

```json
{
  "name": "EmptyMod",
  "version": "1.0.0",
  "styleFileList": [],
  "scriptFileList": [],
  "tweeFileList": [],
  "imgFileList": [],
  "additionFile": [
    "readme.txt"
  ]
}
```

## Typical Mod Structure

```
MyMod/
  boot.json
  readme.txt
  MyMod_style.css
  MyMod_script.js
  MyMod_passage.twee
  MyMod_Image/
    character/
      avatar.png
```

## Notes

1. Paths in `boot.json` are **relative** to the zip root
2. Do not duplicate filenames within a Mod; avoid collisions with the base game and other Mods
3. Duplicate Passage names **override** game content
4. Mods load in list order; later Mods override earlier ones for the same Passage
5. Identical CSS/JS files are **concatenated**, not overwritten
6. Image paths should not easily collide with other strings in the file

## Next Steps

- [Example Mod Tutorial](./example-walkthrough) — Build a functional Mod from scratch
- [boot.json Reference](./boot-json) — All available fields
- [Script Loading Stages](./script-stages) — Differences between the four script stages
- [Packaging](./packaging) — Manual and automated packaging
- [ModPack Format](./modpack-format) — The .modpack binary format (optional)
