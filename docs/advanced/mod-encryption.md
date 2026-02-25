# Mod 加密

为满足部分 Mod 作者对内容保护的需求，ModLoader 从 v2.1.0 开始提供基于 [libsodium](https://doc.libsodium.org/) 的 Mod 内容保护框架。

## 工作原理

加密 Mod 利用了 ModLoader 的**懒加载（SideLazyLoad）**特性：

1. 加密 Mod 本身是一个普通 Mod，在 `earlyload` 阶段执行
2. 在 `earlyload` 阶段请求用户输入解密密码（通过 SweetAlert2Mod 弹出对话框）
3. 使用密码解密实际的 Mod 数据
4. 将解密后的 Mod 作为懒加载 Mod 释放给 ModLoader 加载

## 相关 API

### SideLazyLoad API

v2.0.0 引入的 SideLazyLoad API 专门为 Mod 加密功能设计。加密 Mod 的解密器在 `earlyload` 阶段将解密后的 Mod zip 数据通过此 API 注入到 ModLoader 的加载队列中。

ModLoader 在 `earlyload` 执行过程中会不断调用 `tryInitWaitingLazyLoadMod()` 检查新的懒加载 Mod，并立即加载它们。

## 参考实现

### CryptoI18nMod

[CryptoI18nMod](https://github.com/Lyoko-Jeremie/CryptoI18nMod) 是 v2.0.0 版本 Mod 加密功能的 Demo，以 i18n Mod 作为范例展示加密 Mod 的完整实现。

### SimpleCryptWrapper

[SimpleCryptWrapper](https://github.com/Lyoko-Jeremie/SimpleCryptWrapperMod) 是一个简易的 Mod 加密封装工具，可以将另一个 Mod 封装为加载时需要输入解密密码的加密 Mod。主要用于保护图片资源。

## 依赖

加密 Mod 通常依赖以下组件：

- **SweetAlert2Mod** — 提供弹出对话框供用户输入密码
- **libsodium** — 密码学库，提供加解密算法

## 注意事项

:::warning
Mod 加密仅提供基础的内容保护，无法防止有技术能力的用户绕过保护。加密主要用于防止随意复制和分发受保护的 Mod 资源（如美化图片）。
:::
