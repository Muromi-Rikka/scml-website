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

## 可用区域键

向 `addTo()` 传入的区域名（如 `"sidebar"`）会映射到具体注入点。以下为部分内部区域键，供需要精确注入的 Mod 使用：

| 区域键                  | 说明                     |
| ----------------------- | ------------------------ |
| `sidebar`               | 侧边栏主区域             |
| `MenuSmall`             | 小菜单                   |
| `CaptionAfterDescription` | 标题描述后             |
| `HintMobile`            | 移动端图标（疼痛上方）   |
| `MobileStats`           | 移动端状态（疼痛等）     |
| `CharaDescription`      | 角色描述                 |
| `DegreesBonusDisplay`   | 属性加成显示             |
| `DegreesBox`            | 属性框                   |

## 内置初始化

框架在 `preInit` 阶段注册了以下初始化逻辑：

- `applyLocation()` — 应用位置相关逻辑
- `applyBodywriting()` — 应用身体文字相关逻辑
