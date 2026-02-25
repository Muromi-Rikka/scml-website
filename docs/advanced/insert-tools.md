# Insert Tools 工具集

ModLoader 的 Insert Tools 是一组用于 Mod 打包、ModLoader 注入和 SC2 引擎替换的 Node.js 脚本。编译 ModLoader 后，这些工具位于 `dist-insertTools/` 目录。

## 工具列表

| 工具 | 用途 |
|------|------|
| `insert2html.js` | 将 ModLoader 注入到游戏 HTML，并嵌入 modList.json 中的 Mod |
| `packModZip.js` | 将 Mod 目录打包为 `.mod.zip` |
| `sc2ReplaceTool.js` | 将新的 SC2 引擎（format.js）替换到已编译的游戏 HTML 中 |
| `sc2PatchTool.js` | 对游戏 HTML 应用 SC2 引导点补丁（与 sc2ReplaceTool 配合使用） |

## insert2html.js

将 ModLoader 注入到游戏 HTML 中，同时将 `modList.json` 中的 Mod 作为 local 类型嵌入。

### 用法

```bash
node "<insert2html.js 路径>" "<游戏 HTML 路径>" "<modList.json 路径>" "<BeforeSC2.js 路径>"
```

### 参数

| 参数 | 说明 |
|------|------|
| 游戏 HTML 路径 | 已编译的游戏 HTML 文件（需包含 SC2 引导点） |
| modList.json 路径 | 预置 Mod 列表的 JSON 文件 |
| BeforeSC2.js 路径 | ModLoader 核心脚本 |

### 示例

```bash
node "dist-insertTools/insert2html.js" "Degrees of Lewdity 0.4.2.7.html" "modList.json" "dist-BeforeSC2/BeforeSC2.js"
```

### 输出

在原始 HTML 同目录下生成 `.mod.html` 文件，例如：

```
Degrees of Lewdity 0.4.2.7.html.mod.html
```

## packModZip.js

根据 `boot.json` 将 Mod 目录打包为 `.mod.zip`。

### 用法

```bash
node "<packModZip.js 路径>" "<boot.json 路径>"
```

### 参数

| 参数 | 说明 |
|------|------|
| boot.json 路径 | Mod 的 boot.json 文件路径 |

### 示例

```bash
cd src/insertTools/MyMod
node "dist-insertTools/packModZip.js" "boot.json"
```

### 输出

在 boot.json 所在目录下生成 `{ModName}.mod.zip`，Mod 名称取自 boot.json 的 `name` 字段。

### 验证

packModZip 会在打包时执行 `validateBootJson`，校验 boot.json 格式和引用的文件是否存在。

## sc2ReplaceTool.js

将新的 SC2 引擎（format.js）替换到已编译的游戏 HTML 中，无需重新编译整个游戏。

### 用法

```bash
node "<sc2ReplaceTool.js 路径>" "<游戏 HTML 路径>" "<format.js 路径>"
```

### 参数

| 参数 | 说明 |
|------|------|
| 游戏 HTML 路径 | 已编译的游戏 HTML 文件 |
| format.js 路径 | 修改版 SC2 的 format.js（包含 ModLoader 引导点） |

### 示例

```bash
node "dist-insertTools/sc2ReplaceTool.js" "Degrees of Lewdity 0.4.2.7.html" "build/twine2/sugarcube-2/format.js"
```

### 输出

生成带 `.sc2replace.html` 后缀的文件：

```
Degrees of Lewdity 0.4.2.7.html.sc2replace.html
```

### 典型流程

1. 使用 sc2ReplaceTool 替换引擎
2. 使用 insert2html 将 ModLoader 注入到替换后的 HTML

```bash
node "dist-insertTools/sc2ReplaceTool.js" "game.html" "format.js"
node "dist-insertTools/insert2html.js" "game.html.sc2replace.html" "modList.json" "dist-BeforeSC2/BeforeSC2.js"
```

## sc2PatchTool.js

对游戏 HTML 应用 SC2 引导点补丁。当游戏 HTML 尚未包含 ModLoader 所需的 SC2 修改时，可使用此工具直接 patch，而无需替换整个 format.js。

:::info
sc2PatchTool 与 sc2ReplaceTool 的选择取决于你的工作流。通常推荐使用修改版 SC2 引擎编译游戏，或使用 sc2ReplaceTool 直接替换 format.js。
:::

## Docker 打包

若没有 Node.js 环境，可使用 Docker 镜像执行 packModZip：

```bash
docker pull ghcr.io/lyoko-jeremie/sugarcube-2-modloader-inserttools:latest
docker run --rm -v $(pwd):/src ghcr.io/lyoko-jeremie/sugarcube-2-modloader-inserttools:latest
```

在 boot.json 所在目录执行，会在当前目录生成 zip 文件。
