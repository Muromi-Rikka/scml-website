# Location Config

Apply in-game location logic via `maplebirch.tool.patch.applyLocation()`.

_Access via `maplebirch.tool.patch`._

## Usage

```js
const other = maplebirch.tool.patch;

other.applyLocation();
```

The framework registers this during `preInit` as part of built-in initialization. Call `applyLocation()` to apply location-related logic when your Mod adds custom locations.
