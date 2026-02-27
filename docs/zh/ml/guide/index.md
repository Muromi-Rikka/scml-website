# 概述

`sugarcube-2-ModLoader`（以下简称 ModLoader）是为 [SugarCube2](https://www.motoslave.net/sugarcube/2/) 互动小说引擎编写的 Mod 加载与管理框架。项目初衷是为 [Degrees of Lewdity](https://gitgud.io/Vrelnir/degrees-of-lewdity) (DoL) 设计一套支持 Mod 加载和管理的完整方案，但同样适用于任何基于 SugarCube2 的游戏。

## 核心功能

### 多来源 Mod 加载

Mod 可以从四种来源加载，按加载顺序排列：

| 顺序 | 来源类型         | 说明                                               |
| ---- | ---------------- | -------------------------------------------------- |
| 1    | **local**        | 通过 `insert2html` 工具内嵌到游戏 HTML 中的 Mod    |
| 2    | **remote**       | 从 Web 服务器上的 `modList.json` 指定的远程 Mod    |
| 3    | **localStorage** | 通过浏览器 localStorage 旁加载的 Mod（有大小限制） |
| 4    | **IndexDB**      | 通过 IndexedDB 旁加载的 Mod（玩家上传的主要途径）  |

同名 Mod 存在覆盖关系：后加载的来源会覆盖先加载的同名 Mod。

### 四阶段脚本加载

ModLoader 提供四个脚本执行阶段，让 Mod 作者在启动流程的不同时机精确控制游戏数据：

- **`inject_early`** — 当前 Mod 加载后立即以 `<script>` 标签注入，仅支持同步操作
- **`earlyload`** — 在 inject_early 之后执行，支持异步操作，可读取未修改的原始数据
- **`preload`** — 在所有 Mod 数据合并到 `tw-storydata` 之后执行，可读取合并后的最终数据
- **`scriptFileList`** — 作为游戏脚本的一部分合并到 `tw-storydata` 中

### Passage / 样式 / 脚本合并

Mod 中的 `tweeFileList`、`styleFileList` 和 `scriptFileList` 内容会在 SugarCube2 引擎读取数据之前，合并到网页 HTML 的 `tw-storydata` DOM 节点中。这保证了 Mod 安装后内存中的数据格式与直接修改网页 HTML 完全一致。

### Mod 间通信

- **AddonPlugin 系统**：Mod 可以注册为 Addon 插件，其他 Mod 通过 `boot.json` 中的 `addonPlugin` 字段声明依赖并交互
- **ModInfo.modRef 机制**：任意 Mod 可以通过 `modRef` 属性暴露自己的 API，其他 Mod 通过 `modUtils.getMod()` 获取并调用

### 依赖检查

Mod 可在 `boot.json` 的 `dependenceInfo` 中声明对以下目标的版本约束，详见[依赖检查](./dependency-checking)：

- 其他 Mod（普通依赖）
- ModLoader 自身版本
- 游戏版本（如 DoL 的版本号）

版本号遵循[语义化版本控制规范](https://semver.org/lang/zh-CN/)，使用 [semver](https://www.npmjs.com/package/semver) 进行校验。

### 安全模式

若 ModLoader 连续三次加载失败，在下次启动时会自动进入安全模式，禁用所有 Mod。用户可以在此状态下正常打开 Mod 管理器，卸载导致故障的 Mod。

## 下载

- 预编译版 ModLoader：[ModLoader/actions](https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/actions)
- 附带 ModLoader 的自动构建版 DoL：[DoLModLoaderBuild](https://github.com/Lyoko-Jeremie/DoLModLoaderBuild/releases)

## 三种修改游戏的方法

ModLoader 基于对 SugarCube2 引擎工作原理的深入分析，支持三种修改游戏的途径：

1. **修改 `tw-storydata`**：在 SC2 编译前修改 HTML 中的游戏脚本节点，使引擎认为游戏本来就是这样的。由 [TweeReplacer](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_TweeReplacer) 和 [ReplacePatch](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_ReplacePatch) 等 Addon 实现。

2. **参与编译过程**：通过对 SC2 Wikifier 的侵入性修改，挂钩并拦截编译引擎的输入输出。由 [TweePrefixPostfixAddonMod](https://github.com/Lyoko-Jeremie/TweePrefixPostfixAddonMod) 实现。

3. **修改渲染后的 HTML**：监听 SC2 的 passage 渲染完成事件，在显示后立即修改 HTML 内容。
