# Skills 文档化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `skills/` 目录下的两个 Claude Code Skill（`scml-mod-development` 和 `maplebirch-framework`）的内容整合到 Rspress 文档站中，创建新的"Skills"导航分区，同时补充现有文档中缺失的实用内容。

**Architecture:** 在 `docs/zh/` 和 `docs/en/` 下各新建 `skills/` 目录，包含概述页和两个技能详情页。导航栏新增"技能"入口。部分 skill 参考内容（bundled-mods 使用示例、api-reference 通信模式）比现有文档更详细，需要补充到已有文档页面中。

**Tech Stack:** Rspress 2.x, Markdown, JSON (\_meta.json / \_nav.json)

---

## File Structure

### 新建文件

| File                                     | Responsibility                                           |
| ---------------------------------------- | -------------------------------------------------------- |
| `docs/zh/skills/index.md`                | Skills 概述页（什么是 skill、如何安装、可用 skill 列表） |
| `docs/zh/skills/scml-mod-development.md` | SCML Mod 开发 skill 详细内容                             |
| `docs/zh/skills/maplebirch-framework.md` | Maplebirch 框架 skill 详细内容                           |
| `docs/zh/skills/_meta.json`              | 侧边栏导航配置                                           |
| `docs/en/skills/index.md`                | English skills overview                                  |
| `docs/en/skills/scml-mod-development.md` | English SCML skill detail                                |
| `docs/en/skills/maplebirch-framework.md` | English Maplebirch skill detail                          |
| `docs/en/skills/_meta.json`              | English sidebar nav config                               |

### 修改文件

| File                               | Change                                            |
| ---------------------------------- | ------------------------------------------------- |
| `docs/zh/_nav.json`                | 添加"技能"导航入口                                |
| `docs/en/_nav.json`                | Add "Skills" nav entry                            |
| `docs/zh/ml/guide/bundled-mods.md` | 补充 addon 使用示例（来自 skill bundled-mods.md） |
| `docs/en/ml/guide/bundled-mods.md` | 同上英文版                                        |

---

### Task 1: 创建中文 Skills 概述页

**Files:**

- Create: `docs/zh/skills/index.md`
- Create: `docs/zh/skills/_meta.json`

- [ ] **Step 1: 创建 \_meta.json**

```json
["index", "scml-mod-development", "maplebirch-framework"]
```

- [ ] **Step 2: 创建 index.md**

内容要点：

- 什么是 Claude Code Skill（面向 AI 编程助手的领域知识包）
- 当前可用 skill 列表及简介
- 安装方式（`npx skills add` 或手动复制到 `.claude/skills/`）
- 每个 skill 的适用场景说明
- 链接到各 skill 详情页

参考 `skills/scml-mod-development/SKILL.md` 和 `skills/maplebirch-framework/SKILL.md` 的 description 字段编写场景说明。

- [ ] **Step 3: 验证 Rspress 构建**

Run: `bun run build`
Expected: 构建成功，`docs/zh/skills/` 页面可访问

- [ ] **Step 4: Commit**

```bash
git add docs/zh/skills/index.md docs/zh/skills/_meta.json
git commit -m "docs: add Chinese skills overview page"
```

---

### Task 2: 创建中文 SCML Mod 开发 Skill 详情页

**Files:**

- Create: `docs/zh/skills/scml-mod-development.md`

- [ ] **Step 1: 创建 scml-mod-development.md**

基于 `skills/scml-mod-development/SKILL.md` 内容，转换为文档格式。内容结构：

1. **概述** — skill 的用途和触发场景
2. **快速开始** — 创建新 Mod 的标准流程（目录结构、boot.json、打包）
3. **脚本阶段选择** — 四个阶段的对比表和选择指南（来自 `references/script-stages.md`）
4. **boot.json 要点** — 必需字段、addonPlugin 配置（来自 `references/boot-json-reference.md`，链接到已有的 `../ml/creating-mods/boot-json` 详细参考）
5. **内置 Mod 与 Addon** — 常用 addon 速查表（来自 `references/bundled-mods.md`，链接到已有的 `../ml/guide/bundled-mods` 详细列表）
6. **API 速查** — ModUtils 核心方法、生命周期钩子摘要（链接到已有的 `../ml/api/` 详细参考）
7. **Twee 文件格式** — 基本语法
8. **常见陷阱** — boot.json 位置、路径大小写、IIFE 格式等

注意：详情页是**速查/索引**性质，详细内容通过链接指向已有的 `ml/` 文档页面，避免内容重复。

- [ ] **Step 2: 验证 Rspress 构建**

Run: `bun run build`
Expected: 构建成功

- [ ] **Step 3: Commit**

```bash
git add docs/zh/skills/scml-mod-development.md
git commit -m "docs: add Chinese SCML mod development skill page"
```

---

### Task 3: 创建中文 Maplebirch 框架 Skill 详情页

**Files:**

- Create: `docs/zh/skills/maplebirch-framework.md`

- [ ] **Step 1: 创建 maplebirch-framework.md**

基于 `skills/maplebirch-framework/SKILL.md` 内容，转换为文档格式。内容结构：

1. **概述** — skill 的用途和触发场景
2. **快速开始** — 创建 maplebirch Mod 的标准流程（目录结构、boot.json 模板）
3. **addonPlugin 参数速查** — script/module/language/audio/npc/framework 参数摘要（链接到已有的 `../maplebirch/addon-plugin` 详细参考）
4. **核心 API 速查** — 各模块访问路径表、EventEmitter、Logger、ToolCollection Patch API（链接到已有的 `../maplebirch/` 各子页面）
5. **NPC 注册** — JS API 和 boot.json 声明式配置示例（链接到 `../maplebirch/named-npc/`）
6. **战斗动作** — CombatAction.reg 示例（链接到 `../maplebirch/combat/actions`）
7. **音频系统** — 播放控制 API（链接到 `../maplebirch/audio`）
8. **多语言宏** — <<language>>、<<lanSwitch>> 等（链接到 `../maplebirch/sugar-cube-macro`）
9. **变量命名空间** — V.maplebirch 结构（链接到 `../maplebirch/variables`）
10. **常见陷阱** — module vs script、V.worn 只读代理、初始化时序等

同样以**速查/索引**为主，详细内容链接到已有的 `maplebirch/` 文档页面。

- [ ] **Step 2: 验证 Rspress 构建**

Run: `bun run build`
Expected: 构建成功

- [ ] **Step 3: Commit**

```bash
git add docs/zh/skills/maplebirch-framework.md
git commit -m "docs: add Chinese maplebirch framework skill page"
```

---

### Task 4: 创建英文 Skills 文档

**Files:**

- Create: `docs/en/skills/index.md`
- Create: `docs/en/skills/_meta.json`
- Create: `docs/en/skills/scml-mod-development.md`
- Create: `docs/en/skills/maplebirch-framework.md`

- [ ] **Step 1: 创建 \_meta.json**

```json
["index", "scml-mod-development", "maplebirch-framework"]
```

- [ ] **Step 2: 创建英文版三个页面**

将 Task 1-3 的中文内容翻译为英文。内容结构和链接路径保持一致（`../ml/` → `../ml/`，`../maplebirch/` → `../maplebirch/`），仅语言不同。

- [ ] **Step 3: 验证 Rspress 构建**

Run: `bun run build`
Expected: 构建成功，中英文 skills 页面均可访问

- [ ] **Step 4: Commit**

```bash
git add docs/en/skills/
git commit -m "docs: add English skills documentation pages"
```

---

### Task 5: 更新导航栏

**Files:**

- Modify: `docs/zh/_nav.json`
- Modify: `docs/en/_nav.json`

- [ ] **Step 1: 更新中文导航**

在 `docs/zh/_nav.json` 中，在"贡献者"之前添加"技能"入口：

```json
[
  { "text": "指南", "link": "/ml/guide/", "activeMatch": "/ml/guide/" },
  { "text": "API 参考", "link": "/ml/api/", "activeMatch": "/ml/api/" },
  { "text": "创建 Mod", "link": "/ml/creating-mods/", "activeMatch": "/ml/creating-mods/" },
  { "text": "高级", "link": "/ml/advanced/", "activeMatch": "/ml/advanced/" },
  { "text": "MapleBirch 框架", "link": "/maplebirch/", "activeMatch": "/maplebirch/" },
  { "text": "技能", "link": "/skills/", "activeMatch": "/skills/" },
  { "text": "贡献者", "link": "/contributors/", "activeMatch": "/contributors/" }
]
```

- [ ] **Step 2: 更新英文导航**

在 `docs/en/_nav.json` 中，在"Contributors"之前添加"Skills"入口：

```json
[
  { "text": "Guide", "link": "/ml/guide/", "activeMatch": "/ml/guide/" },
  { "text": "API", "link": "/ml/api/", "activeMatch": "/ml/api/" },
  { "text": "Creating Mods", "link": "/ml/creating-mods/", "activeMatch": "/ml/creating-mods/" },
  { "text": "Advanced", "link": "/ml/advanced/", "activeMatch": "/ml/advanced/" },
  { "text": "MapleBirch Framework", "link": "/maplebirch/", "activeMatch": "/maplebirch/" },
  { "text": "Skills", "link": "/skills/", "activeMatch": "/skills/" },
  { "text": "Contributors", "link": "/contributors/", "activeMatch": "/contributors/" }
]
```

- [ ] **Step 3: 验证 Rspress 构建并检查导航**

Run: `bun run build && bun run preview`
Expected: 导航栏显示"技能"/"Skills"入口，点击可跳转到 skills 概述页

- [ ] **Step 4: Commit**

```bash
git add docs/zh/_nav.json docs/en/_nav.json
git commit -m "docs: add Skills nav entry to zh and en navigation"
```

---

### Task 6: 补充内置 Mod 使用示例到现有文档

**Files:**

- Modify: `docs/zh/ml/guide/bundled-mods.md`
- Modify: `docs/en/ml/guide/bundled-mods.md`

- [ ] **Step 1: 为中文 bundled-mods.md 补充 addon 使用示例**

在现有的 Mod 列表表格之后，为以下常用 addon 添加 `boot.json` 配置示例代码块：

1. **TweeReplacer** — 添加 `addonPlugin` 依赖声明和 params 示例
2. **ReplacePatch** — 同上
3. **ImageLoaderHook** — 添加 `imgFileList` + `addonPlugin` 示例
4. **自定义 Addon 创建** — 添加 `registerAddonPlugin` 示例代码

这些内容来自 `skills/scml-mod-development/references/bundled-mods.md`，是现有文档中缺失的实用配置示例。

- [ ] **Step 2: 为英文 bundled-mods.md 补充同样的示例**

- [ ] **Step 3: 验证 Rspress 构建**

Run: `bun run build`
Expected: 构建成功

- [ ] **Step 4: Commit**

```bash
git add docs/zh/ml/guide/bundled-mods.md docs/en/ml/guide/bundled-mods.md
git commit -m "docs: add addon usage examples to bundled-mods page"
```

---

### Task 7: 最终验证与清理

- [ ] **Step 1: 完整构建验证**

Run: `bun run build`
Expected: 零错误，所有页面正确生成

- [ ] **Step 2: 格式检查**

Run: `bun run fmt:check`
Expected: 无格式问题

- [ ] **Step 3: Lint 检查**

Run: `bun run lint`
Expected: 无 lint 错误

- [ ] **Step 4: 链接检查**

手动验证所有新建页面中的相对链接（`../ml/...`、`../maplebirch/...`）指向正确的页面。

- [ ] **Step 5: 最终 Commit（如有修复）**

```bash
git add -A
git commit -m "docs: fix formatting and broken links in skills pages"
```
