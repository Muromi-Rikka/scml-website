# 创建 Mod

本章介绍如何为基于 SugarCube2 的游戏创建 ModLoader 兼容的 Mod。

## 快速入门

创建一个 Mod 只需要三步：

1. 编写 `boot.json` 描述文件
2. 准备 Mod 内容文件（twee、JS、CSS、图片等）
3. 将所有文件打包为 `.mod.zip` 压缩包

## Mod 包格式

每个 Mod 以 `.mod.zip` 压缩包（或 `.modpack` 二进制格式）分发，包含：

- **`boot.json`**（必须位于 zip 根目录）— Mod 描述文件，声明名称、版本、文件列表和依赖
- **脚本文件** — JS 文件，按阶段划分为 inject_early / earlyload / preload / 主脚本
- **样式文件** — CSS 文件
- **Twee 文件** — Passage 剧本文件
- **图片文件** — 游戏资源图片
- **附加文件** — README 等额外文件

## 最小 Mod 示例

以下是一个最简单的 Mod 结构：

```tree
MyMod
├── boot.json
└── readme.txt
```

对应的最小 `boot.json`：

```json
{
  "name": "EmptyMod",
  "version": "1.0.0",
  "styleFileList": [],
  "scriptFileList": [],
  "tweeFileList": [],
  "imgFileList": [],
  "additionFile": ["readme.txt"]
}
```

## 典型 Mod 结构

```tree
MyMod
├── boot.json
├── readme.txt
├── MyMod_style.css
├── MyMod_script.js
├── MyMod_passage.twee
└── MyMod_Image
    └── character
        └── avatar.png
```

## 注意事项

1. `boot.json` 文件内的路径都是**相对路径**，相对于 zip 文件根目录
2. 同一个 Mod 内的文件名不能重复，也尽量避免与原游戏或其他 Mod 重复
3. 与原游戏重复的 Passage 名称会**覆盖**游戏源文件
4. Mod 按列表顺序加载，靠后的 Mod 覆盖靠前 Mod 的同名 Passage
5. 同名 CSS/JS 文件不会互相覆盖，而是将内容**拼接**在一起
6. 图片文件路径应尽量避免与文件中其他字符串混淆，否则可能意外破坏文件内容

## 下一步

- [示例 Mod 教程](./example-walkthrough) — 从零创建一个功能 Mod 的完整步骤
- [boot.json 完整参考](./boot-json) — 了解所有可用字段
- [脚本加载阶段](./script-stages) — 了解四个脚本执行阶段的区别
- [打包方法](./packaging) — 了解手动和自动打包方式
- [ModPack 格式](./modpack-format) — 了解 .modpack 二进制格式（可选）
