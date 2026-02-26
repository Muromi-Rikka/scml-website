# Insert Tools

ModLoader’s Insert Tools are Node.js scripts for Mod packaging, ModLoader injection, and SC2 engine replacement. After building ModLoader, they live under `dist-insertTools/`.

## Tool List

| Tool | Purpose |
|------|---------|
| `insert2html.js` | Inject ModLoader into game HTML and embed Mods from modList.json |
| `packModZip.js` | Package a Mod directory into `.mod.zip` |
| `sc2ReplaceTool.js` | Replace SC2 engine (format.js) in compiled game HTML |
| `sc2PatchTool.js` | Apply SC2 bootstrap patch to game HTML (used with sc2ReplaceTool) |

## insert2html.js

Injects ModLoader into game HTML and embeds Mods listed in `modList.json` as local type.

### Usage

```bash
node "<path to insert2html.js>" "<game HTML path>" "<modList.json path>" "<BeforeSC2.js path>"
```

### Arguments

| Argument | Description |
|----------|-------------|
| Game HTML path | Compiled game HTML (must include SC2 bootstrap) |
| modList.json path | JSON file listing built-in Mods |
| BeforeSC2.js path | ModLoader core script |

### Example

```bash
node "dist-insertTools/insert2html.js" "Degrees of Lewdity 0.4.2.7.html" "modList.json" "dist-BeforeSC2/BeforeSC2.js"
```

### Output

Creates a `.mod.html` file next to the source HTML, e.g.:

```
Degrees of Lewdity 0.4.2.7.html.mod.html
```

## packModZip.js

Packages a Mod directory into `.mod.zip` based on `boot.json`.

### Usage

```bash
node "<path to packModZip.js>" "<path to boot.json>"
```

### Arguments

| Argument | Description |
|----------|-------------|
| boot.json path | Path to the Mod’s boot.json |

### Example

```bash
cd src/insertTools/MyMod
node "dist-insertTools/packModZip.js" "boot.json"
```

### Output

Creates `{ModName}.mod.zip` in the same directory as boot.json. Mod name comes from boot.json `name`.

### Validation

packModZip runs `validateBootJson` and checks boot.json format and that referenced files exist.

## sc2ReplaceTool.js

Replaces the SC2 engine (format.js) in compiled game HTML without recompiling the game.

### Usage

```bash
node "<path to sc2ReplaceTool.js>" "<game HTML path>" "<format.js path>"
```

### Arguments

| Argument | Description |
|----------|-------------|
| Game HTML path | Compiled game HTML |
| format.js path | Modified SC2 format.js (includes ModLoader bootstrap) |

### Example

```bash
node "dist-insertTools/sc2ReplaceTool.js" "Degrees of Lewdity 0.4.2.7.html" "build/twine2/sugarcube-2/format.js"
```

### Output

Creates a file with `.sc2replace.html` suffix:

```
Degrees of Lewdity 0.4.2.7.html.sc2replace.html
```

### Typical Flow

1. Use sc2ReplaceTool to replace the engine
2. Use insert2html to inject ModLoader into the result

```bash
node "dist-insertTools/sc2ReplaceTool.js" "game.html" "format.js"
node "dist-insertTools/insert2html.js" "game.html.sc2replace.html" "modList.json" "dist-BeforeSC2/BeforeSC2.js"
```

## sc2PatchTool.js

Applies the SC2 bootstrap patch to game HTML. Use when the game HTML does not yet have the SC2 changes ModLoader needs, instead of replacing the whole format.js.

:::info
Use sc2PatchTool or sc2ReplaceTool depending on your workflow. Usually, either build the game with the modified SC2 engine or replace format.js with sc2ReplaceTool.
:::

## Docker Packaging

Without Node.js, use Docker to run packModZip:

```bash
docker pull ghcr.io/lyoko-jeremie/sugarcube-2-modloader-inserttools:latest
docker run --rm -v $(pwd):/src ghcr.io/lyoko-jeremie/sugarcube-2-modloader-inserttools:latest
```

Run in the boot.json directory; output is a zip in the current directory.
