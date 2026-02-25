# boot.json 参考

`boot.json` 是 Mod 的描述文件，必须位于 zip 压缩包的根目录。它声明了 Mod 的基本信息、文件列表和依赖关系。

## 完整字段说明

```json5
{
  // （必须）Mod 名称
  "name": "MyMod",

  // （可选）用户友好的显示名称，在 Mod 管理器中显示
  "nickName": "A Example Mod",
  // 写法 2：多语言支持
  // "nickName": {
  //   "cn": "中文名称",
  //   "en": "English Name"
  // },

  // （可选）Mod 别名，提供兼容性
  // 用例：Mod 改名后保留旧名以便其他 Mod 正确识别；跨游戏迁移时声明功能等价
  "alias": [
    "OldModName"
  ],

  // （必须）Mod 版本号
  "version": "1.0.0",

  // （可选）提前注入的 JS 脚本
  // 当前 Mod 加载后立即以 <script> 标签注入到 DOM，由浏览器执行
  "scriptFileList_inject_early": [
    "MyMod_script_inject_early.js"
  ],

  // （可选）提前加载的 JS 脚本
  // 在 inject_early 之后由 ModLoader 执行，支持异步操作
  // 可读取未修改的原始 Passage 数据
  "scriptFileList_earlyload": [
    "MyMod_script_earlyload.js"
  ],

  // （可选）预加载的 JS 脚本
  // 在 Mod 数据合并到 tw-storydata 之后执行，支持异步操作
  // 可读取合并后的最终 Passage 数据
  "scriptFileList_preload": [
    "MyMod_script_preload.js"
  ],

  // （必须）CSS 样式文件列表
  "styleFileList": [
    "MyMod_style_1.css",
    "MyMod_style_2.css"
  ],

  // （必须）JS 脚本文件列表（作为游戏的一部分合并）
  "scriptFileList": [
    "MyMod_script_1.js",
    "MyMod_script_2.js"
  ],

  // （必须）Twee 剧本文件列表
  "tweeFileList": [
    "MyMod_Passage1.twee",
    "MyMod_Passage2.twee"
  ],

  // （必须）图片文件列表
  // 路径应避免与文件中其他字符串混淆
  "imgFileList": [
    "MyMod_Image/typeA/111.jpg",
    "MyMod_Image/typeA/222.png",
    "MyMod_Image/typeB/333.gif"
  ],

  // （可选）附加文件列表
  // 不会被加载，仅作为附加文件存在，以 UTF-8 编码读取保存
  "additionFile": [
    "readme.txt"   // 第一个以 readme（不区分大小写）开头的文件作为说明文件显示在 Mod 管理器中
  ],

  // （可选）附加二进制文件
  "additionBinaryFile": [
    "data.zip"
  ],

  // （可选）附加文件夹，其下所有文件以二进制格式保存
  "additionDir": [
    "extra_data"
  ],

  // （可选）依赖的 Addon 插件列表
  "addonPlugin": [
    {
      "modName": "AddonModName",     // 插件来自哪个 Mod
      "addonName": "pluginName",     // 该 Mod 中的插件名
      "modVersion": "1.0.0",         // 插件所在 Mod 的版本
      "params": []                   // （可选）插件参数
    }
  ],

  // （可选）依赖的 Mod 列表
  "dependenceInfo": [
    {
      "modName": "SomeMod",          // 依赖的 Mod 名称
      "version": "^2.0.0"            // 依赖的版本约束
    },
    {
      "modName": "ModLoader",        // 声明对 ModLoader 版本的依赖
      "version": "^1.6.0"
    },
    {
      "modName": "GameVersion",      // 声明对游戏版本的依赖
      "version": "=0.4.2.7"          // 以 = 开头表示只匹配特定版本
    }
  ]
}
```

## 必填字段

以下字段**必须存在**（即使为空数组）：

- `name` — Mod 名称
- `version` — 版本号
- `styleFileList` — CSS 文件列表
- `scriptFileList` — JS 脚本文件列表
- `tweeFileList` — Twee 文件列表
- `imgFileList` — 图片文件列表

## 版本号约束语法

`dependenceInfo` 中的 `version` 字段支持以下格式：

| 格式 | 含义 | 示例 |
|------|------|------|
| `^x.y.z` | 兼容同一大版本的所有版本（推荐默认写法） | `^2.0.0` 匹配 2.x.x |
| `=x.y.z` 或 `x.y.z` | 精确匹配指定版本 | `=1.2.3` |
| `>x.y.z` | 大于指定版本 | `>1.0.0` |
| `>=x.y.z` | 大于等于指定版本 | `>=1.0.0` |
| `<x.y.z` | 小于指定版本 | `<2.0.0` |
| `<=x.y.z` | 小于等于指定版本 | `<=2.0.0` |

版本号遵循[语义化版本控制规范](https://semver.org/lang/zh-CN/)，使用 [semver](https://www.npmjs.com/package/semver) 进行校验。

:::tip
对于 `GameVersion` 的依赖声明，比较时只比较游戏本体版本号，会忽略第一个 `-` 开始的所有后缀。
:::

## 最小 boot.json

```json
{
  "name": "EmptyMod",
  "version": "1.0.0",
  "styleFileList": [],
  "scriptFileList": [],
  "tweeFileList": [],
  "imgFileList": [],
  "additionFile": [
    "readme.txt"
  ]
}
```
