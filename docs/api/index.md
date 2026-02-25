# 开发者 API 概述

ModLoader 通过全局对象向 Mod 开发者暴露一组公共 API，用于查询 Mod 信息、实现 Mod 间通信、加载图片等。

## 全局对象

| 全局对象 | 说明 |
|---------|------|
| `window.modUtils` | 面向 Mod 开发者的主要 API 入口 |
| `window.modSC2DataManager` | 核心数据管理器，提供底层功能访问 |
| `window.jsPreloader` | 脚本预加载器 |
| `window.modAddonPluginManager` | Addon 插件管理器 |

## API 分类

- [modUtils 参考](./mod-utils) — Mod 查询、当前运行 Mod 名称获取等公共方法
- [AddonPlugin 系统](./addon-plugin) — Addon 插件注册、Mod 间 API 暴露与调用
- [图片加载](./image-loading) — 通过 HtmlTagSrcHook 拦截和替换图片
- [生命周期钩子](./lifecycle-hooks) — 加载过程中各阶段的回调钩子

## SugarCube2 事件

SC2 引擎在运行过程中会触发以下 jQuery 事件，Mod 可以监听这些事件来响应游戏状态变化：

| 事件名 | 触发时机 |
|-------|---------|
| `:storyready` | 游戏完全启动完毕 |
| `:passageinit` | 新 Passage 上下文开始初始化 |
| `:passagestart` | 新 Passage 开始渲染 |
| `:passagerender` | 新 Passage 渲染结束 |
| `:passagedisplay` | 新 Passage 准备插入到 HTML |
| `:passageend` | 新 Passage 处理结束 |

### 监听示例

```js
// 只触发一次
$(document).one(":storyready", () => {
  // 游戏启动后的初始化逻辑
});

// 每次触发
$(document).on(":passageend", () => {
  // 每个 Passage 渲染完毕后的处理
});
```
