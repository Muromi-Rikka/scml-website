# 构建与分发

本文介绍 maplebirchFramework 的构建工具链、构建命令和打包流程。

## 构建工具链

| 工具 | 用途 |
|------|------|
| [Rspack](https://rspack.dev) + SWC | TypeScript 编译与打包 |
| [tsup](https://tsup.egoist.dev) | TypeScript 类型声明生成 |
| [Bun](https://bun.sh) | 包管理器与脚本运行器 |
| [oxlint](https://oxc.rs) | 代码检查 |
| [oxfmt](https://oxc.rs) | 代码格式化 |

## 构建命令

| 命令 | 说明 |
|------|------|
| `bun run dev` | 启动开发服务器（端口 5678） |
| `bun run build` | 生产构建（Rspack） |
| `bun run build:dev` | 开发构建（含 source map） |
| `bun run build:types` | 生成类型声明（tsup） |
| `bun run package` | 打包为 `.mod.zip` |
| `bun run build:all` | 完整构建流程（clean + build + types + package） |
| `bun run clean` | 清理构建产物 |
| `bun run lint` | 代码检查 |
| `bun run fmt` | 代码格式化 |

## Rspack 配置

### 入口与输出

```
入口: ./src/main.ts
输出: dist/inject_early.js
```

输出配置为 `window` 类型的库，导出名为 `maplebirch`：

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

这意味着打包后的代码会将 `MaplebirchCore` 实例挂载到 `window.maplebirch`。

### TypeScript 编译

使用 Rspack 内置的 SWC loader 编译 TypeScript：

- 目标：`> 0.5%, not dead, not ie 11`
- 支持 `.twee` 文件作为原始文本资源（`?raw` 查询参数）

### 开发服务器

开发服务器运行在端口 5678，提供以下功能：

- 静态文件服务（`game/` 目录）
- `/modList.json` 端点：自动扫描 `game/mods/` 下的 `.zip` 文件并列出
- `/{name}-{version}.mod.zip` 端点：动态创建 mod zip 文件

:::tip
开发时需要在项目根目录放置 `game/index.html`（游戏文件），开发服务器会自动提供热重载的 mod 文件。
:::

## 类型声明生成

tsup 配置生成仅类型声明文件：

```
入口: src/main.ts
输出: dist/maplebirch.d.ts
模式: dts only
```

生成的 `maplebirch.d.ts` 包含框架所有公开 API 的类型定义，供依赖框架的 Mod 开发者使用。

## 打包流程

```mermaid
graph LR
  clean["clean"] --> build["rspack build"]
  build --> types["tsup (类型)"]
  types --> package["scripts/package.ts"]
  package --> zip["maplebirch-{version}.mod.zip"]
```

最终生成的 `.mod.zip` 文件包含：

- `dist/inject_early.js` — 编译后的框架代码
- `dist/maplebirch.d.ts` — TypeScript 类型声明
- `boot.json` — 由 `package.json` 中的 `scml` 字段生成
- 其他必要文件

### boot.json 生成

`boot.json` 从 `package.json` 的 `scml` 配置段自动生成：

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

## 项目结构

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
