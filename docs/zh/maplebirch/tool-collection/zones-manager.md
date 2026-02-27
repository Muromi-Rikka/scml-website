# 区域管理器（zonesManager）

区域管理器负责游戏界面区域的部件注册和渲染。这是框架最重要的工具之一，允许 Mod 向游戏的各个区域注入内容。

_可通过 `maplebirch.tool.zone` 或 `maplebirch.tool.addTo()` 访问。_

## 添加部件到区域

```js
const zone = maplebirch.tool.zone;

// 添加简单的 Twee 部件
zone.addTo("sidebar", "<<myWidget>>");

// 添加带条件的部件
zone.addTo("sidebar", {
  widget: "<<myWidget>>",
  exclude: ["Combat"],
  match: ["Home", "Shop"],
  passage: "MyPassage",
});

// 添加带优先级的部件（数字越小越靠前）
zone.addTo("sidebar", [5, "<<myWidget>>"]);
```

## 快捷方法

```js
maplebirch.tool.addTo("sidebar", "<<myWidget>>");

maplebirch.tool.onInit(() => {
  // 在每次初始化时执行
});
```

## 内置初始化

框架在 `preInit` 阶段注册了以下初始化逻辑：

- `applyLocation()` — 应用位置相关逻辑
- `applyBodywriting()` — 应用身体文字相关逻辑
