# 构建系统

本文概述 ModLoader 的构建流程。若仅制作 Mod，请参考[打包方法](../creating-mods/packaging)。以下内容针对 ModLoader 开发者和需要打包自定义游戏整合包的用户。

## 快速导航

- [Insert Tools 工具集](./insert-tools) — insert2html、packModZip、sc2ReplaceTool、sc2PatchTool 的用途、参数和示例
- [CI/CD 构建流水线](./ci-cd) — GitHub Actions 流程及各仓库的构建产物
- [定制 SC2 引擎](./sc2-engine) — 引擎修改内容及不重新编译直接替换引擎的方法

## 编译 ModLoader

```bash
yarn run webpack:BeforeSC2
yarn run ts:ForSC2
yarn run webpack:insertTools
```

编译后会生成：

- `dist-BeforeSC2/BeforeSC2.js` — ModLoader 核心
- `dist-insertTools/insert2html.js` — HTML 注入工具
- `dist-insertTools/packModZip.js` — Mod 打包工具
- `dist-insertTools/sc2ReplaceTool.js` — SC2 引擎替换工具

详见 [Insert Tools](./insert-tools)。

## 完整打包流程概览

1. **构建修改版 SC2 引擎** — 在 [sugarcube-2_Vrelnir](https://github.com/Lyoko-Jeremie/sugarcube-2_Vrelnir) 中执行 `node build.js -d -u -b 2`，获得 `format.js`
2. **替换游戏引擎** — 用 `format.js` 覆盖游戏项目的 `devTools/tweego/storyFormats/sugarcube-2/format.js`，或使用 [sc2ReplaceTool](./insert-tools) 替换到已编译 HTML
3. **注入 ModLoader** — 使用 [insert2html](./insert-tools#insert2htmljs) 将 ModLoader 注入到游戏 HTML 中，并嵌入 `modList.json` 中的 Mod
