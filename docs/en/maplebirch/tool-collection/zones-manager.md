# Zones Manager (zonesManager)

The zones manager handles widget registration and rendering for game interface areas. It is one of the framework's most important tools, allowing Mods to inject content into various areas of the game.

_Access via `maplebirch.tool.zone` or `maplebirch.tool.addTo()`._

## Adding Widgets to Zones

```js
const zone = maplebirch.tool.zone;

// Add a simple Twee widget
zone.addTo("sidebar", "<<myWidget>>");

// Add widget with conditions
zone.addTo("sidebar", {
  widget: "<<myWidget>>",
  exclude: ["Combat"],
  match: ["Home", "Shop"],
  passage: "MyPassage",
});

// Add with priority (lower number = earlier)
zone.addTo("sidebar", [5, "<<myWidget>>"]);
```

## Shortcut Methods

```js
maplebirch.tool.addTo("sidebar", "<<myWidget>>");

maplebirch.tool.onInit(() => {
  // Runs on each init
});
```

## Available Zone Keys

Zone names passed to `addTo()` (e.g. `"sidebar"`) map to specific injection points. The following are internal zone keys for Mods that need precise injection:

| Zone Key                | Description                    |
| ----------------------- | ------------------------------ |
| `sidebar`               | Main sidebar area              |
| `MenuSmall`             | Small menu                     |
| `CaptionAfterDescription` | After caption description    |
| `HintMobile`            | Mobile icons (above pain)      |
| `MobileStats`           | Mobile stats (pain, etc.)      |
| `CharaDescription`      | Character description          |
| `DegreesBonusDisplay`   | Attribute bonus display        |
| `DegreesBox`            | Attribute box                  |

## Built-in Initialization

The framework registers during `preInit`:

- `applyLocation()` — Location-related logic
- `applyBodywriting()` — Bodywriting-related logic
