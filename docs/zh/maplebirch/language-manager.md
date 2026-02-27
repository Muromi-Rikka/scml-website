# LanguageManager 语言管理

## 基本介绍

`LanguageManager` 是框架内置的国际化/本地化管理系统。它为模组制作者提供翻译支持，支持多语言动态切换、自动翻译匹配和高性能查询。

`LanguageManager` 通过 `maplebirch.lang` 访问。翻译方法及 `Language` 属性同时暴露在 `maplebirch` 上，便于使用。

---

## 核心 API

### t(key, space?)

通过翻译键获取对应语言的文本。

- **@param** `key` (string): 翻译键名。
- **@param** `space` (boolean): 仅在当前语言为英文时，是否在返回文本后添加一个空格。默认为 `false`。
- **@return** (string): 目标语言的翻译文本，若未找到则返回 `[key]` 格式的占位符。

```js
// 基础用法
maplebirch.t("ui_title"); // 输出: '地图编辑器' (当前语言为 CN 时)

// 英文模式下添加空格
maplebirch.t("game_start", true); // 输出: 'Start ' (当前语言为 EN 时)

// 键不存在的情况
maplebirch.t("nonexistent_key"); // 输出: '[nonexistent_key]'
```

### auto(text)

自动检测传入的文本，并尝试返回其当前语言的翻译。

- **@param** `text` (string): 需要被自动翻译的源文本。
- **@return** (string): 目标语言的翻译文本，若未找到对应翻译则返回原文本。

```js
// 从英文自动翻译到中文
maplebirch.Language = "CN";
maplebirch.auto("Welcome to the game."); // 输出: '欢迎来到游戏。'

// 从中文自动翻译到英文
maplebirch.Language = "EN";
maplebirch.auto("欢迎来到游戏。"); // 输出: 'Welcome to the game.'

// 翻译文本不存在
maplebirch.auto("Some unique untranslated text."); // 输出原文本
```

### Language 属性

获取或设置当前系统语言。设置语言会触发 `:language` 事件并清空缓存。

```js
// 获取当前语言
const currentLang = maplebirch.Language;

// 切换语言（会触发页面文本的重新渲染）
maplebirch.Language = "JA";

// 监听语言切换事件
maplebirch.on(":language", () => {
  console.log("语言已切换至:", maplebirch.Language);
});
```

---

## 配置方式

多语言功能通过 [AddonPlugin](./addon-plugin) 配置，在模组的 `boot.json` 中 `addonPlugin` 条目的 `params.language` 字段设置。支持三种配置模式：

### 模式 1：自动导入全部语言文件

自动扫描并导入模组 `translations/` 目录下所有支持格式的语言文件。

- **配置值**：`true`
- **查找规则**：扫描 `translations/` 目录，支持 `{language_code}.json`、`{language_code}.yml`、`{language_code}.yaml`，语言代码如 `en`、`cn`、`ja`（不区分大小写）
- **优先级**：同语言代码下 `json > yml > yaml`

```json
{
  "addonPlugin": [
    {
      "modName": "maplebirch",
      "addonName": "maplebirchAddon",
      "params": {
        "language": true
      }
    }
  ]
}
```

**文件结构示例：**

```
my-mod/
├── boot.json（或 addonPlugin 配置）
└── translations/
    ├── en.json
    ├── cn.json
    ├── ja.yml
    └── ko.yaml
```

### 模式 2：导入指定语言文件

只导入指定的几种语言，按配置顺序尝试查找文件。

- **配置值**：字符串数组，如 `["EN", "CN", "JA"]`
- 按数组顺序依次查找每个语言的文件，每个语言尝试 `json`、`yml`、`yaml`
- 找不到对应文件时跳过该语言并记录警告

```json
{
  "params": {
    "language": ["EN", "CN", "JA"]
  }
}
```

### 模式 3：自定义文件路径

完全自定义每个语言文件的路径，支持任意目录结构。

- **配置值**：对象，键为语言代码，值为包含 `file` 路径的对象

```json
{
  "params": {
    "language": {
      "EN": { "file": "lang/english.json" },
      "CN": { "file": "lang/chinese_simple.yml" },
      "JA": { "file": "locales/japanese.yaml" },
      "FR": { "file": "translations/french.json" }
    }
  }
}
```

**文件结构示例：**

```
my-mod/
├── addonPlugin 配置
├── lang/
│   ├── english.json
│   └── chinese_simple.yml
├── locales/
│   └── japanese.yaml
└── translations/
    └── french.json
```

---

## 翻译文件格式示例

### JSON 格式（推荐）

```json
{
  "ui_menu_start": "开始游戏",
  "ui_menu_load": "加载游戏",
  "ui_menu_settings": "设置",
  "character_player_name": "艾莉丝",
  "dialogue_merchant_greeting": "看看我的货物吧，旅行者！",
  "item_potion_health_name": "生命药水",
  "system_save_success": "游戏已保存。"
}
```

### YAML / YML 格式

```yaml
ui_menu_start: "开始游戏"
ui_menu_load: "加载游戏"
ui_menu_settings: "设置"
character_player_name: "艾莉丝"
dialogue_merchant_greeting: "看看我的货物吧，旅行者！"
item_potion_health_name: "生命药水"
system_save_success: "游戏已保存。"
```
