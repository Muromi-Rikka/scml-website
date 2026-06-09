# 版本历史

本站文档以 **[maplebirch-release-v4.0.2](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/releases/tag/maplebirch-release-v4.0.2)** 为当前推荐最低框架版本。完整历史见上游 [UPDATE.md](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/blob/main/UPDATE.md)。

## v4.0.2

发布标签：[maplebirch-release-v4.0.2](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/releases/tag/maplebirch-release-v4.0.2)
推荐资产：`maplebirch-0.5.10.8-v4.0.2.modpack`

:::tip
v4.0.0 累积自 v3.1.14，框架版本升至 4.0.0，最高游戏版本依赖更新至 0.5.10.8。
:::

### 主要变更

**类型包**
- 新增可发布的 `@scml-maplebirch/types` 类型包，含 `maplebirch`、`SugarCube` 及全局声明

**时间与 DateTime**
- 重写时间/日期补丁逻辑，减少时间推进、时间事件与 `DoLTimeWrapperAddon` 之间的冲突 — 见 [时间事件](./dynamic/time-events)
- 修复 `TimeEvent` 兼容接口及跨 passage 时间回滚问题

**数据库**
- 修复 IDB 版本低于已有数据库时的加载挂起；版本降级时自动重置

**简易框架兼容**
- 简化旧式兼容层，仅保留 `addto` 与 `TimeEvent`

**模块管理**
- 优化注册、依赖执行和启用/禁用逻辑 — 见 [模块系统](./module-system)
- 模组设置新增 **重置框架默认设置** — 见 [GUI 控制](./gui-settings)

**食物与古董注册**
- 添加 **食物注册**（0.5.9.x+）与 **古董注册** — 见 [食物注册](./tool-collection/foodstuff)、[古董注册](./tool-collection/antiques)

**战斗系统重构**
- 战斗按钮重构为 `maplebirch.combat.CombatAction`，新增 `effect` 字段支持 Twine 文本/函数注入 `effectsman` — 见 [战斗按钮](./combat/actions)
- 旧式战斗反应、射精、异装对话模块不再独立维护

**NPC 系统**
- 修复 NPC 描述、性别代词及身体部位描述
- 优化 NPC 日程注册 — 见 [NPC 日程](./named-npc/npc-schedule)
- 更新 NPC 服装文档，额外服装文件应使用 `loadWardrobe` — 见 [NPC 服装](./named-npc/npc-clothes)
- 修复 NPC 侧边栏人模、遮罩及帽子特写问题 — 见 [NPC 侧边栏](./named-npc/npc-sidebar)
- 新增 **NPC 转化** — 见 [NPC 转化](./named-npc/npc-transformation)
- 新增 **NPC 体液图层** — 见 [NPC 体液](./named-npc/npc-fluids)
- 新增 **NPC 怀孕**（含种族注册、单 NPC 配置、孩子出生、转化数据）— 见 [NPC 怀孕](./named-npc/npc-pregnancy)

**角色与侧边栏**
- 遮罩新增旋转角度支持
- PC 转化注册可指定目标画布（如战斗画布）— 见 [角色渲染](./character/)、[转化系统](./character/transformation)

**时间旅行作弊**
- 新增/增强 **时间旅行作弊**，支持按年/月/日/时/分跳转，确认后直接刷新当前页面

**SugarCube 宏**
- 重构宏实现，`<<lanButton>>`/`<<lanLink>>` 增强 `class:`/`style:` 参数 — 见 [SugarCube 宏](./sugar-cube-macro)

**工具函数**
- 推荐使用原型/静态方法：`source.clone()`、`Object.merge()`、`list.contains()`、`Math.clamp()` 等 — 见 [工具函数](./tool-collection/utils)
- 全局函数仍挂载于 `window`

**音频模块**
- 拆分 `Track`、`Playlist`、`AudioBufferPlayer` 内部结构 — 见 [音频管理](./audio)

**模组保护**
- 提供 **模组加密** 功能 — 见 [模组保护与凭证](./mod-protection)

**云存档**
- 新增 **云存档** 客户端与服务端示例（Go + SQLite / Cloudflare R2+WebDAV）— 见 [云存档](./cloud-save)

### 文档相关

- [NPC 怀孕](./named-npc/npc-pregnancy) — 全新怀孕系统文档
- [NPC 转化](./named-npc/npc-transformation) — 全新转化系统文档
- [NPC 体液](./named-npc/npc-fluids) — 全新体液图层文档
- [云存档](./cloud-save) — 全新云存档服务文档
- [战斗按钮](./combat/actions) — 新增 `effect` 字段与 `effectsman` 注入说明
- [音频管理](./audio) — 重写 API 文档，拆分内部结构
- [工具函数](./tool-collection/utils) — 重写为原型/静态方法风格
- [食物注册](./tool-collection/foodstuff)、[古董注册](./tool-collection/antiques) — 补充侧边栏入口

## v3.2.5

发布标签：[maplebirch-release-v3.2.5](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/releases/tag/maplebirch-release-v3.2.5)  
推荐资产：`maplebirch-0.5.9.7-v3.2.5.modpack`

### 主要变更

- 修复 **NPC 侧边栏** 人模等错误
- 删除战斗模块的 **战斗反应**、**战斗射精**、**异装对话**（原版已可直接实现）— 见 [战斗反应](./combat/reaction)、[战斗对话](./combat/speech)
- 在 **游戏版本 0.5.9.7** 下简化 **简易框架** 兼容维护（保留 `addto` 与 `TimeEvent`）— 见 [快速开始](./getting-started)
- 优化 **模块管理** 的注册与使用 — 见 [模块系统](./module-system)
- 修复 **时间事件** 在 0.5.9.7 上的错误 — 见 [时间事件](./dynamic/time-events)
- 优化 **NPC 日程** 注册逻辑 — 见 [NPC 日程](./named-npc/npc-schedule)
- 模组设置中新增 **重置框架默认设置** — 见 [GUI 控制](./gui-settings)
- 提供 **模组加密** 协作能力（`.modpack` + `maplebirch.credential`）— 见 [模组保护与凭证](./mod-protection)
- 添加 **食物注册**（`maplebirch.tool.patch.addFoodstuff`，0.5.9.x 以上版本可用）以及 **古董注册**（`maplebirch.tool.patch.addAntiques`）功能 — 见 [食物注册](./tool-collection/foodstuff)、[古董注册](./tool-collection/antiques)
- 将 `maplebirch.tool.other` 重构为 `maplebirch.tool.patch`，原有特质、地点、纹身 API 路径同步更新
- `boot.json` 的 `framework` 字段新增 `foodstuff`、`antiques`、`bodywriting` 的外部文件引用支持

### 文档相关

- [模组保护与凭证](./mod-protection) — 对齐上游 README 加密流程
- [模块系统](./module-system) — 生命周期、`dependencyGraph`、EXPOSED 模块说明
- [食物注册](./tool-collection/foodstuff) — 新增食物注册 API 文档
- [古董注册](./tool-collection/antiques) — 新增古董注册 API 文档
- [纹身系统](./tool-collection/bodywriting) — 新增 boot.json 配置说明

## 更早版本

请参阅上游 [UPDATE.md](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/blob/main/UPDATE.md) 中的 v3.1.x、v3.0.x 及更早条目。本站正文不再单独维护各历史小版本的兼容说明。
