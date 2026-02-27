# Mod Packaging Methods

There are three ways to package Mod files into `.mod.zip`: manual, Node.js automation, and Docker.

## Manual Packaging

Simplest method: use a Zip-capable tool (e.g. [7-Zip](https://7-zip.org/)).

### Steps

**1.** Edit `boot.json` with your preferred editor.

**2.** In the directory containing `boot.json`, use the compression tool to **pack `boot.json` and all referenced files** into a zip.

**3.** Set options:

- **Format**: Zip
- **Algorithm**: Deflate
- **Compression level**: Higher is better
- **Password**: None

**4.** Run the compression.

**5.** Inspect the zip:

- `boot.json` is at the **root**
- Paths in `boot.json` **match** the zip layout
- Compression is **Store or Deflate** only

**6.** (Optional) Rename to `ModName.mod.zip`.

**7.** Load the Mod in the Mod manager.

:::info
Besides `.mod.zip`, ModLoader supports `.modpack` binary format. See [ModPack Format](./modpack-format).
:::

:::danger Common mistakes

- `boot.json` is not at zip root (nested in a folder)
- Paths in `boot.json` don't match zip layout
- Using an unsupported compression algorithm
  :::

## Automated Packaging (Node.js)

Requires [Node.js](https://nodejs.org) and Yarn.

### Build the packaging script

```bash
yarn run webpack:insertTools
```

### Run packaging

From the Mod directory (where `boot.json` lives):

```bash
node "<path to packModZip.js>" "<path to boot.json>"
```

Example:

```bash
cd src/insertTools/MyMod
node "H:\Code\sugarcube-2\ModLoader\dist-insertTools\packModZip.js" "boot.json"
```

Output is a zip named from the Mod name in `boot.json`:

```
MyMod.mod.zip
```

## Automated Packaging (Docker)

Requires Docker and access to ghcr.io.

### Pull the image

```bash
docker pull ghcr.io/lyoko-jeremie/sugarcube-2-modloader-inserttools:latest
```

### Run packaging

From the Mod directory (where `boot.json` lives):

```bash
docker run --rm -v $(pwd):/src ghcr.io/lyoko-jeremie/sugarcube-2-modloader-inserttools:latest
```

Output is a zip in the current directory:

```
MyMod.mod.zip
```

## Environment Setup

If Node.js is not installed:

1. Download and install Node.js from [nodejs.org](https://nodejs.org)
2. Run `corepack enable` in the terminal
3. Done
