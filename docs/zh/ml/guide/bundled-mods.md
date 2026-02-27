# 内置 Mod 与子模块

ModLoader 将与核心功能无关的功能分离为独立的 Mod，并将常用 Mod 以预置的方式提供。这些 Mod 在 `modList.json` 中定义，作为 Git 子模块位于 `mod/` 目录下，通过 `insert2html` 打包时作为 **local** 类型嵌入到游戏 HTML 中。本列表与 [sugarcube-2-ModLoader README](https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader) 保持一致。

## 核心基础设施

| Mod                                                                       | 状态   | 功能                                                              |
| ------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------- |
| [ModLoaderGui](https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoaderGui) | Usable | Mod 管理器界面，管理加载顺序、启用/禁用 Mod、查看加载日志         |
| [ConflictChecker](https://github.com/Lyoko-Jeremie/ConflictCheckerAddon)  | Stable | Mod 冲突检查器，提供附加约束条件检查 Mod 间的冲突                 |
| [SweetAlert2Mod](https://github.com/Lyoko-Jeremie/SweetAlert2Mod)         | Stable | 弹出提示框封装，基于 [SweetAlert2](https://sweetalert2.github.io) |
| [ModSubUiAngularJs](https://github.com/Lyoko-Jeremie/ModSubUiAngularJs)   | Stable | 基于 AngularJS 的可复用 UI 组件框架                               |

## Twee 内容操作

| Mod                                                                                  | 状态       | 功能                                                |
| ------------------------------------------------------------------------------------ | ---------- | --------------------------------------------------- |
| [TweeReplacer](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_TweeReplacer) | Stable     | Passage 替换，支持正则表达式和文件存储替换字符串    |
| [I18nTweeReplacer](https://github.com/Lyoko-Jeremie/I18nTweeReplacerMod)             | Stable     | TweeReplacer 的原生 i18n 支持版                     |
| [TweeReplacerLinker](https://github.com/Lyoko-Jeremie/TweeReplacerLinkerAddon)       | Stable     | 链接 TweeReplacer 和 I18nTweeReplacer，共享替换顺序 |
| [ReplacePatch](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_ReplacePatch) | Stable     | 提供对 JS/CSS/Passage 的简单字符串替换              |
| [TweePrefixPostfixAddon](https://github.com/Lyoko-Jeremie/TweePrefixPostfixAddonMod) | Developing | 提供在 Passage/Widget 执行前后挂钩的能力            |
| [Diff3WayMerge](https://github.com/Lyoko-Jeremie/Mod_Diff3WayMerge)                  | Developing | 基于 Git Diff3Way 算法的 Passage 合并功能           |

## 图片与 UI

| Mod                                                                                | 状态       | 功能                                        |
| ---------------------------------------------------------------------------------- | ---------- | ------------------------------------------- |
| [ImageLoaderHook](https://github.com/Lyoko-Jeremie/DoL_ImgLoaderHooker)            | Stable     | 拦截图片请求，从 Mod zip 中替换游戏图片     |
| [BeautySelectorAddon](https://github.com/Lyoko-Jeremie/DoL_BeautySelectorAddonMod) | Stable     | 同一 Mod 中内置多组美化图片并支持运行时切换 |
| [ModuleCssReplacer](https://github.com/Lyoko-Jeremie/DoL_ModuleCssReplacerAddon)   | Deprecated | CSS 替换器（有重大性能问题，请勿使用）      |

## i18n 国际化

| Mod                                                                       | 状态   | 功能                               |
| ------------------------------------------------------------------------- | ------ | ---------------------------------- |
| [I18nTweeList](https://github.com/Lyoko-Jeremie/I18nTweeListAddonMod)     | Stable | 为 `tweeFileList` 提供 i18n 支持   |
| [I18nScriptList](https://github.com/Lyoko-Jeremie/I18nScriptListAddonMod) | Stable | 为 `scriptFileList` 提供 i18n 支持 |

## DoL 专用钩子

| Mod                                                                                                                      | 状态   | 功能                                               |
| ------------------------------------------------------------------------------------------------------------------------ | ------ | -------------------------------------------------- |
| [CheckGameVersion](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_CheckGameVersion)                             | Stable | 为依赖检查中的游戏版本检查提供 DoL 适配            |
| [CheckDoLCompressorDictionaries](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_CheckDoLCompressorDictionaries) | Stable | 检查 DoL 数据压缩字典变更并警告用户                |
| [DoLHookWidgetMod](https://github.com/Lyoko-Jeremie/DoLHookWidgetMod)                                                    | Stable | 给 DoL 自定义 Widget 打 TweePrefixPostfix 所需补丁 |
| DoLTimeWrapperAddon                                                                                                      | —      | DoL 时间包装器钩子                                 |
| DoLLinkButtonFilter                                                                                                      | —      | DoL 链接/按钮过滤器                                |

## 游戏内容插件

| Mod                                                                           | 状态   | 功能                 |
| ----------------------------------------------------------------------------- | ------ | -------------------- |
| [ModdedClothesAddon](https://github.com/Lyoko-Jeremie/DoL_ModdedClothesAddon) | Stable | DoL 快速服装添加工具 |
| [ModdedFeatsAddon](https://github.com/Lyoko-Jeremie/DoL_ModdedFeatsAddon)     | Stable | DoL 快速成就添加工具 |
| [ModdedHairAddon](https://github.com/Lyoko-Jeremie/DoL_ModdedHairAddon)       | Stable | DoL 快速发型添加工具 |

## 外部 Mod 与工具

| Mod                                                                               | 类型     | 状态   | 功能                                                                   |
| --------------------------------------------------------------------------------- | -------- | ------ | ---------------------------------------------------------------------- |
| [PhoneDebugToolsEruda](https://github.com/Lyoko-Jeremie/PhoneDebugToolsErudaMod)  | External | Stable | 手机调试工具，对 [Eruda](https://github.com/liriliri/eruda) 的简单封装 |
| [i18n](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_i18nMod)           | External | Stable | i18n 中文翻译 Mod                                                      |
| [CryptoI18n](https://github.com/Lyoko-Jeremie/CryptoI18nMod)                      | Example  | Demo   | v2.0.0 Mod 加密功能 Demo                                               |
| [ExampleModModifyMod](https://github.com/Lyoko-Jeremie/ExampleModModifyMod)       | Example  | Demo   | 演示如何用 Mod B 读取并修改 Mod A 的数据和行为                         |
| [SimpleCryptWrapper](https://github.com/Lyoko-Jeremie/SimpleCryptWrapperMod)      | Tools    | Stable | 简易 Mod 加密封装工具                                                  |
| [DoLModWebpackExampleTs](https://github.com/Lyoko-Jeremie/DoLModWebpackExampleTs) | Template | Demo   | 使用 Webpack + TypeScript 的 Mod 模板项目                              |
| [DoLModWebpackExampleJs](https://github.com/Lyoko-Jeremie/DoLModWebpackExampleJs) | Template | Demo   | 使用 Webpack + JavaScript 的 Mod 模板项目                              |

:::info
有关各个 Mod 的详细功能及用法，请参见对应 Mod 项目的 README.md 文件。
:::
