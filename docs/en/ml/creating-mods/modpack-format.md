# ModPack Format

Besides `.mod.zip`, ModLoader supports the `.modpack` binary format. `.modpack` is ModLoader’s custom binary Mod package format, for cases where size or load performance matters more.

## vs .mod.zip

| Feature        | .mod.zip                                 | .modpack                      |
| -------------- | ---------------------------------------- | ----------------------------- |
| Format         | Standard Zip                             | Custom binary                 |
| Human-readable | Can unpack and inspect with normal tools | Binary, needs dedicated tools |
| Size           | Depends on Zip compression               | Can be tuned for Mod use      |
| Packaging      | Manual or packModZip.js                  | ModLoader toolchain           |

## Use Cases

- **Size**: May yield smaller files in some cases
- **Load performance**: Binary parsing can be faster than Zip decompression (implementation-dependent)
- **Toolchain**: As an intermediate in ModLoader build pipelines

:::info
For most Mod authors, `.mod.zip` is recommended: standard, widely supported, and packable with any Zip tool.
:::

## How to Generate

`.modpack` is produced by ModLoader’s packaging tools or build pipeline, not by hand. See ModLoader source for details.

If you package Mods as `.mod.zip`, ModLoader will load them directly; conversion to `.modpack` is not required.
