# 战斗反应（已移除）

自框架 **v3.2.3** 起，战斗模块中的 **`maplebirch.combat.Reaction`** 以及基于该 API 的「异装 / 双性」等反应对话注册能力已从框架中删除（与上游 [v3.2.3 发布说明](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/releases/tag/maplebirch-release-v3.2.3) 一致）。当前 `CombatManager` 仅保留 **[战斗按钮](./actions)** 相关能力（`maplebirch.combat.CombatAction`）。

## 迁移建议

- 若仅需在战斗中展示对话或条件文本，请使用游戏原版战斗 Passage、SugarCube 宏或 `<<run>>` / `<<print>>` 等在合适钩子中自行组织逻辑。
- 仍依赖框架的命名 NPC、动态事件等能力时，请继续使用 `maplebirch.npc`、`maplebirch.dynamic` 等模块，与战斗反应无绑定关系。
