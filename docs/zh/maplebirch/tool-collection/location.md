# 地点配置

通过 `maplebirch.tool.other.applyLocation()` 应用游戏中地点相关逻辑。

_可通过 `maplebirch.tool.other` 访问。_

## 使用方式

```js
const other = maplebirch.tool.other;

other.applyLocation();
```

框架在 `preInit` 阶段会将其作为内置初始化逻辑之一。当 Mod 添加自定义地点时，可调用 `applyLocation()` 以应用地点相关逻辑。
