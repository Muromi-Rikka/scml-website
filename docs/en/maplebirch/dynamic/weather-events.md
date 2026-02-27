# Weather Events

The WeatherEvents module handles weather-related events and effects. It allows registering events on weather changes, modifying weather layers/effects, and adding custom weather types.

_Access via `maplebirch.dynamic.Weather` or shortcut `maplebirchFrameworks.addWeatherEvent()`._

:::tip
Layer/effect changes must be registered before the framework's `:passagestart` phase. Using the recommended `script` load method ensures correct timing.
:::

## Core API

### regWeatherEvent(eventId, options)

Register a new weather event.

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

Unregister a weather event.

```js
maplebirch.dynamic.delWeatherEvent("rainyDay");
```

### addWeather(data)

Add custom weather types or exceptions.

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

## Event Options

| Option      | Type     | Description                         |
| ----------- | -------- | ----------------------------------- |
| `condition` | function | Trigger condition, returns boolean  |
| `onEnter`   | function | Called when condition becomes true  |
| `onExit`    | function | Called when condition becomes false |
| `once`      | boolean  | Trigger only once                   |
| `priority`  | number   | Higher runs first                   |
