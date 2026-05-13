# 战斗对话（已移除）

自框架 **v3.2.3** 起，战斗模块中的 **`maplebirch.combat.Speech`** 以及 **`maplebirch.combat.ejaculation`** 等战斗对话 / 射精宏辅助 API 已从框架中删除；原版游戏路径已可直接实现同类需求（见 [v3.2.3 发布说明](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/releases/tag/maplebirch-release-v3.2.3)）。

## 迁移建议

- 一般战斗台词：在对应 Passage 或 widget 中用 SugarCube 条件输出即可。
- 命名 NPC 的射精台词等：请按游戏原版约定自行注册 `<<widget "ejaculation-<npc>">>` 等宏，或通过 TweeReplacer / ReplacePatcher 注入，而不再通过框架战斗模块封装。
