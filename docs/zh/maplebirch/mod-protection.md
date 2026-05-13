# 模组保护与凭证

自 **v3.2.3** 起，框架在 `MaplebirchCore` 上暴露 **`maplebirch.credential`**（`CredentialVault`），用于在 IndexedDB 中安全保存模组解锁密码、校验授权载荷、以及在需要时为解密流程提供 **guard digest** 等能力。该服务与 ModLoader 的 SideLazyLoad / 加密管线配合使用，而不是单独替代 ModLoader 的加密实现。

## 与工具链的关系

- **[dol-mod-protection-tools](https://github.com/MaplebirchLeaf/dol-mod-protection-tools)**：官方推荐的配套工具，用于生成与维护受保护模组、密码提示与元数据。
- **ModLoader 文档**：[Mod 加密](/ml/advanced/mod-encryption) 说明了 SideLazyLoad、`tryInitWaitingLazyLoadMod` 等与加密 Mod 加载相关的基础概念。

## 典型用法（概念层）

1. 在 `earlyload` 或框架事件（如 `:idbReady`）之后，当需要向玩家索取凭据时，调用 `maplebirch.credential.prompt(modName, authConfig)`（需满足 SweetAlert2 等 UI 依赖，详见上游实现）。
2. 使用 `unlock` / `readPassword` / `guard` 等方法在本地校验、派生摘要或清理失效凭据。

具体字段（`AuthConfig`、`AuthPayload` 等）以实现仓库中的 TypeScript 类型为准；撰写集成代码时请直接参考 [SCML-DOL-maplebirchFramework](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework) 中 `src/services/CredentialVault.ts` 与发行说明。
