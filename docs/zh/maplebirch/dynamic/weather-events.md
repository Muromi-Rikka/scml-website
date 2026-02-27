# 天气事件

天气事件模块 (`WeatherEvents`) 是动态管理系统的一部分，用于处理游戏中的天气相关事件和效果。支持注册天气变化时触发的事件、修改天气图层与效果、添加自定义天气类型。

_可通过 `maplebirch.dynamic.Weather` 或快捷接口 `maplebirchFrameworks.addWeatherEvent()` 访问。_

:::tip
图层效果修改需要在框架 `:passagestart` 时机前注册。使用推荐的 `script` 方式加载文件会自动在正确时机执行。
:::

## 核心 API

### regWeatherEvent(eventId, options)

注册一个新的天气事件。

```js
maplebirch.dynamic.regWeatherEvent("rainyDay", {
  condition: () => Weather.name === "rain",
  onEnter: () => {
    V.isRaining = true;
    Wikifier.wikifyEval('<<notify "开始下雨了">>');
  },
  onExit: () => {
    V.isRaining = false;
    Wikifier.wikifyEval('<<notify "雨停了">>');
  },
  priority: 5,
  once: false,
});
```

### delWeatherEvent(eventId)

注销已注册的天气事件。

```js
maplebirch.dynamic.delWeatherEvent("rainyDay");
```

### addWeather(data)

添加自定义天气类型或天气例外。

```js
maplebirch.dynamic.addWeather({
  name: "acidRain",
  iconType: "acid",
  value: 10,
  probability: { summer: 0.1, winter: 0.05, spring: 0.2, autumn: 0.15 },
  cloudCount: { small: () => random(5, 10), large: () => random(2, 5) },
  tanningModifier: -0.5,
  overcast: 0.8,
  precipitationIntensity: 0.7,
  visibility: 0.4,
});
```

### addLayer(layerName, patch, mode?)

修改天气图层的参数。

```js
maplebirch.dynamic.Weather.addLayer("clouds", { blur: 5, zIndex: 10 }).addLayer(
  "rain",
  { animation: { speed: 2 } },
  "merge",
);
```

- `mode`: 'concat'、'replace'（默认）、'merge'

### addEffect(effectName, patch, mode?)

修改天气效果的参数。

```js
maplebirch.dynamic.Weather.addEffect("lightning", { frequency: 0.5, intensity: 2 }).addEffect(
  "thunder",
  { volume: 0.8 },
  "merge",
);
```

### addWeatherData(data)

添加自定义天气类型或天气例外（同 `addWeather`）。

## 事件配置选项

| 参数        | 类型     | 说明                             |
| ----------- | -------- | -------------------------------- |
| `condition` | function | 触发条件函数，返回布尔值         |
| `onEnter`   | function | 满足条件时进入事件，执行一次     |
| `onExit`    | function | 条件不再满足时退出事件，执行一次 |
| `once`      | boolean  | 是否只触发一次                   |
| `priority`  | number   | 优先级，数字越大越先执行         |

## 自定义字段匹配

可通过字段值匹配天气状态：

```js
maplebirch.dynamic.regWeatherEvent("coldNight", {
  weather: ["clear", "partlyCloudy"],
  temp: { max: 5 },
  hour: { min: 20, max: 6 },
  season: ["winter", "autumn"],
  onEnter: () => {
    V.feelsCold = true;
  },
  onExit: () => {
    V.feelsCold = false;
  },
});
```
