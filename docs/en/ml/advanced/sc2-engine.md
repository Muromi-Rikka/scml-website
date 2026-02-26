# Custom SC2 Engine

ModLoader requires a modified SugarCube2 engine to bootstrap correctly. This page describes the engine changes and how to replace the engine without recompiling the game.

## Engine Repository

Modified SC2 engine: [sugarcube-2_Vrelnir](https://github.com/Lyoko-Jeremie/sugarcube-2_Vrelnir)

Games that use this ModLoader must use this SC2 build.

## Engine Changes

### 1. Startup Modification

The jQuery closure in `sugarcube.js` is modified to add ModLoader’s async wait and wrap the original startup in `mainStart()`:

```js
jQuery(() => {
  'use strict';

  const mainStart = () => {
    // Original contents of jQuery(() => {})
  };

  if (typeof window.modSC2DataManager !== 'undefined') {
    window.modSC2DataManager.startInit()
      .then(() => window.jsPreloader.startLoad())
      .then(() => mainStart())
      .catch(err => {
        console.error(err);
      });
  } else {
    mainStart();
  }
});
```

Startup changes from `jQuery -> SC2` to `jQuery -> ModLoader -> SC2`.

### 2. Wikifier Changes

`_lastPassageQ` and related data are added to track compilation. Relevant files:

- `macrolib.js`
- `parserlib.js`
- `wikifier.js`

Search for `passageObj` to locate changes.

### 3. img/svg Tag Interception

Image creation (`img` and `svg`) is intercepted so all images can be loaded from memory (no server).

In `Wikifier.Parser.add 'htmlTag'`:

```js
if (typeof window.modSC2DataManager !== 'undefined' &&
    typeof window.modSC2DataManager.getHtmlTagSrcHook?.()?.doHook !== 'undefined') {
  if (tagName === 'img' && !el.getAttribute('src')?.startsWith('data:')) {
    el.setAttribute('ML-src', el.getAttribute('src'));
    el.removeAttribute('src');
    window.modSC2DataManager.getHtmlTagSrcHook().doHook(el).catch(E => console.error(E));
  }
}
```

## Replacing the Engine Without Recompiling

Use `sc2ReplaceTool` to swap in a new SC2 engine in compiled game HTML.

### Steps

**1.** Run the replacement:

```bash
node "<path to sc2ReplaceTool.js>" "<compiled game HTML>" "<path to format.js>"
```

Example:

```bash
node "dist-insertTools/sc2ReplaceTool.js" "Degrees of Lewdity VERSION.html" "build/twine2/sugarcube-2/format.js"
```

Output has `.sc2replace.html` suffix:

```
Degrees of Lewdity VERSION.html.sc2replace.html
```

**2.** Inject ModLoader into the result with `insert2html`:

```bash
node "dist-insertTools/insert2html.js" "Degrees of Lewdity VERSION.html.sc2replace.html" "modList.json" "dist-BeforeSC2/BeforeSC2.js"
```

Final output:

```
Degrees of Lewdity VERSION.html.sc2replace.html.mod.html
```

## Building the SC2 Engine

In the modified SC2 project:

```bash
node build.js -d -u -b 2
```

Output: `build/twine2/sugarcube-2/format.js`.
