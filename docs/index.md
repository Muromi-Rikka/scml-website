---
pageType: home

hero:
  name: ModLoader
  text: SugarCube-2 Mod 加载框架
  tagline: 为 SugarCube2 互动小说引擎设计的模组加载与管理框架
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/
    - theme: alt
      text: GitHub
      link: https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader
features:
  - title: 多来源 Mod 加载
    details: 支持从 HTML 内嵌、远程服务器、localStorage 和 IndexedDB 四种来源加载 Mod，后加载的同名 Mod 自动覆盖先加载的。
    icon: 📦
  - title: 四阶段脚本加载
    details: 提供 inject_early、earlyload、preload 和 scriptFileList 四个脚本加载阶段，让 Mod 作者在不同时机精确控制游戏数据。
    icon: ⚡
  - title: Passage / 样式 / 脚本合并
    details: Mod 的 tweeFileList、styleFileList 和 scriptFileList 在 SugarCube2 读取数据前合并到 tw-storydata 节点中。
    icon: 🔀
  - title: Mod 间通信
    details: 通过 AddonPlugin 系统和 ModInfo.modRef 机制，Mod 之间可以相互暴露 API 并进行交互。
    icon: 🔗
  - title: 依赖检查
    details: Mod 可在 boot.json 中声明对其他 Mod、ModLoader 版本和游戏版本的依赖约束，加载时自动校验。
    icon: ✅
  - title: 安全模式
    details: 连续三次加载失败后自动进入安全模式，禁用所有 Mod 以便恢复，防止故障 Mod 导致游戏无法启动。
    icon: 🛡️
---
## 快速链接

- [示例 Mod 教程](/creating-mods/example-walkthrough) — 从零创建一个功能 Mod 的完整步骤
- [ModPack 格式](/creating-mods/modpack-format) — 了解 .modpack 二进制格式
