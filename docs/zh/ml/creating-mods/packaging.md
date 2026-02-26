# Mod 打包方法

将 Mod 文件打包为 `.mod.zip` 有三种方式：手动打包、Node.js 自动打包和 Docker 打包。

## 手动打包方法

这是最简单的方式，只需一个支持 Zip 压缩的工具（如 [7-Zip](https://7-zip.org/)）。

### 步骤

**1.** 使用你喜爱的编辑器编辑好 `boot.json` 文件。

**2.** 在 `boot.json` 所在目录中，使用压缩工具**仔细选择 `boot.json` 及其中引用的所有文件**打包为 zip 文件。

**3.** 设置压缩参数：
- **格式**：Zip
- **算法**：Deflate
- **压缩等级**：越大越好
- **密码**：无

**4.** 点击确定，等待压缩完成。

**5.** 压缩后打开压缩文件检查：
- `boot.json` 文件位于**根目录**
- `boot.json` 中编写的文件路径与压缩包内结构**完全一致**
- 任何文件的压缩算法只能是 **Store 或 Deflate**

**6.**（可选）重命名压缩包为 `ModName.mod.zip`。

**7.** 使用 Mod 管理器加载 Mod。

:::info
除 `.mod.zip` 外，ModLoader 还支持 `.modpack` 二进制格式，详见 [ModPack 格式](./modpack-format)。
:::

:::danger 常见错误
- `boot.json` 不在 zip 根目录（被包在了一层文件夹里）
- `boot.json` 中的路径与 zip 内实际路径不匹配
- 使用了 Deflate/Store 以外的压缩算法
:::

## 自动打包方法（Node.js）

需要已安装 [Node.js](https://nodejs.org) 和 Yarn。

### 编译打包脚本

```bash
yarn run webpack:insertTools
```

### 执行打包

切换到 Mod 目录（`boot.json` 所在文件夹），执行：

```bash
node "<packModZip.js 文件路径>" "<boot.json 文件路径>"
```

示例：

```bash
cd src/insertTools/MyMod
node "H:\Code\sugarcube-2\ModLoader\dist-insertTools\packModZip.js" "boot.json"
```

之后会在当前目录下生成以 `boot.json` 中 Mod 名称命名的 zip 文件：

```
MyMod.mod.zip
```

## 自动打包方法（Docker）

需要已安装 Docker 并可访问 ghcr.io。

### 拉取镜像

```bash
docker pull ghcr.io/lyoko-jeremie/sugarcube-2-modloader-inserttools:latest
```

### 执行打包

切换到 Mod 目录（`boot.json` 所在文件夹），执行：

```bash
docker run --rm -v $(pwd):/src ghcr.io/lyoko-jeremie/sugarcube-2-modloader-inserttools:latest
```

同样会在当前目录下生成 zip 文件：

```
MyMod.mod.zip
```

## 环境安装

如果没有 Node.js 环境：

1. 从 [Node.js 官网](https://nodejs.org) 下载并安装 Node.js
2. 在命令行运行 `corepack enable` 启用包管理器支持
3. 完成
