# 版本历史

本站文档以 **[maplebirch-release-v3.2.5](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/releases/tag/maplebirch-release-v3.2.5)** 为当前推荐最低框架版本。完整历史见上游 [UPDATE.md](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/blob/main/UPDATE.md)。

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

### 文档相关

- [模组保护与凭证](./mod-protection) — 对齐上游 README 加密流程
- [模块系统](./module-system) — 生命周期、`dependencyGraph`、EXPOSED 模块说明

## 更早版本

请参阅上游 [UPDATE.md](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/blob/main/UPDATE.md) 中的 v3.1.x、v3.0.x 及更早条目。本站正文不再单独维护各历史小版本的兼容说明。
