# 快速开始

本文介绍如何让你的 Mod 依赖并使用 maplebirchFramework。

## 安装框架

1. 从 [GitHub Releases](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/releases) 下载框架的 `.mod.zip` 文件
2. 通过 ModLoader 的 Mod 管理器上传安装，确保框架及其所有依赖（ModLoader、ModLoaderGui、BeautySelectorAddon 等）均已正确加载

:::tip
框架的别名为 `Simple Frameworks`，如果已安装旧版简易框架，maplebirch 会在启动时自动禁用它以避免冲突。
:::

## 声明依赖

在你的 Mod 的 `boot.json` 中通过 `dependenceInfo` 声明对 maplebirch 的版本约束：

```json
{
  "name": "MyMod",
  "version": "1.0.0",
  "dependenceInfo": [
    {
      "modName": "maplebirch",
      "version": ">=3.0.0"
    }
  ]
}
```

ModLoader 会在加载时检查版本约束，如果未满足则阻止 Mod 加载。

## 注册到框架

通过 `boot.json` 的 `addonPlugin` 字段将你的 Mod 注册到 maplebirch 的 AddonPlugin 系统：

```json
{
  "addonPlugin": [
    {
      "modName": "maplebirch",
      "addonName": "maplebirchAddon",
      "modVersion": "^2.7.0",
      "params": {
        "script": [
          "mymod_framework.js"
        ]
      }
    }
  ]
}
```

`params` 中支持以下配置项：

| 参数 | 类型 | 说明 |
|------|------|------|
| `module` | `string[]` | 在 `inject_early` 完成后立即执行的 JS 文件，非必要不推荐使用 |
| `script` | `string[]` | 在 AddonPlugin 处理完成后执行的 JS 文件（推荐） |
| `language` | `boolean \| string[] \| object` | 语言文件配置，详见 [AddonPlugin 系统](./addon-plugin) |
| `audio` | `boolean \| string[]` | 音频文件配置 |
| `npc` | `object` | NPC 配置（命名 NPC、侧边栏、服装等） |
| `framework` | `object \| object[]` | 框架级配置（特质、区域部件等） |

## 最小示例

以下是一个依赖 maplebirch 的完整 `boot.json` 示例：

```json
{
  "name": "MyFirstMod",
  "version": "1.0.0",
  "scriptFileList": [],
  "styleFileList": [],
  "tweeFileList": [],
  "imgFileList": [],
  "additionFile": ["readme.txt"],
  "dependenceInfo": [
    {
      "modName": "maplebirch",
      "version": ">=3.0.0"
    }
  ],
  "addonPlugin": [
    {
      "modName": "maplebirch",
      "addonName": "maplebirchAddon",
      "modVersion": "^2.7.0",
      "params": {
        "script": ["mymod.js"],
        "language": true
      }
    }
  ]
}
```

:::info
`language: true` 表示自动导入 `translations/` 目录下的所有语言文件。你需要按如下结构放置翻译文件：

```tree
MyFirstMod/
├── boot.json
├── mymod.js
└── translations/
    ├── cn.json
    └── en.json
```
:::

## `module` 与 `script` 的区别

- **`module`** 中的文件在 `inject_early` 阶段完成后立即执行，此时框架本身可能还未完全初始化，适用于需要在极早期注册模块的场景
- **`script`** 中的文件在所有 Mod 注册到 AddonPlugin 之后执行，此时框架已完成初始化，推荐绝大多数场景使用

## 验证框架加载

在你的脚本中检查框架是否可用：

```js
if (window.maplebirch) {
  console.log('maplebirch 框架版本:', window.maplebirch.meta.version);
  // 框架已就绪，可以使用其 API
} else {
  console.error('maplebirch 框架未加载');
}
```

## 下一步

- [核心架构](./architecture) — 深入了解 MaplebirchCore 与模块系统
- [AddonPlugin 系统](./addon-plugin) — 了解 params 各配置项的详细用法
- [变量与游戏状态](./variables) — 管理 `V.maplebirch` 命名空间
