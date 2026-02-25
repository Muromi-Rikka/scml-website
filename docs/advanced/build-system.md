# 构建系统

本文介绍如何编译 ModLoader 本体、将 ModLoader 注入到游戏 HTML 中、以及如何将预置 Mod 嵌入到 HTML 中。

:::info
如果仅制作 Mod，只需按照[打包方法](../creating-mods/packaging)打包 Mod 即可通过 Mod 管理器加载。以下内容针对 ModLoader 开发者和需要打包自定义游戏整合包的用户。
:::

## 编译 ModLoader

### 编译脚本

```bash
yarn run webpack:BeforeSC2
yarn run ts:ForSC2
yarn run webpack:insertTools
```

编译后会生成以下关键文件：
- `dist-BeforeSC2/BeforeSC2.js` — ModLoader 核心
- `dist-insertTools/insert2html.js` — HTML 注入工具
- `dist-insertTools/packModZip.js` — Mod 打包工具
- `dist-insertTools/sc2ReplaceTool.js` — SC2 引擎替换工具

## 注入 ModLoader 到游戏 HTML

### 编写 modList.json

`modList.json` 声明需要嵌入到 HTML 中的预置 Mod 列表：

```json
[
  "mod1.zip",
  "mod2.zip"
]
```

路径格式支持多种写法：

```json5
[
  "aaa.mod.zip",                      // 从 HTML 同目录加载
  "/rrr.mod.zip",                     // 从 Web 服务器根目录加载
  "./ddd/ccc.mod.zip",                // 从 HTML 所在目录下的子目录加载
  "../../uuu.mod.zip",                // 从上级目录加载
  "http://aaa.bbb.ccc/mmm.mod.zip"   // 从指定网站加载
]
```

### 执行注入

切换到 `modList.json` 所在目录，执行：

```bash
node "<insert2html.js 路径>" "<游戏 HTML 路径>" "<modList.json 路径>" "<BeforeSC2.js 路径>"
```

示例：

```bash
node "dist-insertTools/insert2html.js" "Degrees of Lewdity VERSION.html" "modList.json" "dist-BeforeSC2/BeforeSC2.js"
```

会在原始 HTML 同目录下生成 `.mod.html` 文件：

```
Degrees of Lewdity VERSION.html.mod.html
```

## modList.json 的设计

`modList.json` 在不同场景下的作用：

| 使用场景 | 说明 |
|---------|------|
| **整合包作者** | 在打包时指定自定义 `modList.json`，将想要的 Mod 全部打包进 HTML（local） |
| **Web 服务器** | 在服务器上与 HTML 同目录放置 `modList.json`，启动时由 `RemoteLoader` 加载（remote） |
| **终端用户** | 打开游戏后自动获得 local + remote 的 Mod，还可通过 Mod 管理器上传自己的 Mod（IndexDB） |

## 完整打包流程

从零开始打包一个带 ModLoader 的游戏：

**1.** 构建修改版 SC2 引擎

在 [sugarcube-2_Vrelnir](https://github.com/Lyoko-Jeremie/sugarcube-2_Vrelnir) 项目中执行：

```bash
node build.js -d -u -b 2
```

编译结果位于 `build/twine2/sugarcube-2/format.js`。

**2.** 替换游戏引擎

将 `format.js` 覆盖游戏项目的 `devTools/tweego/storyFormats/sugarcube-2/format.js`，然后编译游戏获得带 ModLoader 引导点的 HTML 文件。

**3.** 注入 ModLoader

使用 `insert2html.js` 将 ModLoader 注入到游戏 HTML 中（同时嵌入 `modList.json` 中的预置 Mod）。

## CI/CD 自动构建

项目使用 GitHub Actions 实现自动编译：

- [修改版 SC2 引擎](https://github.com/Lyoko-Jeremie/sugarcube-2_Vrelnir/actions) — 预编译版，已注入 ModLoader 引导点
- [ModLoader 及工具](https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader/actions) — ModLoader 本体、packModZip.js、insert2html.js 及 Addon
- [DoL 自动构建](https://github.com/Lyoko-Jeremie/DoLModLoaderBuild/actions) — 包含 ModLoader 和 Addon 的原版 DoL 游戏
