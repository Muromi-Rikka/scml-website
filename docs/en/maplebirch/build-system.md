# Build & Distribution

This document introduces the maplebirchFramework build toolchain, build commands, and packaging workflow.

## Build Toolchain

| Tool                               | Purpose                                |
| ---------------------------------- | -------------------------------------- |
| [Rspack](https://rspack.dev) + SWC | TypeScript compilation and bundling    |
| [tsup](https://tsup.egoist.dev)    | TypeScript type declaration generation |
| [Bun](https://bun.sh)              | Package manager and script runner      |
| [oxlint](https://oxc.rs)           | Code linting                           |
| [oxfmt](https://oxc.rs)            | Code formatting                        |

## Build Commands

| Command               | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `bun run dev`         | Start dev server (port 5678)                          |
| `bun run build`       | Production build (Rspack)                             |
| `bun run build:dev`   | Development build (with source map)                   |
| `bun run build:types` | Generate type declarations (tsup)                     |
| `bun run package`     | Package as `.mod.zip`                                 |
| `bun run build:all`   | Full build workflow (clean + build + types + package) |
| `bun run clean`       | Clean build artifacts                                 |
| `bun run lint`        | Run linter                                            |
| `bun run fmt`         | Format code                                           |

## Rspack Configuration

### Entry and Output

```
Entry: ./src/main.ts
Output: dist/inject_early.js
```

Output is configured as a `window`-type library exporting as `maplebirch`:

```js
output: {
  filename: 'inject_early.js',
  library: {
    name: 'maplebirch',
    type: 'window',
    export: 'default'
  }
}
```

This means the bundled code mounts the `MaplebirchCore` instance to `window.maplebirch`.

### TypeScript Compilation

Uses Rspack's built-in SWC loader to compile TypeScript:

- Target: `> 0.5%, not dead, not ie 11`
- Supports `.twee` files as raw text resources (`?raw` query parameter)

### Development Server

The dev server runs on port 5678 and provides:

- Static file serving (`game/` directory)
- `/modList.json` endpoint: Auto-scans `.zip` files under `game/mods/` and lists them
- `/{name}-{version}.mod.zip` endpoint: Dynamically creates mod zip files

:::tip
Place `game/index.html` (game files) in the project root during development; the dev server automatically serves mod files with hot reload.
:::

## Type Declaration Generation

tsup is configured to generate type-only declaration files:

```
Entry: src/main.ts
Output: dist/maplebirch.d.ts
Mode: dts only
```

The generated `maplebirch.d.ts` contains type definitions for all public framework APIs, for use by Mod developers who depend on the framework.

## Packaging Workflow

```mermaid
graph LR
  clean["clean"] --> build["rspack build"]
  build --> types["tsup (types)"]
  types --> package["scripts/package.ts"]
  package --> zip["maplebirch-{version}.mod.zip"]
```

The final `.mod.zip` file contains:

- `dist/inject_early.js` — Compiled framework code
- `dist/maplebirch.d.ts` — TypeScript type declarations
- `boot.json` — Generated from `scml` field in `package.json`
- Other required files

### boot.json Generation

`boot.json` is automatically generated from the `scml` section in `package.json`:

```json
{
  "scml": {
    "nickName": {
      "en": "Maplebirch Frameworks",
      "cn": "秋枫白桦框架"
    },
    "alias": ["Simple Frameworks"],
    "scriptFileList": ["defineSugarCube.js"],
    "dependenceInfo": [
      { "modName": "ModLoader", "version": ">=2.0.0" },
      ...
    ]
  }
}
```

## Project Structure

```tree
SCML-DOL-maplebirchFramework/
├── src/
│   ├── main.ts                # 入口文件
│   ├── core.ts                # MaplebirchCore 核心类
│   ├── constants.ts           # 常量定义
│   ├── utils.ts               # 工具函数
│   ├── services/              # 服务层
│   │   ├── EventEmitter.ts
│   │   ├── GUIControl.ts
│   │   ├── IndexedDBService.ts
│   │   ├── LanguageManager.ts
│   │   ├── Logger.ts
│   │   └── ModuleSystem.ts
│   ├── modules/               # 功能模块
│   │   ├── AddonPlugin.ts
│   │   ├── Audio.ts
│   │   ├── Character.ts
│   │   ├── Combat.ts
│   │   ├── Dynamic.ts
│   │   ├── NamedNPC.ts
│   │   ├── ToolCollection.ts
│   │   └── Variables.ts
│   └── database/              # 数据库相关
├── types/                     # TypeScript 类型定义
├── scripts/                   # 构建脚本
├── rspack.config.ts           # Rspack 配置
├── tsup.config.ts             # tsup 配置
├── tsconfig.json              # TypeScript 配置
└── package.json               # 项目配置
```
