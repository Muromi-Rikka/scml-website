# Skills

This project provides a set of **Claude Code Skills** to help AI coding assistants work more efficiently with SCML mod development.

## What are Skills

Skills are **domain knowledge packages** for AI coding assistants, containing API references, best practices, and common patterns for specific frameworks or tools. When developers use these Skills in Claude Code, the AI can generate framework-compliant code more accurately.

## Available Skills

| Skill                                          | Description                                   | Use Cases                                                                           |
| ---------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------- |
| [SCML Mod Development](./scml-mod-development) | Generic SugarCube-2 ModLoader mod development | Creating boot.json, choosing script stages, using ModUtils API, packaging .mod.zip  |
| [Maplebirch Framework](./maplebirch-framework) | maplebirchFramework-specific                  | Registering NPCs, combat actions, audio management, dynamic events, language macros |

## Installation

### Option 1: Install via GitHub (Recommended)

```bash
npx skills add github:Muromi-Rikka/scml-website/skills/scml-mod-development
npx skills add github:Muromi-Rikka/scml-website/skills/maplebirch-framework
```

### Option 2: Manual Installation

Copy the `skills/` directory contents to your project's `.claude/skills/` directory:

```bash
cp -r skills/scml-mod-development .claude/skills/
cp -r skills/maplebirch-framework .claude/skills/
```

## Skill Details

- [SCML Mod Development Skill](./scml-mod-development) — Covers boot.json configuration, script loading stages, bundled mods & addons, ModUtils API, and more
- [Maplebirch Framework Skill](./maplebirch-framework) — Covers addonPlugin parameters, NPC registration, combat system, audio management, event system, and more
