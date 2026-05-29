# Maplebirch 框架技能

本技能帮助 AI 助手使用 **maplebirchFramework** 为 Degrees of Lewdity (DoL) 创建 Mod。框架提供稳定的附加接口，无需直接修改原版游戏文件。

## 适用场景

当你需要以下操作时，此技能会自动触发：

- 使用 maplebirchAddon 配置 boot.json
- 注册命名 NPC（外观、属性、日程、侧边栏）
- 添加战斗动作按钮
- 管理音频播放
- 注册动态事件（时间/状态/天气）
- 使用多语言宏（`<<language>>`、`<<lanSwitch>>` 等）
- 注册角色渲染图层
- 使用工具集合（特质、地点、纹身、食物、古董）
- 扩展模块系统

## 快速开始

### 1. 创建 Mod 目录结构

```
MyMaplebirchMod/
├── boot.json
├── mymod.js
├── translations/
│   ├── cn.json
│   └── en.json
├── audio/          (可选)
│   └── bgm.mp3
└── img/            (可选)
    └── face/
```

### 2. 编写 boot.json

```json
{
  "name": "MyMaplebirchMod",
  "version": "1.0.0",
  "scriptFileList": [],
  "styleFileList": [],
  "tweeFileList": [],
  "imgFileList": [],
  "additionFile": [],
  "dependenceInfo": [
    { "modName": "GameVersion", "version": ">=0.5.9.7" },
    { "modName": "maplebirch", "version": ">=3.2.5" }
  ],
  "addonPlugin": [
    {
      "modName": "maplebirch",
      "addonName": "maplebirchAddon",
      "modVersion": "^3.2.0",
      "params": {
        "script": ["mymod.js"],
        "language": true
      }
    }
  ]
}
```

### 3. 验证框架加载

```js
if (window.maplebirch) {
  console.log("maplebirch version:", window.maplebirch.meta.version);
} else {
  console.error("maplebirch framework not loaded");
}
```

## addonPlugin 参数速查

| 参数        | 类型                            | 说明                                      |
| ----------- | ------------------------------- | ----------------------------------------- |
| `script`    | `string[]`                      | 主脚本文件（推荐，框架完全初始化后执行）  |
| `module`    | `string[]`                      | 早期脚本（inject_early 后立即执行，慎用） |
| `language`  | `boolean \| string[] \| object` | 翻译文件配置                              |
| `audio`     | `boolean \| string[]`           | 音频文件配置                              |
| `npc`       | `object`                        | NPC 注册（NamedNPC、Stats、Sidebar）      |
| `framework` | `object \| object[]`            | 特质、地点、纹身、食物、古董、区域注入    |

详见 [AddonPlugin 系统](../maplebirch/addon-plugin)。

## 核心 API 速查

### 模块访问路径

| 访问路径             | 说明                                    |
| -------------------- | --------------------------------------- |
| `maplebirch.tool`    | 工具集合（随机、宏、HTML、区域、Patch） |
| `maplebirch.var`     | 变量管理与迁移                          |
| `maplebirch.char`    | 角色渲染图层系统                        |
| `maplebirch.npc`     | 命名 NPC 系统                           |
| `maplebirch.audio`   | 音频播放与管理                          |
| `maplebirch.combat`  | 战斗系统                                |
| `maplebirch.dynamic` | 动态事件（时间/状态/天气）              |

### 服务

| 访问路径            | 说明       |
| ------------------- | ---------- |
| `maplebirch.tracer` | 事件总线   |
| `maplebirch.logger` | 日志服务   |
| `maplebirch.lang`   | 国际化翻译 |

### 事件系统

```js
maplebirch.on(eventName, callback, description?)
maplebirch.off(eventName, identifier)
maplebirch.once(eventName, callback, description?)
maplebirch.after(eventName, callback)
maplebirch.trigger(eventName, ...args)
```

常用事件：`:passagestart`、`:passageend`、`:storyready`、`:onSave`、`:onLoad`、`:language`

### 日志

```js
maplebirch.log(message, level?)  // level: "DEBUG" | "INFO" | "WARN" | "ERROR"
const log = maplebirch.tool.createlog("mymod")
log("message", "INFO")  // [maplebirch][INFO] [mymod] message
```

详见 [核心服务](../maplebirch/services)、[事件发射器](../maplebirch/event-emitter)、[模块系统](../maplebirch/module-system)。

## NPC 注册

### JS API

```js
maplebirch.npc.add(
  { nam: "Luna", gender: "f", title: "Moon Witch", age: 25, ... },
  { love: { maxValue: 100 }, important: true },
  translations,  // 可选 Map
);
```

### boot.json 声明式

```json
{
  "npc": {
    "NamedNPC": [
      [
        { "nam": "Luna", "gender": "f", "title": "Moon Witch" },
        { "love": { "maxValue": 100 }, "important": true },
        { "Luna": { "EN": "Luna", "CN": "露娜" } }
      ]
    ]
  }
}
```

详见 [NPC 注册](../maplebirch/named-npc/)、[NPC 状态](../maplebirch/named-npc/npc-stats)、[NPC 日程](../maplebirch/named-npc/npc-schedule)、[NPC 服装](../maplebirch/named-npc/npc-clothes)。

## 战斗动作

```js
maplebirch.combat.CombatAction.reg({
  id: "fireball",
  actionType: "rightaction",
  cond: (ctx) => V.player.mana >= 25,
  display: (ctx) => `Fireball (25 mana)`,
  value: "fireball",
  color: (ctx) => (V.player.mana >= 25 ? "orange" : "gray"),
  difficulty: "High fire damage",
  combatType: "Default",
  order: 1,
});
```

**actionType**：`leftaction`、`rightaction`、`feetaction`、`mouthaction`、`penisaction`、`vaginaaction`、`anusaction`、`chestaction`、`thighaction`

详见 [战斗动作](../maplebirch/combat/actions)。

## 音频系统

```js
const am = maplebirch.audio;
await am.modPlay("myMod", "track_name");
am.Volume = 0.8;
am.PlayMode = "shuffle";
```

boot.json 配置：`"audio": true`（导入 `audio/` 目录）或 `"audio": ["bgm", "sfx"]`

支持格式：mp3、wav、ogg、m4a、flac、webm

详见 [音频管理](../maplebirch/audio)。

## 多语言宏

| 宏                              | 用途                 |
| ------------------------------- | -------------------- |
| `<<language>>`                  | 按语言显示不同内容块 |
| `<<lanSwitch>>` / `lanSwitch()` | 内联语言切换         |
| `<<lanButton>>`                 | 语言感知按钮         |
| `<<lanLink>>`                   | 语言感知链接         |
| `<<lanListbox>>`                | 语言感知下拉框       |

翻译 API：`maplebirch.t(key)` — 按 key 查找翻译；`maplebirch.auto(text)` — 反向翻译

详见 [SugarCube 宏扩展](../maplebirch/sugar-cube-macro)、[语言管理](../maplebirch/language-manager)。

## 变量命名空间

游戏状态存储在 `V.maplebirch`：

```js
{
  player: { clothing: {} },  // V.worn 的只读代理
  npc: {},
  transformation: {},
  version: "3.2.5"
}
```

选项配置在 `V.options.maplebirch`（跨存档持久化）。

详见 [变量与游戏状态](../maplebirch/variables)。

## 常见陷阱

- **用 `module` 代替 `script`** — `module` 在框架可能未完全初始化时执行，除非必要否则使用 `script`
- **未声明 GameVersion 依赖** — `dependenceInfo` 中必须包含 `GameVersion >= 0.5.9.7`
- **直接修改 `V.maplebirch.player.clothing`** — 它是 `V.worn` 的只读代理，修改装备请使用 `V.worn`
- **在 Init 之前调用框架 API** — 使用 `maplebirch.on(":passagestart", ...)` 确保框架就绪
- **循环模块依赖** — ModuleSystem 使用拓扑排序，循环依赖在注册时被拒绝
- **音频文件未列入 additionFile** — 音频路径必须在 boot.json 的 `additionFile` 中声明
