# SCML Mod 开发技能

本技能帮助 AI 助手为 SugarCube-2 ModLoader (SCML) 游戏创建和调试 Mod。适用于所有基于 SC2 的游戏，主要面向 Degrees of Lewdity (DoL)。

## 适用场景

当你需要以下操作时，此技能会自动触发：

- 创建新的 Mod 并生成 `boot.json`
- 选择合适的脚本加载阶段
- 使用 AddonPlugin 依赖其他 Mod
- 使用 ModUtils API 进行 Mod 间通信
- 替换 Passage 或图片内容
- 打包 `.mod.zip` 文件
- 排查 Mod 加载问题

## 快速开始

### 1. 创建 Mod 目录结构

```
MyMod/
├── boot.json
├── readme.txt
├── MyMod_style.css          (样式)
├── MyMod_script.js          (主脚本)
├── MyMod_passage.twee       (Passage)
└── MyMod_Image/             (图片)
    └── character/
        └── avatar.png
```

### 2. 编写 boot.json

```json
{
  "name": "MyMod",
  "version": "1.0.0",
  "styleFileList": ["MyMod_style.css"],
  "scriptFileList": ["MyMod_script.js"],
  "tweeFileList": ["MyMod_passage.twee"],
  "imgFileList": ["MyMod_Image/character/avatar.png"],
  "additionFile": ["readme.txt"],
  "dependenceInfo": [],
  "addonPlugin": []
}
```

### 3. 打包

将所有文件（不含外层文件夹）压缩为 `.mod.zip` 格式。`boot.json` 必须位于 zip 根目录。

:::tip
详见 [创建 Mod](../ml/creating-mods) 完整教程。
:::

## 脚本阶段选择

| 需求                                | 阶段           | boot.json 字段                |
| ----------------------------------- | -------------- | ----------------------------- |
| 注册 Addon、暴露 modRef、同步初始化 | `inject_early` | `scriptFileList_inject_early` |
| 异步初始化、读取原始数据、解密      | `earlyload`    | `scriptFileList_earlyload`    |
| 读取合并后的数据、修改 Passage      | `preload`      | `scriptFileList_preload`      |
| 普通游戏脚本、宏、游戏逻辑          | 主脚本         | `scriptFileList`              |

:::warning
`earlyload` 和 `preload` 脚本使用 IIFE 格式：

```js
(async () => {
  // 你的代码
})();
```

详见 [脚本加载阶段](../ml/creating-mods/script-stages)。
:::

## boot.json 要点

**必需字段**（即使为空也必须存在）：

| 字段             | 类型     | 说明           |
| ---------------- | -------- | -------------- |
| `name`           | string   | Mod 名称       |
| `version`        | string   | 语义版本号     |
| `styleFileList`  | string[] | CSS 文件列表   |
| `scriptFileList` | string[] | 主脚本文件列表 |
| `tweeFileList`   | string[] | Twee 文件列表  |
| `imgFileList`    | string[] | 图片文件列表   |

**AddonPlugin 依赖：**

```json
{
  "addonPlugin": [
    {
      "modName": "TweeReplacer",
      "addonName": "tweeReplacer",
      "modVersion": "1.0.0",
      "params": []
    }
  ]
}
```

详见 [boot.json 完整参考](../ml/creating-mods/boot-json)。

## 内置 Mod 与 Addon

| Addon               | 用途                      | boot.json 配置               |
| ------------------- | ------------------------- | ---------------------------- |
| TweeReplacer        | Passage 替换              | `addonName: "tweeReplacer"`  |
| ReplacePatch        | JS/CSS/Passage 字符串替换 | `addonName: "replacePatch"`  |
| ImageLoaderHook     | 图片替换                  | `addonName: "imgLoaderHook"` |
| BeautySelectorAddon | 多组美化图片切换          | `addonName: "bsaAddon"`      |

详见 [内置 Mod 与子模块](../ml/guide/bundled-mods)。

## API 速查

### ModUtils (`window.modUtils`)

```js
// 查询 Mod
window.modUtils.getModListName(); // 所有已加载 Mod 名称
window.modUtils.getMod("MyMod"); // 获取 Mod 信息
window.modUtils.getNowRunningModName(); // 当前运行 Mod 名称

// 暴露 API
const info = window.modUtils.getMod(myName);
info.modRef = { doThing: () => {} };
```

### 生命周期钩子

| 钩子                     | 触发时机                |
| ------------------------ | ----------------------- |
| `afterInjectEarlyLoad`   | inject_early 脚本执行后 |
| `afterEarlyLoad`         | 所有 earlyload 完成后   |
| `afterRegisterMod2Addon` | Mod 到 Addon 注册完成后 |
| `beforePatchModToGame`   | 数据合并到游戏之前      |
| `afterPatchModToGame`    | 数据合并到游戏之后      |
| `ModLoaderLoadEnd`       | ModLoader 加载完成      |

详见 [ModUtils 参考](../ml/api/mod-utils)、[生命周期钩子](../ml/api/lifecycle-hooks)、[AddonPlugin 系统](../ml/api/addon-plugin)。

## Twee 文件格式

```
:: PassageName [tag1 tag2]
Passage 内容。
链接使用 [[显示文本->目标 Passage]] 语法。
```

同名 Passage 会**覆盖**原游戏内容。多个 Mod 同名 Passage：后加载的优先。

## 常见陷阱

- **boot.json 不在 zip 根目录** — 直接打包文件，不要打包包含文件的文件夹
- **路径大小写不匹配** — boot.json 中的路径必须与 zip 内路径完全一致（区分大小写）
- **earlyload/preload 未使用 IIFE** — 必须使用 `(async () => { ... })()` 格式
- **在 inject_early 中执行异步操作** — 此阶段不支持 async，不会被 await
- **过早调用其他 Mod 的 modRef** — 使用 preload 或更晚阶段进行跨 Mod 调用
- **图片路径冲突** — 使用唯一的、带命名空间的路径
