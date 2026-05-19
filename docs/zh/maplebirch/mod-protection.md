# 模组保护与凭证

自 **v3.2.5** 起，框架提供完整的 **模组加密** 协作能力：框架本体**不加密**；依赖框架的其它模组如需保护，请使用配套工具生成加密壳 **`.modpack`**，由框架在运行时校验凭证并配合 ModLoader 懒加载解密后的真实模组。

## 框架本体与依赖模组

| 对象 | 是否加密 | 说明 |
| ---- | -------- | ---- |
| maplebirch 框架 | 否 | 以普通 `.mod.zip` 或发行页提供的 `.modpack` 壳分发均可；壳内仅为框架安装包，不涉及第三方 Mod 保护 |
| 依赖框架的 Mod | 可选 | 使用 [dol-mod-protection-tools](https://github.com/MaplebirchLeaf/dol-mod-protection-tools) 将原始 zip 转为 `.modpack` |

加密后的 `.modpack` **仅暴露**壳 `boot.json`、`earlyload` 解密器与 `.crypt` 分片；原始 `boot.json`、`auth.json`、脚本与资源均进入加密 payload，不会以明文留在壳包中。

## 配套工具

**[dol-mod-protection-tools](https://github.com/MaplebirchLeaf/dol-mod-protection-tools)** — 官方推荐的 Mod 保护工具，用于生成 `.modpack`、维护 `auth.json` 与密码提示等元数据。完整字段说明见其仓库 README。

**ModLoader 基础** — [Mod 加密](/ml/advanced/mod-encryption) 说明了 SideLazyLoad、`tryInitWaitingLazyLoadMod` 等与懒加载加密 Mod 相关的概念。

## 运行时流程

1. 玩家在 `earlyload` 阶段加载 `.modpack` 壳；壳内解密器向框架请求凭证验证（`maplebirch.credential`，即 `CredentialVault`）。
2. 首次加载时通过 SweetAlert2 等 UI 提示输入密码；验证通过后凭证写入 IndexedDB，后续可自动解锁。
3. 验证成功后解密真实模组并交给 ModLoader **SideLazyLoad**；关闭弹窗或验证失败时，框架会**禁用**该加密模组。

:::tip v3.2.5
凭证、guard digest 与禁用逻辑在 **v3.2.5** 与 `dol-mod-protection-tools` 对齐；集成时请声明 `maplebirch` **`>=3.2.5`**。详见 [更新日志](./changelog)。
:::

## auth.json（转换前放在 zip 根目录）

由配套工具生成，或手动放入待转换的原始 Mod zip 根目录；转换后不会明文出现在壳包中。最小配置：

```json
{
  "key": "main",
  "publicKey": "BASE64_SPKI_PUBLIC_KEY"
}
```

可选字段包括 `subject`、`name`、`prompt`、`date` 等，见 [dol-mod-protection-tools](https://github.com/MaplebirchLeaf/dol-mod-protection-tools) README。

## CredentialVault API（概念层）

框架在 `MaplebirchCore` 上暴露 **`maplebirch.credential`**，与 ModLoader 加密管线配合，**不替代** ModLoader 自身的 libsodium 加解密实现：

- 在 IndexedDB 就绪（如 `:idbReady`）后，可调用 `maplebirch.credential.prompt(modName, authConfig)` 弹出解锁 UI。
- 使用 `unlock`、`readPassword`、`guard` 等方法校验载荷、派生 guard digest 或清理失效凭据。

`AuthConfig`、`AuthPayload` 等类型以实现仓库 `src/services/CredentialVault.ts` 为准；撰写集成代码时请对照 [SCML-DOL-maplebirchFramework](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework) 与 [v3.2.5 发布说明](https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchFramework/releases/tag/maplebirch-release-v3.2.5)。
