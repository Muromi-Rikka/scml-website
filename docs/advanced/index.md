# 高级主题

本章涵盖 ModLoader 的高级功能和底层实现细节，适合 ModLoader 贡献者和需要深度定制的高级 Mod 作者。

## 内容

- [构建系统](./build-system) — 如何编译 ModLoader 本体以及将 Mod 注入到游戏 HTML 中
- [Insert Tools](./insert-tools) — insert2html、packModZip、sc2ReplaceTool 等工具的用途与用法
- [CI/CD 构建流水线](./ci-cd) — GitHub Actions 及各仓库的构建产物
- [定制 SC2 引擎](./sc2-engine) — 了解 ModLoader 对 SugarCube2 引擎的修改及如何替换引擎
- [Mod 加密](./mod-encryption) — 基于 libsodium 的 Mod 内容保护框架
