# 技能（Skills）

本项目提供了一组 **Claude Code Skill**，帮助 AI 编程助手更高效地协助开发者创建 SCML Mod。

## 什么是 Skill

Skill 是面向 AI 编程助手的**领域知识包**，包含特定框架或工具的 API 参考、最佳实践和常见模式。当开发者在 Claude Code 中使用这些 Skill 时，AI 能够更准确地生成符合框架规范的代码。

## 可用技能

| 技能                                      | 说明                                | 适用场景                                                       |
| ----------------------------------------- | ----------------------------------- | -------------------------------------------------------------- |
| [SCML Mod 开发](./scml-mod-development)   | SugarCube-2 ModLoader 通用 Mod 开发 | 创建 boot.json、选择脚本阶段、使用 ModUtils API、打包 .mod.zip |
| [Maplebirch 框架](./maplebirch-framework) | maplebirchFramework 框架专用        | 注册 NPC、战斗动作、音频管理、动态事件、多语言宏               |

## 安装方式

### 方式一：通过 GitHub 安装（推荐）

```bash
npx skills add github:Muromi-Rikka/scml-website/skills/scml-mod-development
npx skills add github:Muromi-Rikka/scml-website/skills/maplebirch-framework
```

### 方式二：手动安装

将 `skills/` 目录下的文件复制到项目的 `.claude/skills/` 目录：

```bash
cp -r skills/scml-mod-development .claude/skills/
cp -r skills/maplebirch-framework .claude/skills/
```

## 技能详情

- [SCML Mod 开发技能](./scml-mod-development) — 涵盖 boot.json 配置、脚本加载阶段、内置 Mod 与 Addon、ModUtils API 等
- [Maplebirch 框架技能](./maplebirch-framework) — 涵盖 addonPlugin 参数、NPC 注册、战斗系统、音频管理、事件系统等
