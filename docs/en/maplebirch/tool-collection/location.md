# Location Config

Apply in-game location logic via `maplebirch.tool.other.applyLocation()`.

_Access via `maplebirch.tool.other`._

## Usage

```js
const other = maplebirch.tool.other;

other.applyLocation();
```

The framework registers this during `preInit` as part of built-in initialization. Call `applyLocation()` to apply location-related logic when your Mod adds custom locations.
